package models

import (
	"github.com/google/uuid"
)

type MTOMilestoneSolutionLink struct {
	baseStruct

	MilestoneID uuid.UUID `json:"milestoneID" db:"milestone_id"`
	SolutionID  uuid.UUID `json:"solutionID" db:"solution_id"`
}

// NewMTOMilestoneSolutionLink returns a new mtoMilestoneSolutionLink object
func NewMTOMilestoneSolutionLink(createdBy uuid.UUID, milestoneID uuid.UUID, solutionID uuid.UUID) *MTOMilestoneSolutionLink {
	return &MTOMilestoneSolutionLink{
		baseStruct:  NewBaseStruct(createdBy),
		MilestoneID: milestoneID,
		SolutionID:  solutionID,
	}
}
