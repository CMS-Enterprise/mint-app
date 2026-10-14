package email

import (
	"strings"
	"testing"
)

func TestCTATUpdateEmailKeepsProgressNotesAdminOnly(t *testing.T) {
	subject := CTATUpdateSubjectContent{TicketNumber: "CTAT-001"}
	content := CTATUpdateBodyContent{
		Status:               "In progress",
		StatusUpdated:        true,
		ProgressNotes:        "Internal contract review detail",
		ProgressNotesUpdated: true,
	}

	_, requesterBody, err := CTAT.Update.GetContent(subject, content)
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(requesterBody, "Progress notes") || strings.Contains(requesterBody, content.ProgressNotes) {
		t.Fatal("requester update email exposed progress notes")
	}

	_, adminBody, err := CTAT.UpdateAdmin.GetContent(subject, CTATUpdateAdminBodyContent{
		CTATUpdateBodyContent: content,
		AdminName:             "CTAT admin",
	})
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(adminBody, content.ProgressNotes) {
		t.Fatal("admin update email omitted progress notes")
	}
}
