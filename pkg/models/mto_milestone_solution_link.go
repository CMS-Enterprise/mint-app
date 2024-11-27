package models

import (
	"github.com/google/uuid"
)

type MTOMilestoneSolutionLink struct {
	baseStruct

	MTOMilestoneID uuid.UUID `json:"mtoMilestoneID" db:"mto_milestone_id"`
	MTOSolutionID  uuid.UUID `json:"mtoSolutionID" db:"mto_solution_id"`
}

// NewMTOMilestoneSolutionLink returns a new mtoMilestoneSolutionLink object
func NewMTOMilestoneSolutionLink(createdBy uuid.UUID, mtoMilestoneID uuid.UUID, mtoSolutionID uuid.UUID) *MTOMilestoneSolutionLink {
	return &MTOMilestoneSolutionLink{
		baseStruct:     NewBaseStruct(createdBy),
		MTOMilestoneID: mtoMilestoneID,
		MTOSolutionID:  mtoSolutionID,
	}
}
