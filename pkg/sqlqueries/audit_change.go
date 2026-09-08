package sqlqueries

import _ "embed"

// auditChangeCollectionGetByModelPlanIDAndDateRange uses a model plan ID to join on any change that
//
//go:embed SQL/audit_change/collection_by_model_plan_id_and_date_range.sql
var auditChangeCollectionGetByModelPlanIDAndDateRange string

// auditChangeGetByAuditIDWithModelPlanID returns an audit_change along with the representative id. It expects an audit ID to return the data
//
//go:embed SQL/audit_change/get_by_audit_id_with_model_plan_id.sql
var auditChangeGetByAuditIDWithModelPlanID string

// auditChangeGetNotTranslated returns all audit_changes that don't have an entry in the translated or the queue table.
//
//go:embed SQL/audit_change/get_not_translated.sql
var auditChangeGetNotTranslated string

// auditChangeCollectionByIDAndTable returns audit changes by ID and Table
//
//go:embed SQL/audit_change/collection_by_id_and_table.sql
var auditChangeCollectionByIDAndTable string

// auditChangeCollectionByIDAndTableAndField returns audit changes by ID and Table and Field
//
//go:embed SQL/audit_change/collection_by_id_and_table_and_field.sql
var auditChangeCollectionByIDAndTableAndField string

// auditChangeCollectionByPrimaryKeyOrForeignKeyAndDate returns audit changes by (PK or FK) and Date
//
//go:embed SQL/audit_change/collection_by_primary_key_or_foreign_keyand_date.sql
var auditChangeCollectionByPrimaryKeyOrForeignKeyAndDate string

type auditChangeScripts struct {

	// Holds the SQL query to return all raw audit changes for given model_plan_id and date range, including all child relations
	CollectionGetByModelPlanIDAndDateRange string
	// Holds the SQL to get a single change, also returning the model plan ID it is associated with
	GetByAuditIDWithModelPlanID string
	// Holds the SQL to return all audit changes that aren't queued or already translated
	GetNotTranslated string
	// CollectionByIDAndTable holds SQL to return audit changes by ID and Table
	CollectionByIDAndTable string
	// CollectionByIDAndTableAndField holds SQL to return audit changes by ID and Table and Field
	CollectionByIDAndTableAndField string
	// CollectionByPrimaryKeyOrForeignKeyAndDate holds SQL to return audit changes by (PK or FK) and Date
	CollectionByPrimaryKeyOrForeignKeyAndDate string
}

// AuditChange houses all the sql for getting data for analyzed audit from the database
var AuditChange = auditChangeScripts{
	CollectionGetByModelPlanIDAndDateRange:    auditChangeCollectionGetByModelPlanIDAndDateRange,
	GetByAuditIDWithModelPlanID:               auditChangeGetByAuditIDWithModelPlanID,
	GetNotTranslated:                          auditChangeGetNotTranslated,
	CollectionByIDAndTable:                    auditChangeCollectionByIDAndTable,
	CollectionByIDAndTableAndField:            auditChangeCollectionByIDAndTableAndField,
	CollectionByPrimaryKeyOrForeignKeyAndDate: auditChangeCollectionByPrimaryKeyOrForeignKeyAndDate,
}
