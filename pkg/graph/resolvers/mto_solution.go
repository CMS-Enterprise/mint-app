package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOSolutionGetByModelPlanIDLOADER implements resolver logic to get all MTO
// solutions by a model plan ID using a data loader
func MTOSolutionGetByModelPlanIDLOADER(
	ctx context.Context,
	modelPlanID *uuid.UUID,
) ([]*models.MTOCommonSolution, error) {

	// Translate a nil key to UUID nil, as we need a primitive type for translating results later
	var key uuid.UUID
	if modelPlanID != nil {
		key = *modelPlanID
	}
	return loaders.MTOCommonSolution.ByModelPlanID.Load(ctx, key)
}

func MTOSolutionGetCommonSolutionByKeyLoader(
	namedPreparer sqlutils.NamedPreparer,
	logger *zap.Logger,
	key *models.MTOCommonSolutionKey,
) (*models.MTOCommonSolution, error) {
	if key == nil {
		return nil, fmt.Errorf("common solution key is nil")
	}

	commonSolution, err := storage.MTOCommonSolutionGetByKeyLoader(
		namedPreparer,
		logger,
		[]models.MTOCommonSolutionKey{*key},
	)
	if err != nil {
		return nil, err
	}

	if len(commonSolution) == 0 {
		return nil, fmt.Errorf("common solution not found for solution key %s", *key)
	}

	return commonSolution[0], nil
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

// MTOSolutionCreate uses the provided information to create a new MTOSolution
func MTOSolutionCreate(
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
		name,
		solutionType,
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

func MTOSolutionCreateWithCommonKey(
	logger *zap.Logger,
	principal authentication.Principal,
	store *storage.Store,
	commonSolutionKey *models.MTOCommonSolutionKey,
) (*models.MTOSolution, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// TODO: How should we populate these fields?
	mtoSolution := models.NewMTOSolution(
		uuid.Nil,
		commonSolutionKey,
		"",
		models.MTOSolutionTypeOther,
		models.MTOFacilitatorOther,
		"",
		"",
		principalAccount.ID,
	)

	err := BaseStructPreCreate(logger, mtoSolution, principal, store, true)
	if err != nil {
		return nil, err
	}

	return storage.MTOSolutionCreate(store, logger, mtoSolution)
}
