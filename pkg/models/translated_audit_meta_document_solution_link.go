package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
)

// Changes: (Meta) Figure out what we need here, do we need all need info? Do we need all solution info?

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
	DocumentVisibility *string   `json:"documentVisibility"`
	// Changes: (Meta) if required add what other solutions documents were connected
}

func (tam *TranslatedAuditMetaDocumentSolutionLink) SetOptionalDocumentFields(documentName string, documentType string, documentOtherType zero.String, documentVisibility string) {
	tam.DocumentName = &documentName
	tam.DocumentType = &documentType
	tam.DocumentOtherType = documentOtherType.Ptr()
	tam.DocumentVisibility = &documentVisibility

}

// NewTranslatedAuditMetaDocumentSolutionLink creates a New TranslatedAuditMetaDocumentSolutionLink
func NewTranslatedAuditMetaDocumentSolutionLink(tableName string,
	version int,
	solutionName string,
	solutionOtherHeader *string,
	solIsOther bool,

	needName string,
	needIsOther bool,

	documentID uuid.UUID,
) TranslatedAuditMetaDocumentSolutionLink {

	return TranslatedAuditMetaDocumentSolutionLink{
		TranslatedAuditMetaBaseStruct: NewTranslatedAuditMetaBaseStruct(tableName, version),
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
	//Changes: (Meta) should we see about leaving out null values when we serialize to save database space? Would that create an issue?, currently null values still get serialized
	/*
		{
			"version": 0,
			"needName": "To eat Ice Cream",
			"tableName": "document_solution_link",
			"documentID": "106cc0b8-2249-4503-8b46-e075904b5f76",
			"needIsOther": true,
			"documentName": null,
			"documentType": null,
			"solutionName": "My special solution 2",
			"solutionIsOther": true,
			"documentVisibility": null,
			"solutionOtherHeader": "The Happy Helper Team"
		}
	*/
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
