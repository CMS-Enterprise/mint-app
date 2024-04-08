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

// TranslatedAuditChangeWithTranslatedFields is a struct that is used to group a translated audit change with the representative fields. It is meant to be used as a convenience grouping
type TranslatedAuditChangeWithTranslatedFields struct {
	TranslatedAuditChange
	TranslatedFields []*TranslatedAuditField
}

// TranslatedAuditChange is a structure that shows grouped, humanReadable Audit data
type TranslatedAuditChange struct {
	baseStruct
	modelPlanRelation
	ModelName  string            `json:"modelName" db:"model_name"`
	TableID    int               `json:"tableID" db:"table_id"`
	TableName  string            `json:"tableName" db:"table_name"`
	PrimaryKey uuid.UUID         `json:"primaryKey" db:"primary_key"`
	Date       time.Time         `json:"date" db:"date"`
	Action     DatabaseOperation `json:"action" db:"action"`

	ActorID   uuid.UUID `json:"actorID" db:"actor_id"`
	ActorName string    `json:"actorName" db:"actor_name"` //Maybe normalize this?
	ChangeID  int       `json:"changeID" db:"change_id"`

	MetaDataRaw interface{}             `db:"meta_data"`
	MetaData    TranslatedAuditMetaData `json:"metaData"`
}

// NewTranslatedAuditChange
func NewTranslatedAuditChange(
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
) TranslatedAuditChange {
	version := 0
	genericMeta := NewTranslatedAuditMetaBaseStruct(tableName, version)
	return TranslatedAuditChange{
		baseStruct:        NewBaseStruct(createdBy),
		ActorID:           actorID,
		ActorName:         actorName,
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		ModelName:         modelName,
		Date:              date,
		TableName:         tableName,
		TableID:           tableID,
		ChangeID:          changeID,
		PrimaryKey:        primaryKey,
		Action:            action,

		MetaData: &genericMeta,
	}

}

// ParseMetaData parses raw MetaData into Typed meta data per the provided struct
func (tac *TranslatedAuditChange) ParseMetaData() error {

	meta, err := parseRawTranslatedAuditMetaData(tac.TableName, tac.MetaDataRaw)
	if err != nil {
		return err
	}

	tac.MetaData = meta
	return nil
}
