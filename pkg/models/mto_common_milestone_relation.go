package models

import "github.com/google/uuid"

// mtoCommonMilestoneRelation is a struct meant to be embedded to show that the object should have an MTO common Milestone relation
type mtoCommonMilestoneRelation struct {
	MTOCommonMilestoneID *uuid.UUID `json:"mtoCommonMilestoneID" db:"mto_common_milestone_id"`
}

// NewMTOCommonMilestoneRelation returns an MTO common Milestone relation object
func NewMTOCommonMilestoneRelation(mtoCommonMilestoneID *uuid.UUID) mtoCommonMilestoneRelation {
	return mtoCommonMilestoneRelation{
		MTOCommonMilestoneID: mtoCommonMilestoneID,
	}
}
