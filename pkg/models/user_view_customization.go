package models

import (
	"github.com/lib/pq"
)

type ViewCustomizationType string

const (
	ViewCustomizationTypeMyModelPlans               ViewCustomizationType = "MY_MODEL_PLANS"
	ViewCustomizationTypeAllModelPlans              ViewCustomizationType = "ALL_MODEL_PLANS"
	ViewCustomizationTypeFollowedModels             ViewCustomizationType = "FOLLOWED_MODELS"
	ViewCustomizationTypeModelsWithCrTdl            ViewCustomizationType = "MODELS_WITH_CR_TDL"
	ViewCustomizationTypeModelsBySolution           ViewCustomizationType = "MODELS_BY_SOLUTION"
	ViewCustomizationTypeModelsApproachingClearance ViewCustomizationType = "MODELS_APPROACHING_CLEARANCE"
)

// UserViewCustomization represents a user's choices to customize their homepage
type UserViewCustomization struct {
	baseStruct
	userIDRelation
	ViewCustomization pq.StringArray `json:"viewCustomization" db:"view_customization"`
	Solutions         pq.StringArray `json:"solutions" db:"solutions"`
}
