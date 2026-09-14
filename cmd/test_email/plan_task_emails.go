package main

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendPlanTaskNewAvailableTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelID := uuid.New()
	modelName := "Test Model Plan"
	twoPagerTaskName := models.PlanTaskKeyTwoPager.DisplayName()
	sixPagerTaskName := models.PlanTaskKeySixPager.DisplayName()

	subjectContent := email.PlanTaskNewAvailableSubjectContent{
		ModelName: modelName,
	}
	bodyContent := email.PlanTaskNewAvailableBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelID:       modelID.String(),
		ModelName:     modelName,
		TaskList: []string{
			sixPagerTaskName,
			twoPagerTaskName,
		},
		IsModelLead: true,
	}

	emailSubject, emailBody, err := email.PlanTask.NewAvailable.GetContent(subjectContent, bodyContent)
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

func sendPlanTaskCompletedTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelID := uuid.New()
	modelName := "Test Model Plan"
	sixPagerTaskName := models.PlanTaskKeySixPager.DisplayName()

	subjectContent := email.PlanTaskCompletedSubjectContent{
		ModelName: modelName,
	}
	bodyContent := email.PlanTaskCompletedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelID:       modelID.String(),
		ModelName:     modelName,
		TaskName:      sixPagerTaskName,
		IsModelLead:   true,
	}

	emailSubject, emailBody, err := email.PlanTask.Completed.GetContent(subjectContent, bodyContent)
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
