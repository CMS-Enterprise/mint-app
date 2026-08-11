package email

import "testing"

func TestPlanTaskNewAvailableTemplate(t *testing.T) {
	clientAddress := "https://mint.cms.gov"
	modelID := "00000000-0000-0000-0000-000000000000"

	subject, body, err := PlanTask.NewAvailable.GetContent(
		PlanTaskNewAvailableSubjectContent{
			ModelName: "Test Model Plan",
		},
		PlanTaskNewAvailableBodyContent{
			ClientAddress: clientAddress,
			ModelID:       modelID,
			ModelName:     "Test Model Plan",
			TaskList:      []string{"Task 1", "Task 2"},
			IsModelLead:   true,
		},
	)

	if err != nil {
		t.Fatalf("unexpected template render error: %v", err)
	}

	if subject != "New tasks available for your model (Test Model Plan)" {
		t.Fatalf("expected subject %q, got %q", "New tasks available for your model (Test Model Plan)", subject)
	}

	assertContains(t, body, "There are new tasks for your model Test Model Plan.", true)
	assertContains(t, body, "<li>Task 1</li>", true)
	assertContains(t, body, "<li>Task 2</li>", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area/tasks?tab=current", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area/collaborators", true)
	assertContains(t, body, clientAddress+"/notifications/settings?unsubscribe_email=NEW_TASK_ADDED", true)
	assertContains(t, body, `href="`+clientAddress+`/notifications/settings"`, true)
}
