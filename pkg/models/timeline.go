package models

import (
	"time"
)

// Timeline represents the "timeline" section of a plan
type Timeline struct {
	baseTaskListSection

	CompleteICIP            *time.Time `json:"completeICIP" db:"complete_icip" statusWeight:"1"`
	ClearanceStarts         *time.Time `json:"clearanceStarts" db:"clearance_starts" statusWeight:"1"`
	ClearanceEnds           *time.Time `json:"clearanceEnds" db:"clearance_ends" statusWeight:"1"`
	Announced               *time.Time `json:"announced" db:"announced" statusWeight:"1"`
	ApplicationsStart       *time.Time `json:"applicationsStart" db:"applications_starts" statusWeight:"1"`
	ApplicationsEnd         *time.Time `json:"applicationsEnd" db:"applications_ends" statusWeight:"1"`
	PerformancePeriodStarts *time.Time `json:"performancePeriodStarts" db:"performance_period_starts" statusWeight:"1"`
	PerformancePeriodEnds   *time.Time `json:"performancePeriodEnds" db:"performance_period_ends" statusWeight:"1"`
	WrapUpEnds              *time.Time `json:"wrapUpEnds" db:"wrap_up_ends" statusWeight:"1"`
	HighLevelNote           *string    `json:"highLevelNote" db:"high_level_note"`
}

// NewTimeline returns a new timeline object
func NewTimeline(tls baseTaskListSection) *Timeline {
	return &Timeline{
		baseTaskListSection: tls,
	}
}
