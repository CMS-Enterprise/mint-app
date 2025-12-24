package email

import (
	_ "embed"
)

// ModelPlanSuggestedPhaseTemplateName is the template name definition for the corresponding email template
const ModelPlanSuggestedPhaseTemplateName string = "model_plan_suggested_phase"

//go:embed templates/model_plan_suggested_phase_subject.html
var modelPlanSuggestedPhaseSubjectTemplate string

//go:embed templates/model_plan_suggested_phase_body.html
var modelPlanSuggestedPhaseBodyTemplate string

type ModelPlanSuggestedPhaseSubjectContent struct {
	ModelName string
}

type ModelPlanSuggestedPhaseBodyContent struct {
	ClientAddress              string
	Phase                      string
	SuggestedStatusesRaw       []string
	SuggestedStatusesHumanized []string
	CurrentStatusHumanized     string
	ModelPlanID                string
	ModelPlanName              string
}
