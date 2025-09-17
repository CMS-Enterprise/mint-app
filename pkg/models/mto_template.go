package models

import (
	"time"

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

// MTOTemplate Represents a Master Template of MTO that can be applied to a Model Plan
type MTOTemplate struct {
	baseStruct
	modelPlanRelation

	Key         MTOTemplateKey `json:"key"         db:"key"`
	Name        string         `json:"name"        db:"name"`
	Description *string        `json:"description" db:"description"`

	// Convenience counts (not persisted, filled in resolvers)
	CategoryCount        int `json:"categoryCount"  db:"-"`
	PrimaryCategoryCount int `json:"primaryCategoryCount"  db:"-"`
	MilestoneCount       int `json:"milestoneCount" db:"-"`
	SolutionCount        int `json:"solutionCount"  db:"-"`

	// Indicates if the template is added to a model plan (not persisted, filled in by join in database)
	IsAdded   bool       `json:"isAdded" db:"is_added"`
	DateAdded *time.Time `json:"dateAdded" db:"date_added"`
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
