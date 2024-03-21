package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// HumanizedAuditChangeCreate creates a HumanizedAuditChange in the database, using the values passed in the humanizedAuditChange parameter
func HumanizedAuditChangeCreate(np sqlutils.NamedPreparer, humanizedAuditChange *models.HumanizedAuditChange) (*models.HumanizedAuditChange, error) {
	if humanizedAuditChange.ID == uuid.Nil {
		humanizedAuditChange.ID = uuid.New()
	}

	retHumanizedChange, procError := sqlutils.GetProcedure[models.HumanizedAuditChange](np, sqlqueries.HumanizedAuditChange.Create, humanizedAuditChange)
	if procError != nil {
		return nil, fmt.Errorf("issue creating new HumanizedAuditChange object: %w", procError)
	}
	return retHumanizedChange, nil
}

// HumanizedAuditChangeCreate creates a HumanizedAuditChange in the database, using the values passed in the humanizedAuditChange parameter
func HumanizedAuditChangeCreateCollection(np sqlutils.NamedPreparer, humanizedAuditChanges []*models.HumanizedAuditChange) ([]*models.HumanizedAuditChange, error) {
	retChanges := []*models.HumanizedAuditChange{}
	// Ticket (ChChCh Changes!) Make this a separate SQL call to try to insert all records at once instead of iterating through a collection.
	// Note, even in this structure, a transaction is possible

	for _, humanizedAuditChange := range humanizedAuditChanges {
		retChange, err := HumanizedAuditChangeCreate(np, humanizedAuditChange)
		if err != nil {
			return nil, fmt.Errorf("issue creating new HumanizedAuditChange collection. error: %w", err)
		}
		retChanges = append(retChanges, retChange)
	}

	return retChanges, nil
}

// HumanizedAuditChangeCollectionGetByModelPlanID returns all HumanizedAuditChange for a given model plan id
func HumanizedAuditChangeCollectionGetByModelPlanID(np sqlutils.NamedPreparer, modelPlanID uuid.UUID) ([]*models.HumanizedAuditChange, error) {

	arg := map[string]interface{}{"model_plan_id": modelPlanID}

	humanizedAuditCollection, procErr := sqlutils.SelectProcedure[models.HumanizedAuditChange](np, sqlqueries.HumanizedAuditChange.CollectionGetByModelPlanID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting humanized audit collection by model_plan_id (%s)  : %w", modelPlanID, procErr)
	}
	return humanizedAuditCollection, nil
}
