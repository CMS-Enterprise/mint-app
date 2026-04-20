package main

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendMTOCommonMilestoneCreatedTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	err := sendMTOCommonMilestoneCreatedEmail(emailService, addressBook)
	noErr(err)
}

func sendMTOCommonMilestoneCreatedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	if emailService == nil {
		return nil
	}

	clientAddress := emailService.GetConfig().GetClientAddress()
	emailSubject, emailBody, err := email.MTO.CommonMilestone.Added.GetContent(
		email.MTOCommonMilestoneCreatedSubjectContent{},
		email.MTOCommonMilestoneCreatedBodyContent{
			UserName:       "Jane Doe",
			MilestoneTitle: "Acquire an application support contractor",
			CategoryAndSub: "Operations / Internal functions",
			Roles:          "Model team, IT lead",
			Solutions:      "4innovation (4i), Salesforce CONNECT",
			Link:           clientAddress + "/help-and-knowledge/common-milestones",
			ClientAddress:  clientAddress,
		},
	)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
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

func sendMTOCommonMilestoneUpdatedTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	err := sendMTOCommonMilestoneUpdatedEmail(emailService, addressBook)
	noErr(err)
}

func sendMTOCommonMilestoneUpdatedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	if emailService == nil {
		return nil
	}

	clientAddress := emailService.GetConfig().GetClientAddress()
	emailSubject, emailBody, err := email.MTO.CommonMilestone.Updated.GetContent(
		email.MTOCommonMilestoneUpdatedSubjectContent{},
		email.MTOCommonMilestoneUpdatedBodyContent{
			UserName:               "Jane Doe",
			PreviousTitle:          "Acquire an application support contractor",
			PreviousDescription:    "Original milestone description for contractor acquisition.",
			PreviousCategoryAndSub: "Operations / Internal functions",
			PreviousRoles:          "Model team",
			PreviousSolutions:      "4innovation (4i)",
			NewTitle:               "Acquire and onboard an application support contractor",
			NewDescription:         "Updated milestone description with onboarding details.",
			NewCategoryAndSub:      "Operations / Vendor management",
			NewRoles:               "Model team, IT lead",
			NewSolutions:           "4innovation (4i), Salesforce CONNECT",
			Link:                   clientAddress + "/help-and-knowledge/common-milestones",
			ClientAddress:          clientAddress,
		},
	)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
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

func sendMTOCommonMilestoneRemovedTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	err := sendMTOCommonMilestoneRemovedEmail(emailService, addressBook)
	noErr(err)
}

func sendMTOCommonMilestoneRemovedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) error {
	if emailService == nil {
		return nil
	}

	clientAddress := emailService.GetConfig().GetClientAddress()
	emailSubject, emailBody, err := email.MTO.CommonMilestone.Removed.GetContent(
		email.MTOCommonMilestoneRemovedSubjectContent{},
		email.MTOCommonMilestoneRemovedBodyContent{
			UserName:       "Jane Doe",
			MilestoneTitle: "Acquire an application support contractor",
			Description:    "Milestone description for contractor acquisition.",
			CategoryAndSub: "Operations / Internal functions",
			Roles:          "Model team, IT lead",
			Solutions:      "4innovation (4i), Salesforce CONNECT",
			ClientAddress:  clientAddress,
		},
	)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
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
