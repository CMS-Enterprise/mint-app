package models

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/sanitization"
)

// EChimpCRRaw represents a CR that came from E-Chimp before sanitization
type EChimpCRRaw struct {
	CrNumber            string `parquet:"crNumber" json:"crNumber"`
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
	sanitizedSummary := sanitization.InnerHTML(sanitization.SanitizeString(raw.CrSummary))
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
		Initiator:           sanitization.SanitizeString(raw.Initiator),
		FirstName:           sanitization.SanitizeString(raw.FirstName),
		LastName:            sanitization.SanitizeString(raw.LastName),
		Title:               sanitization.SanitizeString(raw.Title),
		SensitiveFlag:       sensitiveFlag,
		ImplementationDate:  sanitization.SanitizeString(raw.ImplementationDate),
		CrSummary:           sanitizedSummary,
		CrStatus:            sanitization.SanitizeString(raw.CrStatus),
		EmergencyCrFlag:     emergencyFlag,
		RelatedCrNumbers:    sanitization.SanitizeString(raw.RelatedCrNumbers),
		RelatedCrTdlNumbers: sanitization.SanitizeString(raw.RelatedCrTdlNumbers),
		AssociatedModelUids: &associatedUUID,
	}
	return sanitizedCR, nil

}

func ConvertRawCRSToParsed(rawRecords []*EChimpCRRaw) ([]*EChimpCR, error) {
	records := []*EChimpCR{}
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

// EChimpCR represents a CR that came from E-Chimp
type EChimpCR struct {
	CrNumber            string     `parquet:"crNumber" json:"crNumber"`
	VersionNum          string     `parquet:"versionNum" json:"versionNum"`
	Initiator           string     `parquet:"initiator" json:"initiator"`
	FirstName           string     `parquet:"firstName" json:"firstName"`
	LastName            string     `parquet:"lastName" json:"lastName"`
	Title               string     `parquet:"title" json:"title"`
	SensitiveFlag       *bool      `parquet:"sensitiveFlag" json:"sensitiveFlag"`
	ImplementationDate  string     `parquet:"implementationDate" json:"implementationDate"`
	CrSummary           string     `parquet:"crSummary" json:"crSummary"`
	CrStatus            string     `parquet:"crStatus" json:"crStatus"`
	EmergencyCrFlag     *bool      `parquet:"emergencyCrFlag" json:"emergencyCrFlag"`
	RelatedCrNumbers    string     `parquet:"relatedCrNumbers" json:"relatedCrNumbers"`
	RelatedCrTdlNumbers string     `parquet:"relatedCrTdlNumbers" json:"relatedCrTdlNumbers"`
	AssociatedModelUids *uuid.UUID `parquet:"associatedModelUids" json:"associatedModelUids"`
}
