package main

import (
	"time"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

// sendTestDailyDigestEmail demonstrates sending a daily digest test email with MTOUpdates included.
func sendTestDailyDigestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	analyzedAudit := &models.AnalyzedAudit{
		ModelName: "Test Model Plan",
		Date:      time.Now(),
		Changes: models.AnalyzedAuditChange{
			MTOUpdates: &models.AnalyzedMTOUpdates{
				ReadyForReview: true,
				Updates:        []string{"status", "content"},
			},
			PlanDiscussions: &models.AnalyzedPlanDiscussions{
				Activity: true,
			},
		},
	}

	emailTemplate, err := templateService.GetEmailTemplate(email.DailyDigestTemplateName)
	noErr(err)

	subject, err := emailTemplate.GetExecutedSubject(email.DailyDigestSubjectContent{})
	noErr(err)

	body, err := emailTemplate.GetExecutedBody(email.DailyDigestBodyContent{
		AnalyzedAudits: []*models.AnalyzedAudit{analyzedAudit},
		ClientAddress:  emailService.GetConfig().GetClientAddress(),
	})
	noErr(err)

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.DefaultSender},
		nil,
		subject,
		"text/html",
		body,
	)
	noErr(err)
}
