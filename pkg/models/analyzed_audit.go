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
	NameChange    AuditField `json:"nameChange"`
	StatusChanges []string   `json:"statusChanges"`
}

// AnalyzedDocuments represents an AnalyzedDocuments in an AnalyzedAuditChange
type AnalyzedDocuments struct {
	Count int `json:"count"`
}

// AnalyzedCrTdls represents an AnalyzedCrTdls in an AnalyzedAuditChange
type AnalyzedCrTdls struct {
	Activity bool `json:"activity"`
}

// AnalyzedPlanSections represents an AnalyzedPlanSections in an AnalyzedAuditChange
type AnalyzedPlanSections struct {
	Updated           []string `json:"updated"`
	ReadyForReview    []string `json:"readyForReview"`
	ReadyForClearance []string `json:"readyForClearance"`
}

// AnalyzedPlanCollaborators represents an AnalyzedPlanCollaborators in an AnalyzedAuditChange
type AnalyzedPlanCollaborators struct {
	Added []string `json:"added"`
}

// AnalyzedPlanDiscussions represents an AnalyzedPlanDiscussions in an AnalyzedAuditChange
type AnalyzedPlanDiscussions struct {
	Activity bool `json:"activity" db:"activity"`
}

// AnalyzedAuditChange represents Changes in an AnalyzedAudit
type AnalyzedAuditChange struct {
	ModelPlan         *AnalyzedModelPlan         `json:"modelPlan"`
	Documents         *AnalyzedDocuments         `json:"documents"`
	CrTdls            *AnalyzedCrTdls            `json:"crTdls"`
	PlanSections      *AnalyzedPlanSections      `json:"planSections"`
	PlanCollaborators *AnalyzedPlanCollaborators `json:"planCollaborators"`
	PlanDiscussions   *AnalyzedPlanDiscussions   `json:"planDiscussion"`
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
