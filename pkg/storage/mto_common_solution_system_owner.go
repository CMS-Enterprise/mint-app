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

// MTOCommonSolutionSystemOwnerGetByCommonSolutionKeyLoader returns a list of system owners associated with the given keys.
func MTOCommonSolutionSystemOwnerGetByCommonSolutionKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionSystemOwner, error) {
	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionSystemOwner](np, sqlqueries.MTOCommonSolutionSystemOwner.GetByCommonSolutionKey, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionCreateSystemOwner creates a new MTOCommonSolutionSystemOwner in the database.
func MTOCommonSolutionCreateSystemOwner(np sqlutils.NamedPreparer, _ *zap.Logger, systemOwner *models.MTOCommonSolutionSystemOwner) (*models.MTOCommonSolutionSystemOwner, error) {
	if systemOwner == nil {
		return nil, fmt.Errorf("system owner cannot be nil")
	}
	if systemOwner.ID == uuid.Nil {
		systemOwner.ID = uuid.New()
	}

	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionSystemOwner](np, sqlqueries.MTOCommonSolutionSystemOwner.Create, systemOwner)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionGetSystemOwnerByID fetches a system owner by its ID.
func MTOCommonSolutionGetSystemOwnerByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionSystemOwner, error) {
	arg := map[string]interface{}{"id": id}

	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionSystemOwner](np, sqlqueries.MTOCommonSolutionSystemOwner.GetByID, arg)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionSystemOwnerGetByIDLoader returns a list of system owners associated with the given IDs.
func MTOCommonSolutionSystemOwnerGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOCommonSolutionSystemOwner, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionSystemOwner](np, sqlqueries.MTOCommonSolutionSystemOwner.GetByIDs, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionUpdateSystemOwner updates an existing system owner.
func MTOCommonSolutionUpdateSystemOwner(np sqlutils.NamedPreparer, _ *zap.Logger, systemOwner *models.MTOCommonSolutionSystemOwner) (*models.MTOCommonSolutionSystemOwner, error) {
	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionSystemOwner](np, sqlqueries.MTOCommonSolutionSystemOwner.Update, systemOwner)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionDeleteSystemOwnerByID deletes a system owner by its ID.
func MTOCommonSolutionDeleteSystemOwnerByID(tx *sqlx.Tx, actorUserID uuid.UUID, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionSystemOwner, error) {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{"id": id}
	returnedSystemOwner, err := sqlutils.GetProcedure[models.MTOCommonSolutionSystemOwner](tx, sqlqueries.MTOCommonSolutionSystemOwner.DeleteByID, arg)
	if err != nil {
		return nil, err
	}
	return returnedSystemOwner, nil
}
