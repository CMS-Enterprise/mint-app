package sqlqueries

import _ "embed"

//go:embed SQL/common_waiver/get_by_id_LOADER.sql
var commonWaiverGetByIDLoaderSQL string

type commonWaiverScripts struct {
	// Uses a list of ids to return a corresponding list of common waiver objects
	GetByIDLoader string
}

// CommonWaiver houses all the SQL scripts for the common_waiver table
var CommonWaiver = commonWaiverScripts{
	GetByIDLoader: commonWaiverGetByIDLoaderSQL,
}
