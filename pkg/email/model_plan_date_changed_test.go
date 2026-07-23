package email

import (
	"strings"
	"testing"
	"time"
)

func TestModelPlanDateChangedTemplateSections(t *testing.T) {
	date := time.Date(2026, 9, 1, 0, 0, 0, 0, time.UTC)
	nextDate := time.Date(2026, 10, 1, 0, 0, 0, 0, time.UTC)
	description := "A custom date for this model plan timeline."

	tests := []struct {
		name                         string
		dateChanges                  []DateChange
		customTimelineDateChanges    []CustomTimelineDateChange
		shouldShowBasicTimeline      bool
		shouldShowAdditionalTimeline bool
	}{
		{
			name: "date changes only shows basic timeline",
			dateChanges: []DateChange{
				{
					IsChanged: true,
					Field:     "Complete ICIP",
					NewDate:   &date,
				},
			},
			shouldShowBasicTimeline: true,
		},
		{
			name: "custom timeline date changes only shows additional model dates",
			customTimelineDateChanges: []CustomTimelineDateChange{
				{
					IsChanged:    true,
					Title:        "Custom single date title",
					Description:  &description,
					OldStartDate: &date,
					NewStartDate: &nextDate,
				},
			},
			shouldShowAdditionalTimeline: true,
		},
		{
			name: "both change types show both timeline sections",
			dateChanges: []DateChange{
				{
					IsChanged: true,
					Field:     "Complete ICIP",
					NewDate:   &date,
				},
			},
			customTimelineDateChanges: []CustomTimelineDateChange{
				{
					IsChanged:    true,
					Title:        "Custom single date title",
					Description:  &description,
					OldStartDate: &date,
					NewStartDate: &nextDate,
				},
			},
			shouldShowBasicTimeline:      true,
			shouldShowAdditionalTimeline: true,
		},
		{
			name: "no changes hides both timeline sections",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, body, err := ModelPlan.DateChanged.GetContent(
				ModelPlanDateChangedSubjectContent{
					ModelName: "Test Model",
				},
				ModelPlanDateChangedBodyContent{
					ClientAddress:             "localhost:3005",
					ModelName:                 "Test Model",
					ModelID:                   "00000000-0000-0000-0000-000000000000",
					DateChanges:               tt.dateChanges,
					CustomTimelineDateChanges: tt.customTimelineDateChanges,
				},
			)
			if err != nil {
				t.Fatalf("unexpected template render error: %v", err)
			}

			assertContains(t, body, "Basic high level timeline", tt.shouldShowBasicTimeline)
			assertContains(t, body, "Additional model dates", tt.shouldShowAdditionalTimeline)
		})
	}
}

func assertContains(t *testing.T, body string, text string, shouldContain bool) {
	t.Helper()

	contains := strings.Contains(body, text)
	if contains != shouldContain {
		t.Fatalf("expected body contains %q to be %t, got %t", text, shouldContain, contains)
	}
}
