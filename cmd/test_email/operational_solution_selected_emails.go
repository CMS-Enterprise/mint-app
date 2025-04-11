package main

import (
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendOperationalSolutionSelectedTestEmail(
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
	startDate := time.Date(2020, 5, 13, 20, 47, 50, 120000000, time.UTC)
	pocEmails := []string{"poc1@email.email", "poc2@email.email"}
	leadNames := []string{"Model Lead1", "Model Lead2"}
	filterView := "CBOSC"

	err := sendOperationalSolutionSelectedForUseByModelEmail(emailService,
		templateService,
		addressBook,
		solutionName,
		solutionStatus,
		needName,
		modelName,
		modelPlanID.String(),
		modelShortName,
		modelStatus,
		&startDate,
		pocEmails,
		leadNames,
		filterView,
	)
	noErr(err)
}

// sendOperationalSolutionSelectedForUseByModelEmail parses the provided data into content for an email, and sends the email.
func sendOperationalSolutionSelectedForUseByModelEmail(
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
	modelStartDate *time.Time,

	pocEmailAddress []string,
	modelLeadNames []string,
	filterView string,
) error {

	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.OperationalSolutionSelectedTemplateName)
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
		ModelStartDate:    modelStartDate,
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
