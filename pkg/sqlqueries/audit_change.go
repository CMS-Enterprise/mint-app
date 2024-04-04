package sqlqueries

import _ "embed"

// auditChangeCollectionGetByModelPlanIDAndDateRange uses a model plan ID to join on any change that
//
//go:embed SQL/audit_change/collection_by_model_plan_id_and_date_range.sql
var auditChangeCollectionGetByModelPlanIDAndDateRange string

type auditChangeScripts struct {

	// Holds the SQL query to return all raw audit changes for given model_plan_id and date range, including all child relations
	CollectionGetByModelPlanIDAndDateRange string
}

// AuditChange houses all the sql for getting data for analyzed audit from the database
var AuditChange = auditChangeScripts{
	// Holds the SQL to get all changes associated with a model plan
	CollectionGetByModelPlanIDAndDateRange: auditChangeCollectionGetByModelPlanIDAndDateRange,
}
