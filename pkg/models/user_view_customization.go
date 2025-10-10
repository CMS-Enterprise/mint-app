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
	ViewCustomizationTypeModelsByGroup              ViewCustomizationType = "MODELS_BY_GROUP"
)

type ComponentGroup string

const (
	ComponentGroupCcmiPmg  ComponentGroup = "CCMI_PCMG"
	ComponentGroupCcmiPpg  ComponentGroup = "CCMI_PPG"
	ComponentGroupCcmiScmg ComponentGroup = "CCMI_SCMG"
	ComponentGroupCcmiSphg ComponentGroup = "CCMI_SPHG"
	ComponentGroupCcmiTbd  ComponentGroup = "CCMI_TBD"
	ComponentGroupCsq      ComponentGroup = "CCSQ"
	ComponentGroupCmcs     ComponentGroup = "CMCS"
	ComponentGroupCm       ComponentGroup = "CM"
	ComponentGroupFchco    ComponentGroup = "FCHCO"
	ComponentGroupCpi      ComponentGroup = "CPI"
)

// UserViewCustomization represents a user's choices to customize their homepage
type UserViewCustomization struct {
	baseStruct
	userIDRelation
	ViewCustomization pq.StringArray `json:"viewCustomization" db:"view_customization"`
	Solutions         pq.StringArray `json:"solutions" db:"solutions"`
	ComponentGroups   pq.StringArray `json:"componentGroups" db:"component_groups"`
}
