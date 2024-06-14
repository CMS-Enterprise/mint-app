package models

import (
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type ViewCustomizationType string

const (
	ViewCustomizationTypeMyModelPlans                ViewCustomizationType = "MY_MODEL_PLANS"
	ViewCustomizationTypeAllModelPlans               ViewCustomizationType = "ALL_MODEL_PLANS"
	ViewCustomizationTypeFollowedModels              ViewCustomizationType = "FOLLOWED_MODELS"
	ViewCustomizationTypeModelsWithCrTdl             ViewCustomizationType = "MODELS_WITH_CR_TDL"
	ViewCustomizationTypeModelsByOperationalSolution ViewCustomizationType = "MODELS_BY_OPERATIONAL_SOLUTION"
)

type UserViewCustomization struct {
	baseStruct
	UserID                       uuid.UUID      `json:"userId" db:"user_id"`
	ViewCustomization            pq.StringArray `json:"viewCustomization" db:"view_customization"`
	PossibleOperationalSolutions []uuid.UUID    `json:"possibleOperationalSolutions" db:"possible_operational_solutions"`
}
