package models

import "github.com/google/uuid"

type IMilestoneRelation interface {
	GetMilestoneID() uuid.UUID
}

type milestoneRelation struct {
	MilestoneID uuid.UUID `json:"milestoneID" db:"milestone_id"`
}

func NewMilestoneRelation(milestoneID uuid.UUID) milestoneRelation {
	return milestoneRelation{
		MilestoneID: milestoneID,
	}
}

func (m milestoneRelation) GetMilestoneID() uuid.UUID {
	return m.MilestoneID
}
