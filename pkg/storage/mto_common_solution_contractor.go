package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// MTOCommonSolutionContractorGetByCommonSolutionKeyLoader returns a list of contractors associated with the given keys.
func MTOCommonSolutionContractorGetByCommonSolutionKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionContractor, error) {
	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutionContractor.GetByCommonSolutionKey, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionCreateContractor creates a new MTOCommonSolutionContractor in the database.
func MTOCommonSolutionCreateContractor(np sqlutils.NamedPreparer, _ *zap.Logger, contractor *models.MTOCommonSolutionContractor) (*models.MTOCommonSolutionContractor, error) {
	if contractor == nil {
		return nil, fmt.Errorf("contractor cannot be nil")
	}
	if contractor.ID == uuid.Nil {
		contractor.ID = uuid.New()
	}

	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutionContractor.Create, contractor)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionGetContractorByID fetches a contractor by its ID.
func MTOCommonSolutionGetContractorByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionContractor, error) {
	arg := map[string]interface{}{"id": id}

	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutionContractor.GetByID, arg)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionContractorGetByCommonSolutionIDLoader returns a list of contractors associated with the given keys.
func MTOCommonSolutionContractorGetByCommonSolutionIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOCommonSolutionContractor, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutionContractor.GetByIDs, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionUpdateContractor updates an existing contractor.
func MTOCommonSolutionUpdateContractor(np sqlutils.NamedPreparer, _ *zap.Logger, contractor *models.MTOCommonSolutionContractor) (*models.MTOCommonSolutionContractor, error) {
	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutionContractor.Update, contractor)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionDeleteContractorByID deletes a contractor by its ID.
func MTOCommonSolutionDeleteContractorByID(tx *sqlx.Tx, actorUserID uuid.UUID, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionContractor, error) {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{"id": id}
	returnedContractor, err := sqlutils.GetProcedure[models.MTOCommonSolutionContractor](tx, sqlqueries.MTOCommonSolutionContractor.DeleteByID, arg)
	if err != nil {
		return nil, err
	}
	return returnedContractor, nil
}
