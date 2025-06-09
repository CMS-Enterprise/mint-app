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
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutioncontractor.GetByCommonSolutionKey, args)
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
	if contractor.Key == "" {
		return nil, fmt.Errorf("contractor key cannot be nil")
	}
	if contractor.ID == uuid.Nil {
		contractor.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutioncontractor.Create, contractor)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOCommonSolutionContractor object: %w", procErr)
	}
	return returned, nil
}

// MTOCommonSolutionGetContractorByID fetches a contractor by its ID.
func MTOCommonSolutionGetContractorByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionContractor, error) {
	arg := map[string]interface{}{"id": id}

	returned, procErr := sqlutils.GetProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutioncontractor.GetByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting MTOCommonSolutionContractor by ID %s: %w", id, procErr)
	}
	return returned, nil
}

// MTOCommonSolutionUpdateContractor updates an existing contractor.
func MTOCommonSolutionUpdateContractor(np sqlutils.NamedPreparer, _ *zap.Logger, contractor *models.MTOCommonSolutionContractor) (*models.MTOCommonSolutionContractor, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOCommonSolutionContractor](np, sqlqueries.MTOCommonSolutioncontractor.Update, contractor)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOCommonSolutionContractor object: %w", procErr)
	}
	return returned, nil
}

// MTOCommonSolutionDeleteContractorByID deletes a contractor by its ID.
func MTOCommonSolutionDeleteContractorByID(tx *sqlx.Tx, actorUserID uuid.UUID, _ *zap.Logger, id uuid.UUID) error {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return err
	}

	arg := map[string]interface{}{"id": id}
	procErr := sqlutils.ExecProcedure(tx, sqlqueries.MTOCommonSolutioncontractor.DeleteByID, arg)
	if procErr != nil {
		return fmt.Errorf("issue deleting MTOCommonSolutionContractor by ID %s: %w", id, procErr)
	}
	return nil
}
