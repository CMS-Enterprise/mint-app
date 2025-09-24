package sqlqueries

import _ "embed"

//go:embed SQL/mto/template/template/get_by_id_LOADER.sql
var mtoTemplateGetByIDLoaderSQL string

//go:embed SQL/mto/template/template/get_by_model_plan_id_LOADER.sql
var mtoTemplateGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/template/template/get_by_key_LOADER.sql
var mtoTemplateGetByKeyLoaderSQL string

//go:embed SQL/mto/template/template/get_all.sql
var mtoTemplateGetAllSQL string

type mtoTemplateScripts struct {
	GetByIDLoader          string
	GetByModelPlanIDLoader string
	GetByKeyLoader         string
	GetAll                 string
}

var MTOTemplate = mtoTemplateScripts{
	GetByIDLoader:          mtoTemplateGetByIDLoaderSQL,
	GetByModelPlanIDLoader: mtoTemplateGetByModelPlanIDLoaderSQL,
	GetAll:                 mtoTemplateGetAllSQL,
	GetByKeyLoader:         mtoTemplateGetByKeyLoaderSQL,
}
