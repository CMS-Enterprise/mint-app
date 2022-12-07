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

// AnalyzedModelLeads represents an AnalyzedPlanCollaborators in an AnalyzedAuditChange
type AnalyzedModelLeads struct {
	Added []string `json:"added"`
}

// AnalyzedPlanDiscussions represents an AnalyzedPlanDiscussions in an AnalyzedAuditChange
type AnalyzedPlanDiscussions struct {
	Activity bool `json:"activity" db:"activity"`
}

// AnalyzedAuditChange represents Changes in an AnalyzedAudit
type AnalyzedAuditChange struct {
	ModelPlan       *AnalyzedModelPlan       `json:"modelPlan"`
	Documents       *AnalyzedDocuments       `json:"documents"`
	CrTdls          *AnalyzedCrTdls          `json:"crTdls"`
	PlanSections    *AnalyzedPlanSections    `json:"planSections"`
	ModelLeads      *AnalyzedModelLeads      `json:"modelLeads"`
	PlanDiscussions *AnalyzedPlanDiscussions `json:"planDiscussion"`
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
func (a AnalyzedAuditChange) HumanizedSubset(size uint) []string {
	humanizedAuditChanges := a.Humanize()
	humanizedAuditChangesCount := len(humanizedAuditChanges)

	if humanizedAuditChangesCount > 5 {
		humanizedAuditChanges = lo.Subset(humanizedAuditChanges, 0, size)
		humanizedAuditChanges = append(humanizedAuditChanges, fmt.Sprintf("+%d more changes", humanizedAuditChangesCount-int(size)))
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

// Humanize returns AnalyzedModelPlan in human readable sentences
func (amp AnalyzedModelPlan) Humanize() []string {
	var humanizedNameChange string
	var humanizedStatusChanges []string

	if amp.NameChange.Old != nil {
		humanizedNameChange = fmt.Sprintf("The model has been renamed (previously %s)", amp.NameChange.Old.(string))
	}

	if len(amp.StatusChanges) > 0 {
		humanizedStatusChanges = lo.Map(amp.StatusChanges, func(status string, index int) string {
			switch status {
			case "PLAN_COMPLETE":
				return "The model plan is complete"
			case "ICIP_COMPLETE":
				return "The ICIP for this model is complete"
			case "INTERNAL_CMMI_CLEARANCE":
				return "This model is in internal (CMMI) clearance"
			case "CMS_CLEARANCE":
				return "This model is in CMS clearance"
			case "HHS_CLEARANCE":
				return "This model is in HHS clearance"
			case "OMB_ASRF_CLEARANCE":
				return "This model is in OMB/ASRF clearance"
			case "CLEARED":
				return "This model has been cleared"
			case "ANNOUNCED":
				return "This model has been announced"
			default:
				return ""
			}
		})
	}
	return append(humanizedStatusChanges, humanizedNameChange)
}

// Humanize returns AnalyzedDocuments in a human readable sentence
func (ad AnalyzedDocuments) Humanize() string {
	if ad.Count > 0 {
		return fmt.Sprintf("%d new documents have been uploaded", ad.Count)
	}

	return ""
}

// Humanize returns AnalyzedCrTdls in a human readable sentence
func (act AnalyzedCrTdls) Humanize() string {
	if act.Activity {
		return "Updates to CR/TDLs"
	}
	return ""
}

// Humanize returns AnalyzedPlanSections in human readable sentences
func (aps AnalyzedPlanSections) Humanize() []string {
	var humanizedAnalyzedPlanSections []string

	// Section updates
	if len(aps.Updated) > 0 {
		updatedSectionNames := lo.Map(aps.Updated, func(name string, index int) string {
			s := strings.Replace(name, "_", " ", -1)
			caser := cases.Title(language.AmericanEnglish)
			return caser.String(strings.Replace(s, "plan", "", -1))
		})
		humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("Updates to %s", strings.Join(updatedSectionNames, ",")))
	}

	// Ready for clearance
	if len(aps.ReadyForClearance) > 0 {
		updatedSectionNames := lo.Map(aps.ReadyForClearance, func(name string, index int) string {
			s := strings.Replace(name, "_", " ", -1)
			caser := cases.Title(language.AmericanEnglish)
			return caser.String(strings.Replace(s, "plan", "", -1))
		})
		if len(updatedSectionNames) == 1 {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s is ready for clearance", updatedSectionNames[0]))
		} else {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s are ready for clearance", strings.Join(updatedSectionNames, ",")))
		}
	}

	// Ready for review
	if len(aps.ReadyForReview) > 0 {
		updatedSectionNames := lo.Map(aps.ReadyForReview, func(name string, index int) string {
			s := strings.Replace(name, "_", " ", -1)
			caser := cases.Title(language.AmericanEnglish)
			return caser.String(strings.Replace(s, "plan", "", -1))
		})
		if len(updatedSectionNames) == 1 {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s is ready for clearance", updatedSectionNames[0]))
		} else {
			humanizedAnalyzedPlanSections = append(humanizedAnalyzedPlanSections, fmt.Sprintf("%s are ready for clearance", strings.Join(updatedSectionNames, ",")))
		}
	}
	return humanizedAnalyzedPlanSections
}

// Humanize returns AnalyzedModelLeads in human readable sentences
func (aml AnalyzedModelLeads) Humanize() []string {
	var humanizedAnalyzedModelLeads []string

	if len(aml.Added) > 0 {
		humanizedAnalyzedModelLeads = lo.Map(aml.Added, func(name string, index int) string {
			return fmt.Sprintf("%s has been addeed as a Model Lead", name)
		})
	}

	return humanizedAnalyzedModelLeads
}

// Humanize returns AnalyzedPlanDiscussions in a human readable sentence
func (aps AnalyzedPlanDiscussions) Humanize() string {
	if aps.Activity {
		return "New activity in Discussions"
	}

	return ""
}
