package resolvers

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/notifications"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// CreatePlanDiscussion implements resolver logic to create a plan Discussion object. It will also save any Mentions to the tag table
func CreatePlanDiscussion(
	ctx context.Context,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	input *model.PlanDiscussionCreateInput,
	principal authentication.Principal,
	store *storage.Store,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.PlanDiscussion, error) {
	planDiscussion := models.NewPlanDiscussion(
		principal.Account().ID,
		principal.AllowASSESSMENT(),
		input.ModelPlanID,
		input.Content,
		input.UserRole,
		input.UserRoleDescription,
	)

	newDiscussion, err := sqlutils.WithTransaction[models.PlanDiscussion](store, func(tx *sqlx.Tx) (*models.PlanDiscussion, error) {
		err := BaseStructPreCreate(logger, planDiscussion, principal, store, false)
		if err != nil {
			return nil, err
		}

		// Note: in the future, this could be a transaction as well. It makes sense to create the user accounts for referenced users using a store though.
		err = UpdateTaggedHTMLMentionsAndRawContent(ctx, store, &planDiscussion.Content, getAccountInformation)

		if err != nil {
			return nil, fmt.Errorf("unable to update tagged html. error : %w", err)
		}

		discussion, err := store.PlanDiscussionCreate(logger, planDiscussion, tx)
		if err != nil {
			return nil, err
		}

		tags, err := TagCollectionCreate(tx, logger, principal, "content", "plan_discussion", discussion.ID, planDiscussion.Content.Mentions)
		if err != nil {
			return discussion, err
		}
		discussion.Content.Tags = tags
		discussion.Content.Mentions = planDiscussion.Content.Mentions

		commonName := principal.Account().CommonName
		modelPlan, err := ModelPlanGetByIDLOADER(ctx, input.ModelPlanID)
		if err != nil {
			return discussion, err
		}

		userRole := discussion.UserRole.Humanize(models.ValueOrEmpty(discussion.UserRoleDescription))

		// Send email to MINT Dev Team
		go func() {
			sendEmailErr := sendPlanDiscussionCreatedEmail(
				ctx,
				logger,
				emailService,
				emailTemplateService,
				addressBook,
				addressBook.MINTTeamEmail,
				discussion,
				modelPlan,
				commonName,
				userRole,
			)

			if sendEmailErr != nil {
				logger.Error("error sending plan discussion created email to MINT Team",
					zap.String("discussionID", discussion.ID.String()),
					zap.Error(sendEmailErr))
			}
		}()

		_, notificationErr := notifications.ActivityTaggedInDiscussionCreate(ctx, tx, principal.Account().ID, discussion.ModelPlanID, discussion.ID, discussion.Content, loaders.UserNotificationPreferencesGetByUserID)
		if notificationErr != nil {
			return nil, fmt.Errorf("unable to generate notifications, %w", notificationErr)
		}
		go func() {
			err = sendPlanDiscussionTagEmails(
				ctx,
				store,
				true,
				logger,
				emailService,
				emailTemplateService,
				addressBook,
				discussion.Content,
				discussion.ID,
				modelPlan,
				commonName,
				userRole,
			)
			if err != nil {
				logger.Error("error sending tagged in plan discussion emails to tagged users and teams",
					zap.String("discussionID", discussion.ID.String()),
					zap.Error(err))
			}
		}()

		return discussion, nil
	})
	if err != nil {
		return nil, err
	}
	return newDiscussion, err
}

// Handles send an email for when a tagged entity is tagged in either a plan discussion or discussion reply
func sendPlanDiscussionTagEmails(
	ctx context.Context,
	_ sqlutils.NamedPreparer,
	isDiscussion bool, // true for discussion, false for
	_ *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	tHTML models.TaggedHTML,
	discussionID uuid.UUID,
	modelPlan *models.ModelPlan,
	createdByUserName string,
	createdByUserRole string,
) error {

	var errs []error
	for _, mention := range tHTML.UniqueMentions() { // Get only unique mentions so we don't send multiple emails if someone is tagged in the same content twice
		if mention.Entity == nil {
			errs = append(errs, fmt.Errorf("entity is not stored for mention on discussion %s, model plan %s, %s", discussionID, modelPlan.ModelName, modelPlan.ID))
			continue // non blocking
		}
		entity := *mention.Entity

		switch mention.Type {
		case models.TagTypeUserAccount:
			taggedUserAccount, ok := entity.(*authentication.UserAccount)
			if !ok {
				errs = append(errs, fmt.Errorf("tagged entity was expected to be a user account, but was not able to be cast to UserAccount. entity: %v", entity))
				continue
			}
			pref, err := UserNotificationPreferencesGetByUserID(ctx, *mention.EntityUUID)
			if err != nil {
				errs = append(errs, fmt.Errorf("unable to get user notification preference, Notification not created %w", err))
				continue
			}

			// Early return if
			if (isDiscussion && !pref.TaggedInDiscussion.SendEmail()) || // is a discussion, and user doesn't want  discussion tag emails
				(!isDiscussion && !pref.TaggedInDiscussionReply.SendEmail()) { // is a reply, and user doesn't want  discussion reply tag emails

				continue
			}
			err = sendPlanDiscussionTaggedUserEmail(emailService, emailTemplateService, addressBook, tHTML, discussionID, modelPlan, taggedUserAccount, createdByUserName, createdByUserRole)
			if err != nil {
				errs = append(errs, err) //non blocking
				continue
			}
		case models.TagTypePossibleSolution:

			soln, ok := entity.(*models.PossibleOperationalSolution)
			if !ok {
				errs = append(errs, fmt.Errorf("tagged entity was expected to be a possible solution, but was not able to be cast to PossibleOperationalSolution. entity: %v", entity))
			}

			config := emailService.GetConfig()

			pocs, err := PossibleOperationalSolutionContactsGetByPossibleSolutionID(ctx, *mention.EntityIntID)
			if err != nil {
				errs = append(errs, err) //non blocking
				continue
			}
			// var pocEmailAddress []string
			pocEmailAddress, err := models.GetPOCEmailAddresses(pocs, config.GetSendTaggedPOCEmails(), addressBook.DevTeamEmail)
			if err != nil {
				errs = append(errs, err)
				continue
			}

			err = sendPlanDiscussionTaggedSolutionEmail(emailService, emailTemplateService, addressBook, tHTML, discussionID, modelPlan, createdByUserName, createdByUserRole, soln, pocEmailAddress)
			if err != nil {
				errs = append(errs, err) //non blocking
				continue
			}

		default:

		}
	}
	if len(errs) > 1 {
		return fmt.Errorf("error sending plan_discussion tag emails. First error: %v", errs[0])
	}

	return nil
}
func sendPlanDiscussionTaggedUserEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	tHTML models.TaggedHTML,
	discussionID uuid.UUID,
	modelPlan *models.ModelPlan,
	taggedUser *authentication.UserAccount,
	createdByUserName string,
	createdByUserRole string,
) error {

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.PlanDiscussionTaggedUserTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.PlanDiscussionTaggedUserSubjectContent{
		ModelName:         modelPlan.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(modelPlan.Abbreviation),
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.PlanDiscussionTaggedUserBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      discussionID.String(),
		UserName:          createdByUserName,
		DiscussionContent: tHTML.RawContent.ToTemplate(),
		ModelID:           modelPlan.ID.String(),
		ModelName:         modelPlan.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(modelPlan.Abbreviation),
		Role:              createdByUserRole,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{taggedUser.Email}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}
func sendPlanDiscussionTaggedSolutionEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	tHTML models.TaggedHTML,
	discussionID uuid.UUID,
	modelPlan *models.ModelPlan,
	createdByUserName string,
	createdByUserRole string,
	solution *models.PossibleOperationalSolution,
	pocEmailAddress []string,
) error {

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.PlanDiscussionTaggedPossibleSolutionTemplateName)
	if err != nil {
		return err
	}
	emailSubject, err := emailTemplate.GetExecutedSubject(email.PlanDiscussionTaggedSolutionSubjectContent{
		SolutionName:      solution.Name,
		ModelName:         modelPlan.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(modelPlan.Abbreviation)})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.PlanDiscussionTaggedSolutionBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      discussionID.String(),
		UserName:          createdByUserName,
		DiscussionContent: tHTML.RawContent.ToTemplate(),
		ModelID:           modelPlan.ID.String(),
		ModelName:         modelPlan.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(modelPlan.Abbreviation),
		Role:              createdByUserRole,
		SolutionName:      solution.Name})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, pocEmailAddress, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}

func sendPlanDiscussionCreatedEmail(
	ctx context.Context,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	receiverEmail string,
	planDiscussion *models.PlanDiscussion,
	modelPlan *models.ModelPlan,
	createdByUserName string,
	createdByUserRole string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.PlanDiscussionCreatedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.PlanDiscussionCreatedSubjectContent{
		ModelName:         modelPlan.ModelName,
		ModelAbbreviation: models.ValueOrEmpty(modelPlan.Abbreviation),
		UserName:          createdByUserName,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.PlanDiscussionCreatedBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      planDiscussion.ID.String(),
		UserName:          createdByUserName,
		DiscussionContent: planDiscussion.Content.RawContent.ToTemplate(),
		ModelID:           modelPlan.ID.String(),
		ModelName:         modelPlan.ModelName,
		Role:              createdByUserRole,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{receiverEmail}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}

// UpdatePlanDiscussion implements resolver logic to update a plan Discussion object
// Deprecated: THIS IS NOT USED by the front end. If it is ever used, make sure to handle tags
func UpdatePlanDiscussion(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.PlanDiscussion, error) {

	// Get existing discussion
	existingDiscussion, err := store.PlanDiscussionByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existingDiscussion, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	result, err := store.PlanDiscussionUpdate(logger, existingDiscussion)
	return result, err
}

// DeletePlanDiscussion implements resolver logic to Delete a plan Discussion object
// Deprecated: THIS IS NOT USED by the front end. If it is ever used, make sure to handle tags
func DeletePlanDiscussion(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.PlanDiscussion, error) {

	existingDiscussion, err := store.PlanDiscussionByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreDelete(logger, existingDiscussion, principal, store, true)
	if err != nil {
		return nil, err
	}
	result, err := store.PlanDiscussionDelete(logger, id, principal.Account().ID)
	return result, err
}

// CreateDiscussionReply implements resolver logic to create a Discussion reply object
func CreateDiscussionReply(
	ctx context.Context,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	input *model.DiscussionReplyCreateInput,
	principal authentication.Principal,
	store *storage.Store,
	getAccountInformation userhelpers.GetAccountInfoFunc,
) (*models.DiscussionReply, error) {
	discussionReply := models.NewDiscussionReply(
		principal.Account().ID,
		principal.AllowASSESSMENT(),
		input.DiscussionID,
		input.Content,
		input.UserRole,
		input.UserRoleDescription,
	)
	newReply, err := sqlutils.WithTransaction[models.DiscussionReply](store, func(tx *sqlx.Tx) (*models.DiscussionReply, error) {
		err := BaseStructPreCreate(logger, discussionReply, principal, store, false)
		if err != nil {
			return nil, err
		}
		err = UpdateTaggedHTMLMentionsAndRawContent(ctx, store, &discussionReply.Content, getAccountInformation)

		if err != nil {
			return nil, fmt.Errorf("unable to update tagged html. error : %w", err)
		}

		reply, err := storage.DiscussionReplyCreate(logger, discussionReply, tx)

		if err != nil {
			return reply, err
		}
		tags, err := TagCollectionCreate(tx, logger, principal, "content", "discussion_reply", reply.ID, discussionReply.Content.Mentions)
		if err != nil {
			return reply, err
		}
		reply.Content.Tags = tags
		reply.Content.Mentions = discussionReply.Content.Mentions

		// Note these aren't async in order to prevent race condition. If possible, this can be made async.
		discussion, err := store.PlanDiscussionByID(logger, reply.DiscussionID)
		if err != nil {
			return reply, err
		}
		modelPlan, err := ModelPlanGetByIDLOADER(ctx, discussion.ModelPlanID)
		if err != nil {
			return reply, err
		}

		// Create Activity and notifications in the DB
		_, notificationErr := notifications.ActivityTaggedInDiscussionReplyCreate(ctx, tx, principal.Account().ID, discussion.ModelPlanID, discussion.ID, reply.ID, reply.Content, loaders.UserNotificationPreferencesGetByUserID)
		if notificationErr != nil {
			return nil, fmt.Errorf("unable to generate notifications, %w", notificationErr)
		}

		discussionCreatorPref, err := UserNotificationPreferencesGetByUserID(ctx, discussion.CreatedBy)
		if err != nil {
			return nil, fmt.Errorf("unable to get user notification preference, Notification not created %w", err)
		}

		_, err = notifications.ActivityNewDiscussionRepliedCreate(ctx, tx, reply.CreatedBy, discussion.ModelPlanID, discussion.ID, discussion.CreatedBy, reply.ID, reply.Content, discussionCreatorPref)
		if notificationErr != nil {
			return nil, fmt.Errorf("unable to generate notifications, %w", notificationErr)
		}

		go func() {
			replyUser := principal.Account()
			commonName := replyUser.CommonName

			if err != nil {
				logger.Error("error sending discussion reply emails. Unable to retrieve modelPlan",
					zap.String("replyID", reply.ID.String()),
					zap.Error(err))
			}

			if discussionCreatorPref.NewDiscussionReply.SendEmail() {
				errReplyEmail := sendDiscussionReplyEmails(
					ctx,
					store,
					logger,
					emailService,
					emailTemplateService,
					addressBook,
					discussion,
					reply,
					modelPlan,
					replyUser,
				)
				if errReplyEmail != nil {
					logger.Error("error sending tagged in plan discussion reply emails to tagged users and teams",
						zap.String("discussionID", discussion.ID.String()),
						zap.Error(errReplyEmail))
				}
			}

			err = sendPlanDiscussionTagEmails(
				ctx,
				store,
				false,
				logger,
				emailService,
				emailTemplateService,
				addressBook,
				reply.Content,
				reply.DiscussionID,
				modelPlan,
				commonName,
				reply.UserRole.Humanize(models.ValueOrEmpty(reply.UserRoleDescription)),
			)

			if err != nil {
				if err != nil {
					logger.Error("error sending tagged in plan discussion reply emails to tagged users and teams",
						zap.String("discussionID", discussion.ID.String()),
						zap.Error(err))
				}
			}
		}()

		return reply, err
	})
	if err != nil {
		return nil, err
	}
	return newReply, err
}

// UpdateDiscussionReply implements resolver logic to update a Discussion reply object
// Deprecated: THIS IS NOT USED by the front end. If it is ever used, make sure to handle tags
func UpdateDiscussionReply(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.DiscussionReply, error) {
	// Get existing reply
	existingReply, err := store.DiscussionReplyByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreUpdate(logger, existingReply, changes, principal, store, true, false)
	if err != nil {
		return nil, err
	}

	result, err := store.DiscussionReplyUpdate(logger, existingReply)
	return result, err
}

// DeleteDiscussionReply implements resolver logic to Delete a Discussion reply object
// Deprecated: THIS IS NOT USED by the front end. If it is ever used, make sure to handle tags
func DeleteDiscussionReply(logger *zap.Logger, id uuid.UUID, principal authentication.Principal, store *storage.Store) (*models.DiscussionReply, error) {
	existingReply, err := store.DiscussionReplyByID(logger, id)
	if err != nil {
		return nil, err
	}
	err = BaseStructPreDelete(logger, existingReply, principal, store, true)
	if err != nil {
		return nil, err
	}
	result, err := store.DiscussionReplyDelete(logger, id, principal.Account().ID)

	return result, err
}

// DiscussionReplyCollectionByDiscusionIDLOADER implements resolver logic to get Discussion Reply by a model plan ID using a data loader
func DiscussionReplyCollectionByDiscusionIDLOADER(ctx context.Context, discussionID uuid.UUID) ([]*models.DiscussionReply, error) {
	allLoaders := loaders.Loaders(ctx)
	discRLoader := allLoaders.DiscussionReplyLoader
	key := loaders.NewKeyArgs()
	key.Args["discussion_id"] = discussionID

	thunk := discRLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.DiscussionReply), nil
}

// PlanDiscussionGetByModelPlanIDLOADER implements resolver logic to get Plan Discussion by a model plan ID using a data loader
func PlanDiscussionGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.PlanDiscussion, error) {
	allLoaders := loaders.Loaders(ctx)
	discLoader := allLoaders.DiscussionLoader
	key := loaders.NewKeyArgs()
	key.Args["model_plan_id"] = modelPlanID

	thunk := discLoader.Loader.Load(ctx, key)
	result, err := thunk()

	if err != nil {
		return nil, err
	}

	return result.([]*models.PlanDiscussion), nil
}

// PlanDiscussionGetByID returns a single discussion from the database for a given discussionID
func PlanDiscussionGetByID(_ context.Context, store *storage.Store, logger *zap.Logger, discussionID uuid.UUID) (*models.PlanDiscussion, error) {
	// Future Enhancement: make this a data loader
	return store.PlanDiscussionByID(logger, discussionID)

}

// DiscussionReplyGetByID returns a single discussion reply from the database for a given discussionReplyID
func DiscussionReplyGetByID(_ context.Context, store *storage.Store, logger *zap.Logger, discussionReplyID uuid.UUID) (*models.DiscussionReply, error) {
	// Future Enhancement: make this a data loader
	return store.DiscussionReplyByID(logger, discussionReplyID)

}

// GetMostRecentDiscussionRoleSelection implements resolver logic to get the most recent user role selection
func GetMostRecentDiscussionRoleSelection(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
) (*models.DiscussionRoleSelection, error) {
	return store.GetMostRecentDiscussionRoleSelection(logger, principal.Account().ID)
}
