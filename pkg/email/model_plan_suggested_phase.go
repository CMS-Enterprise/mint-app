package email

type ModelPlanSuggestedPhaseSubjectContent struct {
	ModelName string
}

type ModelPlanSuggestedPhaseBodyContent struct {
	ClientAddress  string
	ModelTeamEmail string
	Phase          string
	ModelPlanID    string
}
