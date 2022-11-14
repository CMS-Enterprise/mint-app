package models

import "github.com/google/uuid"

// PlanDocumentSolutionLink represents a plan document solution link
type PlanDocumentSolutionLink struct {
	baseStruct
	modelPlanRelation

	SolutionID  int       `json:"solutionID" db:"solution_id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	DocumentID  uuid.UUID `json:"documentID" db:"document_id"`
}
