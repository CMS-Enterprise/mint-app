package models

// EChimpTDL is the tdl dta from echimp
type EChimpTDL struct {
	TDLNumber           string `parquet:"name=tdlNumber, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	VersionNum          string `parquet:"name=versionNum, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	Initiator           string `parquet:"name=initiator, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	FirstName           string `parquet:"name=firstName, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	LastName            string `parquet:"name=lastName, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	Title               string `parquet:"name=title, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	IssuedDate          string `parquet:"name=issuedDate, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	Status              string `parquet:"name=status, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
	AssociatedModelUids string `parquet:"name=associatedModelUids, type=BYTE_ARRAY, convertedtype=UTF8, encoding=PLAIN_DICTIONARY"`
}
