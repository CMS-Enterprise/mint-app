package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/model_plan_mto_template_link/get_by_id_LOADER.sql
var ModelPlanMTOTemplateLinkGetByIDLoader string

//go:embed SQL/mto/template/model_plan_mto_template_link/get_by_model_plan_id_LOADER.sql
var ModelPlanMTOTemplateLinkGetByModelPlanIDLoader string

//go:embed SQL/mto/template/model_plan_mto_template_link/get_by_template_id_LOADER.sql
var ModelPlanMTOTemplateLinkGetByTemplateIDLoader string

//go:embed SQL/mto/template/model_plan_mto_template_link/upsert.sql
var ModelPlanMTOTemplateLinkUpsert string

type ModelPlanMTOTemplateLinkScripts struct {
	GetByIDLoader          string
	GetByModelPlanIDLoader string
	GetByTemplateIDLoader  string
	Upsert                 string
}

// ModelPlanMTOTemplateLink houses all the sql for getting data for model plan MTO template links from the database
var ModelPlanMTOTemplateLink = ModelPlanMTOTemplateLinkScripts{
	GetByIDLoader:          ModelPlanMTOTemplateLinkGetByIDLoader,
	GetByModelPlanIDLoader: ModelPlanMTOTemplateLinkGetByModelPlanIDLoader,
	GetByTemplateIDLoader:  ModelPlanMTOTemplateLinkGetByTemplateIDLoader,
	Upsert:                 ModelPlanMTOTemplateLinkUpsert,
}
