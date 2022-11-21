package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
)

// AnalyzedAudit represents a analyzed_audit to a table row in the database
type AnalyzedAudit struct {
	baseStruct
	modelPlanRelation
	Date    time.Time           `json:"date" db:"date"`
	Changes AnalyzedAuditChange `json:"changes" db:"changes"`
}

// AnalyzedModelPlan represents an AnalyzedModelPlan in an AnalyzedAuditChange
type AnalyzedModelPlan struct {
	NameChange    AuditField
	StatusChanges []string
}

// AnalyzedDocuments represents an AnalyzedDocuments in an AnalyzedAuditChange
type AnalyzedDocuments struct {
	Count int
}

// AnalyzedCrTdls represents an AnalyzedCrTdls in an AnalyzedAuditChange
type AnalyzedCrTdls struct {
	Activity bool
}

// AnalyzedPlanSections represents an AnalyzedPlanSections in an AnalyzedAuditChange
type AnalyzedPlanSections struct {
	Updated           []string
	ReadyForReview    []string
	ReadyForClearance []string
}

// AnalyzedPlanCollaborators represents an AnalyzedPlanCollaborators in an AnalyzedAuditChange
type AnalyzedPlanCollaborators struct {
	Added []string
}

// AnalyzedPlanDiscussions represents an AnalyzedPlanDiscussions in an AnalyzedAuditChange
type AnalyzedPlanDiscussions struct {
	Activity bool
}

// AnalyzedAuditChange represents Changes in an AnalyzedAudit
type AnalyzedAuditChange struct {
	ModelPlan         *AnalyzedModelPlan
	Documents         *AnalyzedDocuments
	CrTdls            *AnalyzedCrTdls
	PlanSections      *AnalyzedPlanSections
	PlanCollaborators *AnalyzedPlanCollaborators
	PlanDiscussions   *AnalyzedPlanDiscussions
}

// NewAnalyzedAudit returns a new AnalyzedAudit object
func NewAnalyzedAudit(createdBy string, modelPlanID uuid.UUID, date time.Time, changes AnalyzedAuditChange) (*AnalyzedAudit, error) {
	return &AnalyzedAudit{
		Date:              date,
		Changes:           changes,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}, nil
}

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (a *AnalyzedAuditChange) Scan(src interface{}) error {
	if src == nil {
		return nil
	}
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}
	err := json.Unmarshal(source, a)
	if err != nil {
		return err
	}

	return nil
}

// Value let's the SQL driver transform the data to the AuditFields type
func (a AnalyzedAuditChange) Value() (driver.Value, error) {
	j, err := json.Marshal(a)
	return j, err
}
