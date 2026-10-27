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

	subject, body, err := ModelFollowerUpdate.Send.GetContent(
		ModelFollowerUpdateSubjectContent{
			ModelAcronym: "TMP",
		},
		ModelFollowerUpdateBodyContent{
			ClientAddress:    clientAddress,
			ModelID:          modelID,
			ModelName:        "Test Model Plan",
			ModelShortName:   &shortName,
			ModelCategories:  []string{"Accountable Care", "Disease-Specific & Episode-Based"},
			ModelStatus:      "Planning",
			ModelLastUpdated: time.Date(2026, 8, 9, 0, 0, 0, 0, time.UTC),
			ModelLeads:       []string{"Lead One", "Lead Two"},
			Content:          template.HTML(`<p>Hello <strong>followers</strong></p>`),
		},
	)

	if err != nil {
		t.Fatalf("unexpected template render error: %v", err)
	}

	if subject != "A model (TMP) has shared a message" {
		t.Fatalf("expected subject %q, got %q", "A model (TMP) has shared a message", subject)
	}

	assertContains(t, body, "A model has shared a message:", true)
	assertContains(t, body, "Test Model Plan", true)
	assertContains(t, body, "(TMP)", true)
	assertContains(t, body, "Accountable Care", true)
	assertContains(t, body, "Planning", true)
	assertContains(t, body, "08/09/2026", true)
	assertContains(t, body, "Lead One,&nbsp;Lead Two", true)
	assertContains(t, body, "You received this notification because you are currently following this model", true)
	// the sanitized content is rendered as HTML, not escaped
	assertContains(t, body, "<p>Hello <strong>followers</strong></p>", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/read-view/model-basics", true)
}
