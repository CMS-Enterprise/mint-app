package resolvers

import (
	"time"

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

	// Test Cases
	testCases := []struct {
		name     string
		changes  map[string]interface{}
		existing *models.PlanBasics
		expected map[string]dateChange
	}{
		// No fields changed
		{
			name:     "No fields changed",
			changes:  map[string]interface{}{},
			existing: defaultExisting,
			expected: map[string]dateChange{},
		},
		// Single field changed
		{
			name: "Single field changed",
			changes: map[string]interface{}{
				"performancePeriodStarts": t2.Format(time.RFC3339),
			},
			existing: defaultExisting,
			expected: map[string]dateChange{
				"performancePeriod": {
					HumanReadableFieldName: "Performance period",
					IsRange:                true,
					Old:                    nil,
					New:                    nil,
					OldRangeStart:          defaultExisting.PerformancePeriodStarts,
					OldRangeEnd:            defaultExisting.PerformancePeriodEnds,
					NewRangeStart:          &t2,
					NewRangeEnd:            defaultExisting.PerformancePeriodEnds,
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
			expected: map[string]dateChange{},
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
			expected: map[string]dateChange{
				"completeICIP": {
					HumanReadableFieldName: "Complete ICIP",
					IsRange:                false,
					Old:                    defaultExisting.CompleteICIP,
					New:                    &t2,
					OldRangeStart:          nil,
					OldRangeEnd:            nil,
					NewRangeStart:          nil,
					NewRangeEnd:            nil,
				},
				"clearance": {
					HumanReadableFieldName: "Clearance",
					IsRange:                true,
					Old:                    nil,
					New:                    nil,
					OldRangeStart:          defaultExisting.ClearanceStarts,
					OldRangeEnd:            defaultExisting.ClearanceEnds,
					NewRangeStart:          &t2,
					NewRangeEnd:            &t2,
				},
				"announced": {
					HumanReadableFieldName: "Announce model",
					IsRange:                false,
					Old:                    defaultExisting.Announced,
					New:                    &t2,
					OldRangeStart:          nil,
					OldRangeEnd:            nil,
					NewRangeStart:          nil,
					NewRangeEnd:            nil,
				},
				"applications": {
					HumanReadableFieldName: "Application period",
					IsRange:                true,
					Old:                    nil,
					New:                    nil,
					OldRangeStart:          defaultExisting.ApplicationsStart,
					OldRangeEnd:            defaultExisting.ApplicationsEnd,
					NewRangeStart:          &t2,
					NewRangeEnd:            &t2,
				},
				"performancePeriod": {
					HumanReadableFieldName: "Performance period",
					IsRange:                true,
					Old:                    nil,
					New:                    nil,
					OldRangeStart:          defaultExisting.PerformancePeriodStarts,
					OldRangeEnd:            defaultExisting.PerformancePeriodEnds,
					NewRangeStart:          &t2,
					NewRangeEnd:            &t2,
				},
				"wrapUpEnds": {
					HumanReadableFieldName: "Model wrap-up end date",
					IsRange:                false,
					Old:                    defaultExisting.WrapUpEnds,
					New:                    &t2,
					OldRangeStart:          nil,
					OldRangeEnd:            nil,
					NewRangeStart:          nil,
					NewRangeEnd:            nil,
				},
			},
		},

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
			expected: map[string]dateChange{
				"wrapUpEnds": {
					HumanReadableFieldName: "Model wrap-up end date",
					IsRange:                false,
					Old:                    nil,
					New:                    &t1,
					OldRangeStart:          nil,
					OldRangeEnd:            nil,
					NewRangeStart:          nil,
					NewRangeEnd:            nil,
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
