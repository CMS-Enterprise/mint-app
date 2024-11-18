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
	// Hols the SQL to
	GetByIDLoader string
}

// MTO houses all the sql for getting data for mto from the database
var MTO = mtoScripts{
	Create:        mtoCreateSQL,
	Update:        mtoUpdateSQL,
	GetByIDLoader: mtoGetByIDLoaderSQL,
}
