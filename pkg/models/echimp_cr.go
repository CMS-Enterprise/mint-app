package models

// EChimpCR represents a CR that came from E-Chimp
type EChimpCR struct {
	CrNumber            string `parquet:"name=crNumber, type=BYTE_ARRAY, convertedtype=UTF8"`
	VersionNum          string `parquet:"name=versionNum, type=BYTE_ARRAY, convertedtype=UTF8"`
	Initiator           string `parquet:"name=initiator, type=BYTE_ARRAY, convertedtype=UTF8"`
	FirstName           string `parquet:"name=firstName, type=BYTE_ARRAY, convertedtype=UTF8"`
	LastName            string `parquet:"name=lastName, type=BYTE_ARRAY, convertedtype=UTF8"`
	Title               string `parquet:"name=title, type=BYTE_ARRAY, convertedtype=UTF8"`
	SensitiveFlag       string `parquet:"name=sensitiveFlag, type=BYTE_ARRAY, convertedtype=UTF8"`
	ImplementationDate  string `parquet:"name=implementationDate, type=BYTE_ARRAY, convertedtype=UTF8"`
	CrSummary           string `parquet:"name=crSummary, type=BYTE_ARRAY, convertedtype=UTF8"`
	CrStatus            string `parquet:"name=crStatus, type=BYTE_ARRAY, convertedtype=UTF8"`
	EmergencyCrFlag     string `parquet:"name=emergencyCrFlag, type=BYTE_ARRAY, convertedtype=UTF8"`
	RelatedCrNumbers    string `parquet:"name=relatedCrNumbers, type=BYTE_ARRAY, convertedtype=UTF8"`
	RelatedCrTdlNumbers string `parquet:"name=relatedCrTdlNumbers, type=BYTE_ARRAY, convertedtype=UTF8"`
	AssociatedModelUids string `parquet:"name=associatedModelUids, type=BYTE_ARRAY, convertedtype=UTF8"`
}
