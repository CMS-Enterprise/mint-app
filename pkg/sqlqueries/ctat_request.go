package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/ctat_request/get_by_requester_id_LOADER.sql
var ctatRequestsByRequesterIDLoaderSQL string

//go:embed SQL/ctat_request/get_by_id_LOADER.sql
var ctatRequestByIDLoaderSQL string

//go:embed SQL/ctat_request/get_for_admin.sql
var ctatRequestsForAdminSQL string

//go:embed SQL/ctat_request/create.sql
var ctatRequestCreateSQL string

//go:embed SQL/ctat_request/admin_update.sql
var ctatRequestAdminUpdateSQL string

type ctatRequestScripts struct {
	GetByIDLoader          string
	GetByRequesterIDLoader string
	GetForAdmin            string
	Create                 string
	AdminUpdate            string
}

// CTATRequest houses all the SQL queries for CTAT request operations in the database
var CTATRequest = ctatRequestScripts{
	GetByIDLoader:          ctatRequestByIDLoaderSQL,
	GetByRequesterIDLoader: ctatRequestsByRequesterIDLoaderSQL,
	GetForAdmin:            ctatRequestsForAdminSQL,
	Create:                 ctatRequestCreateSQL,
	AdminUpdate:            ctatRequestAdminUpdateSQL,
}
