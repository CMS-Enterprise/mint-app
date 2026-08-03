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
			shouldShowAdditionalTimeline: true,
		},
		{
			name: "no custom timeline dates hides additional model dates",
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

			assertContains(t, body, "Basic high level timeline", true)
			assertContains(t, body, "Additional model dates", tt.shouldShowAdditionalTimeline)
		})
	}
}

func TestModelPlanDateChangedTemplateCustomTimelineDateChangeRendering(t *testing.T) {
	oldDate := time.Date(2026, 9, 1, 0, 0, 0, 0, time.UTC)
	newDate := time.Date(2026, 10, 1, 0, 0, 0, 0, time.UTC)

	tests := []struct {
		name                 string
		customTimelineChange CustomTimelineDateChange
		shouldShowOldChanged bool
		shouldShowNewDate    bool
	}{
		{
			name: "changed custom timeline date shows old struck through and new date",
			customTimelineChange: CustomTimelineDateChange{
				IsChanged:    true,
				Title:        "Custom single date title",
				OldStartDate: &oldDate,
				NewStartDate: &newDate,
			},
			shouldShowOldChanged: true,
			shouldShowNewDate:    true,
		},
		{
			name: "unchanged custom timeline date only shows current date",
			customTimelineChange: CustomTimelineDateChange{
				IsChanged:    false,
				Title:        "Custom single date title",
				OldStartDate: &oldDate,
				NewStartDate: &newDate,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, body, err := ModelPlan.DateChanged.GetContent(
				ModelPlanDateChangedSubjectContent{
					ModelName: "Test Model",
				},
				ModelPlanDateChangedBodyContent{
					ClientAddress: "localhost:3005",
					ModelName:     "Test Model",
					ModelID:       "00000000-0000-0000-0000-000000000000",
					CustomTimelineDateChanges: []CustomTimelineDateChange{
						tt.customTimelineChange,
					},
				},
			)
			if err != nil {
				t.Fatalf("unexpected template render error: %v", err)
			}

			assertContains(t, body, "09/01/2026", true)
			assertContains(t, body, `<span style="color: #D54309; text-decoration: line-through;">`, tt.shouldShowOldChanged)
			assertContains(t, body, "10/01/2026", tt.shouldShowNewDate)
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
