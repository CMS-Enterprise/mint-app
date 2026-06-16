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

var AllCustomTimelineDateType = []CustomTimelineDateType{
	CustomTimelineDateTypeSingle,
	CustomTimelineDateTypeRange,
}

type CustomTimelineDate struct {
	baseStruct
	modelPlanRelation

	ID          uuid.UUID              `json:"id"`
	Title       string                 `json:"title"`
	Description *string                `json:"description,omitempty"`
	DateType    CustomTimelineDateType `json:"dateType"`
	StartDate   time.Time              `json:"startDate"`
	EndDate     *time.Time             `json:"endDate,omitempty"`
}
