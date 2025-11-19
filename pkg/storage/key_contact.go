package storage

import (
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// KeyContactCreateContact creates a new KeyContact in the database.
func KeyContactCreateContact(np sqlutils.NamedPreparer, _ *zap.Logger, KeyContact *models.KeyContact) (*models.KeyContact, error) {
	if KeyContact == nil {
		return nil, fmt.Errorf("Key Contact cannot be nil")
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
