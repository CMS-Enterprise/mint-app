package main

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

// sendMTOCommonSolutionPOCWelcomeTestEmail demonstrates sending a welcome email to a new POC.
func sendMTOCommonSolutionPOCWelcomeTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contact := &models.MTOCommonSolutionContact{
		Email:         "poc@email.com",
		Key:           "INNOVATION",
		Name:          "John Doe",
		IsPrimary:     false,
		ReceiveEmails: true,
	}

	err := sendSolutionContactWelcomeEmail(
		emailService,
		templateService,
		addressBook,
		contact,
	)
	noErr(err)
}

func sendSolutionContactWelcomeEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCWelcomeTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.AddedAsPointOfContactSubjectContent{
		SolutionAcronym: string(contact.Key),
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewAddedAsPointOfContactBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	))
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{contact.Email}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}

func sendMTOCommonSolutionPOCRemovedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contact := &models.MTOCommonSolutionContact{
		Name:   "Jane Doe",
		IsTeam: false,
		Key:    "INNOVATION",
	}

	err := sendSolutionContactRemovedEmail(emailService, templateService, addressBook, contact)
	noErr(err)
}

func sendSolutionContactRemovedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCRemovedTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.PointOfContactRemovedSubjectContent{
		SolutionAcronym: string(contact.Key),
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewPointOfContactRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	))
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{contact.Email}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}
