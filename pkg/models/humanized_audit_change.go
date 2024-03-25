package models

import (
	"time"

	"github.com/google/uuid"
)

/* TODO: EASI-(ChChCh Changes!) Work on a job to process data and make type safe audit results
1. See about making a method that will
   a. get all changes from a time period
   b. debounce the changes
   c. create a typed record


*/

// HumanizedAuditChange is a structure that shows grouped, humanReadable Audit data
type HumanizedAuditChange struct {
	// Ticket: (ChChCh Changes!) Think about what should be in the row....
	//Perhaps we want this to be a time frame, and have an array of specific changes instead of just meta data?

	baseStruct
	modelPlanRelation
	ModelName           string    `json:"modelName" db:"model_name"`
	TableID             int       `json:"tableID" db:"table_id"`
	TableName           string    `json:"tableName" db:"table_name"` // Ticket: (ChChCh Changes!) should we expand this to include the table id? Audit_change has this in the
	PrimaryKey          uuid.UUID `json:"primaryKey" db:"primary_key"`
	Date                time.Time `json:"date" db:"date"`
	Action              string    `json:"action" db:"action"`
	FieldName           string    `json:"fieldName" db:"field_name"`
	FieldNameTranslated string    `json:"fieldNameTranslated" db:"field_name_translated"`

	// Ticket: (ChChCh Changes!) We might consider changing the type from interface to string? But it could be an array. This gives us options
	Old           interface{} `json:"old" db:"old"`
	OldTranslated interface{} `json:"oldTranslated" db:"old_translated"`
	New           interface{} `json:"new" db:"new"`
	NewTranslated interface{} `json:"newTranslated" db:"new_translated"`

	ActorID   uuid.UUID `json:"actorID" db:"actor_id"`
	ActorName string    `json:"actorName" db:"actor_name"` //Maybe normalize this?
	ChangeID  int       `json:"changeID" db:"change_id"`

	// Changes     AnalyzedAuditChange `json:"changes"`
	MetaDataRaw interface{} `db:"meta_data"`
	// this is conditional data that is returned. It deserializes to data specific the activity type
	MetaData HumanizedAuditMetaData `json:"metaData"`
}

// NewHumanizedAuditChange
func NewHumanizedAuditChange(
	createdBy uuid.UUID,
	actorID uuid.UUID,
	modelPlanID uuid.UUID,
	modelName string,
	date time.Time,
	tableName string,
	tableID int,
	changeID int,
	action string,
	fieldName string,
	fieldNameTranslated string,
	old interface{},
	oldTranslated interface{},
	new interface{},
	newTranslated interface{},
) HumanizedAuditChange {
	version := 0
	genericMeta := NewHumanizedAuditMetaBaseStruct(tableName, version)
	return HumanizedAuditChange{
		baseStruct:          NewBaseStruct(createdBy),
		ActorID:             actorID,
		ActorName:           actorID.String(), //TODO (ChChCh Changes!) Get the name or don't here...
		modelPlanRelation:   NewModelPlanRelation(modelPlanID),
		ModelName:           modelName,
		Date:                date,
		TableName:           tableName,
		TableID:             tableID,
		ChangeID:            changeID,
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
func (hmc *HumanizedAuditChange) ParseMetaData() error {

	// Ticket: (ChChCh Changes!) What to do about the error here?

	meta, err := parseRawHumanizedAuditMetaData(hmc.TableName, hmc.MetaDataRaw)
	if err != nil {
		return err
	}

	hmc.MetaData = meta
	// Ticket: (ChChCh Changes!) Does the receiver need to be a pointer for this to work?
	return nil
}
