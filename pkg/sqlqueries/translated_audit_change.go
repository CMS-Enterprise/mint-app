package sqlqueries

import _ "embed"

// translatedAuditChangeCreateSQL creates a new TranslatedAuditChange object
//
//go:embed SQL/translated_audit_change/create.sql
var translatedAuditChangeCreateSQL string

// translatedAuditChangeCollectionGetByModelPlanID returns all translated changed for a given model plan id
//
//go:embed SQL/translated_audit_change/collection_get_by_model_plan_ids.sql
var translatedAuditChangeCollectionGetByModelPlanID string

// translatedAuditChangeScripts holds all the relevant SQL related to Translated Audit changes
type translatedAuditChangeScripts struct {
	// Holds the SQL query to create a translatedAuditChange
	Create string

	// Holds the SQL query to return all translatedAuditChanges for a given ModelPlanID
	CollectionGetByModelPlanID string
}

// TranslatedAuditChange holds all the SQL scrips related to the translatedAuditChange Entity
var TranslatedAuditChange = translatedAuditChangeScripts{
	Create:                     translatedAuditChangeCreateSQL,
	CollectionGetByModelPlanID: translatedAuditChangeCollectionGetByModelPlanID,
}
