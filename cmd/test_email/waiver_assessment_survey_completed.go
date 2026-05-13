package main

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendTestWaiverAssessmentSurveyMarkedCompleteEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelPlan := models.NewModelPlan(
		uuid.Nil,
		"Test Model Plan",
	)

	subjectContent := email.WaiverAssessmentSurveyCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.WaiverAssessmentSurveyCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: "Test User",
	}

	emailSubject, emailBody, err := email.WaiverAssessmentSurvey.Completed.GetContent(subjectContent, bodyContent)
	noErr(err)

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}
