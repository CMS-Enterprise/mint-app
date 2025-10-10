package resolvers

import (
	"context"
	"fmt"

	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOMilestoneCreateCustom uses the provided information to create a new Custom MTO Milestone
func MTOMilestoneCreateCustom(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	name string,
	description *string,
	modelPlanID uuid.UUID,
	mtoCategoryID *uuid.UUID,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// A custom milestone never has a CommonMilestoneKey, so pass in `nil`
	milestone := models.NewMTOMilestone(principalAccount.ID, &name, description, nil, modelPlanID, mtoCategoryID)

	err := BaseStructPreCreate(logger, milestone, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneCreate(store, logger, milestone)
}

// MTOMilestoneCreateCommon uses the provided information to create a new Custom MTO Milestone
func MTOMilestoneCreateCommon(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
	commonMilestoneKey models.MTOCommonMilestoneKey,
	commonSolutions []models.MTOCommonSolutionKey,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOMilestone, error) {
		// First, fetch the Common Milestone object from the DB
		commonMilestone, err := MTOCommonMilestoneGetByKeyLOADER(ctx, commonMilestoneKey)
		if err != nil {
			logger.Error("failed to fetch common milestone when creating milestone from library", zap.Error(err))
			return nil, err
		}

		// Next, attempt to insert a category with the same name as the configured category in the Common Milestone
		// Here we use a special storage method that handles conflicts without returning an error
		// to ensure that we create a cateogry if needed, otherwise we just return the existing one

		// Note, the position for the category & subcategory (coded as `0` here) is not respected when inserted, but is a required parameter in the constructor
		// It will be have a position equal to the max of all other positions
		parentCategoryToCreate := models.NewMTOCategory(principalAccount.ID, commonMilestone.CategoryName, modelPlanID, nil, 0)
		parentCategory, err := storage.MTOCategoryCreateAllowConflicts(tx, logger, parentCategoryToCreate)
		if err != nil {
			logger.Error("failed to create parent category when creating milestone from library", zap.Error(err))
			return nil, err
		}
		finalCategoryID := parentCategory.ID // track the eventual category ID that we will attach to the milestone
		if commonMilestone.SubCategoryName != nil {
			subCategoryToCreate := models.NewMTOCategory(principalAccount.ID, *commonMilestone.SubCategoryName, modelPlanID, &parentCategory.ID, 0)
			subCategory, err := storage.MTOCategoryCreateAllowConflicts(tx, logger, subCategoryToCreate)
			if err != nil {
				logger.Error("failed to create subcategory when creating milestone from library", zap.Error(err))
				return nil, err
			}
			finalCategoryID = subCategory.ID
		}

		// A common milestone never has a name (since it comes from the Common Milestone itself), so pass in `nil`
		milestone := models.NewMTOMilestone(
			principalAccount.ID,
			nil,
			&commonMilestone.Description,
			&commonMilestoneKey,
			modelPlanID,
			&finalCategoryID,
		)
		milestone.FacilitatedBy = &commonMilestone.FacilitatedByRole

		if err := BaseStructPreCreate(logger, milestone, principal, store, true); err != nil {
			return nil, err
		}
		createdMilestone, err := storage.MTOMilestoneCreate(tx, logger, milestone)
		if err != nil {
			logger.Error("failed to create mto milestone from common library", zap.Error(err))
			return nil, err
		}

		// create common solutions and link them
		_, err = MTOMilestoneUpdateLinkedSolutionsWithTX(
			ctx,
			principal,
			logger,
			tx,
			emailService,
			emailTemplateService,
			addressBook,
			createdMilestone.ID,
			createdMilestone.ModelPlanID,
			[]uuid.UUID{},
			commonSolutions,
		)
		if err != nil {
			logger.Error("failed to create solution when creating common milestone", zap.Error(err))
			return nil, err
		}

		return createdMilestone, err
	})
}

// MTOMilestoneUpdate updates the fields of an MTOMilestone
func MTOMilestoneUpdate(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	id uuid.UUID,
	changes map[string]interface{},
	solutionLinks *model.MTOSolutionLinks,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOMilestoneGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Milestone. Err %w", err)
	}

	// Since storage.MTOMilestoneGetByID will return a `Name` property when
	// fetching milestones sourced from the common milestone library, we need to clear out that field
	// or else storage.MTOMilestoneUpdate will attempt to update the name (which won't be allowed, since this is a Milestone sourced from the common milestone library
	if existing.AddedFromMilestoneLibrary() {
		existing.Name = nil
	}

	// Check access and apply changes
	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	updatedMilestone, err := sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOMilestone, error) {
		if solutionLinks != nil {
			_, updateLinksErr := MTOMilestoneUpdateLinkedSolutionsWithTX(
				ctx,
				principal,
				logger,
				tx,
				emailService,
				emailTemplateService,
				addressBook,
				id,
				existing.ModelPlanID,
				solutionLinks.SolutionIDs,
				solutionLinks.CommonSolutionKeys,
			)
			if updateLinksErr != nil {
				return nil, fmt.Errorf("unable to update MTO Milestone. Err %w", updateLinksErr)
			}
		}

		return storage.MTOMilestoneUpdate(tx, logger, existing)
	})

	if err != nil {
		logger.Error("error updating MTO Milestone",
			zap.String("milestoneID", existing.ID.String()),
			zap.Error(err))
		return nil, fmt.Errorf("unable to update MTO Milestone. Err %w", err)
	}

	return updatedMilestone, nil
}

// MTOMilestoneDelete deletes an MTOMilestone
// It returns an error if the principal is invalid, the milestone doesn't exist, user doesn't have permissions to delete, or the delete call itself fails
// Future Enhancement - Consider returning a *models.MTOMilestone here if we want to ever access the returned data on what was deleted
func MTOMilestoneDelete(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, id uuid.UUID) error {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Write up a transaction since storage.MTOMilestoneDelete needs one for setting `delete` session user variables
	return sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {
		// First, fetch the existing milestone so we can check permissions
		existing, err := storage.MTOMilestoneGetByID(tx, logger, id)
		if err != nil {
			return fmt.Errorf("error fetching mto milestone during deletion: %s", err)
		}

		// Check permissions
		if err := BaseStructPreDelete(logger, existing, principal, store, true); err != nil {
			return fmt.Errorf("error deleting mto milestone. user doesnt have permissions. %s", err)
		}

		// Finally, delete the milestone
		if err := storage.MTOMilestoneDelete(tx, principalAccount.ID, logger, id); err != nil {
			return fmt.Errorf("unable to delete mto milestone. Err %w", err)
		}
		return nil
	})
}

// MTOMilestoneGetByModelPlanIDLOADER implements resolver logic to get all MTO milestones by a model plan ID using a data loader
func MTOMilestoneGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByModelPlanID.Load(ctx, modelPlanID)
}

// MTOMilestoneGetByIDLOADER returns a mto milestone by it's provided ID
func MTOMilestoneGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByID.Load(ctx, id)
}

// MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER implements resolver logic to get all MTO milestones by a model plan ID and MTO category ID using a data loader
func MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER(ctx context.Context, modelPlanID uuid.UUID, mtoCategoryID uuid.UUID) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByModelPlanIDAndMTOCategoryID.Load(ctx,
		storage.MTOMilestoneByModelPlanAndCategoryKey{
			ModelPlanID:   modelPlanID,
			MTOCategoryID: mtoCategoryID,
		})
}

func MTOMilestoneGetBySolutionIDLOADER(
	ctx context.Context,
	solutionID uuid.UUID,
) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.BySolutionID.Load(ctx, solutionID)
}

// MTOMilestoneUpdateLinkedSolutionsWithTX updates the linked solutions for a milestone, deleting ones that are not included in the list
func MTOMilestoneUpdateLinkedSolutionsWithTX(
	ctx context.Context,
	principal authentication.Principal,
	logger *zap.Logger,
	tx *sqlx.Tx,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	milestoneID uuid.UUID,
	modelPlanID uuid.UUID,
	solutionIDs []uuid.UUID,
	commonSolutionKeys []models.MTOCommonSolutionKey,
) ([]*models.MTOSolution, error) {
	commonSolutionsInstance, err := storage.MTOSolutionCreateCommonAllowConflictsSQL(tx, logger, commonSolutionKeys, modelPlanID, principal.Account().ID)
	if err != nil {
		return nil, err
	}
	commonSolutionIDs := lo.Map(commonSolutionsInstance, func(item *models.MTOSolutionWithNewlyInsertedStatus, _ int) uuid.UUID {
		return item.ID
	})
	joinedSolutionIDs := lo.Union(solutionIDs, commonSolutionIDs)

	currentLinkedSolutions, err := storage.MTOMilestoneSolutionLinkMergeSolutionsToMilestones(tx, logger, milestoneID, joinedSolutionIDs, principal.Account().ID)
	if err != nil {
		return nil, err
	}

	newlyInserted := lo.Filter(commonSolutionsInstance, func(item *models.MTOSolutionWithNewlyInsertedStatus, _ int) bool {
		return item.NewlyInserted
	})
	if len(newlyInserted) > 0 {
		for _, solution := range newlyInserted {
			sendEmailErr := sendMTOSolutionSelectedEmails(ctx, tx, logger, emailService, emailTemplateService, addressBook, solution.ToMTOSolution())
			if sendEmailErr != nil {
				logger.Error("error sending solution selected emails",
					zap.Any("solution", solution.Key),
					zap.Error(sendEmailErr))
			}
		}
	}

	return currentLinkedSolutions, nil
}

// MTOMilestoneUpdateLinkedSolutions is a convenience wrapper around MTOMilestoneUpdateLinkedSolutionsWithTX
// it initiates the transaction, then calls MTOMilestoneUpdateLinkedSolutionsWithTX
func MTOMilestoneUpdateLinkedSolutions(
	ctx context.Context,
	principal authentication.Principal,
	logger *zap.Logger,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	id uuid.UUID,
	solutionIDs []uuid.UUID,
	commonSolutionKeys []models.MTOCommonSolutionKey,
) ([]*models.MTOSolution, error) {

	milestone, err := MTOMilestoneGetByIDLOADER(ctx, id)
	if err != nil {
		return nil, err
	}

	// initiate transaction
	var retSolutions []*models.MTOSolution
	// Future Enhancement see about replacing this with a helper function that expects to return a slice instead of a single type
	err = sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {

		currentLinkedSolutions, err := MTOMilestoneUpdateLinkedSolutionsWithTX(ctx, principal, logger, tx,
			emailService,
			emailTemplateService,
			addressBook,
			id, milestone.ModelPlanID, solutionIDs, commonSolutionKeys)
		if err != nil {
			return err
		}
		retSolutions = currentLinkedSolutions
		// Future Enhancement, return the solutions from in the transaction instead of setting the variable
		return nil

	})
	if err != nil {
		return nil, err
	}
	return retSolutions, nil
}

// MTOMilestoneGetByModelPlanIDNoLinkedSolutionLoader returns all milestones by a model plan ID that are not linked to a solution
func MTOMilestoneGetByModelPlanIDNoLinkedSolutionLoader(
	ctx context.Context,
	modelPlanID uuid.UUID,
) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByModelPlanIDNoLinkedSolution.Load(ctx, modelPlanID)
}

// UpdateAssignedToMTOMilestone updates the assignedTo field of an MTOMilestone
func UpdateAssignedToMTOMilestone(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	id uuid.UUID,
	assignedToID uuid.UUID,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOMilestoneGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Milestone. Err %w", err)
	}

	// Since storage.MTOMilestoneGetByID will return a `Name` property when
	// fetching milestones sourced from the common milestone library, we need to clear out that field
	// or else storage.MTOMilestoneUpdate will attempt to update the name (which won't be allowed, since this is a Milestone sourced from the common milestone library
	if existing.AddedFromMilestoneLibrary() {
		existing.Name = nil
	}

	// Determine if assignedTo is changing, and if so, capture the new assignedToID for email purposes
	var newAssignedToID *uuid.UUID
	if existing.AssignedTo == nil || *existing.AssignedTo != assignedToID {
		newAssignedToID = &assignedToID
	}
	assignedToChanged := existing.AssignedTo == nil || *existing.AssignedTo != assignedToID

	// Make sure assignedToID is valid
	_, err = storage.UserAccountGetByID(store, assignedToID)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Milestone. assignedToID is not valid. Err %w", err)
	}

	// Check access and apply changes
	existing.AssignedTo = &assignedToID
	err = BaseStructPreUpdate(logger, existing, map[string]interface{}{
		"assignedTo": assignedToID,
	}, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	updatedMilestone, err := storage.MTOMilestoneUpdate(store, logger, existing)

	if err != nil {
		logger.Error("error updating MTO Milestone",
			zap.String("milestoneID", existing.ID.String()),
			zap.Error(err))
		return nil, fmt.Errorf("unable to update MTO Milestone. Err %w", err)
	}

	// Send email notification if assignedTo changed and there's a new assignee
	if assignedToChanged && newAssignedToID != nil {
		go func() {
			modelPlan, modelPlanErr := loaders.ModelPlan.GetByID.Load(ctx, updatedMilestone.ModelPlanID)
			if modelPlanErr != nil {
				logger.Error("error loading model plan for milestone assigned email",
					zap.String("milestoneID", updatedMilestone.ID.String()),
					zap.String("assignedToID", newAssignedToID.String()),
					zap.Error(modelPlanErr))
				return
			}

			solutions, solutionsErr := MTOSolutionGetByMilestoneIDLOADER(ctx, updatedMilestone.ID)
			if solutionsErr != nil {
				logger.Error("error loading solutions for milestone assigned email",
					zap.String("milestoneID", updatedMilestone.ID.String()),
					zap.String("assignedToID", newAssignedToID.String()),
					zap.Error(solutionsErr))
				return
			}

			sendEmailErr := sendMTOMilestoneAssignedEmail(ctx, store, logger, emailService, emailTemplateService, addressBook, updatedMilestone, *newAssignedToID, modelPlan, solutions)
			if sendEmailErr != nil {
				logger.Error("error sending milestone assigned email",
					zap.String("milestoneID", updatedMilestone.ID.String()),
					zap.String("assignedToID", newAssignedToID.String()),
					zap.Error(sendEmailErr))
			}
		}()
	}

	return updatedMilestone, nil
}

// sendMTOMilestoneAssignedEmail sends an email notification when a milestone is assigned to a user
func sendMTOMilestoneAssignedEmail(
	ctx context.Context,
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	milestone *models.MTOMilestone,
	assignedToID uuid.UUID,
	modelPlan *models.ModelPlan,
	solutions []*models.MTOSolution,
) error {
	if emailService == nil || emailTemplateService == nil || milestone == nil {
		return nil
	}

	// Get the assigned user's information
	assignedUser, err := storage.UserAccountGetByID(np, assignedToID)
	if err != nil {
		logger.Error("failed to get assigned user for milestone assignment email",
			zap.String("milestoneID", milestone.ID.String()),
			zap.String("assignedToID", assignedToID.String()),
			zap.Error(err))
		return err
	}

	if assignedUser.Email == "" {
		logger.Warn("assigned user has no email address, skipping milestone assignment email",
			zap.String("milestoneID", milestone.ID.String()),
			zap.String("assignedToID", assignedToID.String()))
		return nil
	}

	// Get email template
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOMilestoneAssignedTemplateName)
	if err != nil {
		return err
	}

	// Prepare subject content
	subjectContent := email.MilestoneAssignedSubjectContent{
		ModelName: modelPlan.ModelName,
	}

	// Prepare body content
	solutionsNames := lo.Map(solutions, func(item *models.MTOSolution, _ int) string {
		if item == nil || item.Name == nil {
			return ""
		}
		return *item.Name
	})
	bodyContent := email.NewMilestoneAssignedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		modelPlan,
		milestone,
		solutionsNames,
	)

	// Execute subject template
	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	// Execute body template
	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
	if err != nil {
		return err
	}

	// Send email to assigned user
	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{assignedUser.Email},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}

	return nil
}
