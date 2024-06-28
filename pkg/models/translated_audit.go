package models

import (
	"time"

	"github.com/google/uuid"
)

// DatabaseOperation The possible types of operations that can cause an audit entry.
// Currently they are represented in the audit.change table as the first letter of the action EG I, D, U, T
type DatabaseOperation string

// these are all the possible values of a Database Operation
const (
	DBOpInsert   DatabaseOperation = "INSERT"
	DBOpUpdate   DatabaseOperation = "UPDATE"
	DBOpDelete   DatabaseOperation = "DELETE"
	DBOpTruncate DatabaseOperation = "TRUNCATE"
)

// TranslatedAuditMetaDataType represents the possible types of TranslatedAuditMetaData. This data is used to deserialize the meta data in the JSONb field in the database
type TranslatedAuditMetaDataType string

// these are all the possible values of a TranslatedAuditMetaDataType
const (
	TAMetaGeneric                    TranslatedAuditMetaDataType = "GENERIC"
	TAMetaBase                       TranslatedAuditMetaDataType = "BASE"
	TAMetaDiscussionReply            TranslatedAuditMetaDataType = "DISCUSSION_REPLY"
	TAMetaOperationalNeed            TranslatedAuditMetaDataType = "OPERATIONAL_NEED"
	TAMetaOperationalSolution        TranslatedAuditMetaDataType = "OPERATIONAL_SOLUTION"
	TAMetaOperationalSolutionSubtask TranslatedAuditMetaDataType = "OPERATIONAL_SOLUTION_SUBTASK"
	TAMetaDocumentSolutionLink       TranslatedAuditMetaDataType = "DOCUMENT_SOLUTION_LINK"
)

// TranslatedAuditWithTranslatedFields is a struct that is used to group a translated audit change with the representative fields. It is meant to be used as a convenience grouping
type TranslatedAuditWithTranslatedFields struct {
	TranslatedAudit
	TranslatedFields []*TranslatedAuditField
}

// TranslatedAudit is a structure that shows grouped, humanReadable Audit data
type TranslatedAudit struct {
	baseStruct
	modelPlanRelation
	TableID int `json:"tableID" db:"table_id"`
	// TableName is the data fetched from the audit.table_config table. It is not stored when the data is stored to the database.
	TableName  TableName         `json:"tableName" db:"table_name"`
	PrimaryKey uuid.UUID         `json:"primaryKey" db:"primary_key"`
	Date       time.Time         `json:"date" db:"date"`
	Action     DatabaseOperation `json:"action" db:"action"`
	// Restricted denotes if this audit should only be visible to users with specific permissions. Currently, that means they are a collaborator or an assessment user
	Restricted bool `json:"restricted" db:"restricted"`

	ActorID uuid.UUID `json:"actorID" db:"actor_id"`
	// ActorName is fetched from the user_account table. It is not stored when the data is stored to the database.
	ActorName string `json:"actorName" db:"actor_name"`
	ChangeID  int    `json:"changeID" db:"change_id"`

	MetaDataRaw  interface{}                  `db:"meta_data"`
	MetaDataType *TranslatedAuditMetaDataType `db:"meta_data_type"`
	MetaData     TranslatedAuditMetaData      `json:"metaData"`
}

/* Future Enhancement: Note some of theses fields duplicate data that is from the audit.changes table. If desired some of these fields could be removed from this table, and be returned from the changes table
Fields include
  * actorID
  * date
  * action
  * primary key
*/

// NewTranslatedAuditChange
func NewTranslatedAuditChange(
	createdBy uuid.UUID,
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	date time.Time,
	tableID int,
	changeID int,
	primaryKey uuid.UUID,
	action DatabaseOperation,
) TranslatedAudit {
	return TranslatedAudit{
		baseStruct:        NewBaseStruct(createdBy),
		ActorID:           actorID,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Date:              date,
		TableID:           tableID,
		ChangeID:          changeID,
		PrimaryKey:        primaryKey,
		Action:            action,
	}

}

// ParseMetaData parses raw MetaData into Typed meta data per the provided struct
func (tac *TranslatedAudit) ParseMetaData() error {

	meta, err := parseRawTranslatedAuditMetaData(tac.MetaDataType, tac.MetaDataRaw)
	if err != nil {
		return err
	}

	tac.MetaData = meta
	return nil
}
