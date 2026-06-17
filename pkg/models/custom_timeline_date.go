package models

import (
	"time"
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
