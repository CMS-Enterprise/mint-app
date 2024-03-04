package sqlqueries

import _ "embed"

//go:embed SQL/analyzed_audit/collection_get_by_model_plan_ids_and_date_loader.sql
var analyzedAuditCollectionGetByModelPlanIDsAndDateLoader string

type analyzedAuditScripts struct {

	// Holds the SQL query to return all Analyzed Audits for given model_plan_ids and date
	CollectionGetByModelPlanIDsAndDateLoader string
}

// AnalyzedAudit houses all the sql for getting data for analyzed audit from the database
var AnalyzedAudit = analyzedAuditScripts{
	CollectionGetByModelPlanIDsAndDateLoader: analyzedAuditCollectionGetByModelPlanIDsAndDateLoader,
}
