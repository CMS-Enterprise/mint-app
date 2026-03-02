package main

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/graph/resolvers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func main() {
	emailService := initializeOddMailService()
	addressBook := initializeAddressBook()

	// Running all test functions
	sendModelPlanCreatedEmailTest(emailService)

	// Discussion emails
	sendPlanDiscussionCreatedTestEmail(emailService, addressBook)
	sendPlanDiscussionTaggedUserTestEmail(emailService, addressBook)
	sendPlanDiscussionTaggedSolutionTestEmail(emailService, addressBook)

	//DiscussionReply email
	sendDiscussionReplyOriginatorTestEmail(emailService, addressBook)

	// Model plan emails
	sendModelPlanShareTest(emailService, addressBook)
	sendDateChangedEmailsTest(emailService, addressBook)
	sendCollaboratorAddedEmailTest(emailService, addressBook)
	sendDataExchangeApproachMarkedCompleteEmailNotificationTest(emailService, addressBook)
	sendTestIddocQuestionnaireMarkedCompleteEmail(emailService, addressBook)
	sendFeedbackEmail(emailService, addressBook)
	reportAProblemEmail(emailService, addressBook)

	// Solution emails

	sendMTOSolutionSelectedTestEmail(emailService, addressBook)

	// MTO Common Solution Contact emails for editable POC workflow
	sendMTOCommonSolutionPOCWelcomeTestEmail(emailService, addressBook)
	sendMTOCommonSolutionPOCRemovedTestEmail(emailService, addressBook)
	sendMTOCommonSolutionPOCAddedTestEmail(emailService, addressBook)
	sendMTOCommonSolutionPOCEditedTestEmail(emailService, addressBook)

	// MTO Common Solution Contractor emails for editable POC workflow
	sendMTOCommonSolutionContractorRemovedTestEmail(emailService, addressBook)
	sendMTOCommonSolutionContractorAddedTestEmail(emailService, addressBook)
	sendMTOCommonSolutionContractorEditedTestEmail(emailService, addressBook)

	// MTO Common Solution System Owner emails for editable POC workflow
	sendMTOCommonSolutionSystemOwnerAddedTestEmail(emailService, addressBook)
	sendMTOCommonSolutionSystemOwnerEditedTestEmail(emailService, addressBook)
	sendMTOCommonSolutionSystemOwnerRemovedTestEmail(emailService, addressBook)

	// Model Plan Suggested Phase Emails
	sendModelPlanSuggestedPhaseEmailsTestWithPhaseInClearance(emailService, addressBook)
	sendModelPlanSuggestedPhaseEmailsTestWithPhaseIcipComplete(emailService, addressBook)

	// Daily Digest Email
	sendTestDailyDigestEmail(emailService, addressBook)           // daily digest email to user
	sendTestDailyDigestEmailAggregated(emailService, addressBook) // daily digest email to mint team

	// MTO Milestone Assignment Email
	sendMTOMilestoneAssignedTestEmail(emailService, addressBook)

	// Model Plan Created Email showing if it was in the test environment
	testEnv, err := appconfig.NewEnvironment("test")
	if err != nil {
		panic("unable to create test environment")
	}
	appconfig.SetEnvironment(testEnv)
	sendModelPlanCreatedEmailTest(emailService)
}

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

func initializeOddMailService() oddmail.EmailService {
	emailServiceConfig := oddmail.GoSimpleMailServiceConfig{
		Enabled:       true,
		Host:          "localhost",
		Port:          1030,
		ClientAddress: "localhost:3005",
	}

	emailService, err := oddmail.NewGoSimpleMailService(emailServiceConfig)
	noErr(err)
	return emailService
}

func initializeAddressBook() email.AddressBook {
	return email.AddressBook{
		DefaultSender: "test@mint.dev.cms.gov",
		MINTTeamEmail: "test.team@mint.dev.cms.gov",
		DevTeamEmail:  "test.dev.team@mint.dev.cms.gov",

		ModelPlanDateChangedRecipients: []string{
			"test.receiver.1@mint.dev.cms.gov",
			"test.receiver.2@mint.dev.cms.gov",
		},
	}
}

func sendPlanDiscussionCreatedTestEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	discussionUserRole := models.DiscussionRoleMintTeam
	tag1EUA := "SKZO"
	tag1Label := "Alexander Stark"
	tag1Type := models.TagTypeUserAccount
	tag1 := `<span data-type="mention" tag-type="` + string(tag1Type) + `" class="mention" data-id="` + tag1EUA + `" data-label="` + tag1Label + `">@` + tag1Label + `</span>`

	tag2ID := "HIGLAS"
	tag2Label := "Healthcare Integrated General Ledger Accounting System (HIGLAS)"
	tag2Type := models.TagTypeMTOCommonSolution
	tag2 := `<span data-type="mention" tag-type="` + string(tag2Type) + `" class="mention" data-id="` + tag2ID + `" data-label="` + tag2Label + `">@` + tag2Label + `</span>`

	tag3ID := "CONNECT"
	tag3Label := "Salesforce CONNECT"
	tag3Type := models.TagTypeMTOCommonSolution
	tag3 := `<span data-type="mention" tag-type="` + string(tag3Type) + `" class="mention" data-id="` + tag3ID + `" data-label="` + tag3Label + `">@` + tag3Label + `</span>`

	content := "Test Content for Plan Discussion, check out this tag  " + tag1 + "!  BTW, here is a list of solutions <ul><li>" + tag2 + "</li><li>" + tag3 + "</li></ul>"

	taggedContent, err := models.NewTaggedContentFromString(content)
	noErr(err)

	planDiscussion := models.NewPlanDiscussion(
		uuid.Nil,
		false,
		uuid.Nil,
		models.TaggedHTML(taggedContent),
		&discussionUserRole,
		models.StringPointer("Test User Role Description"),
	)

	err = sendPlanDiscussionCreatedEmail(
		emailService,
		addressBook,
		addressBook.MINTTeamEmail,
		planDiscussion,
		uuid.Nil,
	)
	noErr(err)
}

func sendPlanDiscussionCreatedEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
	receiverEmail string,
	planDiscussion *models.PlanDiscussion,
	modelPlanID uuid.UUID,
) error {
	if emailService == nil {
		return nil
	}
	createdByUserName := "Test User"
	modelName := "Test Model Plan Name"
	modelAbbreviation := "TMPN"

	modelPlan := models.ModelPlan{
		ModelName:    modelName,
		Abbreviation: &modelAbbreviation,
	}

	subjectContent := email.PlanDiscussionCreatedSubjectContent{
		UserName:          createdByUserName,
		ModelName:         modelName,
		ModelAbbreviation: modelAbbreviation,
	}
	bodyContent := email.NewPlanDiscussionCreatedBodyContent(
		emailService.GetConfig().GetClientAddress(),
		planDiscussion,
		&modelPlan,
		createdByUserName,
		planDiscussion.UserRole.Humanize(models.ValueOrEmpty(planDiscussion.UserRoleDescription)),
	)

	emailSubject, emailBody, err := email.PlanDiscussion.Created.GetContent(subjectContent, bodyContent)
	if err != nil {
		return err
	}

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{receiverEmail},
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

func sendModelPlanCreatedEmailTest(
	emailService oddmail.EmailService,
) {
	subjectContent := email.ModelPlanCreatedSubjectContent{
		ModelName: "Test Model Plan",
	}
	bodyContent := email.ModelPlanCreatedBodyContent{
		ClientAddress: "localhost:3005",
		ModelName:     "Test Model Plan",
		ModelID:       "00",
		UserName:      "Test User",
		IsGeneralUser: true,
	}

	emailSubject, emailBody, err := email.ModelPlan.Created.GetContent(subjectContent, bodyContent)
	noErr(err)

	err = emailService.Send(
		"test@mint.cms.gov",
		[]string{"test@mint.cms.gov"},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}

func sendModelPlanShareTest(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	// Mocked data
	modelPlanID := uuid.New()
	receiverEmails := []string{"test1@example.com", "test2@example.com"}
	optionalMessage := models.StringPointer("This is an optional message.")

	// Mocked model plan and related data
	modelPlan := models.NewModelPlan(
		modelPlanID,
		"Test Model Plan",
	)

	// Get client address
	clientAddress := emailService.GetConfig().GetClientAddress()

	username := "Bob Ross"

	// Mocking data for AdditionalModelCategories
	modelPlanCategoriesHumanized := []string{
		"Accountable Care",
		"Disease-Specific & Episodic",
		"Health Plan",
		"Prescription Drug",
	}

	humanizedViewFilter := models.StringPointer("Chronic Conditions Warehouse")
	lowercaseViewFilter := models.StringPointer("ccw")

	// Mocking data for modelLeads
	modelLeads := []string{"Lead 1", "Lead 2"}

	subjectContent := email.ModelPlanShareSubjectContent{
		UserName: username,
	}
	bodyContent := email.ModelPlanShareBodyContent{
		UserName:                 username,
		OptionalMessage:          optionalMessage,
		ModelName:                modelPlan.ModelName,
		ModelShortName:           modelPlan.Abbreviation,
		ModelCategories:          modelPlanCategoriesHumanized,
		ModelStatus:              models.ModelStatusHumanized[modelPlan.Status],
		ModelLastUpdated:         modelPlan.CreatedDts,
		ModelLeads:               modelLeads,
		ModelViewFilter:          lowercaseViewFilter,
		HumanizedModelViewFilter: humanizedViewFilter,
		ClientAddress:            clientAddress,
		ModelID:                  modelPlan.ID.String(),
	}

	emailSubject, emailBody, err := email.ModelPlan.Shared.GetContent(subjectContent, bodyContent)
	noErr(err)

	// Send email
	err = emailService.Send(
		addressBook.DefaultSender,
		receiverEmails,
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}

func sendDateChangedEmailsTest(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelPlan := models.NewModelPlan(
		uuid.Nil,
		"Test Model Plan",
	)

	t1, _ := time.Parse(time.RFC3339, "2024-01-01T00:00:00Z")
	dateChangeSlice := []email.DateChange{
		{
			Field:     "Complete ICIP",
			IsChanged: true,
			NewDate:   &t1,
		}, {
			Field:         "Clearance",
			IsRange:       true,
			IsChanged:     true,
			NewRangeStart: &t1,
			NewRangeEnd:   &t1,
		}, {
			Field:     "Announce model",
			IsChanged: true,
			NewDate:   &t1,
		}, {
			Field:         "Application period",
			IsRange:       true,
			IsChanged:     true,
			NewRangeStart: &t1,
			NewRangeEnd:   &t1,
		}, {
			Field:         "Performance period",
			IsChanged:     true,
			IsRange:       true,
			NewRangeStart: &t1,
			NewRangeEnd:   &t1,
		}, {
			Field:     "Model wrap-up end date",
			IsChanged: true,
			NewDate:   &t1,
		},
	}

	subjectContent := email.ModelPlanDateChangedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.ModelPlanDateChangedBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
		DateChanges:   dateChangeSlice,
	}

	emailSubject, emailBody, err := email.ModelPlan.DateChanged.GetContent(subjectContent, bodyContent)
	noErr(err)

	err = emailService.Send(
		addressBook.DefaultSender,
		addressBook.ModelPlanDateChangedRecipients,
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}

func sendCollaboratorAddedEmailTest(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	receiverEmail := "test@example.com"
	modelPlan := models.NewModelPlan(
		uuid.Nil,
		"Test Model Plan",
	)

	emailSubject, emailBody, err := email.Collaborator.Added.GetContent(email.AddedAsCollaboratorSubjectContent{
		ModelName: modelPlan.ModelName,
	}, email.AddedAsCollaboratorBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		ModelName:     modelPlan.ModelName,
		ModelID:       modelPlan.GetModelPlanID().String(),
	})
	noErr(err)

	err = emailService.Send(addressBook.DefaultSender, []string{receiverEmail}, nil, emailSubject, "text/html", emailBody)
	noErr(err)
}

func sendDataExchangeApproachMarkedCompleteEmailNotificationTest(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {

	modelPlan := models.NewModelPlan(
		uuid.Nil,
		"Retcon Plan",
	)

	err := resolvers.SendDataExchangeApproachMarkedCompleteEmailNotification(
		emailService,
		addressBook,
		modelPlan,
		"marty.mcfly@delorean.88",
		"Doc Brown",
		true,
	)

	noErr(err)
}

func sendFeedbackEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	princ := authentication.ApplicationPrincipal{
		UserAccount: &authentication.UserAccount{
			CommonName: "Test Feedback reporter",
			Email:      "testReporterEmail@fake.com",
		},
	}

	satisfaction := model.SatisfactionLevelVerySatisfied
	easeOfUse := model.EaseOfUseAgree
	input := model.SendFeedbackEmailInput{
		IsAnonymousSubmission: false,
		AllowContact:          models.BoolPointer(true),
		CmsRole:               models.StringPointer("Inspector General"),
		MintUsedFor:           []model.MintUses{model.MintUsesOther, model.MintUsesEditModel},
		MintUsedForOther:      nil,
		SystemEasyToUse:       &easeOfUse,
		SystemEasyToUseOther:  models.StringPointer("I agree"),
		HowSatisfied:          &satisfaction,
		HowCanWeImprove:       models.StringPointer("Please send me a pizza after every model I submit"),
	}

	_, err := resolvers.SendFeedbackEmail(emailService, addressBook, &princ, input)
	noErr(err)
}

func reportAProblemEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	princ := authentication.ApplicationPrincipal{
		UserAccount: &authentication.UserAccount{
			CommonName: "Test Feedback reporter",
			Email:      "testReporterEmail@fake.com",
		},
	}
	section := model.ReportAProblemSectionOther
	severity := model.ReportAProblemSeverityOther
	input := model.ReportAProblemInput{
		IsAnonymousSubmission: false,
		AllowContact:          models.BoolPointer(true),
		Section:               &section,
		SectionOther:          models.StringPointer("The Landing page"),
		WhatDoing:             models.StringPointer("I was trying to log in"),
		WhatWentWrong:         models.StringPointer("I wasn't able to log in"),
		Severity:              &severity,
		SeverityOther:         models.StringPointer(" I couldn't log in for a week "),
	}

	_, err := resolvers.ReportAProblem(emailService, addressBook, &princ, input)
	noErr(err)
}

func sendModelPlanSuggestedPhaseEmailsTestWithPhaseInClearance(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelPlan := models.NewModelPlan(
		uuid.Nil,
		"Test Model Plan",
	)

	subjectContent := email.ModelPlanSuggestedPhaseSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.ModelPlanSuggestedPhaseBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		Phase:         string(models.ModelPhaseInClearance),
		SuggestedStatusesRaw: []string{
			string(models.ModelStatusInternalCmmiClearance),
			string(models.ModelStatusCmsClearance),
			string(models.ModelStatusHhsClearance),
			string(models.ModelStatusOmbAsrfClearance),
		},
		SuggestedStatusesHumanized: []string{
			models.ModelStatusInternalCmmiClearance.Humanize(),
			models.ModelStatusCmsClearance.Humanize(),
			models.ModelStatusHhsClearance.Humanize(),
			models.ModelStatusOmbAsrfClearance.Humanize(),
		},
		CurrentStatusHumanized: modelPlan.Status.Humanize(),
		ModelPlanID:            modelPlan.GetModelPlanID().String(),
		ModelPlanName:          modelPlan.ModelName,
	}

	emailSubject, emailBody, err := email.ModelPlan.SuggestedPhase.GetContent(subjectContent, bodyContent)
	noErr(err)

	err = emailService.Send(
		addressBook.DefaultSender,
		addressBook.ModelPlanDateChangedRecipients,
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}

func sendModelPlanSuggestedPhaseEmailsTestWithPhaseIcipComplete(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelPlan := models.NewModelPlan(
		uuid.Nil,
		"Test Model Plan",
	)

	subjectContent := email.ModelPlanSuggestedPhaseSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.ModelPlanSuggestedPhaseBodyContent{
		ClientAddress: emailService.GetConfig().GetClientAddress(),
		Phase:         string(models.ModelPhaseIcipComplete),
		SuggestedStatusesRaw: []string{
			string(models.ModelStatusIcipComplete),
		},
		SuggestedStatusesHumanized: []string{
			models.ModelStatusIcipComplete.Humanize(),
		},
		CurrentStatusHumanized: modelPlan.Status.Humanize(),
		ModelPlanID:            modelPlan.GetModelPlanID().String(),
		ModelPlanName:          modelPlan.ModelName,
	}

	emailSubject, emailBody, err := email.ModelPlan.SuggestedPhase.GetContent(subjectContent, bodyContent)
	noErr(err)

	err = emailService.Send(
		addressBook.DefaultSender,
		addressBook.ModelPlanDateChangedRecipients,
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}

func sendTestIddocQuestionnaireMarkedCompleteEmail(
	emailService oddmail.EmailService,
	addressBook email.AddressBook,
) {
	modelPlan := models.NewModelPlan(
		uuid.Nil,
		"Test Model Plan",
	)

	subjectContent := email.IDDOCQuestionnaireCompletedSubjectContent{
		ModelName: modelPlan.ModelName,
	}
	bodyContent := email.IDDOCQuestionnaireCompletedBodyContent{
		ClientAddress:                   emailService.GetConfig().GetClientAddress(),
		ModelName:                       modelPlan.ModelName,
		ModelID:                         modelPlan.GetModelPlanID().String(),
		MarkedCompletedByUserCommonName: "Test User",
		ShowFooter:                      true,
	}

	emailSubject, emailBody, err := email.IDDOCQuestionnaire.Completed.GetContent(subjectContent, bodyContent)
	noErr(err)

	err = emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.MINTTeamEmail},
		nil,
		emailSubject,
		"text/html",
		emailBody,
	)
	noErr(err)
}
