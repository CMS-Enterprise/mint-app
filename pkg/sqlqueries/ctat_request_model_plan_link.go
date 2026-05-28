package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/ctat_request_model_plan_link/get_by_ctat_request_id_LOADER.sql
var ctatRequestModelPlanLinksByCTATRequestIDSQL string

type ctatRequestModelPlanLinkScripts struct {
	GetByCTATRequestID string
}

var CTATRequestModelPlanLink = ctatRequestModelPlanLinkScripts{
	GetByCTATRequestID: ctatRequestModelPlanLinksByCTATRequestIDSQL,
}
