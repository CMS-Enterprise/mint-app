package models

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
