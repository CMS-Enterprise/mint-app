package models

import "github.com/google/uuid"

// Questionnaires is a wrapper type that groups all questionnaire-related fields for a model plan
type Questionnaires struct {
	ModelPlanID uuid.UUID
}
