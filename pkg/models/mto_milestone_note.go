package models

import "github.com/google/uuid"

type MTOMilestoneNote struct {
	baseStruct
	modelPlanRelation

	MilestoneID uuid.UUID `json:"milestoneID" db:"milestone_id"`
	Content     string    `json:"content" db:"content"`
}

type MTOMilestoneNoteCreateInput struct {
	Content     string    `json:"content" db:"content"`
	MilestoneID uuid.UUID `json:"milestoneID" db:"milestone_id"`
}

type MTOMilestoneNoteUpdateInput struct {
	Content string    `json:"content" db:"content"`
	ID      uuid.UUID `json:"id" db:"id"`
}

type MTOMilestoneNoteDeleteInput struct {
	ID uuid.UUID `json:"id" db:"id"`
}

func NewMTOMilestoneNote(createdBy uuid.UUID, content string, milestoneID uuid.UUID, modelPlanID uuid.UUID) *MTOMilestoneNote {
	return &MTOMilestoneNote{
		MilestoneID:       milestoneID,
		Content:           content,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}
