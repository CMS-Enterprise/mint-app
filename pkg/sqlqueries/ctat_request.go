package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/ctat_request/get_by_requester_id_LOADER.sql
var ctatRequestsByRequesterIDSQL string

//go:embed SQL/ctat_request/get_for_admin.sql
var ctatRequestsForAdminSQL string

type ctatRequestScripts struct {
	GetByRequesterID string
	GetForAdmin      string
}

var CTATRequest = ctatRequestScripts{
	GetByRequesterID: ctatRequestsByRequesterIDSQL,
	GetForAdmin:      ctatRequestsForAdminSQL,
}
