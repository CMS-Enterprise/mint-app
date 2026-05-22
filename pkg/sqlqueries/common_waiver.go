package sqlqueries

import _ "embed"

//go:embed SQL/common_waiver/get_by_id_LOADER.sql
var commonWaiverGetByIDLoaderSQL string

//go:embed SQL/common_waiver/get_all.sql
var commonWaiverGetAllSQL string

type commonWaiverScripts struct {
	GetByIDLoader string
	GetAll        string
}

// CommonWaiver houses all the SQL scripts for the common_waiver table
var CommonWaiver = commonWaiverScripts{
	GetByIDLoader: commonWaiverGetByIDLoaderSQL,
	GetAll:        commonWaiverGetAllSQL,
}
