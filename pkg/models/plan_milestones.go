package models

import (
	"time"
)

// PlanMilestones represents the "plan milestones" section of a plan
type PlanMilestones struct {
	BaseTaskListSection

	CompleteICIP    *time.Time `json:"completeICIP" db:"complete_icip" statusWeight:"1"`
	ClearanceStarts *time.Time `json:"clearanceStarts" db:"clearance_starts" statusWeight:"1"`
	ClearanceEnds   *time.Time `json:"clearanceEnds" db:"clearance_ends" statusWeight:"1"`

	Announced *time.Time `json:"announced" db:"announced" statusWeight:"1"`

	ApplicationsStart *time.Time `json:"applicationsStart" db:"applications_starts" statusWeight:"1"`
	ApplicationsEnd   *time.Time `json:"applicationsEnd" db:"applications_ends" statusWeight:"1"`

	PerformancePeriodStarts *time.Time `json:"performancePeriodStarts" db:"performance_period_starts" statusWeight:"1"`
	PerformancePeriodEnds   *time.Time `json:"performancePeriodEnds" db:"performance_period_ends" statusWeight:"1"`
	WrapUpEnds              *time.Time `json:"wrapUpEnds" db:"wrap_up_ends" statusWeight:"1"`
	HighLevelNote           *string    `json:"highLevelNote" db:"high_level_note"`

	PhasedIn     *bool   `json:"phasedIn" db:"phased_in" statusWeight:"1"` //default to false
	PhasedInNote *string `json:"phasedInNote" db:"phased_in_note"`
}
