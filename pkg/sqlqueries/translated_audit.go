package sqlqueries

import _ "embed"

// translatedAuditCreateSQL creates a new TranslatedAuditChange object
//
//go:embed SQL/translated_audit/create.sql
var translatedAuditCreateSQL string

// translatedAuditCollectionGetByModelPlanID returns all translated changed for a given model plan id. It returns in order from newest to oldest.
//
//go:embed SQL/translated_audit/collection_get_by_model_plan_ids.sql
var translatedAuditCollectionGetByModelPlanID string

// translatedAuditScripts holds all the relevant SQL related to Translated Audit changes
type translatedAuditScripts struct {
	// Holds the SQL query to create a translatedAuditChange
	Create string

	// Holds the SQL query to return all translatedAuditChanges for a given ModelPlanID. It returns in order from newest to oldest.
	CollectionGetByModelPlanID string
}

// TranslatedAudit holds all the SQL scrips related to the translatedAuditChange Entity
var TranslatedAudit = translatedAuditScripts{
	Create:                     translatedAuditCreateSQL,
	CollectionGetByModelPlanID: translatedAuditCollectionGetByModelPlanID,
}
