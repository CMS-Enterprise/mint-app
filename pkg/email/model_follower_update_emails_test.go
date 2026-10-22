package email

import (
	"html/template"
	"testing"
)

func TestModelFollowerUpdateTemplate(t *testing.T) {
	clientAddress := "https://mint.cms.gov"
	modelID := "00000000-0000-0000-0000-000000000000"

	subject, body, err := ModelFollowerUpdate.Send.GetContent(
		ModelFollowerUpdateSubjectContent{
			ModelName: "Test Model Plan",
		},
		ModelFollowerUpdateBodyContent{
			ClientAddress: clientAddress,
			ModelID:       modelID,
			ModelName:     "Test Model Plan",
			SenderName:    "Sender Name",
			Content:       template.HTML(`<p>Hello <strong>followers</strong></p>`),
		},
	)

	if err != nil {
		t.Fatalf("unexpected template render error: %v", err)
	}

	if subject != "New update for the model you follow (Test Model Plan)" {
		t.Fatalf("expected subject %q, got %q", "New update for the model you follow (Test Model Plan)", subject)
	}

	assertContains(t, body, "Sender Name sent an update about Test Model Plan", true)
	// the sanitized content is rendered as HTML, not escaped
	assertContains(t, body, "<p>Hello <strong>followers</strong></p>", true)
	assertContains(t, body, clientAddress+"/models/"+modelID+"/collaboration-area", true)
}
