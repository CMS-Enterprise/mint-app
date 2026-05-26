package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/ctat_request/get_lite_by_requester_id_LOADER.sql
var ctatRequestsLiteByRequesterIDSQL string

//go:embed SQL/ctat_request/get_lite_for_admin.sql
var ctatRequestsLiteForAdminSQL string

type ctatRequestScripts struct {
	GetByRequesterID string
	GetForAdmin      string
}

var CTATRequest = ctatRequestScripts{
	GetByRequesterID: ctatRequestsLiteByRequesterIDSQL,
	GetForAdmin:      ctatRequestsLiteForAdminSQL,
}
