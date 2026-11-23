package models

import (
	"testing"
	"time"
)

func TestCTATDashboardFilterValidate(t *testing.T) {
	start := time.Date(2026, time.January, 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 0, 7)

	tests := []struct {
		name      string
		filter    *CTATDashboardFilter
		wantError bool
	}{
		{name: "omitted filter"},
		{name: "empty filter", filter: &CTATDashboardFilter{}},
		{
			name: "valid custom range",
			filter: &CTATDashboardFilter{DateFilter: &CTATDashboardSubmissionDateFilter{
				Selection: CTATDashboardRelativeDateFilterCustomDateRange,
				StartDate: &start,
				EndDate:   &end,
			}},
		},
		{
			name: "custom range requires both dates",
			filter: &CTATDashboardFilter{DateFilter: &CTATDashboardSubmissionDateFilter{
				Selection: CTATDashboardRelativeDateFilterCustomDateRange,
				StartDate: &start,
			}},
			wantError: true,
		},
		{
			name: "custom range requires ordered dates",
			filter: &CTATDashboardFilter{DateFilter: &CTATDashboardSubmissionDateFilter{
				Selection: CTATDashboardRelativeDateFilterCustomDateRange,
				StartDate: &end,
				EndDate:   &start,
			}},
			wantError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.filter.Validate()
			if (err != nil) != tt.wantError {
				t.Fatalf("Validate() error = %v, want error = %t", err, tt.wantError)
			}
		})
	}
}
