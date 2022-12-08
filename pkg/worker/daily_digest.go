package worker

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// DailyDigestEmailJob will generate and send an email based on a users favorited Models.
// args[0] userID, args[1] date
func (w *Worker) DailyDigestEmailJob(ctx context.Context, args ...interface{}) error {
	userID := args[0].(string)
	date := args[1].(time.Time)

	// Get the latest collaborator to get their email.
	// TODO: get email from user_account table when it is ready
	latestCollaborator, err := w.Store.PlanCollaboratorFetchLatestByUserID(userID)
	if err != nil {
		return err
	}
	recipientEmail := latestCollaborator.Email

	// Get all analyzedAudits based on users favorited models
	analyzedAudits, err := getDailyDigestAnalyzedAudits(userID, date, w.Store, w.Logger)
	if err != nil {
		return err
	}
	if analyzedAudits == nil {
		return nil
	}

	// Generate email subject and body from template
	emailSubject, emailBody, err := generateDailyDigestEmail(analyzedAudits, w.EmailTemplateService)
	if err != nil {
		return err
	}

	// Send generated email
	err = sendDailyDigestEmail(recipientEmail, emailSubject, emailBody, w.EmailService)
	if err != nil {
		return err
	}

	return nil
}

// getDailyDigestAnalyzedAudits gets AnalyzedAudits based on a users favorited plans and date
func getDailyDigestAnalyzedAudits(userID string, date time.Time, store *storage.Store, logger *zap.Logger) ([]*models.AnalyzedAudit, error) {
	planFavorites, err := store.PlanFavoriteGetByCollectionByUserID(logger, userID)
	if err != nil {
		return nil, err
	}
	if len(planFavorites) == 0 {
		return nil, nil
	}

	modelPlanIds := lo.Map(planFavorites, func(p *models.PlanFavorite, index int) uuid.UUID {
		return p.ModelPlanID
	})
	if len(modelPlanIds) == 0 {
		return nil, nil
	}

	analyzedAudits, err := store.AnalyzedAuditGetByModelPlanIDsAndDate(logger, modelPlanIds, date)
	if err != nil {
		return nil, err
	}

	return analyzedAudits, nil
}

// generateDailyDigestEmail will geneate the daily digest email from template
func generateDailyDigestEmail(analyzedAudits []*models.AnalyzedAudit, emailTemplateService email.TemplateServiceImpl) (string, string, error) {
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.DailyDigetsTemplateName)
	if err != nil {
		return "", "", err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.DailyDigestSubjectContent{})
	if err != nil {
		return "", "", err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.DailyDigestBodyContent{
		AnalyzedAudits: analyzedAudits,
	})
	if err != nil {
		return "", "", err
	}

	return emailSubject, emailBody, nil
}

// sendDailyDigestEmail will send the daily digest email to given recipient
func sendDailyDigestEmail(recipient string, subject string, body string, emailService oddmail.EmailService) error {
	err := emailService.Send(emailService.GetConfig().GetDefaultSender(), []string{recipient}, nil, subject, "text/html", body)
	if err != nil {
		return err
	}

	return nil
}
