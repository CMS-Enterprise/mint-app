package models

import "github.com/google/uuid"

type MTOCommonSolution struct {
	Name        string               `json:"name" db:"name"`
	Key         MTOCommonSolutionKey `json:"key" db:"key"`
	Type        MTOSolutionType      `json:"type" db:"type"`
	Description string               `json:"description" db:"description"`
	Role        MTOFacilitator       `json:"role" db:"role"`
	ModelPlanID *uuid.UUID           `json:"modelPlanID" db:"model_plan_id"` //TODO (mto) verify this, this would facilitate queries and is_added. This is not an actual database column
	// This field is here for the sake of simplifying DB queries, it comes from a linking table, and only provides some contextual data
	CommonMilestoneKey *MTOCommonMilestoneKey `json:"commonMilestoneKey" db:"mto_common_milestone_key"` //TODO (mto) verify this,
	IsAdded            bool                   `json:"isAdded" db:"is_added"`                            //TODO (mto) verify this
}

type MTOCommonSolutionKey string

const (
	MTOCommonSolutionKeySolutionA MTOCommonSolutionKey = "SOLUTION_A"
	MTOCommonSolutionKeySolutionB MTOCommonSolutionKey = "SOLUTION_B"
)

type MTOSolutionType string

const (
	MTOSolutionTypeItSystem   MTOSolutionType = "IT_SYSTEM"
	MTOSolutionTypeContractor MTOSolutionType = "CONTRACTOR"
	MTOSolutionTypeOther      MTOSolutionType = "OTHER"
)
