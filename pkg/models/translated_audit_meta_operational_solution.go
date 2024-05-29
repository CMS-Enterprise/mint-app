package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// TranslatedAuditMetaOperationalSolution represents the data about an operational need to render an operational need human readable.
type TranslatedAuditMetaOperationalSolution struct {
	TranslatedAuditMetaBaseStruct
	NeedName         string `json:"needName"`
	NeedIsOther      bool   `json:"needIsOther"`
	SolutionName     string `json:"solutionName"`
	NumberOfSubtasks int    `json:"numberOfSubtasks"`
	SolutionIsOther  bool   `json:"isOther"`
	// Changes: (Meta) do we need the otherHeader in the meta data as well?
}

// NewTranslatedAuditMetaOperationalSolution creates a New TranslatedAuditMetaOperationalSolution
func NewTranslatedAuditMetaOperationalSolution(tableName string, version int, solutionName string, solIsOther bool, numSubtasks int, needName string, needIsOther bool) TranslatedAuditMetaOperationalSolution {

	return TranslatedAuditMetaOperationalSolution{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(tableName, version),
		SolutionName:                  solutionName,
		SolutionIsOther:               solIsOther,
		NumberOfSubtasks:              numSubtasks,
		NeedName:                      needName,
		NeedIsOther:                   needIsOther,
	}
}

// isActivityMetaData implements the IActivityMetaGeneric
func (hmb TranslatedAuditMetaOperationalSolution) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditMetaOperationalSolution) Value() (driver.Value, error) {
	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditMetaOperationalSolution) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, hmb)
	if err != nil {
		return err
	}

	return nil
}
