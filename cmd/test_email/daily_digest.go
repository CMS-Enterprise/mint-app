package main

import (
	"time"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

// sendTestDailyDigestEmail sends a test daily digest email including MTO, data exchange, and plan section updates.
func sendTestDailyDigestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	analyzedAudit := &models.AnalyzedAudit{
		ModelName: "Test Model Plan",
		Date:      time.Now(),
		Changes: models.AnalyzedAuditChange{
			PlanDataExchangeApproach: &models.AnalyzedPlanDataExchangeApproach{
				Activity: true,
			},
			PlanSections: &models.AnalyzedPlanSections{
				Updated: []models.TableName{
					models.TNPlanBasics,
					models.TNPlanOpsEvalAndLearning,
					models.TNModelPlan,
				},
				ReadyForReview: []models.TableName{
					models.TNPlanTimeline,
					models.TNPlanOpsEvalAndLearning,
				},
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

// sendTestDailyDigestEmailAggregated sends a test daily digest email including MTO, data exchange, and plan section updates.
func sendTestDailyDigestEmailAggregated(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	analyzedAudit := &models.AnalyzedAudit{
		ModelName: "Test Model Plan",
		Date:      time.Now(),
		Changes: models.AnalyzedAuditChange{
			PlanDataExchangeApproach: &models.AnalyzedPlanDataExchangeApproach{
				Activity: true,
			},
			PlanSections: &models.AnalyzedPlanSections{
				Updated: []models.TableName{
					models.TNPlanBasics,
					models.TNPlanOpsEvalAndLearning,
					models.TNModelPlan,
				},
				ReadyForReview: []models.TableName{
					models.TNPlanTimeline,
					models.TNPlanOpsEvalAndLearning,
				},
			},
		},
	}
	analyzedAudit2 := &models.AnalyzedAudit{
		ModelName: "Test Model Plan 2",
		Date:      time.Now(),
		Changes: models.AnalyzedAuditChange{
			PlanDataExchangeApproach: &models.AnalyzedPlanDataExchangeApproach{
				Activity: true,
			},
			PlanSections: &models.AnalyzedPlanSections{
				Updated: []models.TableName{
					models.TNPlanBasics,
					models.TNPlanOpsEvalAndLearning,
					models.TNModelPlan,
				},
				ReadyForReview: []models.TableName{
					models.TNPlanTimeline,
					models.TNPlanOpsEvalAndLearning,
				},
			},
		},
	}

	emailTemplate, err := templateService.GetEmailTemplate(email.AggregatedDailyDigestTemplateName)
	noErr(err)

	subject, err := emailTemplate.GetExecutedSubject(email.AggregatedDailyDigestSubjectContent{})
	noErr(err)

	body, err := emailTemplate.GetExecutedBody(email.AggregatedDailyDigestBodyContent{
		AnalyzedAudits: []*models.AnalyzedAudit{analyzedAudit, analyzedAudit2},
		ClientAddress:  emailService.GetConfig().GetClientAddress(),
	})
	noErr(err)

	// Send generated email
	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
		nil,
		subject,
		"text/html",
		body,
	)
	noErr(err)
}
