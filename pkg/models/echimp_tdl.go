package models

// EChimpTDL is the tdl dta from echimp
// type EChimpTDL struct {
// 	TdlNumber           string `parquet:"tdlNumber"`
// 	VersionNum          string `parquet:"versionNum"`
// 	Initiator           string `parquet:"initiator"`
// 	FirstName           string `parquet:"firstName"`
// 	LastName            string `parquet:"lastName"`
// 	Title               string `parquet:"title"`
// 	IssuedDate          string `parquet:"issuedDate"`
// 	Status              string `parquet:"status"`
// 	AssociatedModelUids string `parquet:"associatedModelUids"`
// }

type EChimpTDL struct {
	TdlNumber           string `parquet:"tdlNumber"`
	VersionNum          string `parquet:"versionNum"`
	Initiator           string `parquet:"initiator"`
	FirstName           string `parquet:"firstName"`
	LastName            string `parquet:"lastName"`
	Title               string `parquet:"title"`
	IssuedDate          string `parquet:"issuedDate"`
	Status              string `parquet:"status"`
	AssociatedModelUids string `parquet:"associatedModelUids"`
}
