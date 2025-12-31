package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/model_plan_mto_template_link/get_by_id_LOADER.sql
var modelPlanMTOTemplateLinkGetByIDLoader string

//go:embed SQL/mto/template/model_plan_mto_template_link/get_by_model_plan_id_LOADER.sql
var modelPlanMTOTemplateLinkGetByModelPlanIDLoader string

//go:embed SQL/mto/template/model_plan_mto_template_link/get_by_template_id_LOADER.sql
var modelPlanMTOTemplateLinkGetByTemplateIDLoader string

//go:embed SQL/mto/template/model_plan_mto_template_link/upsert.sql
var modelPlanMTOTemplateLinkUpsert string

type modelPlanMTOTemplateLinkScripts struct {
	GetByIDLoader          string
	GetByModelPlanIDLoader string
	GetByTemplateIDLoader  string
	Upsert                 string
}

// ModelPlanMTOTemplateLink houses all the sql for getting data for model plan MTO template links from the database
var ModelPlanMTOTemplateLink = modelPlanMTOTemplateLinkScripts{
	GetByIDLoader:          modelPlanMTOTemplateLinkGetByIDLoader,
	GetByModelPlanIDLoader: modelPlanMTOTemplateLinkGetByModelPlanIDLoader,
	GetByTemplateIDLoader:  modelPlanMTOTemplateLinkGetByTemplateIDLoader,
	Upsert:                 modelPlanMTOTemplateLinkUpsert,
}
