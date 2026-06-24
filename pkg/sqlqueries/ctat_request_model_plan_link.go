package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/ctat_request_model_plan_link/create.sql
var ctatRequestModelPlanLinkCreateSQL string

type ctatRequestModelPlanLinkScripts struct {
	Create string
}

var CTATRequestModelPlanLink = ctatRequestModelPlanLinkScripts{
	Create: ctatRequestModelPlanLinkCreateSQL,
}
