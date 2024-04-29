package sqlqueries

import _ "embed"

// translatedAuditQueueCreateSQL creates a new TranslatedAuditQueueChange object
//
//go:embed SQL/translated_audit_queue/create.sql
var translatedAuditQueueCreateSQL string

// translatedAuditQueueUpdateSQL updates a new TranslatedAuditQueueChange object
//
//go:embed SQL/translated_audit_queue/update.sql
var translatedAuditQueueUpdateSQL string

// translatedAuditQueueGetByIDSQL returns a queue entry by id
//
//go:embed SQL/translated_audit_queue/get_by_id.sql
var translatedAuditQueueGetByIDSQL string

// translatedAuditQueueGetByIDSQL gets potential new entries from the db
// It specifically checks for audits that don't have a translation or a queue entry
//
//go:embed SQL/translated_audit_queue/get_new_entries.sql
var translatedAuditQueueGetNewEntriesSQL string

// translatedAuditQueueScripts holds all the relevant SQL related to Translated Audit changes
type translatedAuditQueueScripts struct {
	// Holds the SQL query to create a translatedAuditQueue
	Create string

	// Holds the SQL to update a translatedAuditQueue object
	Update string

	// Holds the SQL query to return a translatedAuditQueue  object by it's ID
	GetByID string

	// Holds the SQL query to return potential translatedAuditQueue objects (Ones that aren't written)
	GetNewEntries string
}

// TranslatedAuditQueue holds all the SQL scrips related to the translatedAuditQueue Entity
var TranslatedAuditQueue = translatedAuditQueueScripts{
	Create:        translatedAuditQueueCreateSQL,
	Update:        translatedAuditQueueUpdateSQL,
	GetByID:       translatedAuditQueueGetByIDSQL,
	GetNewEntries: translatedAuditQueueGetNewEntriesSQL,
}
