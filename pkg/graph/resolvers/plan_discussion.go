package resolvers

import (
	"context"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage/loaders"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanDiscussion implements resolver logic to create a plan Discussion object
func CreatePlanDiscussion(
	ctx context.Context,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	input *model.PlanDiscussionCreateInput,
	principal authentication.Principal,
	store *storage.Store,
) (*models.PlanDiscussion, error) {
	planDiscussion := models.NewPlanDiscussion(
		principal.Account().ID,
		principal.AllowASSESSMENT(),
		input.ModelPlanID,
		input.Content,
		input.UserRole,
		input.UserRoleDescription,
	)

	err := BaseStructPreCreate(logger, planDiscussion, principal, store, false)
	if err != nil {
		return nil, err
	}

	result, err := store.PlanDiscussionCreate(logger, planDiscussion)
	if err != nil {
		return nil, err
	}

	// Send email to MINT Dev Team
	go func() {
		sendEmailErr := sendPlanDiscussionCreatedEmail(
			ctx,
			store,
			logger,
			emailService,
			emailTemplateService,
			addressBook,
			addressBook.MINTTeamEmail,
			result,
			input.ModelPlanID,
		)

		if sendEmailErr != nil {
			logger.Error("error sending plan discussion created email to MINT Team",
				zap.String("discussionID", result.ID.String()),
				zap.Error(sendEmailErr))
		}
	}()

	return result, err
}

func sendPlanDiscussionCreatedEmail(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	receiverEmail string,
	planDiscussion *models.PlanDiscussion,
	modelPlanID uuid.UUID,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.PlanDiscussionCreatedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.PlanDiscussionCreatedSubjectContent{
		DiscussionContent: planDiscussion.Content.RawContent, //TODO: SW handle the content so the email displays tags correctly....
	})
	if err != nil {
		return err
	}

	modelPlan, err := store.ModelPlanGetByID(logger, modelPlanID)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.PlanDiscussionCreatedBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      planDiscussion.ID.String(),
		UserName:          planDiscussion.CreatedByUserAccount(ctx).CommonName,
		DiscussionContent: planDiscussion.Content.RawContent, //TODO: SW handle the content so the email displays tags correctly....
		ModelID:           modelPlan.ID.String(),
		ModelName:         modelPlan.ModelName,
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
	logger *zap.Logger,
	input *model.DiscussionReplyCreateInput,
	principal authentication.Principal,
	store *storage.Store,
) (*models.DiscussionReply, error) {
	discussionReply := models.NewDiscussionReply(
		principal.Account().ID,
		principal.AllowASSESSMENT(),
		input.DiscussionID,
		input.Content,
		input.Resolution,
		input.UserRole,
		input.UserRoleDescription,
	)

	err := BaseStructPreCreate(logger, discussionReply, principal, store, false)
	if err != nil {
		return nil, err
	}

	result, err := store.DiscussionReplyCreate(logger, discussionReply)
	return result, err
}

// UpdateDiscussionReply implements resolver logic to update a Discussion reply object
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

// GetMostRecentDiscussionRoleSelection implements resolver logic to get the most recent user role selection
func GetMostRecentDiscussionRoleSelection(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
) (*models.DiscussionRoleSelection, error) {
	return store.GetMostRecentDiscussionRoleSelection(logger, principal.Account().ID)
}
