package sqlqueries

import _ "embed"

//go:embed SQL/existing_model_link/merge.sql
var existingModelLinkMergeSQL string

//go:embed SQL/existing_model_link/get_by_id.sql
var existingModelLinkGetByIDSQL string

//go:embed SQL/existing_model_link/get_by_model_plan_id_and_field_name_LOADER.sql
var existingModelLinkGetByModelPlanIDAndFieldNameLoaderSQL string

//go:embed SQL/existing_model_link/get_names_by_model_plan_id_and_field_name_LOADER.sql
var existingModelLinkGetNamesByModelPlanIDAndFieldNameSQL string

type existingModelLinkScripts struct {
	Merge                              string
	GetByID                            string
	GetByModelPlanIDAndFieldNameLoader string
	GetNamesByModelPlanIDAndFieldName  string
}

// ExistingModelLink houses all the sql for getting data for existing model link from the database
var ExistingModelLink = existingModelLinkScripts{
	Merge:                              existingModelLinkMergeSQL,
	GetByID:                            existingModelLinkGetByIDSQL,
	GetByModelPlanIDAndFieldNameLoader: existingModelLinkGetByModelPlanIDAndFieldNameLoaderSQL,
	GetNamesByModelPlanIDAndFieldName:  existingModelLinkGetNamesByModelPlanIDAndFieldNameSQL,
}
