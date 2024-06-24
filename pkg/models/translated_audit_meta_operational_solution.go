package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

// TranslatedAuditMetaOperationalSolution represents the data about an operational need to render an operational need human readable.
type TranslatedAuditMetaOperationalSolution struct {
	TranslatedAuditMetaBaseStruct
	NeedName            string     `json:"needName"`
	NeedIsOther         bool       `json:"needIsOther"`
	SolutionName        string     `json:"solutionName"`
	SolutionOtherHeader *string    `json:"solutionOtherHeader"`
	NumberOfSubtasks    int        `json:"numberOfSubtasks"`
	SolutionIsOther     bool       `json:"solutionIsOther"`
	SolutionStatus      string     `json:"solutionStatus"`
	SolutionMustStart   *time.Time `json:"solutionMustStart"`
	SolutionMustFinish  *time.Time `json:"solutionMustFinish"`
}

// NewTranslatedAuditMetaOperationalSolution creates a New TranslatedAuditMetaOperationalSolution
func NewTranslatedAuditMetaOperationalSolution(tableName string, version int, solutionName string, solutionOtherHeader *string, solIsOther bool, numSubtasks int, needName string, needIsOther bool, solStatusTranslated string,
	solMustStart *time.Time,
	solMustFinish *time.Time,
) TranslatedAuditMetaOperationalSolution {

	return TranslatedAuditMetaOperationalSolution{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(tableName, version),
		SolutionName:                  solutionName,
		SolutionOtherHeader:           solutionOtherHeader,
		SolutionIsOther:               solIsOther,
		NumberOfSubtasks:              numSubtasks,
		NeedName:                      needName,
		NeedIsOther:                   needIsOther,
		SolutionStatus:                solStatusTranslated,
		SolutionMustStart:             solMustStart,
		SolutionMustFinish:            solMustFinish,
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
