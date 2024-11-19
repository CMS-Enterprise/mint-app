package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOSolutionGetByModelPlanIDLOADER implements resolver logic to get all MTO
// solutions by a model plan ID using a data loader
func MTOSolutionGetByModelPlanIDLOADER(
	ctx context.Context,
	modelPlanID uuid.UUID,
) ([]*models.MTOCommonSolution, error) {

	// Translate a nil key to UUID nil, as we need a primitive type for translating results later
	return loaders.MTOCommonSolution.ByModelPlanID.Load(ctx, modelPlanID)
}

func MTOSolutionGetCommonSolutionByKeyLoader(
	ctx context.Context,
	key *models.MTOCommonSolutionKey,
) (*models.MTOCommonSolution, error) {
	commonSolution, err := MTOCommonSolutionGetByKeyLOADER(ctx, *key)
	if err != nil {
		return nil, err
	}

	if commonSolution == nil {
		return nil, fmt.Errorf("common solution not found for key %s", *key)
	}

	return commonSolution, nil
}

// MTOSolutionUpdate updates the MTOSolution
func MTOSolutionUpdate(
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
	existing, err := storage.MTOSolutionGetByIDLoader(store, logger, []uuid.UUID{id})
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO Solution. Err %w", err)
	}

	if len(existing) == 0 {
		return nil, fmt.Errorf("unable to update MTO Solution. ID %s not found", id)
	}

	// Check access and apply changes
	err = BaseStructPreUpdate(logger, existing[0], changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOSolutionUpdate(store, logger, existing[0])
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
	facilitatedBy models.MTOFacilitator,
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
		facilitatedBy,
		pocName,
		pocEmail,
		principalAccount.ID,
	)

	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	return storage.MTOSolutionCreate(store, logger, mtoSolution)
}

func MTOSolutionCreateCommon(
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	modelPlanID uuid.UUID,
	commonSolutionKey *models.MTOCommonSolutionKey,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	mtoSolution := models.NewMTOSolution(
		modelPlanID, // TODO: ???
		commonSolutionKey,
		nil,                        // name, // TODO: ???
		nil,                        // solutionType, // TODO: ???git
		models.MTOFacilitatorOther, // facilitatedBy, // TODO: ???
		"test_poc_name_empty",      // pocName, // TODO: ???
		"empty@email.test",         // pocEmail, // TODO: ???
		principalAccount.ID,
	)

	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	return storage.MTOSolutionCreate(store, logger, mtoSolution)
}
