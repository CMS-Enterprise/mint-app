package worker

import (
	"context"
	"time"

	faktory "github.com/contribsys/faktory/client"
	faktory_worker "github.com/contribsys/faktory_worker_go"
	"github.com/google/uuid"
	"github.com/samber/lo"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
)

/*
####################
# DigestEmail Jobs #
####################
*/

// DigestEmailBatchJob is the batch job for DigestEmailJobs
// args[0] date
func (w *Worker) DigestEmailBatchJob(ctx context.Context, args ...interface{}) error {
	dateAnalyzed := args[0].(string)

	helper := faktory_worker.HelperFor(ctx)

	userIDs, err := w.Store.PlanFavoriteCollectionGetUniqueUserIDs()
	if err != nil {
		return err
	}

	return helper.With(func(cl *faktory.Client) error {
		batch := faktory.NewBatch(cl)
		batch.Description = "Send Daily Digest Emails"
		batch.Success = faktory.NewJob("DigestEmailBatchJobSuccess", dateAnalyzed)
		batch.Success.Queue = defaultQueue

		return batch.Jobs(func() error {
			for _, id := range userIDs {
				job := faktory.NewJob("DigestEmailJob", dateAnalyzed, id) //TODO verify!
				job.Queue = emailQueue
				err = batch.Push(job)
				if err != nil {
					return err
				}
			}
			return nil
		})
	})
}

// DigestEmailBatchJobSuccess is the callback function forDigestEmailBatchJob
// args[0] date
func (w *Worker) DigestEmailBatchJobSuccess(ctx context.Context, args ...interface{}) error {
	// TODO: Add notification here if wanted in the future
	return nil
}

// DigestEmailJob will generate and send an email based on a users favorited Models.
// args[0] date, args[1] userID
func (w *Worker) DigestEmailJob(ctx context.Context, args ...interface{}) error {
	dateAnalyzed, err := time.Parse("2006-01-02", args[0].(string))
	if err != nil {
		return err
	}

	userIDString := args[1].(string) // This is always returned as a string from faktory
	userID, err := uuid.Parse(userIDString)
	if err != nil {
		return err
	}

	account, err := w.Store.UserAccountGetByID(userID)
	if err != nil {
		return err
	}

	recipientEmail := account.Email

	// Get all analyzedAudits based on users favorited models
	analyzedAudits, err := getDigestAnalyzedAudits(userID, dateAnalyzed, w.Store, w.Logger)
	if err != nil {
		return err
	}

	if len(analyzedAudits) == 0 {
		return nil
	}

	// Generate email subject and body from template
	emailSubject, emailBody, err := generateDigestEmail(analyzedAudits, w.EmailTemplateService, w.EmailService)
	if err != nil {
		return err
	}

	// Send generated email
	err = sendDigestEmail(recipientEmail, emailSubject, emailBody, w.EmailService)
	if err != nil {
		return err
	}

	return nil
}

/*
############################
# DigestEmail Jobs Helpers #
############################
*/

// getDigestAnalyzedAudits gets AnalyzedAudits based on a users favorited plans and date
func getDigestAnalyzedAudits(userID uuid.UUID, date time.Time, store *storage.Store, logger *zap.Logger) ([]*models.AnalyzedAudit, error) {

	planFavorites, err := store.PlanFavoriteGetCollectionByUserID(logger, userID)
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

// generateDigestEmail will geneate the daily digest email from template
func generateDigestEmail(analyzedAudits []*models.AnalyzedAudit, emailTemplateService email.TemplateServiceImpl, emailService oddmail.EmailService) (string, string, error) {
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
		ClientAddress:  emailService.GetConfig().GetClientAddress(),
	})
	if err != nil {
		return "", "", err
	}

	return emailSubject, emailBody, nil
}

// sendDigestEmail will send the daily digest email to given recipient
func sendDigestEmail(recipient string, subject string, body string, emailService oddmail.EmailService) error {
	err := emailService.Send(emailService.GetConfig().GetDefaultSender(), []string{recipient}, nil, subject, "text/html", body)
	if err != nil {
		return err
	}

	return nil
}
