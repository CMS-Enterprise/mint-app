package resolvers

import (
	"time"

	"github.com/golang/mock/gomock"

	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
)

func (suite *ResolverSuite) TestSendEmailForPhaseSuggestionByModelPlanID() {
	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

	planName := "Plan For Milestones"
	plan := suite.createModelPlan(planName)

	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		UserName:    "CLAB",
		TeamRoles:   []models.TeamRole{models.TeamRoleLeadership},
	}

	expectedEmail := "CLAB.doe@local.fake" // This comes from the stub fetch user info function

	_, _, err := PlanCollaboratorCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		collaboratorInput,
		suite.testConfigs.Principal,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
		false,
	)
	suite.NoError(err)

	//Asset that making a collaborator also creates an account
	account, uAccountErr := storage.UserAccountGetByUsername(suite.testConfigs.Store, collaboratorInput.UserName)
	suite.NoError(uAccountErr)
	suite.NotNil(account)

	planBasics, err := suite.testConfigs.Store.PlanBasicsGetByModelPlanID(plan.ID)
	suite.NoError(err)
	suite.NotNil(planBasics)

	oneHourAgo := time.Now().Add(-time.Hour)
	planBasics.CompleteICIP = &oneHourAgo
	_, err = suite.testConfigs.Store.PlanBasicsUpdate(suite.testConfigs.Logger, planBasics)
	suite.NotNil(err)

	testTemplate, expectedSubject, expectedBody := createTemplateCacheHelper(planName, plan)
	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.ModelPlanSuggestedPhaseTemplateName)).
		Return(testTemplate, nil).
		AnyTimes()

	mockEmailService.
		EXPECT().
		Send(
			gomock.Any(),
			gomock.Eq([]string{expectedEmail}),
			gomock.Any(),
			gomock.Eq(expectedSubject),
			gomock.Any(),
			gomock.Eq(expectedBody),
		).
		AnyTimes()

	addressBook := email.AddressBook{
		DefaultSender: "unit-test-execution@mint.cms.gov",
	}

	emailServiceConfig := &oddmail.GoSimpleMailServiceConfig{
		ClientAddress: "http://localhost:3005",
	}

	mockEmailService.
		EXPECT().
		GetConfig().
		Return(emailServiceConfig).
		AnyTimes()

	err = SendEmailForPhaseSuggestionByModelPlanID(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		addressBook,
		plan.ID,
	)
	suite.NoError(err)
}

func (suite *ResolverSuite) TestGetEmailsForModelPlanLeads() {
	planName := "Test Plan"
	plan := suite.createModelPlan(planName)

	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		UserName:    "CLAB",
		TeamRoles:   []models.TeamRole{models.TeamRoleLeadership},
	}
	expectedEmail := "Terry.Thompson@local.fake" // This comes from the stub fetch user info function

	_, _, err := PlanCollaboratorCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		collaboratorInput,
		suite.testConfigs.Principal,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
		false,
	)
	suite.NoError(err)

	// Ensure collaborator creation is correct
	collaborators, err := suite.testConfigs.Store.PlanCollaboratorGetByModelPlanID(suite.testConfigs.Logger, plan.ID)
	suite.NoError(err)
	suite.NotEmpty(collaborators)

	// Fetch emails
	emails, err := GetEmailsForModelPlanLeads(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.Equal([]string{expectedEmail}, emails)

	// Add another collaborator
	collaboratorInput = &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		UserName:    "TST2",
		TeamRoles:   []models.TeamRole{models.TeamRoleModelLead},
	}

	expectedEmail2 := "TST2.doe@local.fake"

	_, _, err = PlanCollaboratorCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		collaboratorInput,
		suite.testConfigs.Principal,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
		false,
	)
	suite.NoError(err)

	// Ensure the second collaborator is also created
	collaborators, err = suite.testConfigs.Store.PlanCollaboratorGetByModelPlanID(suite.testConfigs.Logger, plan.ID)
	suite.NoError(err)
	suite.NotEmpty(collaborators)

	// Fetch emails again
	emails, err = GetEmailsForModelPlanLeads(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.ElementsMatch([]string{expectedEmail, expectedEmail2}, emails)
}
