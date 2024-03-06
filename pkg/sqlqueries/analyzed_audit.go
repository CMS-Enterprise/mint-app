package sqlqueries

import _ "embed"

// analyzedAuditCollectionGetByModelPlanIDsAndDateLoader deserializes a JSON array for a dataloader to return a collection of analyzed audits for a given date and model plan ids
// It expects each row to have 1. date, 2. an array of model plan IDS
//
//go:embed SQL/analyzed_audit/collection_get_by_model_plan_ids_and_date_loader.sql
var analyzedAuditCollectionGetByModelPlanIDsAndDateLoader string

// analyzedAuditCreate inserts a record into the Analyzed Audit Table
//
//go:embed SQL/analyzed_audit/create.sql
var analyzedAuditCreate string

// analyzedAuditGetByModelPlanIDAndDate returns an analyzed audit for a model plan on a specific date
//
//go:embed SQL/analyzed_audit/get_by_model_plan_id_and_date.sql
var analyzedAuditGetByModelPlanIDAndDate string

// analyzedAuditGetByModelPlanIDsAndDate return a collection of analyzed audits for a given date and model plan ids
//
//go:embed SQL/analyzed_audit/get_collection_by_model_plan_ids_and_date.sql
var analyzedAuditGetByModelPlanIDsAndDate string

// analyzedAuditGetByDate returns all analyzed audits for a given date.
// It orders the result by model name
//
//go:embed SQL/analyzed_audit/get_by_date.sql
var analyzedAuditGetByDate string

type analyzedAuditScripts struct {

	// Holds the SQL to insert a new record in the analyzed audit table
	Create string

	// Holds the SQL query to return all Analyzed Audits for given model_plan_ids and date
	CollectionGetByModelPlanIDsAndDateLoader string

	// Holds the SQL query to return all Analyzed Audits for given model_plan_ids and date
	CollectionGetByModelPlanIDsAndDate string

	// Holds the SQL to return all Analyzed Audits for a specified date
	GetByDate string

	//  Holds the SQL to return an Analyzed Audit for a specific Model and Date
	GetByModelPlanIDAndDate string
}

// AnalyzedAudit houses all the sql for getting data for analyzed audit from the database
var AnalyzedAudit = analyzedAuditScripts{
	Create:                                   analyzedAuditCreate,
	CollectionGetByModelPlanIDsAndDateLoader: analyzedAuditCollectionGetByModelPlanIDsAndDateLoader,
	CollectionGetByModelPlanIDsAndDate:       analyzedAuditGetByModelPlanIDsAndDate,
	GetByDate:                                analyzedAuditGetByDate,
	GetByModelPlanIDAndDate:                  analyzedAuditGetByModelPlanIDAndDate,
}
