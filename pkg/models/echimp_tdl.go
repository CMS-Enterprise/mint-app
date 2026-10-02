package models

import (
	"fmt"

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

// ConvertRawTDLSToParsed sanitizes a batch of raw ECHIMP TDL records.
// A record that fails to sanitize (e.g. a malformed field in the upstream ECHIMP export) is
// skipped rather than failing the whole batch, since ECHIMP is a third-party data source MINT
// doesn't control the quality of - one bad TDL shouldn't take down the CRs/TDLs feature for
// everyone else. Skipped records are returned as errors for the caller to log.
func ConvertRawTDLSToParsed(rawRecords []*EChimpTDLRaw) ([]*EChimpTDL, []error) {
	records := []*EChimpTDL{}
	var skipErrs []error
	for _, rawRecord := range rawRecords {
		sanitized, err := rawRecord.Sanitize()
		if err != nil {
			skipErrs = append(skipErrs, fmt.Errorf("skipping ECHIMP TDL %s: %w", rawRecord.TdlNumber, err))
			continue
		}
		records = append(records, sanitized)
	}
	return records, skipErrs

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
