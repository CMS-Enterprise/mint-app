package email

import (
	"html/template"
	"testing"
	"time"
)

func TestModelFollowerUpdateTemplate(t *testing.T) {
	clientAddress := "https://mint.cms.gov"
	modelID := "00000000-0000-0000-0000-000000000000"
	shortName := "TMP"

	bodyContent := ModelFollowerUpdateBodyContent{
		ClientAddress:    clientAddress,
		ModelID:          modelID,
		ModelName:        "Test Model Plan",
		ModelShortName:   &shortName,
		ModelCategories:  []string{"Accountable Care"},
		ModelStatus:      "Plan draft",
		ModelLastUpdated: time.Date(2026, 10, 14, 0, 0, 0, 0, time.UTC),
		ModelLeads:       []string{"Ada Lovelace", "Grace Hopper"},
		Content:          template.HTML("<p>The <strong>model</strong> has an <u>update</u></p>"),
	}

	subject, body, err := ModelPlan.FollowerUpdate.GetContent(
		ModelFollowerUpdateSubjectContent{ModelShortName: &shortName},
		bodyContent,
	)
	if err != nil {
		t.Fatalf("unexpected template render error: %v", err)
	}

	if subject != "A model (TMP) has shared a message" {
		t.Fatalf("expected subject %q, got %q", "A model (TMP) has shared a message", subject)
	}

	assertContains(t, body, "A model has shared a message:", true)
	assertContains(t, body, "Test Model Plan", true)
	assertContains(t, body, "Accountable Care", true)
	assertContains(t, body, "Plan draft", true)
	assertContains(t, body, "10/14/2026", true)
	assertContains(t, body, "Ada Lovelace,&nbsp;Grace Hopper", true)
	assertContains(t, body, "<p>The <strong>model</strong> has an <u>update</u></p>", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/read-view/model-basics", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area", true)
	assertContains(t, body, clientAddress+"/notifications/settings?unsubscribe_email=MODEL_FOLLOWER_UPDATE", true)
	assertContains(t, body, `href="`+clientAddress+`/notifications/settings"`, true)
}

func TestModelFollowerUpdateSubjectWithoutShortName(t *testing.T) {
	emptyShortName := ""

	for _, shortName := range []*string{nil, &emptyShortName} {
		subject, _, err := ModelPlan.FollowerUpdate.GetContent(
			ModelFollowerUpdateSubjectContent{ModelShortName: shortName},
			ModelFollowerUpdateBodyContent{ModelName: "Test Model Plan"},
		)
		if err != nil {
			t.Fatalf("unexpected template render error: %v", err)
		}

		if subject != "A model has shared a message" {
			t.Fatalf("expected subject %q, got %q", "A model has shared a message", subject)
		}
	}
}
