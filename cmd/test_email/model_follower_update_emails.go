package main

import (
	"html/template"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendModelFollowerUpdateTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	shortName := "TMP"

	subjectContent := email.ModelFollowerUpdateSubjectContent{
		ModelShortName: &shortName,
	}
	bodyContent := email.ModelFollowerUpdateBodyContent{
		ClientAddress:    emailService.GetConfig().GetClientAddress(),
		ModelID:          uuid.New().String(),
		ModelName:        "Test Model Plan",
		ModelShortName:   &shortName,
		ModelCategories:  []string{"Accountable Care", "Disease-Specific & Episodic"},
		ModelStatus:      "Plan draft",
		ModelLastUpdated: time.Now(),
		ModelLeads:       []string{"Ada Lovelace", "Grace Hopper"},
		Content: template.HTML(
			"<p>The <strong>model</strong> has an <u>update</u>.</p><ul><li>First item</li><li>Second item</li></ul>",
		),
	}

	emailSubject, emailBody, err := email.ModelPlan.FollowerUpdate.GetContent(subjectContent, bodyContent)
	noErr(err)

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.DefaultSender},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}
