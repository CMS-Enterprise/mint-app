package main

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func sendDiscussionReplyOriginatorEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	DiscussionContent models.TaggedHTML,
	discussionID uuid.UUID,
	modelPlanID uuid.UUID,
	modelPlanName string,
	modelPlanAbbreviation string,
	originatorName string,
	originatorRole string,
	originatorEmail string,
	mostRecentReplyName string,
	replies []email.DiscussionReplyEmailContent,
) error {
	if emailService == nil || emailTemplateService == nil {
		return nil
	}

	emailTemplate, err := emailTemplateService.GetEmailTemplate(email.DiscussionReplyCreatedOriginatorTemplateName)
	if err != nil {
		return err
	}

	emailSubject, err := emailTemplate.GetExecutedSubject(email.DiscussionReplyCreatedOriginatorSubject{
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation,
	})
	if err != nil {
		return err
	}
	replyCount := len(replies)
	if replyCount > 2 {
		replies = replies[:2] // only retain the first two replies
	}

	emailBody, err := emailTemplate.GetExecutedBody(email.DiscussionReplyCreatedOriginatorBody{
		ClientAddress:     emailService.GetConfig().GetClientAddress(),
		DiscussionID:      discussionID.String(),
		DiscussionContent: DiscussionContent.RawContent.ToTemplate(),
		ModelID:           modelPlanID.String(),
		ModelName:         modelPlanName,
		ModelAbbreviation: modelPlanAbbreviation,
		OriginatorName:    originatorName,
		OriginatorRole:    originatorRole,
		Replies:           replies,
		ReplyCount:        replyCount,
	})
	if err != nil {
		return err
	}

	err = emailService.Send(addressBook.DefaultSender, []string{originatorEmail}, nil, emailSubject, "text/html", emailBody)
	if err != nil {
		return err
	}

	return nil
}

func sendDiscussionReplyOriginatorTestEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook) {

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
	createdByUserRole := "Test User Role"
	createdByUserEmail := "TestUser@test.com"
	modelName := "Test Model Plan Name"
	modelAbbreviation := "TMPN"

	replies := []email.DiscussionReplyEmailContent{ // This should be sorted that it is newest to oldest
		{
			UserName: "Joe Soccer",
			Role:     "Sportsball Star",
			Content:  "<p>Hey here is a reply</p>",
		},
		{
			UserName: "Joe Baseball",
			Role:     "Sportsball Coach",
			Content:  "<p>Hey here is a reply again</p> <ul><li>bulletPoint</li></ul>",
		},
		{
			UserName: "Jane Football",
			Role:     "Sportsball Star",
			Content:  "<p>Hey here is a football reply </p> <ul><li>bulletPoint</li><li>football</li></ul>",
		},
		{
			UserName: "Tim Swim",
			Role:     "Swimming Star",
			Content:  "<p>Hey here is a noodle reply </p>",
		},
	}

	err = sendDiscussionReplyOriginatorEmail(
		emailService,
		emailTemplateService,
		addressBook,
		models.TaggedHTML(taggedContent),
		uuid.New(),
		uuid.New(),
		modelName,
		modelAbbreviation,
		createdByUserName,
		createdByUserRole,
		createdByUserEmail,
		replies[0].UserName,
		replies,
	)

	noErr(err)

}
