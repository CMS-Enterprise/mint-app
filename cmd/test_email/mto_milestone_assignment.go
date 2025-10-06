package main

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendMTOMilestoneAssignedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	// Create test milestone
	milestoneName := "Complete data validation and testing"
	milestone := models.NewMTOMilestone(
		uuid.New(),
		&milestoneName,
		nil,
		uuid.New(),
		nil,
	)
	needByDate := time.Now().AddDate(0, 2, 0)
	milestone.NeedBy = &needByDate

	// Create test model plan
	modelPlan := models.NewModelPlan(
		milestone.ModelPlanID,
		"Comprehensive Care for Joint Replacement",
	)

	// Create test solutions
	solutions := []string{
		"4innovation (4i)",
		"Centralized Data Exchange (CDX)",
		"Health Data Reporting (HDR)",
	}

	err := sendMTOMilestoneAssignedTestEmailHelper(
		emailService,
		templateService,
		addressBook,
		milestone,
		modelPlan,
		solutions,
	)
	noErr(err)
}

func sendMTOMilestoneAssignedTestEmailHelper(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	milestone *models.MTOMilestone,
	modelPlan *models.ModelPlan,
	solutionNames []string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	// Get email template
	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOMilestoneAssignedTemplateName)
	if err != nil {
		return err
	}

	// Prepare subject content
	subjectContent := email.MilestoneAssignedSubjectContent{
		ModelName: modelPlan.ModelName,
	}

	// Prepare body content
	bodyContent := email.NewMilestoneAssignedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		modelPlan,
		milestone,
		solutionNames,
	)

	// Execute subject template
	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	// Execute body template
	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
	if err != nil {
		return err
	}

	// Send test email
	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{"test@mint.cms.gov"}, // Use test email address
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	if err != nil {
		return err
	}

	return nil
}
