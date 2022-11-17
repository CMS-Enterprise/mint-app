package models

import (
	"time"

	"github.com/google/uuid"
)

// AnalyzedAudit represents a analyzed_audit to a table row in the database
type AnalyzedAudit struct {
	baseStruct
	modelPlanRelation
	Date    time.Time      `json:"date" db:"date"`
	Changes []*AuditChange `json:"changes" db:"changes"`
}

// NewAnalyzedAudit returns a new AnalyzedAudit object
func NewAnalyzedAudit(createdBy string, modelPlanID uuid.UUID, date time.Time, changes []*AuditChange) (*AnalyzedAudit, error) {
	return &AnalyzedAudit{
		Date:              date,
		Changes:           changes,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}, nil
}
