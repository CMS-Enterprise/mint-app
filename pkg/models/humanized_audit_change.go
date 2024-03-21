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
	ModelName string    `json:"modelName" db:"model_name"`
	TableName string    `json:"tableName" db:"table_name"`
	Date      time.Time `json:"date" db:"date"`
	TimeStart time.Time `json:"timeStart" db:"time_start"`
	TimeEnd   time.Time `json:"timeEnd" db:"time_end"`
	ActorID   uuid.UUID `json:"actorID" db:"actor_id"`
	ChangeID  uuid.UUID `json:"changeID" db:"change_id"`

	// Changes     AnalyzedAuditChange `json:"changes"`
	MetaDataRaw interface{} `db:"changes"`
	// this is conditional data that is returned. It deserializes to data specific the activity type
	MetaData HumanizedAuditMetaData `json:"metaData"`
}

// NewHumanizedAuditChange
func NewHumanizedAuditChange(createdBy uuid.UUID, actorID uuid.UUID, modelPlanID uuid.UUID, date time.Time, tableName string) HumanizedAuditChange {
	version := 0
	genericMeta := NewHumanizedAuditMetaBaseStruct(tableName, version)
	return HumanizedAuditChange{
		Date:              date,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(createdBy),
		ActorID:           actorID,
		MetaData:          &genericMeta,
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
