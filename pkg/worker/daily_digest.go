package worker

import (
	"context"
	"fmt"
	"time"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/google/uuid"
	"github.com/samber/lo"
)

// GenerateAndSendEmail will generate and send an email based on a users favorited Models
// args[0] userID, args[1] date
func (w *Worker) DailyDigestJob(ctx context.Context, args ...interface{}) error {
	// user, err := w.Store.UserAccountGetByUsername(args[0].(string))
	// if err != nil {
	// 	return err
	// }
	date := args[1].(time.Time)

	planFavorites, err := w.Store.PlanFavoriteGetByCollectionByEUA(w.Logger, args[0].(string))
	if err != nil {
		return err
	}
	if len(planFavorites) == 0 {
		return nil
	}

	modelPlanIds := lo.Map(planFavorites, func(p *models.PlanFavorite, index int) uuid.UUID {
		return p.ModelPlanID
	})
	if len(modelPlanIds) == 0 {
		return nil
	}

	analyzedAudits, err := w.Store.AnalyzedAuditGetByModelPlanIDsAndDate(w.Logger, modelPlanIds, date)
	if err != nil {
		return err
	}

	emailSubject, emailBody, err := GenerateEmail(analyzedAudits, *w.EmailTemplateService)
	if err != nil {
		return err
	}

	fmt.Println("emailSubject")
	fmt.Println(emailSubject)

	fmt.Println("emailBody")
	fmt.Println(emailBody)

	// err = SendEmail(user.Email, emailSubject, emailBody, *w.EmailService)
	// if err != nil {
	// 	return err
	// }

	return nil
}

func GenerateEmail(analyzedAudits []*models.AnalyzedAudit, emailTemplateService email.TemplateServiceImpl) (string, string, error) {
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

func SendEmail(emailAddress string, subject string, body string, emailService oddmail.GoSimpleMailService) error {
	err := emailService.Send(emailService.GetConfig().GetDefaultSender(), []string{emailAddress}, nil, subject, "text/html", body)
	if err != nil {
		return err
	}

	return nil
}
