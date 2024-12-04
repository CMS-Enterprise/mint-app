package resolvers

import (
	"context"
	"fmt"

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
	modelPlanID uuid.UUID,
	mtoCategoryID *uuid.UUID,
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// A custom milestone never has a CommonMilestoneKey, so pass in `nil`
	milestone := models.NewMTOMilestone(principalAccount.ID, &name, nil, modelPlanID, mtoCategoryID)

	err := BaseStructPreCreate(logger, milestone, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneCreate(store, logger, milestone)
}

// MTOMilestoneCreateCommon uses the provided information to create a new Custom MTO Milestone
func MTOMilestoneCreateCommon(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
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
		parentCategoryToCreate := models.NewMTOCategory(uuid.Nil, commonMilestone.CategoryName, modelPlanID, nil, 0)
		parentCategory, err := storage.MTOCategoryCreateAllowConflicts(tx, logger, parentCategoryToCreate)
		if err != nil {
			logger.Error("failed to create parent category when creating milestone from library", zap.Error(err))
			return nil, err
		}
		finalCategoryID := parentCategory.ID // track the eventual category ID that we will attach to the milestone
		if commonMilestone.SubCategoryName != nil {
			subCategoryToCreate := models.NewMTOCategory(uuid.Nil, *commonMilestone.SubCategoryName, modelPlanID, &parentCategory.ID, 0)
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
			&commonMilestoneKey,
			modelPlanID,
			&finalCategoryID,
		)
		milestone.FacilitatedBy = &commonMilestone.FacilitatedByRole

		if err := BaseStructPreCreate(logger, milestone, principal, store, true); err != nil {
			return nil, err
		}
		createdMilestone, err := storage.MTOMilestoneCreate(tx, logger, milestone)

		// TODO: Batch insert these solutions
		var solutions []*models.MTOSolution
		for _, commonSolutionKey := range commonSolutions {
			solution := models.NewMTOSolution(modelPlanID,
				&commonSolutionKey,
				nil,
				nil,
				nil,
				principal.Account().ID)

			mtoSolution, createMTOSolutionErr := storage.MTOSolutionCreateAllowConflicts(tx, logger, solution)
			if createMTOSolutionErr != nil {
				logger.Error("failed to create solution when creating common milestone", zap.Error(err))
				return nil, createMTOSolutionErr
			}

			solutions = append(solutions, mtoSolution)
		}

		// TODO: Batch insert these links
		for _, solution := range solutions {
			mtoMilestoneSolutionLink := models.NewMTOMilestoneSolutionLink(
				principal.Account().ID,
				createdMilestone.ID,
				solution.ID,
			)

			_, milestoneSolutionLinkErr := storage.MTOMilestoneSolutionLinkCreate(
				tx,
				logger,
				mtoMilestoneSolutionLink,
			)

			if milestoneSolutionLinkErr != nil {
				logger.Error(
					"failed to create milestone solution link when creating milestone from library",
					zap.Error(err),
				)
				return nil, milestoneSolutionLinkErr
			}
		}

		return createdMilestone, err
	})
}

// MTOMilestoneUpdate updates the name of MTOMilestone or SubMilestone
func MTOMilestoneUpdate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
) (*models.MTOMilestone, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOMilestoneGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Milestone. Err %w", err)
	}

	// Check access and apply changes
	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOMilestoneUpdate(store, logger, existing)
}

// MTOMilestoneGetByModelPlanIDLOADER implements resolver logic to get all MTO milestones by a model plan ID using a data loader
func MTOMilestoneGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByModelPlanID.Load(ctx, modelPlanID)
}

// MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER implements resolver logic to get all MTO milestones by a model plan ID and MTO category ID using a data loader
func MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER(ctx context.Context, modelPlanID uuid.UUID, mtoCategoryID uuid.UUID) ([]*models.MTOMilestone, error) {
	return loaders.MTOMilestone.ByModelPlanIDAndMTOCategoryID.Load(ctx,
		storage.MTOMilestoneByModelPlanAndCategoryKey{
			ModelPlanID:   modelPlanID,
			MTOCategoryID: mtoCategoryID,
		})
}
