package models

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/sanitization"
)

// EChimpCRRaw represents a CR that came from E-Chimp before sanitization
type EChimpCRRaw struct {
	CrNumber            string `parquet:"crNumber" json:"crNumber" gqlgen:"id"` // we use gqlgen:"id" here to match the GQL schema
	VersionNum          string `parquet:"versionNum" json:"versionNum"`
	Initiator           string `parquet:"initiator" json:"initiator"`
	FirstName           string `parquet:"firstName" json:"firstName"`
	LastName            string `parquet:"lastName" json:"lastName"`
	Title               string `parquet:"title" json:"title"`
	SensitiveFlag       string `parquet:"sensitiveFlag" json:"sensitiveFlag"`
	ImplementationDate  string `parquet:"implementationDate" json:"implementationDate"`
	CrSummary           string `parquet:"crSummary" json:"crSummary"`
	CrStatus            string `parquet:"crStatus" json:"crStatus"`
	EmergencyCrFlag     string `parquet:"emergencyCrFlag" json:"emergencyCrFlag"`
	RelatedCrNumbers    string `parquet:"relatedCrNumbers" json:"relatedCrNumbers"`
	RelatedCrTdlNumbers string `parquet:"relatedCrTdlNumbers" json:"relatedCrTdlNumbers"`
	AssociatedModelUids string `parquet:"associatedModelUids" json:"associatedModelUids"`
}

func (raw *EChimpCRRaw) Sanitize() (*EChimpCR, error) {

	sanitizedSummary, sanitizeErr := NewTaggedContentFromString(raw.CrSummary)
	if sanitizeErr != nil {
		return nil, sanitizeErr
	}
	sanitizedPointer := &sanitizedSummary
	if sanitizedSummary.RawContent == "" {
		sanitizedPointer = nil
	}
	associatedUUID, parseError := uuid.Parse(raw.AssociatedModelUids)
	if parseError != nil {
		return nil, parseError
	}
	sensitiveFlag := sanitization.YNStringToBool(raw.SensitiveFlag)
	emergencyFlag := sanitization.YNStringToBool(raw.EmergencyCrFlag)

	//todo, sanitize it
	sanitizedCR := &EChimpCR{
		CrNumber:            sanitization.SanitizeString(raw.CrNumber),
		VersionNum:          sanitization.SanitizeString(raw.VersionNum),
		Initiator:           sanitization.SanitizeStringPointerIfEmpty(raw.Initiator),
		FirstName:           sanitization.SanitizeStringPointerIfEmpty(raw.FirstName),
		LastName:            sanitization.SanitizeStringPointerIfEmpty(raw.LastName),
		Title:               sanitization.SanitizeStringPointerIfEmpty(raw.Title),
		SensitiveFlag:       sensitiveFlag,
		ImplementationDate:  sanitization.SanitizeStringPointerIfEmpty(raw.ImplementationDate),
		CrSummary:           sanitizedPointer,
		CrStatus:            sanitization.SanitizeStringPointerIfEmpty(raw.CrStatus),
		EmergencyCrFlag:     emergencyFlag,
		RelatedCrNumbers:    sanitization.SanitizeStringPointerIfEmpty(raw.RelatedCrNumbers),
		RelatedCrTdlNumbers: sanitization.SanitizeStringPointerIfEmpty(raw.RelatedCrTdlNumbers),
		AssociatedModelUids: &associatedUUID,
	}
	return sanitizedCR, nil

}

// ConvertRawCRSToParsed sanitizes a batch of raw ECHIMP CR records.
// A record that fails to sanitize (e.g. a malformed field in the upstream ECHIMP export) is
// skipped rather than failing the whole batch, since ECHIMP is a third-party data source MINT
// doesn't control the quality of - one bad CR shouldn't take down the CRs/TDLs feature for
// everyone else. Skipped records are returned as errors for the caller to log.
func ConvertRawCRSToParsed(rawRecords []*EChimpCRRaw) ([]*EChimpCR, []error) {
	records := []*EChimpCR{}
	var skipErrs []error
	for _, rawRecord := range rawRecords {
		sanitized, err := rawRecord.Sanitize()
		if err != nil {
			skipErrs = append(skipErrs, fmt.Errorf("skipping ECHIMP CR %s: %w", rawRecord.CrNumber, err))
			continue
		}
		records = append(records, sanitized)
	}
	return records, skipErrs

}

// EChimpCR represents a CR that came from E-Chimp
type EChimpCR struct {
	CrNumber            string         `parquet:"crNumber" json:"crNumber" gqlgen:"id"` // we use gqlgen:"id" here to match the GQL schema
	VersionNum          string         `parquet:"versionNum" json:"versionNum"`
	Initiator           *string        `parquet:"initiator" json:"initiator"`
	FirstName           *string        `parquet:"firstName" json:"firstName"`
	LastName            *string        `parquet:"lastName" json:"lastName"`
	Title               *string        `parquet:"title" json:"title"`
	SensitiveFlag       *bool          `parquet:"sensitiveFlag" json:"sensitiveFlag"`
	ImplementationDate  *string        `parquet:"implementationDate" json:"implementationDate"`
	CrSummary           *TaggedContent `parquet:"crSummary" json:"crSummary"`
	CrStatus            *string        `parquet:"crStatus" json:"crStatus"`
	EmergencyCrFlag     *bool          `parquet:"emergencyCrFlag" json:"emergencyCrFlag"`
	RelatedCrNumbers    *string        `parquet:"relatedCrNumbers" json:"relatedCrNumbers"`
	RelatedCrTdlNumbers *string        `parquet:"relatedCrTdlNumbers" json:"relatedCrTdlNumbers"`
	AssociatedModelUids *uuid.UUID     `parquet:"associatedModelUids" json:"associatedModelUids"`
}

func (echimp *EChimpCR) IsEChimpCRAndTdls() {}
