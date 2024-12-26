package resolvers

import (
	"context"
	"fmt"
	"time"

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
	return storage.MTOSolutionUpdate(store, logger, existing)
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
	mtoSolution := models.NewMTOSolution(
		modelPlanID,
		&commonSolutionKey,
		nil, // name is not stored for a solution from the common library
		nil, // type is not stored for a solution from the common library
		nil, // needed by is not provided when creating a custom solution. It must be updated later
		principalAccount.ID,
	)

	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	return sqlutils.WithTransaction[models.MTOSolution](store, func(tx *sqlx.Tx) (*models.MTOSolution, error) {
		solution, err := storage.MTOSolutionCreate(tx, logger, mtoSolution)
		if err != nil {
			return nil, err
		}

		// Link the solution to the provided milestones
		for _, milestoneID := range milestonesToLink {
			link := models.NewMTOMilestoneSolutionLink(
				principal.Account().ID,
				milestoneID,
				solution.ID,
			)

			_, err = storage.MTOMilestoneSolutionLinkCreate(
				tx,
				logger,
				link,
			)
			if err != nil {
				return nil, err
			}
		}

		return solution, nil
	})
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
