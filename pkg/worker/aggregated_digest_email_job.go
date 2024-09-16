package worker

import (
	"time"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// AggregatedDigestEmailJob is the handler for the AggregatedDigestEmailJob which
// sends a daily digest email containing all analyzed audits from the audit
// period
func AggregatedDigestEmailJob(
	dateAnalyzed time.Time,
	store *storage.Store,
	logger *zap.Logger,
	emailTemplateService email.TemplateServiceImpl,
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	// Get all analyzedAudits based on users favorited models
	analyzedAudits, err := getUserAgnosticDigestAnalyzedAudits(dateAnalyzed, store, logger)
	if err != nil {
		return err
	}

	if len(analyzedAudits) == 0 {
		return nil
	}

	// Generate email subject and body from template
	emailSubject, emailBody, err := generateUserAgnosticDigestEmail(analyzedAudits, emailTemplateService, emailService)
	if err != nil {
		return err
	}

	// Send generated email
	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}

	return nil
}

// getUserAgnosticDigestAnalyzedAudits gets AnalyzedAudits based on a date
func getUserAgnosticDigestAnalyzedAudits(
	date time.Time,
	store *storage.Store,
	logger *zap.Logger,
) ([]*models.AnalyzedAudit, error) {

	analyzedAudits, err := store.AnalyzedAuditGetByDate(logger, date)
	if err != nil {
		return nil, err
	}

	return analyzedAudits, nil
}

// generateUserAgnosticDigestEmail will generate the aggregated daily digest email from template
func generateUserAgnosticDigestEmail(
	analyzedAudits []*models.AnalyzedAudit,
	emailTemplateService email.TemplateServiceImpl,
	emailService oddmail.EmailService,
) (string, string, error) {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.AggregatedDailyDigestTemplateName)
	if err != nil {
		return "", "", err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.AggregatedDailyDigestSubjectContent{})
	if err != nil {
		return "", "", err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.AggregatedDailyDigestBodyContent{
		AnalyzedAudits: analyzedAudits,
		ClientAddress:  emailService.GetConfig().GetClientAddress(),
	})
	if err != nil {
		return "", "", err
	}

	return emailSubject, emailBody, nil
}
