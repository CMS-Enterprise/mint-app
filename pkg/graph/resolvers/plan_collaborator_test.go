package resolvers

import (
	"context"

	"github.com/golang/mock/gomock"

	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestCreatePlanCollaborator() {
	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

	planName := "Plan For Milestones"
	plan := suite.createModelPlan(planName)

	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		UserName:    "CLAB",
		TeamRole:    models.TeamRoleLeadership,
	}
	expectedEmail := "CLAB.doe@local.fake" //comes from stubFetchUserInfo

	testTemplate, expectedSubject, expectedBody := createAddedAsCollaboratorTemplateCacheHelper(planName, plan)

	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.AddedAsCollaboratorTemplateName)).
		Return(testTemplate, nil).
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

	mockEmailService.
		EXPECT().
		Send(
			gomock.Eq("unit-test-execution@mint.cms.gov"),
			gomock.Eq([]string{expectedEmail}),
			gomock.Any(),
			gomock.Eq(expectedSubject),
			gomock.Any(),
			gomock.Eq(expectedBody),
		).
		AnyTimes()

	collaborator, _, err := CreatePlanCollaborator(
		context.Background(),
		suite.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		addressBook,
		collaboratorInput,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	account, uAccountErr := suite.testConfigs.Store.UserAccountGetByUsername(collaboratorInput.UserName)
	suite.NoError(uAccountErr)
	suite.NotNil(account)

	suite.NoError(err)
	suite.EqualValues(plan.ID, collaborator.ModelPlanID)
	suite.EqualValues(account.ID, collaborator.UserID)
	suite.EqualValues(models.TeamRoleLeadership, collaborator.TeamRole)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, collaborator.CreatedBy)
	suite.Nil(collaborator.ModifiedBy)
	mockController.Finish()
}

func (suite *ResolverSuite) TestUpdatePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "CLAB", models.TeamRoleLeadership)
	suite.Nil(collaborator.ModifiedBy)
	suite.Nil(collaborator.ModifiedDts)

	updatedCollaborator, err := UpdatePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, models.TeamRoleEvaluation, suite.testConfigs.Principal, suite.testConfigs.Store)

	account, uAccountErr := suite.testConfigs.Store.UserAccountGetByUsername("CLAB")
	suite.NoError(uAccountErr)
	suite.NotNil(account)

	suite.NoError(err)
	suite.NotNil(updatedCollaborator.ModifiedBy)
	suite.NotNil(updatedCollaborator.ModifiedDts)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedCollaborator.ModifiedBy)
	suite.EqualValues(account.ID, collaborator.UserID)
	suite.EqualValues(models.TeamRoleEvaluation, updatedCollaborator.TeamRole)
}

func (suite *ResolverSuite) TestUpdatePlanCollaboratorLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	collaborator := collaborators[0]
	updatedPlanCollaborator, err := UpdatePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, models.TeamRoleEvaluation, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(updatedPlanCollaborator)
}

func (suite *ResolverSuite) TestFetchCollaboratorsByModelPlanID() {
	plan := suite.createModelPlan("Plan For Milestones")
	_ = suite.createPlanCollaborator(plan, "SCND", models.TeamRoleLeadership)

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(collaborators, 2)
	suite.NotEqual(collaborators[0].ID, collaborators[1].ID) // two different collaborators
	// for _, i := range collaborators { //TODO UPDATE!
	// 	suite.Contains([]string{"TEST", "SCND"}, i.EUAUserID) // contains default collaborator and new one
	// }
}

func (suite *ResolverSuite) TestFetchCollaboratorByID() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "SCND", models.TeamRoleLeadership)

	collaboratorByID, err := FetchCollaboratorByID(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(collaboratorByID, collaborator)
}

func (suite *ResolverSuite) TestDeletePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "SCND", models.TeamRoleLeadership)

	// Delete the 2nd collaborator
	deletedCollaborator, err := DeletePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(deletedCollaborator, collaborator)

	// Ensure we get an error when we try fetch it
	collaboratorByID, err := FetchCollaboratorByID(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Store)
	suite.Error(err)
	suite.Nil(collaboratorByID)
}

func (suite *ResolverSuite) TestDeletePlanCollaboratorLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	collaborator := collaborators[0]
	deletedPlanCollaborator, err := DeletePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(deletedPlanCollaborator)
}

func (suite *ResolverSuite) TestIsPlanCollaborator() {

	plan := suite.createModelPlan("Plan For Milestones")
	isCollab, err := IsPlanCollaborator(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(true, isCollab)

	assessment := getTestPrincipal(suite.testConfigs.Store, "FAIL")
	assessment.JobCodeASSESSMENT = true
	assessment.JobCodeUSER = true

	isCollabFalseCase, err := IsPlanCollaborator(suite.testConfigs.Logger, assessment, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(false, isCollabFalseCase)
}
