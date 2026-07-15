package email

import "testing"

func TestCustomTimelineDateCreatedTemplate(t *testing.T) {
	clientAddress := "https://mint.cms.gov"
	modelID := "00000000-0000-0000-0000-000000000000"

	subject, body, err := ModelPlan.CustomTimelineDateCreated.GetContent(
		CustomTimelineDateCreatedSubjectContent{
			ModelName: "Test Model Plan",
		},
		CustomTimelineDateCreatedBodyContent{
			ClientAddress:                 clientAddress,
			ModelName:                     "Test Model Plan",
			ModelID:                       modelID,
			UserName:                      "Test User",
			CustomTimelineDateTitle:       "Custom timeline date",
			CustomTimelineDateDescription: "A custom date for this model plan timeline.",
			CustomTimelineDate:            "09/01/2026",
		},
	)

	if err != nil {
		t.Fatalf("unexpected template render error: %v", err)
	}

	if subject != "New date added to Test Model Plan" {
		t.Fatalf("expected subject %q, got %q", "New date added to Test Model Plan", subject)
	}

	assertContains(t, body, "New date added to Test Model Plan", true)
	assertContains(t, body, "Test User added a new date to the model timeline for Test Model Plan", true)
	assertContains(t, body, "New date summary", true)
	assertContains(t, body, "Date title:</strong> Custom timeline date", true)
	assertContains(t, body, "Date description:</strong> A custom date for this model plan timeline.", true)
	assertContains(t, body, "Date:</strong> 09/01/2026", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/read-view", true)
	assertContains(t, body, clientAddress+"/notifications/settings?unsubscribe_email=DATES_CHANGED", true)
	assertContains(t, body, clientAddress+"/notifications/settings", true)
}
