package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
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

// TranslatedAuditCollectionGetByModelPlanID returns all translatedAudits for a given model plan id
// tablesToInclude: the tables to include in the query. This is a list of models.TableName. If nil or empty, include all
// hasRestrictedAccess: whether or not to show restricted records
// limit: this controls how many records will be returned at once. A null entry will return all records
// offset: how many records to skip before returning results. If null, no records will be skipped.
func TranslatedAuditCollectionGetByModelPlanID(np sqlutils.NamedPreparer, modelPlanID uuid.UUID, tablesToInclude []models.TableName, hasRestrictedAccess bool, limit *int, offset *int) ([]*models.TranslatedAudit, error) {

	// Note, if limit or offset are nill, they are disregarded
	arg := map[string]interface{}{
		"model_plan_id":     modelPlanID,
		"table_names":       pq.Array(tablesToInclude),
		"restricted_access": hasRestrictedAccess,
		"limit_count":       limit,
		"offset_count":      offset,
	}

	translatedAuditCollection, procErr := sqlutils.SelectProcedure[models.TranslatedAudit](np, sqlqueries.TranslatedAudit.CollectionGetByModelPlanID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting translated audit collection by model_plan_id (%s)  : %w", modelPlanID, procErr)
	}
	return translatedAuditCollection, nil
}
