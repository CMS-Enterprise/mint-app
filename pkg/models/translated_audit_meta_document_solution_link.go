package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
)

// TranslatedAuditMetaDocumentSolutionLink represents the data about an operational need to render an operational need human readable.
type TranslatedAuditMetaDocumentSolutionLink struct {
	TranslatedAuditMetaBaseStruct
	NeedName            string  `json:"needName"`
	NeedIsOther         bool    `json:"needIsOther"`
	SolutionName        string  `json:"solutionName"`
	SolutionOtherHeader *string `json:"solutionOtherHeader"`
	SolutionIsOther     bool    `json:"solutionIsOther"`

	DocumentID         uuid.UUID `json:"documentID"`
	DocumentName       *string   `json:"documentName"`
	DocumentType       *string   `json:"documentType"`
	DocumentOtherType  *string   `json:"documentOtherType"`
	DocumentNote       *string   `json:"documentNote"`
	DocumentURL        *string   `json:"documentURL"`
	DocumentVisibility *string   `json:"documentVisibility"`
	DocumentRestricted *bool     `json:"documentRestricted"`
}

func (tam *TranslatedAuditMetaDocumentSolutionLink) SetOptionalDocumentFields(documentName string, documentType string, documentOtherType zero.String, documentNote zero.String, documentURL zero.String, documentVisibility string, documentRestricted bool) {
	tam.DocumentName = &documentName
	tam.DocumentType = &documentType
	tam.DocumentOtherType = documentOtherType.Ptr()
	tam.DocumentNote = documentNote.Ptr()
	tam.DocumentURL = documentURL.Ptr()
	tam.DocumentVisibility = &documentVisibility
	tam.DocumentRestricted = &documentRestricted

}

// NewTranslatedAuditMetaDocumentSolutionLink creates a New TranslatedAuditMetaDocumentSolutionLink
func NewTranslatedAuditMetaDocumentSolutionLink(
	version int,
	solutionName string,
	solutionOtherHeader *string,
	solIsOther bool,

	needName string,
	needIsOther bool,

	documentID uuid.UUID,
) TranslatedAuditMetaDocumentSolutionLink {

	return TranslatedAuditMetaDocumentSolutionLink{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(TNPlanDocumentSolutionLink, version),
		SolutionName:                  solutionName,
		SolutionOtherHeader:           solutionOtherHeader,
		SolutionIsOther:               solIsOther,
		NeedName:                      needName,
		NeedIsOther:                   needIsOther,

		DocumentID: documentID,
	}
}

// isActivityMetaData implements the IActivityMetaGeneric
func (hmb TranslatedAuditMetaDocumentSolutionLink) isAuditMetaData() {}

// Value allows us to satisfy the valuer interface so we can write to the database
func (hmb TranslatedAuditMetaDocumentSolutionLink) Value() (driver.Value, error) {

	j, err := json.Marshal(hmb)
	return j, err
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (hmb *TranslatedAuditMetaDocumentSolutionLink) Scan(src interface{}) error {
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
