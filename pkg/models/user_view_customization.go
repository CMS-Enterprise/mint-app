package models

import (
	"github.com/google/uuid"
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
	ID                           uuid.UUID               `json:"id"`
	UserID                       uuid.UUID               `json:"userId"`
	ViewCustomization            []ViewCustomizationType `json:"viewCustomization"`
	PossibleOperationalSolutions []uuid.UUID             `json:"possibleOperationalSolutions"`
}
