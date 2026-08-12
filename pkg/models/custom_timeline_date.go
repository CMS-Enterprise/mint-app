package models

import (
	"time"

	"github.com/google/uuid"
)

type CustomTimelineDateType string

const (
	CustomTimelineDateTypeSingle CustomTimelineDateType = "SINGLE"
	CustomTimelineDateTypeRange  CustomTimelineDateType = "RANGE"
)

type CustomTimelineDate struct {
	baseStruct
	modelPlanRelation

	Title       string                 `json:"title" db:"title"`
	Description *string                `json:"description,omitempty" db:"description"`
	DateType    CustomTimelineDateType `json:"dateType" db:"date_type"`
	StartDate   time.Time              `json:"startDate" db:"start_date"`
	EndDate     *time.Time             `json:"endDate,omitempty" db:"end_date"`
}

// NewCustomTimelineDate returns a new custom timeline date.
func NewCustomTimelineDate(createdBy uuid.UUID, modelPlanID uuid.UUID) *CustomTimelineDate {
	return &CustomTimelineDate{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
	}
}
