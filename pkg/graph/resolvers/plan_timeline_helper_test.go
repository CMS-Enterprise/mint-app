package resolvers

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/cms-enterprise/mint-app/pkg/email"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanTimelineDateProcessorExtractChangedDates() {

	// Set up some test times
	t1, _ := time.Parse(time.RFC3339, "2024-01-01T00:00:00Z")
	t2, _ := time.Parse(time.RFC3339, "2024-02-02T00:00:00Z")

	// Define a default existing PlanTimeline object
	defaultExisting := &models.PlanTimeline{
		CompleteICIP:            &t1,
		ClearanceStarts:         &t1,
		ClearanceEnds:           &t1,
		Announced:               &t1,
		ApplicationsStart:       &t1,
		ApplicationsEnd:         &t1,
		PerformancePeriodStarts: &t1,
		PerformancePeriodEnds:   &t1,
		WrapUpEnds:              &t1,
	}

	testCases := []struct {
		name     string
		changes  map[string]interface{}
		existing *models.PlanTimeline
		expected map[string]email.DateChange
	}{
		// No fields changed
		{
			name:     "No fields changed",
			changes:  map[string]interface{}{},
			existing: defaultExisting,
			expected: map[string]email.DateChange{},
		},
		// Single field changed
		{
			name: "Single field changed",
			changes: map[string]interface{}{
				"performancePeriodStarts": t2.Format(time.RFC3339),
			},
			existing: defaultExisting,
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field:   getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getTimelineFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: defaultExisting.PerformancePeriodStarts,
					OldRangeEnd:   defaultExisting.PerformancePeriodEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   defaultExisting.PerformancePeriodEnds,
				},
				"wrapUpEnds": {
					Field:   getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
					OldDate: &t1,
				},
			},
		},
		// Incorrect field name
		{
			name: "Incorrect field name",
			changes: map[string]interface{}{
				"wrongField": t2.Format(time.RFC3339),
			},
			existing: defaultExisting,
			expected: map[string]email.DateChange{},
		},
		// All fields changed
		{
			name: "All fields changed",
			changes: map[string]interface{}{
				"completeICIP":            t2.Format(time.RFC3339),
				"clearanceStarts":         t2.Format(time.RFC3339),
				"clearanceEnds":           t2.Format(time.RFC3339),
				"announced":               t2.Format(time.RFC3339),
				"applicationsStart":       t2.Format(time.RFC3339),
				"applicationsEnd":         t2.Format(time.RFC3339),
				"performancePeriodStarts": t2.Format(time.RFC3339),
				"performancePeriodEnds":   t2.Format(time.RFC3339),
				"wrapUpEnds":              t2.Format(time.RFC3339),
			},
			existing: defaultExisting,
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field:     getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
					IsChanged: true,
					OldDate:   defaultExisting.CompleteICIP,
					NewDate:   &t2,
				},
				"clearance": {
					Field:         getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: defaultExisting.ClearanceStarts,
					OldRangeEnd:   defaultExisting.ClearanceEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"announced": {
					Field:     getTimelineFieldDataMap()["announced"].HumanReadableName,
					IsChanged: true,
					OldDate:   defaultExisting.Announced,
					NewDate:   &t2,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: defaultExisting.ApplicationsStart,
					OldRangeEnd:   defaultExisting.ApplicationsEnd,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"performancePeriod": {
					Field:         getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: defaultExisting.PerformancePeriodStarts,
					OldRangeEnd:   defaultExisting.PerformancePeriodEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"wrapUpEnds": {
					Field:     getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
					IsChanged: true,
					OldDate:   defaultExisting.WrapUpEnds,
					NewDate:   &t2,
				},
			},
		},
		// Field was nil initially
		{
			name: "Field was nil initially",
			changes: map[string]interface{}{
				"wrapUpEnds": t1.Format(time.RFC3339),
			},
			existing: &models.PlanTimeline{
				CompleteICIP:            &t1,
				ClearanceStarts:         &t1,
				ClearanceEnds:           &t1,
				Announced:               &t1,
				ApplicationsStart:       &t1,
				ApplicationsEnd:         &t1,
				PerformancePeriodStarts: &t1,
				PerformancePeriodEnds:   &t1,
				WrapUpEnds:              nil,
			},
			expected: map[string]email.DateChange{
				"announced": {
					Field:   getTimelineFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"clearance": {
					Field:         getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"completeICIP": {
					Field:   getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"performancePeriod": {
					Field:         getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:     getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
					IsChanged: true,
					NewDate:   &t1,
				},
			},
		},
		// Single date field from nil to non-nil
		{
			name: "Single date field from nil to non-nil",
			changes: map[string]interface{}{
				"announced": t2.Format(time.RFC3339),
			},
			existing: &models.PlanTimeline{},
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field: getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field:     getTimelineFieldDataMap()["announced"].HumanReadableName,
					IsChanged: true,
					NewDate:   &t2,
				},
				"applications": {
					Field:   getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange: true,
				},
				"performancePeriod": {
					Field:   getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
				},
			},
		},
		// Single date field from non-nil to nil
		{
			name: "Single date field from non-nil to nil",
			changes: map[string]interface{}{
				"announced": nil,
			},
			existing: defaultExisting,
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field:   getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:     getTimelineFieldDataMap()["announced"].HumanReadableName,
					IsChanged: true,
					OldDate:   &t1,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
					OldDate: &t1,
				},
			},
		},
		// Range begin date from nil to non-nil
		{
			name: "Range begin date from nil to non-nil",
			changes: map[string]interface{}{
				"applicationsStart": t2.Format(time.RFC3339),
			},
			existing: &models.PlanTimeline{},
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field: getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field: getTimelineFieldDataMap()["announced"].HumanReadableName,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					NewRangeStart: &t2,
				},
				"performancePeriod": {
					Field:   getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
				},
			},
		},
		// Range end date from nil to non-nil
		{
			name: "Range end date from nil to non-nil",
			changes: map[string]interface{}{
				"applicationsEnd": t2.Format(time.RFC3339),
			},
			existing: &models.PlanTimeline{},
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field: getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field: getTimelineFieldDataMap()["announced"].HumanReadableName,
				},
				"applications": {
					Field:       getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:   true,
					IsRange:     true,
					NewRangeEnd: &t2,
				},
				"performancePeriod": {
					Field:   getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
				},
			},
		},
		// Range begin date from non-nil to nil
		{
			name: "Range begin date from non-nil to nil",
			changes: map[string]interface{}{
				"applicationsStart": nil,
			},
			existing: defaultExisting,
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field:   getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getTimelineFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
					NewRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
					OldDate: &t1,
				},
			},
		},
		// Range end date from non-nil to nil
		{
			name: "Range end date from non-nil to nil",
			changes: map[string]interface{}{
				"applicationsEnd": nil,
			},
			existing: defaultExisting,
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field:   getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getTimelineFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
					NewRangeStart: &t1,
				},
				"performancePeriod": {
					Field:         getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
					OldDate: &t1,
				},
			},
		},
		// Range both dates from nil to non-nil
		{
			name: "Range both dates from nil to non-nil",
			changes: map[string]interface{}{
				"applicationsStart": t2.Format(time.RFC3339),
				"applicationsEnd":   t2.Format(time.RFC3339),
			},
			existing: &models.PlanTimeline{},
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field: getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field: getTimelineFieldDataMap()["announced"].HumanReadableName,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"performancePeriod": {
					Field:   getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
				},
			},
		},
		// Range both dates from non-nil to nil
		{
			name: "Range both dates from non-nil to nil",
			changes: map[string]interface{}{
				"applicationsStart": nil,
				"applicationsEnd":   nil,
			},
			existing: defaultExisting,
			expected: map[string]email.DateChange{
				"completeICIP": {
					Field:   getTimelineFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getTimelineFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getTimelineFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getTimelineFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getTimelineFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getTimelineFieldDataMap()["wrapUpEnds"].HumanReadableName,
					OldDate: &t1,
				},
			},
		},
	}

	for _, tc := range testCases {
		suite.Run(tc.name, func() {
			dp, _ := NewPlanTimelineDateProcessor(tc.changes, tc.existing)
			changes, _ := dp.ExtractPlanTimelineChangedDates()
			suite.Equal(tc.expected, changes)
		})
	}
}

func TestGetUpcomingPlanTimelineDate(t *testing.T) {
	now := time.Now()
	past := now.Add(-24 * time.Hour)
	future1 := now.Add(24 * time.Hour)
	future2 := now.Add(48 * time.Hour)

	// All fields nil
	planTimeline := &models.PlanTimeline{}
	result, err := getUpcomingPlanTimelineDate(planTimeline)
	assert.NoError(t, err)
	assert.Nil(t, result)

	// All fields in the past
	planTimeline = &models.PlanTimeline{
		CompleteICIP:            &past,
		ClearanceStarts:         &past,
		ClearanceEnds:           &past,
		Announced:               &past,
		ApplicationsStart:       &past,
		ApplicationsEnd:         &past,
		PerformancePeriodStarts: &past,
		PerformancePeriodEnds:   &past,
		WrapUpEnds:              &past,
	}
	result, err = getUpcomingPlanTimelineDate(planTimeline)
	assert.NoError(t, err)
	assert.Nil(t, result)

	// Only one future date
	planTimeline = &models.PlanTimeline{
		Announced: &future1,
	}
	result, err = getUpcomingPlanTimelineDate(planTimeline)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.WithinDuration(t, future1, result.Date, time.Second)
	assert.Equal(t, "announced", result.DateField)

	// Multiple future dates, pick nearest
	planTimeline = &models.PlanTimeline{
		CompleteICIP:    &future2,
		ClearanceStarts: &future1,
		WrapUpEnds:      &future2,
	}
	result, err = getUpcomingPlanTimelineDate(planTimeline)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.WithinDuration(t, future1, result.Date, time.Second)
	assert.Equal(t, "clearanceStarts", result.DateField)

	// Mix of past and future, pick nearest future
	planTimeline = &models.PlanTimeline{
		CompleteICIP:    &past,
		ClearanceStarts: &future2,
		Announced:       &future1,
	}
	result, err = getUpcomingPlanTimelineDate(planTimeline)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.WithinDuration(t, future1, result.Date, time.Second)
	assert.Equal(t, "announced", result.DateField)

	// All dates in the future, pick the earliest
	planTimeline = &models.PlanTimeline{
		CompleteICIP:            &future2,
		ClearanceStarts:         &future2,
		ClearanceEnds:           &future1,
		Announced:               &future2,
		ApplicationsStart:       &future2,
		ApplicationsEnd:         &future2,
		PerformancePeriodStarts: &future2,
		PerformancePeriodEnds:   &future2,
		WrapUpEnds:              &future2,
	}
	result, err = getUpcomingPlanTimelineDate(planTimeline)
	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.WithinDuration(t, future1, result.Date, time.Second)
	assert.Equal(t, "clearanceEnds", result.DateField)

	// Only one date is exactly now (should not count as future)
	planTimeline = &models.PlanTimeline{
		CompleteICIP: &now,
	}
	result, err = getUpcomingPlanTimelineDate(planTimeline)
	assert.NoError(t, err)
	assert.Nil(t, result)
}

func TestCountPopulatedPlanTimelineDates(t *testing.T) {
	now := time.Now()

	// All fields nil
	planTimeline := &models.PlanTimeline{}
	count, err := countPopulatedPlanTimelineDates(planTimeline)
	assert.NoError(t, err)
	assert.Equal(t, 0, count)

	// One field populated
	planTimeline = &models.PlanTimeline{
		Announced: &now,
	}
	count, err = countPopulatedPlanTimelineDates(planTimeline)
	assert.NoError(t, err)
	assert.Equal(t, 1, count)

	// Multiple fields populated
	planTimeline = &models.PlanTimeline{
		Announced:       &now,
		ClearanceStarts: &now,
		WrapUpEnds:      &now,
	}
	count, err = countPopulatedPlanTimelineDates(planTimeline)
	assert.NoError(t, err)
	assert.Equal(t, 3, count)

	// All fields populated
	planTimeline = &models.PlanTimeline{
		CompleteICIP:            &now,
		ClearanceStarts:         &now,
		ClearanceEnds:           &now,
		Announced:               &now,
		ApplicationsStart:       &now,
		ApplicationsEnd:         &now,
		PerformancePeriodStarts: &now,
		PerformancePeriodEnds:   &now,
		WrapUpEnds:              &now,
	}
	count, err = countPopulatedPlanTimelineDates(planTimeline)
	assert.NoError(t, err)
	assert.Equal(t, 9, count)
}
