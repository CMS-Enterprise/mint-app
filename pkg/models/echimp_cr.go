package models

// EChimpCR represents a CR that came from E-Chimp
type EChimpCR struct {
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
