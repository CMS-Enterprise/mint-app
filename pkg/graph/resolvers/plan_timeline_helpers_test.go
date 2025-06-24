package resolvers

import (
	"time"

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
					Field:   getFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
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
					Field:   getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field:     getFieldDataMap()["completeICIP"].HumanReadableName,
					IsChanged: true,
					OldDate:   defaultExisting.CompleteICIP,
					NewDate:   &t2,
				},
				"clearance": {
					Field:         getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: defaultExisting.ClearanceStarts,
					OldRangeEnd:   defaultExisting.ClearanceEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"announced": {
					Field:     getFieldDataMap()["announced"].HumanReadableName,
					IsChanged: true,
					OldDate:   defaultExisting.Announced,
					NewDate:   &t2,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: defaultExisting.ApplicationsStart,
					OldRangeEnd:   defaultExisting.ApplicationsEnd,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"performancePeriod": {
					Field:         getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: defaultExisting.PerformancePeriodStarts,
					OldRangeEnd:   defaultExisting.PerformancePeriodEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"wrapUpEnds": {
					Field:     getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field:   getFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"clearance": {
					Field:         getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"completeICIP": {
					Field:   getFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"performancePeriod": {
					Field:         getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:     getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field: getFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field:     getFieldDataMap()["announced"].HumanReadableName,
					IsChanged: true,
					NewDate:   &t2,
				},
				"applications": {
					Field:   getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange: true,
				},
				"performancePeriod": {
					Field:   getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field:   getFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:     getFieldDataMap()["announced"].HumanReadableName,
					IsChanged: true,
					OldDate:   &t1,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field: getFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field: getFieldDataMap()["announced"].HumanReadableName,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					NewRangeStart: &t2,
				},
				"performancePeriod": {
					Field:   getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field: getFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field: getFieldDataMap()["announced"].HumanReadableName,
				},
				"applications": {
					Field:       getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:   true,
					IsRange:     true,
					NewRangeEnd: &t2,
				},
				"performancePeriod": {
					Field:   getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field:   getFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
					NewRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field:   getFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
					NewRangeStart: &t1,
				},
				"performancePeriod": {
					Field:         getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field: getFieldDataMap()["completeICIP"].HumanReadableName,
				},
				"clearance": {
					Field:   getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange: true,
				},
				"announced": {
					Field: getFieldDataMap()["announced"].HumanReadableName,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"performancePeriod": {
					Field:   getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange: true,
				},
				"wrapUpEnds": {
					Field: getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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
					Field:   getFieldDataMap()["completeICIP"].HumanReadableName,
					OldDate: &t1,
				},
				"clearance": {
					Field:         getFieldDataMap()["clearanceStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"announced": {
					Field:   getFieldDataMap()["announced"].HumanReadableName,
					OldDate: &t1,
				},
				"applications": {
					Field:         getFieldDataMap()["applicationsStart"].HumanReadableName,
					IsChanged:     true,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"performancePeriod": {
					Field:         getFieldDataMap()["performancePeriodStarts"].HumanReadableName,
					IsRange:       true,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
				},
				"wrapUpEnds": {
					Field:   getFieldDataMap()["wrapUpEnds"].HumanReadableName,
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

func (suite *ResolverSuite) TestGetUpcomingPlanTimelineDate() {
	// Set up times: tPast < tNow < tFuture1 < tFuture2
	tNow := time.Now()
	tPast := tNow.Add(-24 * time.Hour)
	tFuture1 := tNow.Add(24 * time.Hour)
	tFuture2 := tNow.Add(48 * time.Hour)

	// Test: All fields nil
	planPlanTimeline := &models.PlanTimeline{}
	nearest, field, err := getUpcomingPlanTimelineDate(planPlanTimeline)
	suite.NoError(err)
	suite.Nil(nearest)
	suite.Equal("", field)

	// Test: Only past dates
	planPlanTimeline = &models.PlanTimeline{
		CompleteICIP:            &tPast,
		ClearanceStarts:         &tPast,
		ClearanceEnds:           &tPast,
		Announced:               &tPast,
		ApplicationsStart:       &tPast,
		ApplicationsEnd:         &tPast,
		PerformancePeriodStarts: &tPast,
		PerformancePeriodEnds:   &tPast,
		WrapUpEnds:              &tPast,
	}
	nearest, field, err = getUpcomingPlanTimelineDate(planPlanTimeline)
	suite.NoError(err)
	suite.Nil(nearest)
	suite.Equal("", field)

	// Test: Only one future date, rest nil
	planPlanTimeline = &models.PlanTimeline{
		Announced: &tFuture1,
	}
	nearest, field, err = getUpcomingPlanTimelineDate(planPlanTimeline)
	suite.NoError(err)
	suite.NotNil(nearest)
	suite.WithinDuration(tFuture1, *nearest, time.Second)
	suite.Equal("announced", field)

	// Test: Multiple future dates, pick nearest
	planPlanTimeline = &models.PlanTimeline{
		CompleteICIP:    &tFuture2,
		ClearanceStarts: &tFuture1,
		WrapUpEnds:      &tFuture2,
	}
	nearest, field, err = getUpcomingPlanTimelineDate(planPlanTimeline)
	suite.NoError(err)
	suite.NotNil(nearest)
	suite.WithinDuration(tFuture1, *nearest, time.Second)
	suite.Equal("clearanceStarts", field)

	// Test: Mix of past and future, pick nearest future
	planPlanTimeline = &models.PlanTimeline{
		CompleteICIP:    &tPast,
		ClearanceStarts: &tFuture2,
		Announced:       &tFuture1,
	}
	nearest, field, err = getUpcomingPlanTimelineDate(planPlanTimeline)
	suite.NoError(err)
	suite.NotNil(nearest)
	suite.WithinDuration(tFuture1, *nearest, time.Second)
	suite.Equal("announced", field)

	// Test: All dates in the future, pick the earliest
	planPlanTimeline = &models.PlanTimeline{
		CompleteICIP:            &tFuture2,
		ClearanceStarts:         &tFuture2,
		ClearanceEnds:           &tFuture1,
		Announced:               &tFuture2,
		ApplicationsStart:       &tFuture2,
		ApplicationsEnd:         &tFuture2,
		PerformancePeriodStarts: &tFuture2,
		PerformancePeriodEnds:   &tFuture2,
		WrapUpEnds:              &tFuture2,
	}
	nearest, field, err = getUpcomingPlanTimelineDate(planPlanTimeline)
	suite.NoError(err)
	suite.NotNil(nearest)
	suite.WithinDuration(tFuture1, *nearest, time.Second)
	suite.Equal("clearanceEnds", field)

	// Test: Only one date is exactly now (should not count as future)
	planPlanTimeline = &models.PlanTimeline{
		CompleteICIP: &tNow,
	}
	nearest, field, err = getUpcomingPlanTimelineDate(planPlanTimeline)
	suite.NoError(err)
	suite.Nil(nearest)
	suite.Equal("", field)
}
