package sqlqueries

import _ "embed"

// translatedAuditFieldCreateSQL inserts an entry into the translatedAuditField table
//
//go:embed SQL/translated_audit_field/create.sql
var translatedAuditFieldCreateSQL string

// translatedAuditFieldCollectionGetByTranslatedAuditID returns all translated audit fields for a given translated audit id
//
//go:embed SQL/translated_audit_field/collection_get_by_translated_audit_change_id.sql
var translatedAuditFieldCollectionGetByTranslatedAuditID string

// translatedAuditFieldCollectionGetByTranslatedAuditID returns all translated audit fields for a given translated audit id
// It expects a param called :paramTableJSON which is an array of (translated_audit_id)s. Using this, the dataloader returns all fields for all these ids
//
//go:embed SQL/translated_audit_field/collection_get_by_translated_audit_change_id_loader.sql
var translatedAuditFieldCollectionGetByTranslatedAuditIDLoader string

// translatedAuditFieldScripts holds all the relevant SQL related to Translated Audit fields
type translatedAuditFieldScripts struct {
	// Holds the SQL query to create a translatedAuditField
	Create string

	// Holds the SQL query to return all translatedAuditField for a given translatedAuditChangeID
	CollectionGetByTranslatedAuditID string

	// Holds the SQL query to return all translatedAuditField for a given translatedAuditChangeID.
	// To be used by a data loader, it expects a json string as the parameter
	CollectionGetByTranslatedAuditIDLoader string
}

// TranslatedAuditChange holds all the SQL scrips related to the translatedAuditChange Entity
var TranslatedAuditField = translatedAuditFieldScripts{
	Create:                                 translatedAuditFieldCreateSQL,
	CollectionGetByTranslatedAuditID:       translatedAuditFieldCollectionGetByTranslatedAuditID,
	CollectionGetByTranslatedAuditIDLoader: translatedAuditFieldCollectionGetByTranslatedAuditIDLoader,
}
