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
	addressBook email.AddressBook,
) {
	// Create test milestone
	milestoneName := "Complete data validation and testing"
	key := models.MTOCommonMilestoneKeyManageCd
	milestone := models.NewMTOMilestone(
		uuid.New(),
		&milestoneName,
		nil,
		&key,
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
		addressBook,
		milestone,
		modelPlan,
		solutions,
	)
	noErr(err)
}

func sendMTOMilestoneAssignedTestEmailHelper(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	milestone *models.MTOMilestone,
	modelPlan *models.ModelPlan,
	solutionNames []string,
) error {
	if emailService == nil {
		return nil
	}

	// Prepare subject content
	subjectContent := email.MTOMilestoneAssignedSubjectContent{
		ModelName: modelPlan.ModelName,
	}

	// Prepare body content
	bodyContent := email.NewMTOMilestoneAssignedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		modelPlan,
		milestone,
		solutionNames,
	)

	// Get email content
	emailSubject, emailBody, err := email.MTO.Milestone.Assigned.GetContent(subjectContent, bodyContent)
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
