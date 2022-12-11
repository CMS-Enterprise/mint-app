package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// AnalyzedAudit represents a analyzed_audit to a table row in the database
type AnalyzedAudit struct {
	baseStruct
	modelPlanRelation
	ModelName string              `json:"modelName" db:"model_name"`
	Date      time.Time           `json:"date" db:"date"`
	Changes   AnalyzedAuditChange `json:"changes" db:"changes"`
}

// NewAnalyzedAudit returns a new AnalyzedAudit object
func NewAnalyzedAudit(createdBy string, modelPlanID uuid.UUID, modelName string, date time.Time, changes AnalyzedAuditChange) (*AnalyzedAudit, error) {
	return &AnalyzedAudit{
		Date:              date,
		Changes:           changes,
		ModelName:         modelName,
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}, nil
}

// AnalyzedAuditChange represents Changes in an AnalyzedAudit
type AnalyzedAuditChange struct {
	ModelPlan       *AnalyzedModelPlan       `json:"modelPlan,omitempty"`
	Documents       *AnalyzedDocuments       `json:"documents,omitempty"`
	CrTdls          *AnalyzedCrTdls          `json:"crTdls,omitempty"`
	PlanSections    *AnalyzedPlanSections    `json:"planSections,omitempty"`
	ModelLeads      *AnalyzedModelLeads      `json:"modelLeads,omitempty"`
	PlanDiscussions *AnalyzedPlanDiscussions `json:"planDiscussion,omitempty"`
}

// IsEmpty returns if AnalyzedAuditChange struct is empty
func (a AnalyzedAuditChange) IsEmpty() bool {
	return a == AnalyzedAuditChange{}
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

// Value let's the SQL driver transform the data to the AnalyzedAuditChange type
func (a AnalyzedAuditChange) Value() (driver.Value, error) {
	j, err := json.Marshal(a)
	return j, err
}

// HumanizedSubset returns a subset of length size of humanized audit changes
func (a AnalyzedAuditChange) HumanizedSubset(size int) []string {
	humanizedAuditChanges := a.Humanize()
	humanizedAuditChangesCount := len(humanizedAuditChanges)

	if humanizedAuditChangesCount > 5 {
		humanizedAuditChanges = lo.Subset(humanizedAuditChanges, 0, uint(size))
		humanizedAuditChanges = append(humanizedAuditChanges, fmt.Sprintf("+%d more changes", humanizedAuditChangesCount-size))
	}
	return humanizedAuditChanges
}

// Humanize returns AnalyzedAuditChanges in human readable sentences
func (a AnalyzedAuditChange) Humanize() []string {
	var humanizedAuditChanges []string

	humanizedAuditChanges = append(humanizedAuditChanges, a.ModelPlan.Humanize()...)
	humanizedAuditChanges = append(humanizedAuditChanges, a.PlanSections.Humanize()...)
	humanizedAuditChanges = append(humanizedAuditChanges, a.ModelLeads.Humanize()...)

	humanizedAuditChanges = append(humanizedAuditChanges, a.Documents.Humanize())
	humanizedAuditChanges = append(humanizedAuditChanges, a.CrTdls.Humanize())
	humanizedAuditChanges = append(humanizedAuditChanges, a.PlanDiscussions.Humanize())

	return lo.WithoutEmpty(humanizedAuditChanges)
}

// AnalyzedModelPlan represents an AnalyzedModelPlan in an AnalyzedAuditChange
type AnalyzedModelPlan struct {
	OldName       string   `json:"nameChange,omitempty"`
	StatusChanges []string `json:"statusChanges,omitempty"`
}

// Humanize returns AnalyzedModelPlan in human readable sentences
func (a AnalyzedModelPlan) Humanize() []string {
	var humanizedOldName string
	var humanizedStatusChanges []string

	if a.OldName != "" {
		humanizedOldName = fmt.Sprintf("The model has been renamed (previously %s)", a.OldName)
	}

	if len(a.StatusChanges) > 0 {
		humanizedStatusChanges = lo.Map(a.StatusChanges, func(status string, index int) string {
			switch status {
			case string(ModelStatusPlanComplete):
				return "The model plan is complete"
			case string(ModelStatusIcipComplete):
				return "The ICIP for this model is complete"
			case string(ModelStatusInternalCmmiClearance):
				return "This model is in internal (CMMI) clearance"
			case string(ModelStatusCmsClearance):
				return "This model is in CMS clearance"
			case string(ModelStatusHhsClearance):
				return "This model is in HHS clearance"
			case string(ModelStatusOmbAsrfClearance):
				return "This model is in OMB/ASRF clearance"
			case string(ModelStatusCleared):
				return "This model has been cleared"
			case string(ModelStatusPlanDraft):
				return "This model has been announced"
			default:
				return ""
			}
		})
	}
	return append(humanizedStatusChanges, humanizedOldName)
}

// IsEmpty returns if AnalyzedModelPlan fields are empty
func (a AnalyzedModelPlan) IsEmpty() bool {
	return len(a.StatusChanges) == 0 && a.OldName == ""
}

// AnalyzedDocuments represents an AnalyzedDocuments in an AnalyzedAuditChange
type AnalyzedDocuments struct {
	Count int `json:"count,omitempty"`
}

// Humanize returns AnalyzedDocuments in a human readable sentence
func (a AnalyzedDocuments) Humanize() string {
	if a.Count > 0 {
		return fmt.Sprintf("%d new documents have been uploaded", a.Count)
	}

	return ""
}

// AnalyzedCrTdls represents an AnalyzedCrTdls in an AnalyzedAuditChange
type AnalyzedCrTdls struct {
	Activity bool `json:"activity,omitempty"`
}

// Humanize returns AnalyzedCrTdls in a human readable sentence
func (a AnalyzedCrTdls) Humanize() string {
	if a.Activity {
		return "Updates to CR/TDLs"
	}

	return ""
}

// AnalyzedPlanSections represents an AnalyzedPlanSections in an AnalyzedAuditChange
type AnalyzedPlanSections struct {
	Updated           []string `json:"updated,omitempty"`
	ReadyForReview    []string `json:"readyForReview,omitempty"`
	ReadyForClearance []string `json:"readyForClearance,omitempty"`
}

// IsEmpty returns if AnalyzedPlanSections fields are empty
func (a AnalyzedPlanSections) IsEmpty() bool {
	return len(a.ReadyForClearance) == 0 &&
		len(a.ReadyForReview) == 0 &&
		len(a.Updated) == 0
}

// Humanize returns AnalyzedPlanSections in human readable sentences
func (a AnalyzedPlanSections) Humanize() []string {
	var humanizedAnalyzedPlanSections []string

	// Section updates
	if len(a.Updated) > 0 {
		updatedSectionNames := lo.Map(a.Updated, func(name string, index int) string {
			s := strings.Replace(name, "_", " ", -1)
			caser := cases.Title(language.AmericanEnglish)
			return strings.Trim(caser.String(strings.Replace(s, "plan", "", -1)), " ")
		})
		humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("Updates to %s", strings.Join(updatedSectionNames, ", ")))
	}

	// Ready for clearance
	if len(a.ReadyForClearance) > 0 {
		updatedSectionNames := lo.Map(a.ReadyForClearance, func(name string, index int) string {
			s := strings.Replace(name, "_", " ", -1)
			caser := cases.Title(language.AmericanEnglish)
			return strings.Trim(caser.String(strings.Replace(s, "plan", "", -1)), " ")
		})
		if len(updatedSectionNames) == 1 {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s is ready for clearance", updatedSectionNames[0]))
		} else {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s are ready for clearance", strings.Join(updatedSectionNames, ", ")))
		}
	}

	// Ready for review
	if len(a.ReadyForReview) > 0 {
		updatedSectionNames := lo.Map(a.ReadyForReview, func(name string, index int) string {
			s := strings.Replace(name, "_", " ", -1)
			caser := cases.Title(language.AmericanEnglish)
			return strings.Trim(caser.String(strings.Replace(s, "plan", "", -1)), " ")
		})
		if len(updatedSectionNames) == 1 {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s is ready for clearance", updatedSectionNames[0]))
		} else {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s are ready for clearance", strings.Join(updatedSectionNames, ", ")))
		}
	}
	return humanizedAnalyzedPlanSections
}

// AnalyzedModelLeads represents an AnalyzedModelLeads in an AnalyzedAuditChange
type AnalyzedModelLeads struct {
	Added []string `json:"added,omitempty"`
}

// Humanize returns AnalyzedModelLeads in human readable sentences
func (a AnalyzedModelLeads) Humanize() []string {
	var humanizedAnalyzedModelLeads []string

	if len(a.Added) > 0 {
		humanizedAnalyzedModelLeads = lo.Map(a.Added, func(name string, index int) string {
			return fmt.Sprintf("%s has been addeed as a Model Lead", name)
		})
	}

	return humanizedAnalyzedModelLeads
}

// AnalyzedPlanDiscussions represents an AnalyzedPlanDiscussions in an AnalyzedAuditChange
type AnalyzedPlanDiscussions struct {
	Activity bool `json:"activity,omitempty"`
}

// Humanize returns AnalyzedPlanDiscussions in a human readable sentence
func (a AnalyzedPlanDiscussions) Humanize() string {
	if a.Activity {
		return "New activity in Discussions"
	}

	return ""
}
