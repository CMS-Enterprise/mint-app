package main

import (
	"strings"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

func sendSolutionSelectedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	solutionName := "CBOSC"
	solutionStatus := "Backlog"
	needName := "Helpdesk support"
	modelName := "Transformation in Maternal Health"
	modelShortName := "TMaH"
	modelStatus := "CMS clearance"
	modelPlanID := uuid.New()
	startDate := "06/11/2024"
	pocEmails := []string{"poc1@email.email", "poc2@email.email"}
	leadNames := []string{"Model Lead1", "Model Lead2"}
	filterView := "CBOSC"

	err := sendSolutionSelectedForUseByModelEmail(emailService,
		templateService,
		addressBook,
		solutionName,
		solutionStatus,
		needName,
		modelName,
		modelPlanID.String(),
		modelShortName,
		modelStatus,
		startDate,
		pocEmails,
		leadNames,
		filterView,
	)
	noErr(err)
}

// sendSolutionSelectedForUseByModelEmail parses the provided data into content for an email, and sends the email.
func sendSolutionSelectedForUseByModelEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	solutionName string,
	solutionStatus string,
	needName string,
	modelPlanName string,
	modelPlanID string,
	modelAbbreviation string,
	modelStatus string,
	modelStartDate string,

	pocEmailAddress []string,
	modelLeadNames []string,
	filterView string,
) error {
	// TODO: SW, extract the logic from func sendPlanDiscussionTagEmails to obfuscu

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.SolutionSelectedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.SolutionSelectedSubjectContent{
		ModelName:    modelPlanName,
		SolutionName: solutionName,
	})
	if err != nil {
		return err
	}
	modelLeadJoin := strings.Join(modelLeadNames, ", ")

	emailBody, err := emailTemplate.GetExecutedBody(email.SolutionSelectedBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		FilterView:        filterView,
		SolutionName:      solutionName,
		SolutionStatus:    solutionStatus,
		ModelLeadNames:    modelLeadJoin,
		NeedName:          needName,
		ModelID:           modelPlanID,
		ModelName:         modelPlanName,
		ModelAbbreviation: modelAbbreviation,
		ModelStatus:       modelStatus,
		ModelStartDate:    modelStartDate, // TODO:SW use the correct data, this is
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, pocEmailAddress, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	if err != nil {
		return err
	}

	return nil
}
