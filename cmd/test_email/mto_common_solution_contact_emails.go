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
		addressBook,
		contact,
		"4innovation (4i)",
	)
	noErr(err)
}

func sendSolutionContactWelcomeEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	emailSubject, emailBody, err := email.MTO.CommonSolution.POC.Welcome.GetContent(
		email.MTOCommonSolutionPOCWelcomeSubjectContent{
			SolutionAcronym: string(contact.Key),
			SolutionName:    solutionName,
		},
		email.NewMTOCommonSolutionPOCWelcomeBodyContent(
			emailService.GetConfig().GetClientAddress(),
			*contact,
			solutionName,
		),
	)
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

	err := sendSolutionContactAddedEmail(emailService, addressBook, &contact, "4innovation (4i)")
	noErr(err)
}

func sendSolutionContactAddedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionPOCAddedSubjectContent{
		SolutionAcronym: string(contact.Key),
		SolutionName:    solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionPOCAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
		solutionName,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.POC.Added.GetContent(subjectContent, bodyContent)
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

	err := sendSolutionContactEditedEmail(emailService, addressBook, &contact, "4innovation (4i)")
	noErr(err)
}

func sendSolutionContactEditedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionPOCEditedSubjectContent{
		SolutionAcronym: string(contact.Key),
		SolutionName:    solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionPOCEditedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contact,
		solutionName,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.POC.Edited.GetContent(subjectContent, bodyContent)
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

	err := sendSolutionContactRemovedEmail(emailService, addressBook, contact, "4innovation (4i)")
	noErr(err)
}

func sendSolutionContactRemovedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	contact *models.MTOCommonSolutionContact,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	emailSubject, emailBody, err := email.MTO.CommonSolution.POC.Removed.GetContent(
		email.MTOCommonSolutionPOCRemovedSubjectContent{
			SolutionAcronym: string(contact.Key),
			SolutionName:    solutionName,
		},
		email.NewMTOCommonSolutionPOCRemovedBodyContent(
			emailService.GetConfig().GetClientAddress(),
			*contact,
			solutionName,
		),
	)
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
	contractTitle := "Lead Leader"
	contractor := models.MTOCommonSolutionContractor{
		ContractorName: "Acme Health Solutions",
		ContractTitle:  &contractTitle,
		Key:            "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendContractorAddedEmail(emailService, addressBook, &contractor, solutionName)
	noErr(err)
}

func sendContractorAddedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionContractorAddedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionContractorAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.Contractor.Added.GetContent(subjectContent, bodyContent)
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
		// Purposefully not setting contractTitle to test the default value
		Key: "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendContractorEditedEmail(emailService, addressBook, &contractor, solutionName)
	noErr(err)
}

func sendContractorEditedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionContractorEditedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionContractorEditedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.Contractor.Edited.GetContent(subjectContent, bodyContent)
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
	contractTitle := "Secondary Lead Leader"
	contractor := models.MTOCommonSolutionContractor{
		ContractorName: "Acme Health Solutions",
		ContractTitle:  &contractTitle,
		Key:            "INNOVATION",
	}
	solutionName := "4innovation (4i)"

	err := sendMTOCommonSolutionContractorRemovedEmail(emailService, addressBook, &contractor, solutionName)
	noErr(err)
}

func sendMTOCommonSolutionContractorRemovedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	contractor *models.MTOCommonSolutionContractor,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionContractorRemovedSubjectContent{
		SolutionName: solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionContractorRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*contractor,
		solutionName,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.Contractor.Removed.GetContent(subjectContent, bodyContent)
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

	err := sendMTOCommonSolutionSystemOwnerAddedEmail(emailService, addressBook, &systemOwner, solutionName)
	noErr(err)
}

func sendMTOCommonSolutionSystemOwnerAddedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	systemOwner *models.MTOCommonSolutionSystemOwner,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionSystemOwnerAddedSubjectContent{
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionSystemOwnerAddedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*systemOwner,
		solutionName,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.SystemOwner.Added.GetContent(subjectContent, bodyContent)
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

	err := sendSystemOwnerEditedEmail(emailService, addressBook, &systemOwner, solutionName, cmsComponents)
	noErr(err)
}

func sendSystemOwnerEditedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	systemOwner *models.MTOCommonSolutionSystemOwner,
	solutionName string,
	cmsComponents []models.MTOCommonSolutionCMSComponent,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionSystemOwnerEditedSubjectContent{
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionSystemOwnerEditedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*systemOwner,
		solutionName,
		cmsComponents,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.SystemOwner.Edited.GetContent(subjectContent, bodyContent)
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

	err := sendSystemOwnerRemovedEmail(emailService, addressBook, &systemOwner, solutionName)
	noErr(err)
}

func sendSystemOwnerRemovedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	systemOwner *models.MTOCommonSolutionSystemOwner,
	solutionName string,
) error {
	if emailService == nil {
		return nil
	}

	subjectContent := email.MTOCommonSolutionSystemOwnerRemovedSubjectContent{
		SolutionAcronym: string(systemOwner.Key),
		SolutionName:    solutionName,
	}
	bodyContent := email.NewMTOCommonSolutionSystemOwnerRemovedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		*systemOwner,
		solutionName,
	)

	emailSubject, emailBody, err := email.MTO.CommonSolution.SystemOwner.Removed.GetContent(subjectContent, bodyContent)
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
