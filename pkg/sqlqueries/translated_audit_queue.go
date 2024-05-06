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

// translatedAuditEntriesToQueueSQL returns all queue entries that are ready to be queued id
//
//go:embed SQL/translated_audit_queue/get_entries_to_queue.sql
var translatedAuditEntriesToQueueSQL string

// translatedAuditQueueGetByIDSQL gets entries from the db that are already queued
//
//go:embed SQL/translated_audit_queue/get_queued_entries.sql
var translatedAuditQueueGetQueuedEntriesSQL string

// dangerousTranslatedAuditQueueQueueAllEntriesSQL sets all entries set as new to queued. Should only be used locally
//
//go:embed SQL/translated_audit_queue/dangerous_queue_all_available.sql
var dangerousTranslatedAuditQueueQueueAllEntriesSQL string

// translatedAuditQueueScripts holds all the relevant SQL related to Translated Audit changes
type translatedAuditQueueScripts struct {
	// Holds the SQL query to create a translatedAuditQueue
	Create string

	// Holds the SQL to update a translatedAuditQueue object
	Update string

	// Holds the SQL query to return a translatedAuditQueue  object by it's ID
	GetByID string

	// Holds the SQL query to return entries from the db that are already queued
	GetQueuedEntries string

	// Holds the SQL query to return entries from the db that are ready to be queued
	GetEntriesToQueue string

	// Holds the SQL query to queue all available entries and return the updated entries
	DANGEROUSQueueAllEntries string
}

// TranslatedAuditQueue holds all the SQL scrips related to the translatedAuditQueue Entity
var TranslatedAuditQueue = translatedAuditQueueScripts{
	Create:                   translatedAuditQueueCreateSQL,
	Update:                   translatedAuditQueueUpdateSQL,
	GetByID:                  translatedAuditQueueGetByIDSQL,
	GetQueuedEntries:         translatedAuditQueueGetQueuedEntriesSQL,
	GetEntriesToQueue:        translatedAuditEntriesToQueueSQL,
	DANGEROUSQueueAllEntries: dangerousTranslatedAuditQueueQueueAllEntriesSQL,
}
