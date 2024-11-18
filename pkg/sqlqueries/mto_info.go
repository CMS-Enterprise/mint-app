package sqlqueries

import _ "embed"

//go:embed SQL/mto/info/create.sql
var mtoInfoCreateSQL string

//go:embed SQL/mto/info/update.sql
var mtoInfoUpdateSQL string

//go:embed SQL/mto/info/get_by_id_loader.sql
var mtoInfoGetByIDLoaderSQL string

type mtoInfoScripts struct {
	Create string
	Update string
	// Holds the SQL to get a mto information by id. Note, in the schema, the id is the same as the model plan id
	GetByIDLoader string
}

// MTOInfo houses all the sql for getting data for mto info objects from the database
var MTOInfo = mtoInfoScripts{
	Create:        mtoInfoCreateSQL,
	Update:        mtoInfoUpdateSQL,
	GetByIDLoader: mtoInfoGetByIDLoaderSQL,
}
