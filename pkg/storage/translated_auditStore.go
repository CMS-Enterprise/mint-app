package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// TranslatedAuditCreate creates a TranslatedAudit in the database, using the values passed in the translatedAudit parameter
func TranslatedAuditCreate(np sqlutils.NamedPreparer, translatedAudit *models.TranslatedAudit) (*models.TranslatedAudit, error) {
	if translatedAudit.ID == uuid.Nil {
		translatedAudit.ID = uuid.New()
	}

	// Set the raw data as the humanizedAuditChangeData
	if translatedAudit.MetaData != nil {
		translatedAudit.MetaDataRaw = &translatedAudit.MetaData
	}

	retHumanizedChange, procError := sqlutils.GetProcedure[models.TranslatedAudit](np, sqlqueries.TranslatedAudit.Create, translatedAudit)
	if procError != nil {
		return nil, fmt.Errorf("issue creating new TranslatedAuditChange object: %w", procError)
	}
	return retHumanizedChange, nil
}

// TranslatedAuditCreateCollection creates a TranslatedAudit in the database, using the values passed in the translatedAudits parameter
func TranslatedAuditCreateCollection(np sqlutils.NamedPreparer, translatedAudits []*models.TranslatedAudit) ([]*models.TranslatedAudit, error) {
	retChanges := []*models.TranslatedAudit{}
	// Changes (ChChCh Changes!) Make this a separate SQL call to try to insert all records at once instead of iterating through a collection.
	// Note, even in this structure, a transaction is possible

	for _, translatedAuditChange := range translatedAudits {
		retChange, err := TranslatedAuditCreate(np, translatedAuditChange)
		if err != nil {
			return nil, fmt.Errorf("issue creating new TranslatedAuditChange collection. error: %w", err)
		}
		retChanges = append(retChanges, retChange)
	}

	return retChanges, nil
}

// TranslatedAuditCollectionGetByModelPlanID returns all translatedAudits for a given model plan id
func TranslatedAuditCollectionGetByModelPlanID(np sqlutils.NamedPreparer, modelPlanID uuid.UUID) ([]*models.TranslatedAudit, error) {

	arg := map[string]interface{}{"model_plan_id": modelPlanID}

	translatedAuditCollection, procErr := sqlutils.SelectProcedure[models.TranslatedAudit](np, sqlqueries.TranslatedAudit.CollectionGetByModelPlanID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting translated audit collection by model_plan_id (%s)  : %w", modelPlanID, procErr)
	}
	return translatedAuditCollection, nil
}
