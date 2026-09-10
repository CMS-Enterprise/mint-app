package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/ctat_request_model_plan_link/create.sql
var ctatRequestModelPlanLinkCreateSQL string

type ctatRequestModelPlanLinkScripts struct {
	Create string
}

// CTATRequestModelPlanLink houses all the SQL for CTAT request model link operations in the database
var CTATRequestModelPlanLink = ctatRequestModelPlanLinkScripts{
	Create: ctatRequestModelPlanLinkCreateSQL,
}
