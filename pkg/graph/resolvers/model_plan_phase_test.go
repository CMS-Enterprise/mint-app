package resolvers

import (
	"time"

	"github.com/cms-enterprise/mint-app/pkg/testconfig/emailtestconfigs"

	"github.com/golang/mock/gomock"

	"github.com/cms-enterprise/mint-app/pkg/userhelpers"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func (suite *ResolverSuite) TestSendEmailForPhaseSuggestion() {
	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

	planName := "Plan For Milestones"
	plan := suite.createModelPlan(planName)
	plan.PreviousSuggestedPhase = nil
	timeNow := time.Now().UTC()
	plan.ModifiedDts = &timeNow
	plan.ModifiedBy = &suite.testConfigs.Principal.Account().ID
	plan, err := suite.testConfigs.Store.ModelPlanUpdate(suite.testConfigs.Logger, plan)
	suite.NoError(err)

	emailRecipients := []string{"TEST1@local.mock", "TEST2@local.mock"}
	phaseSuggestion := model.PhaseSuggestion{
		Phase:             models.ModelPhaseIcipComplete,
		SuggestedStatuses: []models.ModelStatus{models.ModelStatusIcipComplete},
	}

	testTemplate, expectedSubject, expectedBody := emailtestconfigs.CreateTemplateCacheHelperWithInputTemplates(
		planName,
		plan,
		"{{.ModelName}}'s Test",
		"{{.ModelPlanName}} {{.ModelPlanID}}")

	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.ModelPlanSuggestedPhaseTemplateName)).
		Return(testTemplate, nil).
		Times(1)

	mockEmailService.
		EXPECT().
		Send(
			gomock.Eq("unit-test-execution@mint.cms.gov"),
			gomock.Eq(emailRecipients),
			gomock.Nil(), // CC
			gomock.Eq(expectedSubject),
			gomock.Eq("text/html"),
			gomock.Eq(expectedBody),
			gomock.Any(),
		).
		Times(1)

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
		Times(1)

	err = TrySendEmailForPhaseSuggestion(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		emailRecipients,
		mockEmailService,
		mockEmailTemplateService,
		&addressBook,
		&phaseSuggestion,
		plan,
	)
	suite.NoError(err)

	plan, err = suite.testConfigs.Store.ModelPlanGetByID(suite.testConfigs.Store, suite.testConfigs.Logger, plan.ID)
	suite.NoError(err)
	suite.NotNil(plan.PreviousSuggestedPhase)
	suite.EqualValues(models.ModelPhaseIcipComplete, *plan.PreviousSuggestedPhase)
}

func (suite *ResolverSuite) TestGetEmailsForModelPlanLeads() {
	planName := "Test Plan"
	plan := suite.createModelPlan(planName)

	expectedEmail := "Terry.Thompson@local.fake" // This comes from the stub fetch user info function

	// Ensure collaborator creation is correct
	collaborators, err := suite.testConfigs.Store.PlanCollaboratorGetByModelPlanID(suite.testConfigs.Logger, plan.ID)
	suite.NoError(err)
	suite.NotEmpty(collaborators)

	// Fetch emails
	emails, err := GetEmailsForModelPlanLeads(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.Equal([]string{expectedEmail}, emails)

	// Add another collaborator
	collaboratorInput := &model.PlanCollaboratorCreateInput{
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

func (suite *ResolverSuite) TestGetAllStatusEvaluationStrategies() {
	strategies := GetAllStatusEvaluationStrategies()

	// Ensure all strategies are returned
	expectedStrategies := []StatusEvaluationStrategy{
		&EndedStrategy{},
		&ActiveStrategy{},
		&AnnounceStrategy{},
		&ClearanceEndStrategy{},
		&ClearanceStartStrategy{},
		&ICIPCompleteStrategy{},
	}

	// Ensure the number of strategies match
	suite.Equal(len(expectedStrategies), len(strategies), "The number of returned strategies should match the expected number")

	// Check each strategy type
	for i, strategy := range strategies {
		suite.IsType(expectedStrategies[i], strategy, "Strategy type mismatch at index %d", i)
	}
}

func (suite *ResolverSuite) TestEvaluateSuggestedPhaseForClearance() {
	// Create a plan
	planName := "Test Plan"
	plan := suite.createModelPlan(planName)
	planBasics, err := suite.testConfigs.Store.PlanBasicsGetByModelPlanID(plan.ID)
	suite.NoError(err)

	yesterday := time.Now().Add(time.Hour * -24)
	tomorrow := time.Now().Add(time.Hour * 24)

	// Set Plan Basics dates
	planBasics.CompleteICIP = &tomorrow
	planBasics.ClearanceStarts = &yesterday // This is the important date for this test! (Clearance Start has passed)
	planBasics.ClearanceEnds = &tomorrow
	planBasics.Announced = &tomorrow
	planBasics.ApplicationsStart = &tomorrow
	planBasics.ApplicationsEnd = &tomorrow
	planBasics.PerformancePeriodStarts = &tomorrow
	planBasics.PerformancePeriodEnds = &tomorrow
	planBasics.WrapUpEnds = &tomorrow

	phaseSuggestion, err := EvaluateSuggestedStatus(plan.Status, planBasics)
	suite.NoError(err)
	suite.NotNil(phaseSuggestion)
	suite.EqualValues(models.ModelPhaseInClearance, phaseSuggestion.Phase)
}
