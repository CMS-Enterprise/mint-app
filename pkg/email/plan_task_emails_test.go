package email

import (
	"testing"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func TestPlanTaskNewAvailableTemplate(t *testing.T) {
	clientAddress := "https://mint.cms.gov"
	modelID := "00000000-0000-0000-0000-000000000000"
	twoPagerTaskName := models.PlanTaskKeyTwoPager.DisplayName()
	sixPagerTaskName := models.PlanTaskKeySixPager.DisplayName()

	subject, body, err := PlanTask.NewAvailable.GetContent(
		PlanTaskNewAvailableSubjectContent{
			ModelName: "Test Model Plan",
		},
		PlanTaskNewAvailableBodyContent{
			ClientAddress: clientAddress,
			ModelID:       modelID,
			ModelName:     "Test Model Plan",
			TaskList:      []string{sixPagerTaskName, twoPagerTaskName},
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
	assertContains(t, body, "<li>"+sixPagerTaskName+"</li>", true)
	assertContains(t, body, "<li>"+twoPagerTaskName+"</li>", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area/tasks?tab=current", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area/collaborators", true)
	assertContains(t, body, clientAddress+"/notifications/settings?unsubscribe_email=NEW_TASK_ADDED", true)
	assertContains(t, body, `href="`+clientAddress+`/notifications/settings"`, true)
}

func TestPlanTaskCompletedTemplate(t *testing.T) {
	clientAddress := "https://mint.cms.gov"
	modelID := "00000000-0000-0000-0000-000000000000"
	sixPagerTaskName := models.PlanTaskKeySixPager.DisplayName()

	subject, body, err := PlanTask.Completed.GetContent(
		PlanTaskCompletedSubjectContent{
			ModelName: "Test Model Plan",
		},
		PlanTaskCompletedBodyContent{
			ClientAddress: clientAddress,
			ModelID:       modelID,
			ModelName:     "Test Model Plan",
			TaskName:      sixPagerTaskName,
			IsModelLead:   true,
		},
	)

	if err != nil {
		t.Fatalf("unexpected template render error: %v", err)
	}

	if subject != "A task has been completed for your model (Test Model Plan)" {
		t.Fatalf("expected subject %q, got %q", "A task has been completed for your model (Test Model Plan)", subject)
	}

	assertContains(t, body, "A task was completed for your model.", true)
	assertContains(t, body, "<li>"+sixPagerTaskName+"</li>", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area/tasks?tab=completed", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area/collaborators", true)
	assertContains(t, body, clientAddress+"/notifications/settings?unsubscribe_email=TASK_COMPLETED", true)
	assertContains(t, body, `href="`+clientAddress+`/notifications/settings"`, true)
	assertContains(t, body, clientAddress+"/how-to-get-access", true)
}
