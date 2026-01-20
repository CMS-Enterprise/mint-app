package sqlqueries

import _ "embed"

//go:embed SQL/iddoc_questionnaire/create.sql
var iddocQuestionnaireCreateSQL string

//go:embed SQL/iddoc_questionnaire/get_by_id.sql
var iddocQuestionnaireGetByIDSQL string

//go:embed SQL/iddoc_questionnaire/update.sql
var iddocQuestionnaireUpdateSQL string

//go:embed SQL/iddoc_questionnaire/get_by_model_plan_id_LOADER.sql
var iddocQuestionnaireGetByModelPlanIDLoaderSQL string

type iddocQuestionnaireScripts struct {
	Create  string
	GetByID string
	Update  string
	//Uses a list of model_plan_ids to return a corresponding list of IDDOC questionnaire objects
	GetByModelPlanIDLoader string
}

// IDDOCQuestionnaire houses all the SQL scripts for the iddoc_questionnaire table
var IDDOCQuestionnaire = iddocQuestionnaireScripts{
	Create:                 iddocQuestionnaireCreateSQL,
	GetByID:                iddocQuestionnaireGetByIDSQL,
	Update:                 iddocQuestionnaireUpdateSQL,
	GetByModelPlanIDLoader: iddocQuestionnaireGetByModelPlanIDLoaderSQL,
}
