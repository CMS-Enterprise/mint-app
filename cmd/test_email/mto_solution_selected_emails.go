package main

import (
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendMTOSolutionSelectedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	solutionName := "CBOSC"
	solutionStatus := "Backlog"
	milestoneNames := helpers.PointerTo("Helpdesk support")
	modelName := "Transformation in Maternal Health"
	modelShortName := "TMaH"
	modelStatus := "CMS clearance"
	modelPlanID := uuid.New()
	startDate := time.Date(2026, 6, 11, 20, 47, 50, 120000000, time.UTC)
	pocEmails := []string{"poc1@email.email", "poc2@email.email"}
	leadNames := []string{"Model Lead1", "Model Lead2"}
	filterView := "CBOSC"

	err := sendMTOSolutionSelectedForUseByModelEmail(emailService,
		templateService,
		addressBook,
		solutionName,
		solutionStatus,
		milestoneNames,
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

// sendMTOSolutionSelectedForUseByModelEmail parses the provided data into content for an email, and sends the email.
func sendMTOSolutionSelectedForUseByModelEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	solutionName string,
	solutionStatus string,
	milestoneNames *string,
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

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOSolutionSelectedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.MTOSolutionSelectedSubjectContent{
		ModelName:    modelPlanName,
		SolutionName: solutionName,
	})
	if err != nil {
		return err
	}
	modelLeadJoin := strings.Join(modelLeadNames, ", ")

	emailBody, err := emailTemplate.GetExecutedBody(email.MTOSolutionSelectedBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		FilterView:        filterView,
		SolutionName:      solutionName,
		SolutionStatus:    solutionStatus,
		ModelLeadNames:    modelLeadJoin,
		MilestoneNames:    milestoneNames,
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
