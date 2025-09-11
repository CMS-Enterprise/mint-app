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

type MTOTemplate struct {
	baseStruct

	Key         MTOTemplateKey `json:"key"         db:"key"`
	Name        string         `json:"name"        db:"name"`
	Description *string        `json:"description" db:"description"`

	// Convenience counts (not persisted, filled in resolvers)
	CategoryCount  int `json:"categoryCount"  db:"-"`
	MilestoneCount int `json:"milestoneCount" db:"-"`
	SolutionCount  int `json:"solutionCount"  db:"-"`
}

type MTOTemplateCategory struct {
	baseStruct

	TemplateID uuid.UUID  `json:"templateID" db:"template_id"`
	Name       string     `json:"name"       db:"name"`
	ParentID   *uuid.UUID `json:"parentID"   db:"parent_id"`
	Order      int        `json:"order"      db:"order"`
}

type MTOTemplateSubCategory struct {
	baseStruct

	TemplateID uuid.UUID  `json:"templateID" db:"template_id"`
	Name       string     `json:"name"       db:"name"`
	ParentID   *uuid.UUID `json:"parentID"   db:"parent_id"`
	Order      int        `json:"order"      db:"order"`
}

type MTOTemplateMilestone struct {
	baseStruct

	Name                  string                `json:"name"                  db:"name"`
	TemplateID            uuid.UUID             `json:"templateID"            db:"template_id"`
	Key                   MTOCommonMilestoneKey `json:"key" db:"key"`
	MTOTemplateCategoryID *uuid.UUID            `json:"mtoTemplateCategoryID" db:"mto_template_category_id"`
}

type MTOTemplateSolution struct {
	baseStruct

	Name                string               `json:"name"               db:"name"`
	Key                 MTOCommonSolutionKey `json:"key"                db:"key"`
	TemplateID          uuid.UUID            `json:"templateID"         db:"template_id"`
	MTOCommonSolutionID uuid.UUID            `json:"mtoCommonSolutionID" db:"mto_common_solution_id"`
}

// NewMtoTemplate returns a new MtoTemplate object
func NewMTOTemplate(
	createdBy uuid.UUID,
	key MTOTemplateKey,
	name string,
	description *string,
) *MTOTemplate {
	return &MTOTemplate{
		baseStruct:  NewBaseStruct(createdBy),
		Key:         key,
		Name:        name,
		Description: description,
	}
}

// NewMTOTemplateCategory returns a new MTOTemplateCategory object
func NewMTOTemplateCategory(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	name string,
	parentID *uuid.UUID,
	order int,
) *MTOTemplateCategory {
	return &MTOTemplateCategory{
		baseStruct: NewBaseStruct(createdBy),
		TemplateID: templateID,
		Name:       name,
		ParentID:   parentID,
		Order:      order,
	}
}

// NewMTOTemplateSubCategory returns a new MTOTemplateSubCategory object
func NewMTOTemplateSubCategory(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	name string,
	order int,
) *MTOTemplateSubCategory {
	return &MTOTemplateSubCategory{
		baseStruct: NewBaseStruct(createdBy),
		TemplateID: templateID,
		Name:       name,
		Order:      order,
	}
}

// NewMTOTemplateMilestone returns a new MTOTemplateMilestone object
func NewMTOTemplateMilestone(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	mtoCommonMilestoneKey MTOCommonMilestoneKey,
	mtoTemplateCategoryID *uuid.UUID,
) *MTOTemplateMilestone {
	return &MTOTemplateMilestone{
		baseStruct:            NewBaseStruct(createdBy),
		TemplateID:            templateID,
		Key:                   mtoCommonMilestoneKey,
		MTOTemplateCategoryID: mtoTemplateCategoryID,
	}
}

// NewMTOTemplateSolution returns a new MTOTemplateSolution object
func NewMTOTemplateSolution(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	mtoCommonSolutionID uuid.UUID,
) *MTOTemplateSolution {
	return &MTOTemplateSolution{
		baseStruct:          NewBaseStruct(createdBy),
		TemplateID:          templateID,
		MTOCommonSolutionID: mtoCommonSolutionID,
	}
}
