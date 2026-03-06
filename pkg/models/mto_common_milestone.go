package models

import "github.com/google/uuid"

type MTOCommonMilestone struct {
	ID                uuid.UUID                 `json:"id" db:"id"`
	Name              string                    `json:"name" db:"name"`
	Description       string                    `json:"description" db:"description"`
	CategoryName      string                    `json:"categoryName" db:"category_name"`
	SubCategoryName   *string                   `json:"subCategoryName" db:"sub_category_name"`
	FacilitatedByRole EnumArray[MTOFacilitator] `json:"facilitatedByRole" db:"facilitated_by_role"`

	// Section specifies the Task List Section that corresponds to suggesting this common milestone
	Section TaskListSection `json:"section" db:"section"`
	// This field facilitate queries, but is not an actual database column (the mto_milestone table joins to the model plan, and potentially to this table, unless it is a custom milestone)
	ModelPlanID *uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	IsArchived  bool       `json:"isArchived" db:"is_archived"`
	IsAdded     bool       `json:"isAdded" db:"is_added"`
	IsSuggested bool       `json:"isSuggested" db:"is_suggested"`
}
