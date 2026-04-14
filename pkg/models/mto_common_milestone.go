package models

import "github.com/google/uuid"

// CommonCategory represents a deduplicated top-level category
// and its deduplicated, alphabetized subcategory names.
type CommonCategory struct {
	Name          string   `json:"name"`
	SubCategories []string `json:"subCategories"`
}

type MTOCommonMilestone struct {
	ID                 uuid.UUID                 `json:"id" db:"id"`
	Name               string                    `json:"name" db:"name"`
	Description        string                    `json:"description" db:"description"`
	CategoryName       string                    `json:"categoryName" db:"category_name"`
	SubCategoryName    *string                   `json:"subCategoryName" db:"sub_category_name"`
	FacilitatedByRole  EnumArray[MTOFacilitator] `json:"facilitatedByRole" db:"facilitated_by_role"`
	FacilitatedByOther *string                   `json:"facilitatedByOther" db:"facilitated_by_other"`

	// Section specifies the Task List Section that corresponds to suggesting this common milestone
	Section TaskListSection `json:"section" db:"section"`
	// These fields facilitate queries but are not actual columns on the mto_common_milestone table.
	// They are populated via JOINs when querying in the context of a model plan.
	ModelPlanID *uuid.UUID `json:"modelPlanID" db:"model_plan_id"`
	IsArchived  bool       `json:"isArchived" db:"is_archived"`
	IsAdded     bool       `json:"isAdded" db:"is_added"`
	// MTOSuggestedMilestoneID is the ID of the mto_suggested_milestone row for this milestone+model plan,
	// or nil if the milestone is not currently suggested. Used to fetch suggestion reasons via dataloader.
	MTOSuggestedMilestoneID *uuid.UUID `json:"mtoSuggestedMilestoneID" db:"mto_suggested_milestone_id"`
}
