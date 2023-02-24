package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null/zero"
)

// PlanDocument represents a document attached to the plan
type PlanDocument struct {
	baseStruct
	modelPlanRelation

	FileType string `json:"fileType" db:"file_type"`
	Bucket   string `json:"bucket" db:"bucket"`
	FileKey  string `json:"fileKey" db:"file_key"`

	VirusScanned bool `json:"virusScanned" db:"virus_scanned"`
	VirusClean   bool `json:"virusClean" db:"virus_clean"`

	FileName             string       `json:"fileName" db:"file_name"`
	FileSize             int          `json:"fileSize" db:"file_size"`
	Restricted           bool         `json:"restricted" db:"restricted"`
	DocumentType         DocumentType `json:"documentType" db:"document_type"`
	OtherTypeDescription zero.String  `json:"otherType" db:"other_type"`
	OptionalNotes        zero.String  `json:"optionalNotes" db:"optional_notes"`

	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
}

// NewPlanDocument returns a new Plan Document
func NewPlanDocument(createdBy uuid.UUID, modelPlanID uuid.UUID, fileType string, bucket string, fileKey string, fileName string, fileSize int, documentType DocumentType, restricted bool, otherTypeDescription zero.String, optionalNotes zero.String) *PlanDocument {
	return &PlanDocument{
		modelPlanRelation:    NewModelPlanRelation(modelPlanID),
		baseStruct:           NewBaseStruct(createdBy),
		FileType:             fileType,
		Bucket:               bucket,
		FileKey:              fileKey,
		FileName:             fileName,
		FileSize:             fileSize,
		DocumentType:         documentType,
		Restricted:           restricted,
		OtherTypeDescription: otherTypeDescription,
		OptionalNotes:        optionalNotes,

		// Defaults
		VirusScanned: false,
		VirusClean:   false,
		DeletedAt:    nil, //TODO: What does this field even do?
	}
}
