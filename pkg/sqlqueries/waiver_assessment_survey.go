package sqlqueries

import _ "embed"

//go:embed SQL/waiver_assessment_survey/create.sql
var waiverAssessmentSurveyCreateSQL string

//go:embed SQL/waiver_assessment_survey/get_by_id.sql
var waiverAssessmentSurveyGetByIDSQL string

//go:embed SQL/waiver_assessment_survey/update.sql
var waiverAssessmentSurveyUpdateSQL string

//go:embed SQL/waiver_assessment_survey/get_by_model_plan_id_LOADER.sql
var waiverAssessmentSurveyGetByModelPlanIDLoaderSQL string

type waiverAssessmentSurveyScripts struct {
	Create  string
	GetByID string
	Update  string
	// Uses a list of model_plan_ids to return a corresponding list of waiver assessment survey objects
	GetByModelPlanIDLoader string
}

// WaiverAssessmentSurvey houses all the SQL scripts for the waiver_assessment_survey table
var WaiverAssessmentSurvey = waiverAssessmentSurveyScripts{
	Create:                 waiverAssessmentSurveyCreateSQL,
	GetByID:                waiverAssessmentSurveyGetByIDSQL,
	Update:                 waiverAssessmentSurveyUpdateSQL,
	GetByModelPlanIDLoader: waiverAssessmentSurveyGetByModelPlanIDLoaderSQL,
}
