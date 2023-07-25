package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/email"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestDateProcessorExtractChangedDates() {

	// Set up some test times
	t1, _ := time.Parse(time.RFC3339, "2024-01-01T00:00:00Z")
	t2, _ := time.Parse(time.RFC3339, "2024-02-02T00:00:00Z")

	// Define a default existing PlanBasics object
	defaultExisting := &models.PlanBasics{
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
		existing *models.PlanBasics
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
				"performancePeriod": {
					Field:         "Performance period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: defaultExisting.PerformancePeriodStarts,
					OldRangeEnd:   defaultExisting.PerformancePeriodEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   defaultExisting.PerformancePeriodEnds,
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
					Field:         "Complete ICIP",
					IsRange:       false,
					OldDate:       defaultExisting.CompleteICIP,
					NewDate:       &t2,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: nil,
					NewRangeEnd:   nil,
				},
				"clearance": {
					Field:         "Clearance",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: defaultExisting.ClearanceStarts,
					OldRangeEnd:   defaultExisting.ClearanceEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"announced": {
					Field:         "Announce model",
					IsRange:       false,
					OldDate:       defaultExisting.Announced,
					NewDate:       &t2,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: nil,
					NewRangeEnd:   nil,
				},
				"applications": {
					Field:         "Application period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: defaultExisting.ApplicationsStart,
					OldRangeEnd:   defaultExisting.ApplicationsEnd,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"performancePeriod": {
					Field:         "Performance period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: defaultExisting.PerformancePeriodStarts,
					OldRangeEnd:   defaultExisting.PerformancePeriodEnds,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
				},
				"wrapUpEnds": {
					Field:         "Model wrap-up end date",
					IsRange:       false,
					OldDate:       defaultExisting.WrapUpEnds,
					NewDate:       &t2,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: nil,
					NewRangeEnd:   nil,
				},
			},
		},
		// Field was nil initially
		{
			name: "Field was nil initially",
			changes: map[string]interface{}{
				"wrapUpEnds": t1.Format(time.RFC3339),
			},
			existing: &models.PlanBasics{
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
				"wrapUpEnds": {
					Field:         "Model wrap-up end date",
					IsRange:       false,
					OldDate:       nil,
					NewDate:       &t1,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: nil,
					NewRangeEnd:   nil,
				},
			},
		},
		// Single date field from nil to non-nil
		{
			name: "Single date field from nil to non-nil",
			changes: map[string]interface{}{
				"announced": t2.Format(time.RFC3339),
			},
			existing: &models.PlanBasics{},
			expected: map[string]email.DateChange{
				"announced": {
					Field:         "Announce model",
					IsRange:       false,
					OldDate:       nil,
					NewDate:       &t2,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: nil,
					NewRangeEnd:   nil,
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
				"announced": {
					Field:         "Announce model",
					IsRange:       false,
					OldDate:       &t1,
					NewDate:       nil,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: nil,
					NewRangeEnd:   nil,
				},
			},
		},
		// Range begin date from nil to non-nil
		{
			name: "Range begin date from nil to non-nil",
			changes: map[string]interface{}{
				"applicationsStart": t2.Format(time.RFC3339),
			},
			existing: &models.PlanBasics{},
			expected: map[string]email.DateChange{
				"applications": {
					Field:         "Application period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: &t2,
					NewRangeEnd:   nil,
				},
			},
		},
		// Range end date from nil to non-nil
		{
			name: "Range end date from nil to non-nil",
			changes: map[string]interface{}{
				"applicationsEnd": t2.Format(time.RFC3339),
			},
			existing: &models.PlanBasics{},
			expected: map[string]email.DateChange{
				"applications": {
					Field:         "Application period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: nil,
					NewRangeEnd:   &t2,
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
				"applications": {
					Field:         "Application period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
					NewRangeStart: nil,
					NewRangeEnd:   &t1,
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
				"applications": {
					Field:         "Application period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
					NewRangeStart: &t1,
					NewRangeEnd:   nil,
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
			existing: &models.PlanBasics{},
			expected: map[string]email.DateChange{
				"applications": {
					Field:         "Application period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: nil,
					OldRangeEnd:   nil,
					NewRangeStart: &t2,
					NewRangeEnd:   &t2,
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
				"applications": {
					Field:         "Application period",
					IsRange:       true,
					OldDate:       nil,
					NewDate:       nil,
					OldRangeStart: &t1,
					OldRangeEnd:   &t1,
					NewRangeStart: nil,
					NewRangeEnd:   nil,
				},
			},
		},
	}

	for _, tc := range testCases {
		suite.Run(tc.name, func() {
			dp, _ := NewDateProcessor(tc.changes, tc.existing)
			changes, _ := dp.ExtractChangedDates()
			suite.Equal(tc.expected, changes)
		})
	}
}
