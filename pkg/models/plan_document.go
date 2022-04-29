package models

import (
	"github.com/google/uuid"
	"time"
)

type PlanDocument struct {
	ID          uuid.UUID `json:"id" db:"id"`
	ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

	FileType *string `json:"fileType" db:"file_type"`
	Bucket   *string `json:"bucket" db:"bucket"`
	FileKey  *string `json:"fileKey" db:"file_key"`

	VirusScanned bool `json:"virusScanned" db:"virus_scanned"`
	VirusClean   bool `json:"virusClean" db:"virus_clean"`

	FileName             *string    `json:"fileName" db:"file_name"`
	FileSize             int        `json:"fileSize" db:"file_size"`
	DocumentType         *string    `json:"documentType" db:"document_type"`
	OtherTypeDescription *string    `json:"otherType" db:"other_type"`
	DeletedAt            *time.Time `json:"deletedAt" db:"deleted_at"`

	CreatedBy   *string    `json:"createdBy" db:"created_by"`
	CreatedDts  *time.Time `json:"createdDts" db:"created_dts"`
	ModifiedBy  *string    `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
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
