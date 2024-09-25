package models

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/sanitization"
)

// EChimpTDLRaw represents a TDL that came from E-Chimp parquet file before being sanitized
type EChimpTDLRaw struct {
	TdlNumber           string `parquet:"tdlNumber" json:"tdlNumber" gqlgen:"id"` // we use gqlgen:"id" here to match the GQL schema
	VersionNum          string `parquet:"versionNum" json:"versionNum"`
	Initiator           string `parquet:"initiator" json:"initiator"`
	FirstName           string `parquet:"firstName" json:"firstName"`
	LastName            string `parquet:"lastName" json:"lastName"`
	Title               string `parquet:"title" json:"title"`
	IssuedDate          string `parquet:"issuedDate" json:"issuedDate"`
	Status              string `parquet:"status" json:"status"`
	AssociatedModelUids string `parquet:"associatedModelUids" json:"associatedModelUids"`
}

func (raw *EChimpTDLRaw) Sanitize() (*EChimpTDL, error) {
	//TODO, do better sanitization, remove line breaks \n
	sanitizedTitle := sanitization.InnerHTML(sanitization.SanitizeString(raw.Title))

	sanitizedPointer := &sanitizedTitle
	if sanitizedTitle == "" {
		sanitizedPointer = nil
	}
	associatedUUID, parseError := uuid.Parse(raw.AssociatedModelUids)
	if parseError != nil {
		return nil, parseError
	}

	//todo, sanitize it
	sanitizedCR := &EChimpTDL{
		TdlNumber:           sanitization.SanitizeString(raw.TdlNumber),
		VersionNum:          sanitization.SanitizeString(raw.VersionNum),
		Initiator:           sanitization.SanitizeStringPointerIfEmpty(raw.Initiator),
		FirstName:           sanitization.SanitizeStringPointerIfEmpty(raw.FirstName),
		LastName:            sanitization.SanitizeStringPointerIfEmpty(raw.LastName),
		Title:               sanitizedPointer,
		IssuedDate:          sanitization.SanitizeStringPointerIfEmpty(raw.IssuedDate),
		Status:              sanitization.SanitizeStringPointerIfEmpty(raw.Status),
		AssociatedModelUids: &associatedUUID,
	}
	return sanitizedCR, nil

}

func ConvertRawTDLSToParsed(rawRecords []*EChimpTDLRaw) ([]*EChimpTDL, error) {
	records := []*EChimpTDL{}
	for _, rawRecord := range rawRecords {
		sanitized, err := rawRecord.Sanitize()
		if err != nil {
			//TODO, do we want to allow errors gracefully?
			return nil, err
		}
		records = append(records, sanitized)
	}
	return records, nil

}

// EChimpTDL represents a TDL that came from E-Chimp
type EChimpTDL struct {
	TdlNumber           string     `parquet:"tdlNumber" json:"tdlNumber" gqlgen:"id"` // we use gqlgen:"id" here to match the GQL schema
	VersionNum          string     `parquet:"versionNum" json:"versionNum"`
	Initiator           *string    `parquet:"initiator" json:"initiator"`
	FirstName           *string    `parquet:"firstName" json:"firstName"`
	LastName            *string    `parquet:"lastName" json:"lastName"`
	Title               *string    `parquet:"title" json:"title"`
	IssuedDate          *string    `parquet:"issuedDate" json:"issuedDate"`
	Status              *string    `parquet:"status" json:"status"`
	AssociatedModelUids *uuid.UUID `parquet:"associatedModelUids" json:"associatedModelUids"`
}

func (echimp *EChimpTDL) IsEChimpCRAndTdls() {}
