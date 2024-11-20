package models

import "github.com/google/uuid"

type MTOCommonMilestone struct {
	Name              string                `json:"name" db:"name"`
	Key               MTOCommonMilestoneKey `json:"key" db:"key"`
	CategoryName      string                `json:"categoryName" db:"category_name"`
	SubCategoryName   *string               `json:"subCategoryName" db:"sub_category_name"`
	FacilitatedByRole MTOFacilitator        `json:"facilitatedByRole" db:"facilitated_by_role"`

	// Section specifies the Task List Section that corresponds to suggesting this common milestone
	Section TaskListSection `json:"section" db:"section"`

	ModelPlanID *uuid.UUID `json:"modelPlanID" db:"model_plan_id"` //TODO (mto) verify this, this would facilitate queries and is_added. This is not an actual database column
	IsAdded     bool       `json:"isAdded" db:"is_added"`          //TODO (mto) verify this
}

type MTOCommonMilestoneKey string

const (
	MTOCommonMilestoneKeyMilestoneA MTOCommonMilestoneKey = "MILESTONE_A"
	MTOCommonMilestoneKeyMilestoneB MTOCommonMilestoneKey = "MILESTONE_B"
)

var AllMTOCommonMilestoneKey = []MTOCommonMilestoneKey{
	MTOCommonMilestoneKeyMilestoneA,
	MTOCommonMilestoneKeyMilestoneB,
}
