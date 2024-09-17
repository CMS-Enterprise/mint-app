package email

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
