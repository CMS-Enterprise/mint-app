package sqlqueries

import _ "embed"

// humanizedAuditChangeCreateSQL creates a new HumanizedAuditChange object
//
//go:embed SQL/humanized_audit_change/create.sql
var humanizedAuditChangeCreateSQL string

// humanizedAuditChangeCollectionGetByModelPlanID returns all humanized changed for a given model plan id
//
//go:embed SQL/humanized_audit_change/collection_get_by_model_plan_ids.sql
var humanizedAuditChangeCollectionGetByModelPlanID string

// humanizedAuditChangeScripts holds all the relevant SQL related to Humanized Audit changes
type humanizedAuditChangeScripts struct {
	// Holds the SQL query to create a HumanizedAuditChange
	Create string

	// Holds the SQL query to return all HumanizedAuditChanges for a given ModelPlanID
	CollectionGetByModelPlanID string
}

// HumanizedAuditChange holds all the SQL scrips related to the HumanizedAuditChange Entity
var HumanizedAuditChange = humanizedAuditChangeScripts{
	Create:                     humanizedAuditChangeCreateSQL,
	CollectionGetByModelPlanID: humanizedAuditChangeCollectionGetByModelPlanID,
}
