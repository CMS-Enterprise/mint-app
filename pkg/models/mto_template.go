package models

import (
	"github.com/google/uuid"
)

/* =========================
   Enum: MTO_TEMPLATE_KEY
   ========================= */

type MTOTemplateKey string

const (
	MTOTemplateKeyAcoAndKidneyModels                MTOTemplateKey = "ACO_AND_KIDNEY_MODELS"
	MTOTemplateKeyEpisodePrimaryCareAndNonAcoModels MTOTemplateKey = "EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS"
	MTOTemplateKeyMedicareAdvantageAndDrugModels    MTOTemplateKey = "MEDICARE_ADVANTAGE_AND_DRUG_MODELS"
	MTOTemplateKeyStandardCategories                MTOTemplateKey = "STANDARD_CATEGORIES"
	MTOTemplateKeyStateAndLocalModels               MTOTemplateKey = "STATE_AND_LOCAL_MODELS"
)

/* =========================
   Core: Template + children
   ========================= */

type MtoTemplate struct {
	baseStruct

	Key         MTOTemplateKey `json:"key"         db:"key"`
	Name        string         `json:"name"        db:"name"`
	Description *string        `json:"description" db:"description"`

	// Convenience counts (not persisted, filled in resolvers)
	CategoryCount  int `json:"categoryCount"  db:"-"`
	MilestoneCount int `json:"milestoneCount" db:"-"`
	SolutionCount  int `json:"solutionCount"  db:"-"`
}

type MtoTemplateCategory struct {
	baseStruct

	TemplateID uuid.UUID  `json:"templateID" db:"template_id"`
	Name       string     `json:"name"       db:"name"`
	ParentID   *uuid.UUID `json:"parentID"   db:"parent_id"`
	Order      int        `json:"order"      db:"order"`
}

type MtoTemplateMilestone struct {
	baseStruct

	TemplateID            uuid.UUID  `json:"templateID"            db:"template_id"`
	MtoCommonMilestoneKey string     `json:"mtoCommonMilestoneKey" db:"mto_common_milestone_key"`
	MtoTemplateCategoryID *uuid.UUID `json:"mtoTemplateCategoryID" db:"mto_template_category_id"`
}

type MtoTemplateSolution struct {
	baseStruct

	TemplateID          uuid.UUID `json:"templateID"         db:"template_id"`
	MtoCommonSolutionID uuid.UUID `json:"mtoCommonSolutionID" db:"mto_common_solution_id"`
}

// NewMtoTemplate returns a new MtoTemplate object
func NewMtoTemplate(
	createdBy uuid.UUID,
	key MTOTemplateKey,
	name string,
	description *string,
) *MtoTemplate {
	return &MtoTemplate{
		baseStruct:  NewBaseStruct(createdBy),
		Key:         key,
		Name:        name,
		Description: description,
	}
}
