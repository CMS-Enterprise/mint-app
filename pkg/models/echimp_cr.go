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
	sanitizedSummary := sanitization.InnerHTML(raw.CrSummary)
	associatedUUID, parseError := uuid.Parse(raw.AssociatedModelUids)
	if parseError != nil {
		return nil, parseError
	}

	//todo, sanitize it
	sanitizedCR := &EChimpCR{
		CrNumber:            raw.CrNumber,
		VersionNum:          raw.VersionNum,
		Initiator:           raw.Initiator,
		FirstName:           raw.FirstName,
		LastName:            raw.LastName,
		Title:               raw.Title,
		SensitiveFlag:       raw.SensitiveFlag,
		ImplementationDate:  raw.ImplementationDate,
		CrSummary:           sanitizedSummary,
		CrStatus:            raw.CrStatus,
		EmergencyCrFlag:     raw.EmergencyCrFlag,
		RelatedCrNumbers:    raw.RelatedCrNumbers,
		RelatedCrTdlNumbers: raw.RelatedCrTdlNumbers,
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
	SensitiveFlag       string     `parquet:"sensitiveFlag" json:"sensitiveFlag"`
	ImplementationDate  string     `parquet:"implementationDate" json:"implementationDate"`
	CrSummary           string     `parquet:"crSummary" json:"crSummary"`
	CrStatus            string     `parquet:"crStatus" json:"crStatus"`
	EmergencyCrFlag     string     `parquet:"emergencyCrFlag" json:"emergencyCrFlag"`
	RelatedCrNumbers    string     `parquet:"relatedCrNumbers" json:"relatedCrNumbers"`
	RelatedCrTdlNumbers string     `parquet:"relatedCrTdlNumbers" json:"relatedCrTdlNumbers"`
	AssociatedModelUids *uuid.UUID `parquet:"associatedModelUids" json:"associatedModelUids"`
}
