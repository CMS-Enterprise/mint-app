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

func sendMTOCommonSolutionPOCAddedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	role := "Team Lead"
	contact := models.MTOCommonSolutionContact{
		Name:          "Jane Doe",
		Email:         "jane.doe@example.com",
		Role:          &role,
		IsPrimary:     true,
		ReceiveEmails: true,
		Key:           "INNOVATION",
	}

	err := sendSolutionContactAddedEmail(emailService, templateService, addressBook, &contact)
	noErr(err)
}

func sendSolutionContactAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCAddedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.PointOfContactAddedSubjectContent{
		SolutionAcronym: string(contact.Key),
	}
	bodyContent := email.NewPointOfContactAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	)

	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{contact.Email},
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

func sendMTOCommonSolutionPOCEditedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	role := "Team Lead"
	contact := models.MTOCommonSolutionContact{
		Name:          "Jane Doe",
		Email:         "jane.doe@example.com",
		Role:          &role,
		IsPrimary:     false,
		ReceiveEmails: false,
		Key:           "INNOVATION",
	}

	err := sendSolutionContactEditedEmail(emailService, templateService, addressBook, &contact)
	noErr(err)
}

func sendSolutionContactEditedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionPOCEditedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.PointOfContactUpdatedSubjectContent{
		SolutionAcronym: string(contact.Key),
	}
	bodyContent := email.NewPointOfContactUpdatedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	)

	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{contact.Email},
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

func sendMTOCommonSolutionPOCRemovedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contact := &models.MTOCommonSolutionContact{
		Name:      "Jane Doe",
		IsTeam:    false,
		Key:       "INNOVATION",
		IsPrimary: false,
		Email:     "jane.doe@example.com",
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

func sendMTOCommonSolutionOwnerAddedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contact := models.MTOCommonSolutionContact{
		Name:   "Jane Doe",
		IsTeam: false,
		Key:    "INNOVATION",
	}

	err := sendSystemOwnerAddedEmail(emailService, templateService, addressBook, &contact)
	noErr(err)
}

func sendSystemOwnerAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionOwnerAddedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.SystemOwnerAddedSubjectContent{
		SolutionAcronym: string(contact.Key),
	}
	bodyContent := email.NewSystemOwnerAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	)

	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{"test@mint.cms.gov"},
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

func sendMTOCommonSolutionOwnerEditedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contact := models.MTOCommonSolutionContact{
		Name:   "Jane Doe",
		IsTeam: false,
		Key:    "INNOVATION",
	}

	err := sendSystemOwnerEditedEmail(emailService, templateService, addressBook, &contact)
	noErr(err)
}

func sendSystemOwnerEditedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionOwnerEditedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.SystemOwnerUpdatedSubjectContent{
		SolutionAcronym: string(contact.Key),
	}
	bodyContent := email.NewSystemOwnerUpdatedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
	)

	emailSubject, err := emailTemplate.GetExecutedSubject(subjectContent)
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(bodyContent)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{"test@mint.cms.gov"},
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
