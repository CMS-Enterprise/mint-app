package resolvers

import (
	"context"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// OperationalSolutionCreate calls a DB method to create an operational solution
func OperationalSolutionCreate(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	operationNeedID uuid.UUID,
	solutionType *models.OperationalSolutionKey,
	changes map[string]interface{},
	principal authentication.Principal,
) (*models.OperationalSolution, error) {
	opSol := models.NewOperationalSolution(principal.Account().ID, operationNeedID)

	err := BaseStructPreUpdate(logger, opSol, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}

	sol, err := store.OperationalSolutionInsert(logger, opSol, solutionType)
	if err != nil {
		return nil, err
	}

	return sol, err

}

// OperationalSolutionUpdate updates an operational Solution by it's ID
func OperationalSolutionUpdate(logger *zap.Logger, id uuid.UUID, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.OperationalSolution, error) {

	existing, err := store.OperationalSolutionGetByID(logger, id)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(logger, existing, changes, principal, store, true, true)
	if err != nil {
		return nil, err
	}
	return store.OperationalSolutionUpdateByID(logger, existing)

}

// OperationalSolutionsAndPossibleGetByOPNeedIDLOADER returns operational Solutions and possible Operational Solutions based on a specific operational Need ID using a Data Loader
func OperationalSolutionsAndPossibleGetByOPNeedIDLOADER(ctx context.Context, operationalNeedID uuid.UUID, includeNotNeeded bool) ([]*models.OperationalSolution, error) {
	return loaders.OperationalSolutions.AndPossibleByOperationalNeedID.Load(ctx,
		storage.SolutionAndPossibleKey{
			OperationalNeedID: operationalNeedID,
			IncludeNotNeeded:  includeNotNeeded,
		})
}

// OperationalSolutionGetByID returns an operational Solution by it's ID
func OperationalSolutionGetByID(logger *zap.Logger, id uuid.UUID, store *storage.Store) (*models.OperationalSolution, error) {
	return store.OperationalSolutionGetByID(logger, id)
}

// OperationalSolutionGetByIDLOADER implements resolver logic to get an Operational Solution by ID using a data loader
func OperationalSolutionGetByIDLOADER(ctx context.Context, id uuid.UUID) (*models.OperationalSolution, error) {
	return loaders.OperationalSolutions.ByID.Load(ctx, id)
}
