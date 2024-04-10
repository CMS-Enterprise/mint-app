package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// TranslatedAuditChangeCreate creates a TranslatedAuditChange in the database, using the values passed in the translatedAuditChange parameter
func TranslatedAuditChangeCreate(np sqlutils.NamedPreparer, translatedAuditChange *models.TranslatedAuditChange) (*models.TranslatedAuditChange, error) {
	if translatedAuditChange.ID == uuid.Nil {
		translatedAuditChange.ID = uuid.New()
	}

	// Set the raw data as the humanizedAuditChangeData
	translatedAuditChange.MetaDataRaw = translatedAuditChange.MetaData

	retHumanizedChange, procError := sqlutils.GetProcedure[models.TranslatedAuditChange](np, sqlqueries.TranslatedAuditChange.Create, translatedAuditChange)
	if procError != nil {
		return nil, fmt.Errorf("issue creating new TranslatedAuditChange object: %w", procError)
	}
	return retHumanizedChange, nil
}

// TranslatedAuditChangeCreateCollection creates a TranslatedAuditChange in the database, using the values passed in the translatedAuditChanges parameter
func TranslatedAuditChangeCreateCollection(np sqlutils.NamedPreparer, translatedAuditChanges []*models.TranslatedAuditChange) ([]*models.TranslatedAuditChange, error) {
	retChanges := []*models.TranslatedAuditChange{}
	// Changes (ChChCh Changes!) Make this a separate SQL call to try to insert all records at once instead of iterating through a collection.
	// Note, even in this structure, a transaction is possible

	for _, translatedAuditChange := range translatedAuditChanges {
		retChange, err := TranslatedAuditChangeCreate(np, translatedAuditChange)
		if err != nil {
			return nil, fmt.Errorf("issue creating new TranslatedAuditChange collection. error: %w", err)
		}
		retChanges = append(retChanges, retChange)
	}

	return retChanges, nil
}

// TranslatedAuditChangeCollectionGetByModelPlanID returns all HumanizedAuditChange for a given model plan id
func TranslatedAuditChangeCollectionGetByModelPlanID(np sqlutils.NamedPreparer, modelPlanID uuid.UUID) ([]*models.TranslatedAuditChange, error) {

	arg := map[string]interface{}{"model_plan_id": modelPlanID}

	translatedAuditCollection, procErr := sqlutils.SelectProcedure[models.TranslatedAuditChange](np, sqlqueries.TranslatedAuditChange.CollectionGetByModelPlanID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting translated audit collection by model_plan_id (%s)  : %w", modelPlanID, procErr)
	}
	return translatedAuditCollection, nil
}
