package sqlqueries

import _ "embed"

//go:embed SQL/mto/create.sql
var mtoCreateSQL string

//go:embed SQL/mto/update.sql
var mtoUpdateSQL string

//go:embed SQL/mto/get_by_id_loader.sql
var mtoGetByIDLoaderSQL string

type mtoScripts struct {
	Create string
	Update string
	// Holds the SQL to get a mto information by id. Note, in the schema, the id is the same as the model plan id
	GetByIDLoader string
}

// MTO houses all the sql for getting data for mto from the database
var MTO = mtoScripts{
	Create:        mtoCreateSQL,
	Update:        mtoUpdateSQL,
	GetByIDLoader: mtoGetByIDLoaderSQL,
}
