package sqlqueries

import _ "embed"

// translatedAuditCreateSQL creates a new TranslatedAuditChange object
//
//go:embed SQL/translated_audit/create.sql
var translatedAuditCreateSQL string

// translatedAuditCollectionGetByModelPlanID returns all translated changed for a given model plan id. It returns in order from newest to oldest.
// It uses the restricted_access param to specify if the user should see confidential docs or not
//
//go:embed SQL/translated_audit/collection_get_by_model_plan_ids.sql
var translatedAuditCollectionGetByModelPlanID string

// translatedAuditMostRecentGetByModelPlanIDAndTableNamesLoader returns the most recent translatedAuditChange for a given ModelPlanID and table names
//
//go:embed SQL/translated_audit/most_recent_get_by_model_plan_id_and_table_names_loader.sql
var translatedAuditMostRecentGetByModelPlanIDAndTableNamesLoader string

// translatedAuditScripts holds all the relevant SQL related to Translated Audit changes
type translatedAuditScripts struct {
	// Holds the SQL query to create a translatedAuditChange
	Create string

	// Holds the SQL query to return all translatedAuditChanges for a given ModelPlanID. It returns in order from newest to oldest.
	CollectionGetByModelPlanID string

	// Holds the SQL query to return the most recent translatedAuditChange for a given ModelPlanID and table names
	MostRecentByModelPlanIDAndTableFiltersLOADER string
}

// TranslatedAudit holds all the SQL scrips related to the translatedAuditChange Entity
var TranslatedAudit = translatedAuditScripts{
	Create:                     translatedAuditCreateSQL,
	CollectionGetByModelPlanID: translatedAuditCollectionGetByModelPlanID,
	MostRecentByModelPlanIDAndTableFiltersLOADER: translatedAuditMostRecentGetByModelPlanIDAndTableNamesLoader,
}
