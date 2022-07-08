package models

import (
	"time"

	"github.com/google/uuid"
)

// PlanDocument represents a document attached to the plan
type PlanDocument struct {
	BaseStruct
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	FileType string `json:"fileType" db:"file_type"`
	Bucket   string `json:"bucket" db:"bucket"`
	FileKey  string `json:"fileKey" db:"file_key"`

	VirusScanned bool `json:"virusScanned" db:"virus_scanned"`
	VirusClean   bool `json:"virusClean" db:"virus_clean"`

	FileName             string       `json:"fileName" db:"file_name"`
	FileSize             int          `json:"fileSize" db:"file_size"`
	DocumentType         DocumentType `json:"documentType" db:"document_type"`
	OtherTypeDescription *string      `json:"otherType" db:"other_type"`
	OptionalNotes        *string      `json:"optionalNotes" db:"optional_notes"`

	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
}

// GetModelTypeName returns a string name that represents the PlanMilestones struct
func (p PlanDocument) GetModelTypeName() string {
	return "Plan_Document"
}

// GetID returns the GetID property for a PlanMilestones struct
func (p PlanDocument) GetID() uuid.UUID {
	return p.ID
}

// GetPlanID returns the ModelPlanID property for a PlanMilestones struct
func (p PlanDocument) GetPlanID() uuid.UUID {
	return p.ModelPlanID
}

// GetModifiedBy returns the ModifiedBy property for a PlanMilestones struct
func (p PlanDocument) GetModifiedBy() *string {
	return p.ModifiedBy
}

// GetCreatedBy implements the CreatedBy property
func (p PlanDocument) GetCreatedBy() string {
	return p.CreatedBy
}
