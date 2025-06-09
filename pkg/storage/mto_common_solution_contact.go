package storage

import (
	"fmt"

	"github.com/google/uuid"
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

// MTOCommonSolutionCreateContact creates a new MTOCommonSolutionContact in the database.
func MTOCommonSolutionCreateContact(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCommonSolutionContact *models.MTOCommonSolutionContact) (*models.MTOCommonSolutionContact, error) {
	if MTOCommonSolutionContact == nil {
		return nil, fmt.Errorf("contractor cannot be nil")
	}
	if MTOCommonSolutionContact.Key == "" {
		return nil, fmt.Errorf("contractor key cannot be nil")
	}
	if MTOCommonSolutionContact.ID == uuid.Nil {
		MTOCommonSolutionContact.ID = uuid.New()
	}

	returned, procErr := sqlutils.GetProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.Create, MTOCommonSolutionContact)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new MTOCommonSolutionContact object: %w", procErr)
	}
	return returned, nil
}

func MTOCommonSolutionGetContactByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionContact, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.GetByID, id)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting MTOCommonSolutionContact by ID %s: %w", id, procErr)
	}

	return returned, nil
}

func MTOCommonSolutionUpdateContact(np sqlutils.NamedPreparer, _ *zap.Logger, MTOCommonSolutionContact *models.MTOCommonSolutionContact) (*models.MTOCommonSolutionContact, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.Update, MTOCommonSolutionContact)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating MTOCommonSolutionContact object: %w", procErr)
	}
	return returned, nil
}

func MTOCommonSolutionDeleteContactByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.MTOCommonSolutionContact, error) {
	returned, procErr := sqlutils.GetProcedure[models.MTOCommonSolutionContact](np, sqlqueries.MTOCommonSolutionContact.DeleteByID, id)
	if procErr != nil {
		return nil, fmt.Errorf("issue deleting MTOCommonSolutionContact by ID %s: %w", id, procErr)
	}
	return returned, nil
}
