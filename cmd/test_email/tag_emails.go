package main

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendPlanDiscussionTaggedUserTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,
) {
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`

	tag2ID := "HIGLAS"
	tag2Label := "Healthcare Integrated General Ledger Accounting System (HIGLAS)"
	tag2Type := models.TagTypePossibleSolution
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2ID + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`

	tag3ID := "CONNECT"
	tag3Label := "Salesforce CONNECT"
	tag3Type := models.TagTypePossibleSolution
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`

	content := "Test Content for Plan Discussion, check out this tag  " + tag1 + "!  BTW, here is a list of solutions <ul><li>" + tag2 + "</li><li>" + tag3 + "</li></ul>"

	taggedContent, err := models.NewTaggedContentFromString(content)
	noErr(err)
	createdByUserName := "Test User"
	modelName := "Test Model Plan Name"
	modelAbbreviation := "TMPN"
	taggedUser := authentication.UserAccount{
		Username:   &tag1EUA,
		Email:      "aStarkTest@mint.mint",
		CommonName: tag1Label,
		FamilyName: "Stark",
		GivenName:  "Alexander",
	}
	discussionUserRoleHumanized := "Model Team"

	err = sendPlanDiscussionTaggedUserEmail(
		emailService,
		templateService,
		addressBook,
		models.TaggedHTML(taggedContent),
		uuid.New(),
		uuid.New(),
		modelName,
		modelAbbreviation,
		&taggedUser,
		createdByUserName,
		discussionUserRoleHumanized,
	)
	noErr(err)

}

func sendPlanDiscussionTaggedUserEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	tHTML models.TaggedHTML,
	discussionID uuid.UUID,
	modelPlanID uuid.UUID,
	modelPlanName string,
	modelPlanAbbreviation string,
	taggedUser *authentication.UserAccount,
	createdByUserName string,
	createdByUserRole string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.PlanDiscussionTaggedUserTemplateName)
	if err != nil {
		return err
	}
	emailSubject, err := emailTemplate.GetExecutedSubject(email.PlanDiscussionTaggedUserSubjectContent{
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation,
	})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.PlanDiscussionTaggedUserBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      discussionID.String(),
		UserName:          createdByUserName,
		DiscussionContent: tHTML.RawContent.ToTemplate(),
		ModelID:           modelPlanID.String(),
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation,
		Role:              createdByUserRole,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{taggedUser.Email}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil
}

func sendPlanDiscussionTaggedSolutionTestEmail(
	emailService oddmail.EmailService,
	templateService email.TemplateService,
	addressBook email.AddressBook,

) {
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`

	tag2ID := "HIGLAS"
	tag2Label := "Healthcare Integrated General Ledger Accounting System (HIGLAS)"
	tag2Type := models.TagTypePossibleSolution
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2ID + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`

	tag3ID := "CONNECT"
	tag3Label := "Salesforce CONNECT"
	tag3Type := models.TagTypePossibleSolution
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`

	content := "Test Content for Plan Discussion, check out this tag  " + tag1 + "!  BTW, here is a list of solutions <ul><li>" + tag2 + "</li><li>" + tag3 + "</li></ul>"

	taggedContent, err := models.NewTaggedContentFromString(content)
	noErr(err)
	createdByUserName := "Test User"
	modelName := "Test Model Plan Name"
	modelAbbreviation := "TMPN"
	solutionName := tag2Label
	discussionUserRoleHumanized := "Model Team"

	pocEmails := []string{
		"poctestemail1@mint.com",
		"poctestemail2@mint.com",
		"poctestemail3@mint.com",
	}

	err = sendPlanDiscussionTaggedSolutionEmail(
		emailService,
		templateService,
		addressBook,
		models.TaggedHTML(taggedContent),
		uuid.New(),
		uuid.New(),
		modelName,
		modelAbbreviation,
		solutionName,
		createdByUserName,
		discussionUserRoleHumanized,
		pocEmails,
	)
	noErr(err)

}

func sendPlanDiscussionTaggedSolutionEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	tHTML models.TaggedHTML,
	discussionID uuid.UUID,
	modelPlanID uuid.UUID,
	modelPlanName string,
	modelPlanAbbreviation string,
	taggedSolutionName string,
	createdByUserName string,
	createdByUserRole string,
	pocEmailAddress []string,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.PlanDiscussionTaggedPossibleSolutionTemplateName)
	if err != nil {
		return err
	}
	emailSubject, err := emailTemplate.GetExecutedSubject(email.PlanDiscussionTaggedSolutionSubjectContent{
		SolutionName:      taggedSolutionName,
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation})
	if err != nil {
		return err
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.PlanDiscussionTaggedSolutionBodyContent{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      discussionID.String(),
		UserName:          createdByUserName,
		DiscussionContent: tHTML.RawContent.ToTemplate(),
		ModelID:           modelPlanID.String(),
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation,
		Role:              createdByUserRole,
		SolutionName:      taggedSolutionName})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, pocEmailAddress, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}
	return nil

}
