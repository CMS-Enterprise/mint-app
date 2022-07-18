package models

// PlanBasics represents the "plan basics" section of a plan
type PlanBasics struct {
	BaseTaskListSection

	ModelType *ModelType `json:"modelType" db:"model_type" statusWeight:"1"`

	Problem           *string `json:"problem" db:"problem" statusWeight:"1"`
	Goal              *string `json:"goal" db:"goal" statusWeight:"1"`
	TestInterventions *string `json:"testInterventions" db:"test_interventions" statusWeight:"1"`
	Note              *string `json:"note" db:"note"`
}
