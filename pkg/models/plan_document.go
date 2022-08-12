package models

import (
	"time"
)

// PlanDocument represents a document attached to the plan
type PlanDocument struct {
	BaseStruct
	ModelPlanRelation
	// ModelPlanID uuid.UUID `json:"modelPlanID" db:"model_plan_id"`

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
