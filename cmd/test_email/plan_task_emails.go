package main

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendPlanTaskNewAvailableTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelID := uuid.New()
	modelName := "Test Model Plan"

	subjectContent := email.PlanTaskNewAvailableSubjectContent{
		ModelName: modelName,
	}
	bodyContent := email.PlanTaskNewAvailableBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelID:       modelID.String(),
		ModelName:     modelName,
		TaskList: []string{
			"Task 1",
			"Task 2",
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

	subjectContent := email.PlanTaskCompletedSubjectContent{
		ModelName: modelName,
	}
	bodyContent := email.PlanTaskCompletedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelID:       modelID.String(),
		ModelName:     modelName,
		TaskName:      "Task 1",
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
