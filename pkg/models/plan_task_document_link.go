package models

import "github.com/google/uuid"

// PlanTaskDocumentLink represents an attribution between a plan task and a plan document.
type PlanTaskDocumentLink struct {
	baseStruct

	PlanTaskID     uuid.UUID `json:"planTaskID" db:"plan_task_id"`
	PlanDocumentID uuid.UUID `json:"planDocumentID" db:"plan_document_id"`
}

// NewPlanTaskDocumentLink returns a new plan task document link.
func NewPlanTaskDocumentLink(createdBy uuid.UUID, planTaskID uuid.UUID, planDocumentID uuid.UUID) *PlanTaskDocumentLink {
	return &PlanTaskDocumentLink{
		baseStruct:     NewBaseStruct(createdBy),
		PlanTaskID:     planTaskID,
		PlanDocumentID: planDocumentID,
	}
}
