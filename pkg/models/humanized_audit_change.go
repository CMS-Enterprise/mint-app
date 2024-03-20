package models

import (
	"database/sql/driver"
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
	ModelName   string              `json:"modelName" db:"model_name"`
	Date        time.Time           `json:"date" db:"date"`
	Changes     AnalyzedAuditChange `json:"changes"`
	MetaDataRaw interface{}         `db:"changes"`

	// this is conditional data that is returned. It deserializes to data specific the activity type
	MetaData HumanizedAuditMetaData `json:"metaData"`
}

// NewHumanizedAuditChange
func NewHumanizedAuditChange(createdBy uuid.UUID, modelPlanID uuid.UUID, date time.Time) HumanizedAuditChange {
	return HumanizedAuditChange{
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		baseStruct:        NewBaseStruct(createdBy),
	}

}

// HumanizedAuditMetaData is an interface that all Humanized meta data structs must implement
type HumanizedAuditMetaData interface {
	isAuditMetaData()
	Value() (driver.Value, error)
	Scan(src interface{}) error
}

//Ticket: (ChChCh Changes!) Try to see about what data should be in here? should we have each entry have it's separate data?
// We could have data for Multiple Tables, and for Multiple fields. We need to be able to handle them all....

//Ticket: (ChChCh Changes!) Should we store these as single entries in the database? Or should we store them grouped in the database?
