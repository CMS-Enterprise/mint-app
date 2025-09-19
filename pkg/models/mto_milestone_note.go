package models

import "github.com/google/uuid"

type MTOMilestoneNote struct {
	baseStruct
	modelPlanRelation

	MTOMilestoneID uuid.UUID `json:"mtoMilestoneID" db:"mto_milestone_id"`
	Content        string    `json:"content" db:"content"`
}

type MTOMilestoneNoteCreateInput struct {
	Content        string    `json:"content" db:"content"`
	MTOMilestoneID uuid.UUID `json:"mtoMilestoneID" db:"mto_milestone_id"`
}

type MTOMilestoneNoteUpdateInput struct {
	Content string    `json:"content" db:"content"`
	ID      uuid.UUID `json:"id" db:"id"`
}

type MTOMilestoneNoteDeleteInput struct {
	ID uuid.UUID `json:"id" db:"id"`
}

func NewMTOMilestoneNote(createdBy uuid.UUID, content string, mtoMilestoneID uuid.UUID, modelPlanID uuid.UUID) *MTOMilestoneNote {
	return &MTOMilestoneNote{
		MTOMilestoneID:    mtoMilestoneID,
		Content:           content,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}
