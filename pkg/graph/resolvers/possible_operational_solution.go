package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// PossibleOperationalSolutionCollectionGetByNeedType returns all possible operational Solutions linked to Operational Need Type
func PossibleOperationalSolutionCollectionGetByNeedType(logger *zap.Logger, needType models.OperationalNeedKey, store *storage.Store) ([]*models.PossibleOperationalSolution, error) {
	return store.PossibleOperationalSolutionCollectionGetByNeedType(logger, needType)
}

// PossibleOperationalSolutionCollectionGetAll returns all possible operational Solutions linked to Operational Need Type
func PossibleOperationalSolutionCollectionGetAll(logger *zap.Logger, store *storage.Store) ([]*models.PossibleOperationalSolution, error) {
	return store.PossibleOperationalSolutionCollectionGetAll(logger)
}

// PossibleOperationalSolutionGetByID returns a possible operational Solutions according to it's id
func PossibleOperationalSolutionGetByID(logger *zap.Logger, store *storage.Store, id int) (*models.PossibleOperationalSolution, error) {
	return store.PossibleOperationalSolutionGetByID(logger, id)
}

// PossibleOperationalSolutionSetPrimaryContactByID sets the primary point of contact for a possible operational solution
func PossibleOperationalSolutionSetPrimaryContactByID(
	logger *zap.Logger,
	store *storage.Store,
	possibleOperationalSolutionID int,
	pointOfContactID uuid.UUID,
	principal authentication.Principal,
) (bool, error) {

	err := store.PossibleOperationalSolutionUnsetPrimaryContactByID(
		logger,
		possibleOperationalSolutionID,
		principal)
	if err != nil {
		return false, err
	}

	return store.PossibleOperationalSolutionSetPrimaryContactByID(
		logger,
		possibleOperationalSolutionID,
		pointOfContactID,
		principal,
	)
}
