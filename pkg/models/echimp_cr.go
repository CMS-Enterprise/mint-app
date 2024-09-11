package models

// EChimpCR represents a CR that came from E-Chimp
type EChimpCR struct {
	CrNumber            string `parquet:"crNumber"`
	VersionNum          string `parquet:"versionNum"`
	Initiator           string `parquet:"initiator"`
	FirstName           string `parquet:"firstName"`
	LastName            string `parquet:"lastName"`
	Title               string `parquet:"title"`
	SensitiveFlag       string `parquet:"sensitiveFlag"`
	ImplementationDate  string `parquet:"implementationDate"`
	CrSummary           string `parquet:"crSummary"`
	CrStatus            string `parquet:"crStatus"`
	EmergencyCrFlag     string `parquet:"emergencyCrFlag"`
	RelatedCrNumbers    string `parquet:"relatedCrNumbers"`
	RelatedCrTdlNumbers string `parquet:"relatedCrTdlNumbers"`
	AssociatedModelUids string `parquet:"associatedModelUids"`
}
