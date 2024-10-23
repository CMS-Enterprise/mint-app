package sqlqueries

import _ "embed"

//go:embed SQL/mto_category/create.sql
var mtoCategoryCreateSQL string

//go:embed SQL/mto_category/update.sql
var mtoCategoryUpdateSQL string

//go:embed SQL/mto_category/get_by_id.sql
var mtoCategoryGetByIDSQL string

//go:embed SQL/mto_category/get_by_model_plan_id_LOADER.sql
var mtoCategoryGetByModelPlanIDLoaderSQL string

type mtoCategoryScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
}

// MTOCategory houses all the sql for getting data for mto category from the database
var MTOCategory = mtoCategoryScripts{
	Create:                 mtoCategoryCreateSQL,
	Update:                 mtoCategoryUpdateSQL,
	GetByID:                mtoCategoryGetByIDSQL,
	GetByModelPlanIDLoader: mtoCategoryGetByModelPlanIDLoaderSQL,
}
