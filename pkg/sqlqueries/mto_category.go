package sqlqueries

import _ "embed"

//go:embed SQL/mto/category/create.sql
var mtoCategoryCreateSQL string

//go:embed SQL/mto/category/update.sql
var mtoCategoryUpdateSQL string

//go:embed SQL/mto/category/get_by_id.sql
var mtoCategoryGetByIDSQL string

//go:embed SQL/mto/category/get_by_model_plan_id_LOADER.sql
var mtoCategoryGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/category/and_subcategories_get_by_model_plan_id_LOADER.sql
var mtoCategoryAndSubCategoriesGetByModelPlanIDLoaderSQL string

//go:embed SQL/mto/category/get_by_parent_id_LOADER.sql
var mtoCategoryGetByParentIDLoaderSQL string

type mtoCategoryScripts struct {
	Create  string
	Update  string
	GetByID string
	// returns all parent level categories by a model plan ID
	GetByModelPlanIDLoader string
	// returns all categories and sub categories by a model plan ID
	AndSubCategoriesGetByModelPlanIDLoader string

	// returns all subcategories associated with a parent category
	GetByParentIDLoader string
}

// MTOCategory houses all the sql for getting data for mto category from the database
var MTOCategory = mtoCategoryScripts{
	Create:                                 mtoCategoryCreateSQL,
	Update:                                 mtoCategoryUpdateSQL,
	GetByID:                                mtoCategoryGetByIDSQL,
	GetByModelPlanIDLoader:                 mtoCategoryGetByModelPlanIDLoaderSQL,
	AndSubCategoriesGetByModelPlanIDLoader: mtoCategoryAndSubCategoriesGetByModelPlanIDLoaderSQL,
	GetByParentIDLoader:                    mtoCategoryGetByParentIDLoaderSQL,
}
