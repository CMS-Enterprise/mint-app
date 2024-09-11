package models

import "github.com/cmsgov/mint-app/pkg/sanitization"

// EChimpTDLRaw represents a TDL that came from E-Chimp parquet file before being sanitized
type EChimpTDLRaw struct {
	TdlNumber           string `parquet:"tdlNumber" json:"tdlNumber"`
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
	sanitizedTitle := sanitization.InnerHTML(raw.Title)

	//todo, sanitize it
	sanitizedCR := &EChimpTDL{
		TdlNumber:           raw.TdlNumber,
		VersionNum:          raw.VersionNum,
		Initiator:           raw.Initiator,
		FirstName:           raw.FirstName,
		LastName:            raw.LastName,
		Title:               sanitizedTitle,
		IssuedDate:          raw.IssuedDate,
		Status:              raw.Status,
		AssociatedModelUids: raw.AssociatedModelUids,
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
	TdlNumber           string `parquet:"tdlNumber" json:"tdlNumber"`
	VersionNum          string `parquet:"versionNum" json:"versionNum"`
	Initiator           string `parquet:"initiator" json:"initiator"`
	FirstName           string `parquet:"firstName" json:"firstName"`
	LastName            string `parquet:"lastName" json:"lastName"`
	Title               string `parquet:"title" json:"title"`
	IssuedDate          string `parquet:"issuedDate" json:"issuedDate"`
	Status              string `parquet:"status" json:"status"`
	AssociatedModelUids string `parquet:"associatedModelUids" json:"associatedModelUids"`
}
