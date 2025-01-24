package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"

	"github.com/jmoiron/sqlx"

	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// MTOSolutionUpdate updates the MTOSolution
func MTOSolutionUpdate(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	id uuid.UUID,
	changes map[string]interface{},
	milestoneLinks *model.MTOMilestoneLinks,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := loaders.MTOSolution.ByID.Load(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Solution. Err %w", err)
	}
	// Since the above dataloader will return `Name` and `Type` properties when
	// fetching solutions sourced from the common solution library, we need to clear out those fields
	// or else storage.MTOSolutionUpdate will attempt to update them (which won't be allowed, since this is a Solution sourced from the common solution library
	if existing.AddedFromSolutionLibrary() {
		existing.Name = nil
		existing.Type = nil
	}

	// Check access and apply changes
	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	// return storage.MTOSolutionUpdate(store, logger, existing)

	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOSolution, error) {
		updatedSolution, err := storage.MTOSolutionUpdate(tx, logger, existing)
		if err != nil {
			return nil, fmt.Errorf("failed to update solution: %w", err)
		}

		// Update linked milestones
		if milestoneLinks.MilestoneIDs != nil {
			_, err := MTOSolutionLinkMilestonesWithTX(
				ctx,
				principal,
				logger,
				tx,
				updatedSolution.ID,
				milestoneLinks.MilestoneIDs,
			)
			if err != nil {
				return nil, fmt.Errorf("failed to update linked milestones: %w", err)
			}
		}

		return updatedSolution, nil
	})
}

// MTOSolutionCreateCustom uses the provided information to create a new MTOSolution
func MTOSolutionCreateCustom(
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	modelPlanID uuid.UUID,
	commonSolutionKey *models.MTOCommonSolutionKey,
	name string,
	solutionType models.MTOSolutionType,
	neededBy *time.Time,
	pocName string,
	pocEmail string,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	mtoSolution := models.NewMTOSolution(
		modelPlanID,
		commonSolutionKey,
		&name,
		&solutionType,
		neededBy,
		principalAccount.ID,
	)
	mtoSolution.PocName = &pocName
	mtoSolution.PocEmail = &pocEmail

	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	return storage.MTOSolutionCreate(store, logger, mtoSolution)
}

func MTOSolutionCreateCommon(
	ctx context.Context,
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	modelPlanID uuid.UUID,
	commonSolutionKey models.MTOCommonSolutionKey,
	milestonesToLink []uuid.UUID,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Create a new MTOSolution object
	mtoSolution := models.NewMTOSolution(
		modelPlanID,
		&commonSolutionKey,
		nil, // name is not stored for a solution from the common library
		nil, // type is not stored for a solution from the common library
		nil, // neededBy is not provided when creating a custom solution. It must be updated later
		principalAccount.ID,
	)

	// Perform pre-create validations
	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	// Use a transaction for atomic operations
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*models.MTOSolution, error) {
		// Step 1: Create the solution
		solution, err := storage.MTOSolutionCreate(tx, logger, mtoSolution)
		if err != nil {
			return nil, fmt.Errorf("failed to create solution: %w", err)
		}

		// Step 2: Link milestones in a consolidated fashion
		if len(milestonesToLink) > 0 {
			_, err := MTOSolutionLinkMilestonesWithTX(ctx, principal, logger, tx, solution.ID, milestonesToLink)
			if err != nil {
				return nil, fmt.Errorf("failed to link milestones to solution: %w", err)
			}
		}

		return solution, nil
	})
}

// MTOSolutionLinkMilestones handles linking milestones to a solution
func MTOSolutionLinkMilestones(
	ctx context.Context,
	principal authentication.Principal,
	logger *zap.Logger,
	store *storage.Store,
	solutionID uuid.UUID,
	milestonesToLink []uuid.UUID,
) ([]*models.MTOMilestone, error) {

	retVals, err := sqlutils.WithTransaction[[]*models.MTOMilestone](store, func(tx *sqlx.Tx) (*[]*models.MTOMilestone, error) {
		result, err := MTOSolutionLinkMilestonesWithTX(ctx, principal, logger, tx, solutionID, milestonesToLink)
		if err != nil {
			return nil, fmt.Errorf("failed to link milestones to solution: %w", err)
		}
		return &result, err
	})

	if err != nil || retVals == nil {
		return nil, err
	}

	return *retVals, err
}

// MTOSolutionLinkMilestonesWithTX handles linking milestones to a solution in a single transaction
func MTOSolutionLinkMilestonesWithTX(
	ctx context.Context,
	principal authentication.Principal,
	logger *zap.Logger,
	tx *sqlx.Tx,
	solutionID uuid.UUID,
	milestonesToLink []uuid.UUID,
) ([]*models.MTOMilestone, error) {
	// Prepare data for batch insertion
	/*links := lo.Map(milestonesToLink, func(milestoneID uuid.UUID, _ int) *models.MTOMilestoneSolutionLink {
		return models.NewMTOMilestoneSolutionLink(principal.Account().ID, milestoneID, solutionID)
	})*/

	// Insert or update links in bulk
	linkedMilestones, err := storage.MTOMilestoneSolutionLinkMilestonesToSolution(tx, logger, solutionID, milestonesToLink, principal.Account().ID)
	if err != nil {
		logger.Error("failed to merge milestone links", zap.Error(err))
		return nil, err
	}

	return linkedMilestones, nil
}

// MTOSolutionGetByModelPlanIDLOADER implements resolver logic to get all MTO solutions by a model plan ID using a data loader
func MTOSolutionGetByModelPlanIDLOADER(
	ctx context.Context,
	modelPlanID uuid.UUID,
) ([]*models.MTOSolution, error) {
	// TODO look into expanding this to also take contextual model plan data to return is added etc
	return loaders.MTOSolution.ByModelPlanID.Load(ctx, modelPlanID)
}

func MTOSolutionGetByMilestoneIDLOADER(
	ctx context.Context,
	milestoneID uuid.UUID,
) ([]*models.MTOSolution, error) {
	return loaders.MTOSolution.ByMilestoneID.Load(ctx, milestoneID)
}

func MTOSolutionGetByIDLOADER(
	ctx context.Context,
	id uuid.UUID,
) (*models.MTOSolution, error) {
	return loaders.MTOSolution.ByID.Load(ctx, id)
}

// MTOSolutionDelete deletes an MTOSolution
// It returns an error if the principal is invalid, the solution doesn't exist, user doesn't have permissions to delete, or the delete call itself fails
// TODO - Consider returning a *models.MTOSolution here if we want to ever access the returned data on what was deleted
func MTOSolutionDelete(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, id uuid.UUID) error {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Write up a transaction since storage.MTOSolutionDelete needs one for setting `delete` session user variables
	return sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {
		// First, fetch the existing solution so we can check permissions
		existing, err := MTOSolutionGetByIDLOADER(ctx, id)
		if err != nil {
			return fmt.Errorf("error fetching mto solution during deletion: %s", err)
		}

		// Check permissions
		if err := BaseStructPreDelete(logger, existing, principal, store, true); err != nil {
			return fmt.Errorf("error deleting mto solution. user doesnt have permissions. %s", err)
		}

		// Finally, delete the solution
		if err := storage.MTOSolutionDelete(tx, principalAccount.ID, logger, id); err != nil {
			return fmt.Errorf("unable to delete mto solution. Err %w", err)
		}
		return nil
	})
}
