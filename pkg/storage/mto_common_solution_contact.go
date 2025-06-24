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

// MTOCommonSolutionContactGetByCommonSolutionKeyLoader returns a list of common solution contacts associated with
func MTOCommonSolutionContactGetByCommonSolutionKeyLoader(np sqlutils.NamedPreparer, _ *zap.Logger, keys []models.MTOCommonSolutionKey) ([]*models.MTOCommonSolutionContact, error) {
	args := map[string]interface{}{
		"keys": pq.Array(keys),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.GetByCommonSolutionKey, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func MTOCommonSolutionContactGetByIDsLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.MTOCommonSolutionContact, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	returned, err := sqlutils.SelectProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.GetByIDs, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// MTOCommonSolutionCreateContact creates a new MTOCommonSolutionContact in the database.
func MTOCommonSolutionCreateContact(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCommonSolutionContact *models.MTOCommonSolutionContact) (*models.MTOCommonSolutionContact, error) {
	if MTOCommonSolutionContact == nil {
		return nil, fmt.Errorf("MTOCommonSolutionContact cannot be nil")
	}
	if MTOCommonSolutionContact.ID == uuid.Nil {
		MTOCommonSolutionContact.ID = uuid.New()
	}

	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.Create, MTOCommonSolutionContact)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func MTOCommonSolutionGetContactByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionContact, error) {
	arg := map[string]interface{}{"id": id}

	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.GetByID, arg)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// MTOCommonSolutionContactUnsetPrimaryContactByKey unsets the primary contact for a given common solution key.
func MTOCommonSolutionContactUnsetPrimaryContactByKey(np sqlutils.NamedPreparer, _ *zap.Logger, existingContact *models.MTOCommonSolutionContact) error {
	args := map[string]interface{}{
		"key":         existingContact.Key,
		"id":          existingContact.ID,
		"modified_by": existingContact.ModifiedBy,
	}

	if existingContact.Key == "" {
		return fmt.Errorf("key cannot be empty")
	}

	return sqlutils.ExecProcedure(np, sqlqueries.MTOCommonSolutionContact.UnsetPrimaryKey, args)
}

func MTOCommonSolutionUpdateContact(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCommonSolutionContact *models.MTOCommonSolutionContact) (*models.MTOCommonSolutionContact, error) {
	returned, err := sqlutils.GetProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.Update, MTOCommonSolutionContact)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func MTOCommonSolutionDeleteContactByID(tx *sqlx.Tx, actorUserID uuid.UUID, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionContact, error) {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{"id": id}
	returnedContact, err := sqlutils.GetProcedure[models.MTOCommonSolutionContact](tx, sqlqueries.MTOCommonSolutionContact.DeleteByID, arg)
	if err != nil {
		return nil, err
	}
	return returnedContact, nil
}
