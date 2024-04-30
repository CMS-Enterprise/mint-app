package storage

import (
	_ "embed"
	"fmt"
	"time"

	"github.com/google/uuid"
	zap "go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

//go:embed SQL/audit_change/collection_by_id_and_table.sql
var auditChangeCollectionByIDAndTable string

//go:embed SQL/audit_change/collection_by_id_and_table_and_field.sql
var auditChangeCollectionByIDAndTableAndField string

//go:embed SQL/audit_change/collection_by_primary_key_or_foreign_keyand_date.sql
var auditChangeCollectionByPrimaryKeyOrForeignKeyAndDate string

// AuditChangeCollectionByIDAndTable returns changes based on tablename and primary key from the database
func (s *Store) AuditChangeCollectionByIDAndTable(
	_ *zap.Logger,
	tableName string,
	primaryKey uuid.UUID,
) ([]*models.AuditChange, error) {

	var auditChanges []*models.AuditChange

	stmt, err := s.db.PrepareNamed(auditChangeCollectionByIDAndTable)
	if err != nil {
		return nil, err

	}
	defer stmt.Close()

	//Add support for secondary key perhaps
	arg := map[string]interface{}{"primary_key": primaryKey,
		"table_name": tableName,
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil
}

// AuditChangeCollectionByIDAndTableAndField returns changes based on tablename
// and primary key from the database. It will only return record sets where the
// given field was modified. It will return all changed fields anywyas
func (s *Store) AuditChangeCollectionByIDAndTableAndField(
	_ *zap.Logger,
	tableName string,
	primaryKey uuid.UUID,
	fieldName string,
	sortDir models.SortDirection,
) ([]*models.AuditChange, error) {

	var auditChanges []*models.AuditChange
	orderedQuery := auditChangeCollectionByIDAndTableAndField
	orderClause := "" //default to ASCENDING
	if sortDir == models.SortDesc {
		orderClause = " ORDER BY 1 DESC"
	}

	orderedQuery = orderedQuery + orderClause

	stmt, err := s.db.PrepareNamed(orderedQuery)
	if err != nil {
		return nil, err

	}
	defer stmt.Close()

	arg := map[string]interface{}{"primary_key": primaryKey,
		"table_name": tableName,
		"field_name": fieldName,
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil
}

// AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate returns changes based on foreign key and date from the database.
func (s *Store) AuditChangeCollectionByPrimaryKeyOrForeignKeyAndDate(
	_ *zap.Logger,
	primaryKey uuid.UUID,
	foreignKey uuid.UUID,
	dayToAnalyze time.Time,
	sortDir models.SortDirection,
) ([]*models.AuditChange, error) {

	var auditChanges []*models.AuditChange
	orderedQuery := auditChangeCollectionByPrimaryKeyOrForeignKeyAndDate
	orderClause := "" //default to ASCENDING
	if sortDir == models.SortDesc {
		orderClause = " ORDER BY 1 DESC"
	}

	orderedQuery = orderedQuery + orderClause

	stmt, err := s.db.PrepareNamed(orderedQuery)
	if err != nil {
		return nil, err

	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"primary_key": primaryKey,
		"foreign_key": foreignKey,
		"start_date":  dayToAnalyze.Format("2006-01-02"),
		"end_date":    dayToAnalyze.AddDate(0, 0, 1).Format("2006-01-02"),
	}

	err = stmt.Select(&auditChanges, arg)
	if err != nil {
		return nil, err

	}

	return auditChanges, nil
}

// AuditChangeCollectionGetByModelPlanIDandTimeRange gets all audit_changes associated with a Model Plan for a specific date range
// It joins on the foreign key field to trace every relevant change back to it's parent model_plan_id.
// It currently knows how to handle model_plan_id, discussion_id, operational_need_id, and solution_id.
// If another level of relationships is added that point back to model_plan_id, this should be updated.
func AuditChangeCollectionGetByModelPlanIDandTimeRange(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	timeStart time.Time,
	timeEnd time.Time,
) ([]*models.AuditChange, error) {

	arg := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"time_start":    timeStart,
		"time_end":      timeEnd,
	}

	auditCollection, procErr := sqlutils.SelectProcedure[models.AuditChange](np, sqlqueries.AuditChange.CollectionGetByModelPlanIDAndDateRange, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting audit collection by model_plan_id (%s) for  date range (%s -- %s)  : %w", modelPlanID, timeStart, timeEnd, procErr)
	}
	return auditCollection, nil

}

func AuditChangeWithModelPlanGetByID(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	auditID int,
) (*models.AuditChangeWithModelPlanID, error) {

	arg := map[string]interface{}{
		"audit_id": auditID,
	}

	auditChangeWithModelPlan, procErr := sqlutils.GetProcedure[models.AuditChangeWithModelPlanID](np, sqlqueries.AuditChange.GetByAuditIDWithModelPlanID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting audit change by audit_id (%v): %w", auditID, procErr)
	}
	return auditChangeWithModelPlan, nil

}

// AuditChangeGetNotProcessed returns all audit changes that have yet to be processed in the processing queue
func AuditChangeGetNotProcessed(
	np sqlutils.NamedPreparer,
	_ zap.Logger,
) ([]*models.AuditChangeWithModelPlanID, error) {
	auditChangeWithModelPlan, procErr := sqlutils.SelectProcedure[models.AuditChangeWithModelPlanID](np, sqlqueries.AuditChange.GetNotTranslated, nil)
	if procErr != nil {
		return nil, fmt.Errorf("issue getting unprocessed audit changes err: %w", procErr)
	}
	return auditChangeWithModelPlan, nil
}
