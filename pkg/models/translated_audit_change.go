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

/* TODO: EASI-(ChChCh Changes!) Work on a job to process data and make type safe audit results
1. See about making a method that will
   a. get all changes from a time period
   b. debounce the changes
   c. create a typed record


*/

// TranslatedAuditChange is a structure that shows grouped, humanReadable Audit data
type TranslatedAuditChange struct {
	// Ticket: (ChChCh Changes!) Think about what should be in the row....
	//Perhaps we want this to be a time frame, and have an array of specific changes instead of just meta data?

	baseStruct
	modelPlanRelation
	ModelName           string            `json:"modelName" db:"model_name"`
	TableID             int               `json:"tableID" db:"table_id"`
	TableName           string            `json:"tableName" db:"table_name"`
	PrimaryKey          uuid.UUID         `json:"primaryKey" db:"primary_key"`
	Date                time.Time         `json:"date" db:"date"`
	Action              DatabaseOperation `json:"action" db:"action"`
	FieldName           string            `json:"fieldName" db:"field_name"`
	FieldNameTranslated string            `json:"fieldNameTranslated" db:"field_name_translated"`

	// Ticket: (ChChCh Changes!) We might consider changing the type from interface to string? But it could be an array. This gives us options
	Old           interface{} `json:"old" db:"old"`
	OldTranslated interface{} `json:"oldTranslated" db:"old_translated"`
	New           interface{} `json:"new" db:"new"`
	NewTranslated interface{} `json:"newTranslated" db:"new_translated"`

	ActorID   uuid.UUID `json:"actorID" db:"actor_id"`
	ActorName string    `json:"actorName" db:"actor_name"` //Maybe normalize this?
	ChangeID  int       `json:"changeID" db:"change_id"`

	MetaDataRaw interface{}             `db:"meta_data"`
	MetaData    TranslatedAuditMetaData `json:"metaData"`
}

// NewHumanizedAuditChange
func NewHumanizedAuditChange(
	createdBy uuid.UUID,
	actorID uuid.UUID,
	actorName string,
	modelPlanID uuid.UUID,
	modelName string,
	date time.Time,
	tableName string,
	tableID int,
	changeID int,
	primaryKey uuid.UUID,
	action DatabaseOperation,
	fieldName string,
	fieldNameTranslated string,
	old interface{},
	oldTranslated interface{},
	new interface{},
	newTranslated interface{},
) TranslatedAuditChange {
	version := 0
	genericMeta := NewTranslatedAuditMetaBaseStruct(tableName, version)
	return TranslatedAuditChange{
		baseStruct:          NewBaseStruct(createdBy),
		ActorID:             actorID,
		ActorName:           actorName,
		modelPlanRelation:   NewModelPlanRelation(modelPlanID),
		ModelName:           modelName,
		Date:                date,
		TableName:           tableName,
		TableID:             tableID,
		ChangeID:            changeID,
		PrimaryKey:          primaryKey,
		Action:              action,
		FieldName:           fieldName,
		FieldNameTranslated: fieldNameTranslated,
		Old:                 old,
		OldTranslated:       oldTranslated,
		New:                 new,
		NewTranslated:       newTranslated,

		MetaData: &genericMeta,
	}

}

// ParseMetaData parses raw MetaData into Typed meta data per the provided struct
func (hmc *TranslatedAuditChange) ParseMetaData() error {

	meta, err := parseRawTranslatedAuditMetaData(hmc.TableName, hmc.MetaDataRaw)
	if err != nil {
		return err
	}

	hmc.MetaData = meta
	return nil
}
