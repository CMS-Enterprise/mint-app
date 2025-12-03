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

func KeyContactGetByIDsLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.KeyContact, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}
	returned, err := sqlutils.SelectProcedure[models.KeyContact](np, sqlqueries.KeyContact.GetByIDs, args)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// KeyContactCreateContact creates a new KeyContact in the database.
func KeyContactCreateContact(np sqlutils.NamedPreparer, _ *zap.Logger, KeyContact *models.KeyContact) (*models.KeyContact, error) {
	if KeyContact == nil {
		return nil, fmt.Errorf("key contact cannot be nil")
	}
	if KeyContact.ID == uuid.Nil {
		KeyContact.ID = uuid.New()
	}

	returned, err := sqlutils.GetProcedure[models.KeyContact](np, sqlqueries.KeyContact.Create, KeyContact)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func KeyContactUpdateContact(np sqlutils.NamedPreparer, _ *zap.Logger, KeyContact *models.KeyContact) (*models.KeyContact, error) {
	returned, err := sqlutils.GetProcedure[models.KeyContact](np, sqlqueries.KeyContact.Update, KeyContact)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func KeyContactDeleteContactByID(tx *sqlx.Tx, actorUserID uuid.UUID, _ *zap.Logger, id uuid.UUID) (*models.KeyContact, error) {
	// We need to set the session user variable so that the audit trigger knows who made the delete operation
	err := setCurrentSessionUserVariable(tx, actorUserID)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{"id": id}
	returnedContact, err := sqlutils.GetProcedure[models.KeyContact](tx, sqlqueries.KeyContact.DeleteByID, arg)
	if err != nil {
		return nil, err
	}
	return returnedContact, nil
}

// KeyContactGetAllLoader returns all key contacts
func KeyContactGetAllLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.KeyContact, error) {
	returned, err := sqlutils.SelectProcedure[models.KeyContact](np, sqlqueries.KeyContact.GetAll, map[string]any{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}
