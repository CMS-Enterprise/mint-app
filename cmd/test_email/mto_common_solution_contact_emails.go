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
		"4innovation (4i)",
	)
	noErr(err)
}

func sendSolutionContactWelcomeEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
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
		SolutionName:    solutionName,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewAddedAsPointOfContactBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
		solutionName,
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

	err := sendSolutionContactAddedEmail(emailService, templateService, addressBook, &contact, "4innovation (4i)")
	noErr(err)
}

func sendSolutionContactAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
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
		SolutionName:    solutionName,
	}
	bodyContent := email.NewPointOfContactAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
		solutionName,
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

	err := sendSolutionContactEditedEmail(emailService, templateService, addressBook, &contact, "4innovation (4i)")
	noErr(err)
}

func sendSolutionContactEditedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
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
		SolutionName:    solutionName,
	}
	bodyContent := email.NewPointOfContactUpdatedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
		solutionName,
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

	err := sendSolutionContactRemovedEmail(emailService, templateService, addressBook, contact, "4innovation (4i)")
	noErr(err)
}

func sendSolutionContactRemovedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
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
		SolutionName:    solutionName,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.NewPointOfContactRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
		solutionName,
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

func sendMTOCommonSolutionContractorAddedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contractorTitle := "Lead Leader"
	contractor := models.MTOCommonSolutionContractor{
		ContractorName:  "Acme Health Solutions",
		ContractorTitle: &contractorTitle,
		Key:             "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendContractorAddedEmail(emailService, templateService, addressBook, &contractor, solutionName)
	noErr(err)
}

func sendContractorAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionContractorAddedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.ContractorAddedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewContractorAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
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

func sendMTOCommonSolutionContractorEditedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contractor := models.MTOCommonSolutionContractor{
		ContractorName: "Acme Health Solutions",
		// Purposefully not setting ContractorTitle to test the default value
		Key: "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendContractorEditedEmail(emailService, templateService, addressBook, &contractor, solutionName)
	noErr(err)
}

func sendContractorEditedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionContractorEditedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.ContractorEditedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewContractorEditedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
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

func sendMTOCommonSolutionContractorRemovedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	contractorTitle := "Secondary Lead Leader"
	contractor := models.MTOCommonSolutionContractor{
		ContractorName:  "Acme Health Solutions",
		ContractorTitle: &contractorTitle,
		Key:             "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendContractorRemovedEmail(emailService, templateService, addressBook, &contractor, solutionName)
	noErr(err)
}

func sendContractorRemovedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.MTOCommonSolutionContractorRemovedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.ContractorRemovedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewContractorRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
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

func sendMTOCommonSolutionSystemOwnerAddedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	systemOwner := models.MTOCommonSolutionSystemOwner{
		CMSComponent: "OFFICE_OF_THE_ACTUARY_OACT",
		OwnerType:    "SYSTEM_OWNER",
		Key:          "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendSystemOwnerAddedEmail(emailService, templateService, addressBook, &systemOwner, solutionName)
	noErr(err)
}

func sendSystemOwnerAddedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	systemOwner *models.MTOCommonSolutionSystemOwner,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.SystemOwnerAddedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.SystemOwnerAddedSubjectContent{
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
	}
	bodyContent := email.NewSystemOwnerAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*systemOwner,
		solutionName,
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

func sendMTOCommonSolutionSystemOwnerEditedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	systemOwner := models.MTOCommonSolutionSystemOwner{
		CMSComponent: "OFFICE_OF_THE_ACTUARY_OACT",
		OwnerType:    "BUSINESS_OWNER",
		Key:          "INNOVATION",
	}
	solutionName := "4innovation (4i)"
	cmsComponents := []models.MTOCommonSolutionCMSComponent{"OFFICE_OF_THE_ACTUARY_OACT", "CENTER_FOR_MEDICARE_CM"}

	err := sendSystemOwnerEditedEmail(emailService, templateService, addressBook, &systemOwner, solutionName, cmsComponents)
	noErr(err)
}

func sendSystemOwnerEditedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	systemOwner *models.MTOCommonSolutionSystemOwner,
	solutionName string,
	cmsComponents []models.MTOCommonSolutionCMSComponent,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.SystemOwnerEditedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.SystemOwnerEditedSubjectContent{
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
	}
	bodyContent := email.NewSystemOwnerEditedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*systemOwner,
		solutionName,
		cmsComponents,
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

func sendMTOCommonSolutionSystemOwnerRemovedTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	systemOwner := models.MTOCommonSolutionSystemOwner{
		CMSComponent: "OFFICE_OF_THE_ACTUARY_OACT",
		OwnerType:    "SYSTEM_OWNER",
		Key:          "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendSystemOwnerRemovedEmail(emailService, templateService, addressBook, &systemOwner, solutionName)
	noErr(err)
}

func sendSystemOwnerRemovedEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	systemOwner *models.MTOCommonSolutionSystemOwner,
	solutionName string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.SystemOwnerRemovedTemplateName)
	if err != nil {
		return err
	}

	subjectContent := email.SystemOwnerRemovedSubjectContent{
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
		OwnerType:       string(systemOwner.OwnerType),
	}
	bodyContent := email.NewSystemOwnerRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*systemOwner,
		solutionName,
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
