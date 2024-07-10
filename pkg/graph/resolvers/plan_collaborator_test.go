package resolvers

import (
	"context"
	"fmt"

	"github.com/lib/pq"

	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/notifications"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestCreatePlanCollaboratorWithoutNotification() {
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
	expectedEmail := "CLAB.doe@local.fake" //comes from stubFetchUserInfo

	testTemplate, expectedSubject, expectedBody := createAddedAsCollaboratorTemplateCacheHelper(planName, plan)

	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.AddedAsCollaboratorTemplateName)).
		Return(testTemplate, nil).
		MaxTimes(0)

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
		MaxTimes(0)

	collaborator, _, err := PlanCollaboratorCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		addressBook,
		collaboratorInput,
		suite.testConfigs.Principal,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
		false,
	)

	//Asset that making a collaborator also creates an account
	account, uAccountErr := storage.UserAccountGetByUsername(suite.testConfigs.Store, collaboratorInput.UserName)
	suite.NoError(uAccountErr)
	suite.NotNil(account)

	suite.NoError(err)
	suite.EqualValues(plan.ID, collaborator.ModelPlanID)
	suite.EqualValues(account.ID, collaborator.UserID)
	suite.EqualValues(pq.StringArray{string(models.TeamRoleLeadership)}, collaborator.TeamRoles)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, collaborator.CreatedBy)
	suite.Nil(collaborator.ModifiedBy)

	// Assert that a notification was not generated for the collaborator
	collabPrinc := suite.getTestPrincipal(suite.testConfigs.Store, collaboratorInput.UserName)
	collabNots, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, collabPrinc)
	suite.NoError(err)
	suite.EqualValues(0, collabNots.NumUnreadNotifications())

	mockController.Finish()
}

func (suite *ResolverSuite) TestCreatePlanCollaboratorWithNotification() {
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

	collaborator, _, err := PlanCollaboratorCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		mockEmailService,
		mockEmailTemplateService,
		addressBook,
		collaboratorInput,
		suite.testConfigs.Principal,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
		true,
	)

	//Asset that making a collaborator also creates an account
	account, uAccountErr := storage.UserAccountGetByUsername(suite.testConfigs.Store, collaboratorInput.UserName)
	suite.NoError(uAccountErr)
	suite.NotNil(account)

	suite.NoError(err)
	suite.EqualValues(plan.ID, collaborator.ModelPlanID)
	suite.EqualValues(account.ID, collaborator.UserID)
	suite.EqualValues(pq.StringArray{string(models.TeamRoleLeadership)}, collaborator.TeamRoles)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, collaborator.CreatedBy)
	suite.Nil(collaborator.ModifiedBy)

	// Assert that a notification was generated for the collaborator
	collabPrinc := suite.getTestPrincipal(suite.testConfigs.Store, collaboratorInput.UserName)
	collabNots, err := notifications.UserNotificationCollectionGetByUser(suite.testConfigs.Context, suite.testConfigs.Store, collabPrinc)
	suite.NoError(err)
	suite.EqualValues(1, collabNots.NumUnreadNotifications())

	mockController.Finish()
}

func (suite *ResolverSuite) TestUpdatePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "CLAB", []models.TeamRole{models.TeamRoleLeadership})
	suite.Nil(collaborator.ModifiedBy)
	suite.Nil(collaborator.ModifiedDts)

	updatedCollaborator, err := PlanCollaboratorUpdate(
		suite.testConfigs.Logger,
		collaborator.ID,
		[]models.TeamRole{models.TeamRoleEvaluation},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	account, uAccountErr := storage.UserAccountGetByUsername(suite.testConfigs.Store, "CLAB")
	suite.NoError(uAccountErr)
	suite.NotNil(account)

	suite.NoError(err)
	suite.NotNil(updatedCollaborator.ModifiedBy)
	suite.NotNil(updatedCollaborator.ModifiedDts)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedCollaborator.ModifiedBy)
	suite.EqualValues(account.ID, collaborator.UserID)
	suite.EqualValues(pq.StringArray{string(models.TeamRoleEvaluation)}, updatedCollaborator.TeamRoles)
}

func (suite *ResolverSuite) TestUpdatePlanCollaboratorLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := PlanCollaboratorGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	collaborator := collaborators[0]
	updatedPlanCollaborator, err := PlanCollaboratorUpdate(
		suite.testConfigs.Logger,
		collaborator.ID,
		[]models.TeamRole{models.TeamRoleEvaluation},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(updatedPlanCollaborator)
}

func (suite *ResolverSuite) TestUpdateMultipleRolesToModelLeadOnly() {
	plan := suite.createModelPlan("Multiple Roles Plan")
	collaborator := suite.createPlanCollaborator(
		plan,
		"CLAB",
		[]models.TeamRole{models.TeamRoleModelLead, models.TeamRoleLearning},
	)

	updatedCollaborator, err := PlanCollaboratorUpdate(
		suite.testConfigs.Logger,
		collaborator.ID,
		[]models.TeamRole{models.TeamRoleModelLead},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.NoError(err)
	suite.NotNil(updatedCollaborator)
	suite.EqualValues(pq.StringArray{string(models.TeamRoleModelLead)}, updatedCollaborator.TeamRoles)
}

func (suite *ResolverSuite) TestAttemptToAddDuplicateRoles() {
	plan := suite.createModelPlan("Duplicate Roles Plan")
	collaborator := suite.createPlanCollaborator(plan, "CLAB", []models.TeamRole{models.TeamRoleModelLead})

	updatedCollaborator, err := PlanCollaboratorUpdate(
		suite.testConfigs.Logger,
		collaborator.ID,
		[]models.TeamRole{models.TeamRoleModelLead, models.TeamRoleModelLead},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.Error(err)
	suite.EqualValues("pq: Duplicate roles are not allowed in team_roles", err.Error())
	suite.Nil(updatedCollaborator)
}

func (suite *ResolverSuite) TestFetchCollaboratorsByModelPlanID() {
	plan := suite.createModelPlan("Plan For Milestones")
	_ = suite.createPlanCollaborator(plan, "SCND", []models.TeamRole{models.TeamRoleLeadership})

	collaborators, err := PlanCollaboratorGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(collaborators, 2)
	suite.NotEqual(collaborators[0].ID, collaborators[1].ID) // two different collaborators
	// for _, i := range collaborators { //TODO UPDATE!
	// 	suite.Contains([]string{"TEST", "SCND"}, i.EUAUserID) // contains default collaborator and new one
	// }
}

func (suite *ResolverSuite) TestPlanCollaboratorGetByID() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "SCND", []models.TeamRole{models.TeamRoleLeadership})

	collaboratorByID, err := PlanCollaboratorGetByID(suite.testConfigs.Context, collaborator.ID)
	suite.NoError(err)
	suite.EqualValues(collaboratorByID, collaborator)
}

func (suite *ResolverSuite) TestDeletePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "SCND", []models.TeamRole{models.TeamRoleLeadership})

	// Delete the 2nd collaborator
	deletedCollaborator, err := PlanCollaboratorDelete(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(deletedCollaborator, collaborator)

	// Ensure we get an error when we try fetch it
	collaboratorByID, err := PlanCollaboratorGetByID(suite.testConfigs.Context, collaborator.ID)
	suite.Error(err)
	suite.Nil(collaboratorByID)
}

func (suite *ResolverSuite) TestPlanCollaboratorDeleteLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := PlanCollaboratorGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	collaborator := collaborators[0]
	deletedPlanCollaborator, err := PlanCollaboratorDelete(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(deletedPlanCollaborator)
}

func (suite *ResolverSuite) TestIsPlanCollaborator() {

	plan := suite.createModelPlan("Plan For Milestones")
	isCollab, err := IsPlanCollaborator(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(true, isCollab)

	assessment := suite.getTestPrincipal(suite.testConfigs.Store, "FAIL")
	assessment.JobCodeASSESSMENT = true
	assessment.JobCodeUSER = true

	isCollabFalseCase, err := IsPlanCollaborator(suite.testConfigs.Logger, assessment, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)
	suite.EqualValues(false, isCollabFalseCase)
}

func (suite *ResolverSuite) TestPlanCollaboratorGetByModelPlanIDDataLoader() {
	plan1 := suite.createModelPlan("Plan For Collab 1")
	suite.createPlanCollaborator(plan1, "SCND", []models.TeamRole{models.TeamRoleLeadership})
	suite.createPlanCollaborator(plan1, "BLOB", []models.TeamRole{models.TeamRoleLeadership})
	suite.createPlanCollaborator(plan1, "MIKE", []models.TeamRole{models.TeamRoleLeadership})
	plan2 := suite.createModelPlan("Plan For Collab 2")

	suite.createPlanCollaborator(plan2, "SCTD", []models.TeamRole{models.TeamRoleLeadership})
	suite.createPlanCollaborator(plan2, "BLIB", []models.TeamRole{models.TeamRoleLeadership})
	suite.createPlanCollaborator(plan2, "MUKE", []models.TeamRole{models.TeamRoleLeadership})

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanCollaboratorGetByModelPlanIDLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanCollaboratorGetByModelPlanIDLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyPlanCollaboratorGetByModelPlanIDLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	collab, err := PlanCollaboratorGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != collab[0].ModelPlanID {
		return fmt.Errorf("plan Collaborator returned model plan ID %s, expected %s", collab[0].ModelPlanID, modelPlanID)
	}
	return nil
}

func (suite *ResolverSuite) TestPlanCollaboratorGetByIDDataLoader() {
	plan1 := suite.createModelPlan("Plan For Collab 1")
	collab1 := suite.createPlanCollaborator(plan1, "SCND", []models.TeamRole{models.TeamRoleLeadership})
	collab2 := suite.createPlanCollaborator(plan1, "BLOB", []models.TeamRole{models.TeamRoleLeadership})
	collab3 := suite.createPlanCollaborator(plan1, "MIKE", []models.TeamRole{models.TeamRoleLeadership})
	plan2 := suite.createModelPlan("Plan For Collab 2")

	collab4 := suite.createPlanCollaborator(plan2, "BIBS", []models.TeamRole{models.TeamRoleLeadership})
	collab5 := suite.createPlanCollaborator(plan2, "BOBS", []models.TeamRole{models.TeamRoleLeadership})
	collab6 := suite.createPlanCollaborator(plan2, "LUKE", []models.TeamRole{models.TeamRoleLeadership})

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)

	g.Go(func() error {
		retCollab, err := PlanCollaboratorGetByID(ctx, collab1.ID)
		suite.NoError(err)
		suite.EqualValues(collab1.ID, retCollab.ID)
		return nil
	})
	g.Go(func() error {
		retCollab, err := PlanCollaboratorGetByID(ctx, collab2.ID)
		suite.NoError(err)
		suite.EqualValues(collab2.ID, retCollab.ID)
		return nil
	})
	g.Go(func() error {
		retCollab, err := PlanCollaboratorGetByID(ctx, collab3.ID)
		suite.NoError(err)
		suite.EqualValues(collab3.ID, retCollab.ID)
		return nil
	})
	g.Go(func() error {
		retCollab, err := PlanCollaboratorGetByID(ctx, collab4.ID)
		suite.NoError(err)
		suite.EqualValues(collab4.ID, retCollab.ID)
		return nil
	})
	g.Go(func() error {
		retCollab, err := PlanCollaboratorGetByID(ctx, collab5.ID)
		suite.NoError(err)
		suite.EqualValues(collab5.ID, retCollab.ID)
		return nil
	})
	g.Go(func() error {
		retCollab, err := PlanCollaboratorGetByID(ctx, collab6.ID)
		suite.NoError(err)
		suite.EqualValues(collab6.ID, retCollab.ID)
		return nil
	})
	err := g.Wait()
	suite.NoError(err)

}
