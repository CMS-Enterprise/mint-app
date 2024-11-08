package resolvers

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/echimptestdata"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/testconfig/emailtestconfigs"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"

	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

// ResolverSuite is the testify suite for the resolver package
type ResolverSuite struct {
	suite.Suite
	testConfigs *TestConfigs
}

// AssertEqualPointerValues takes two pointers and compares their values. It passes if both are nil, fails if only one is nil.
// Otherwise it will just compare the values
func (suite *ResolverSuite) AssertEqualPointerValues(expected, actual *interface{}) bool {
	// Check if both pointers are nil
	if expected == nil && actual == nil {
		return true
	}

	// Check if only one of the pointers is nil
	if expected == nil || actual == nil {
		suite.FailNow("One of the pointers is nil but the other is not")
		return false
	}

	// Dereference both pointers and compare their values
	return suite.EqualValues(*expected, *actual)
}

// SetupTest clears the database between each test
func (suite *ResolverSuite) SetupTest() {
	err := suite.testConfigs.Store.TruncateAllTablesDANGEROUS(suite.testConfigs.Logger)

	//GET USER ACCOUNT EACH TIME!
	princ := suite.getTestPrincipal(suite.testConfigs.Store, suite.testConfigs.UserInfo.Username)
	suite.testConfigs.Principal = princ
	assert.NoError(suite.T(), err)
}

// getTestPrincipal gets a user principal from database
func (suite *ResolverSuite) getTestPrincipal(store *storage.Store, userName string) *authentication.ApplicationPrincipal {

	userAccount, _ := userhelpers.GetOrCreateUserAccount(suite.testConfigs.Context,
		store,
		store,
		userName,
		true,
		false,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.testConfigs.OktaClient.FetchUserInfo))

	princ := &authentication.ApplicationPrincipal{
		Username:          userName,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
		JobCodeMAC:        false,
		JobCodeNonCMS:     false,
		UserAccount:       userAccount,
	}
	return princ

}
func (suite *ResolverSuite) stubFetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	return &models.UserInfo{
		Username:    username,
		FirstName:   username,
		LastName:    "Doe",
		DisplayName: username + " Doe",
		Email:       username + ".doe@local.fake",
	}, nil
}

func (suite *ResolverSuite) createModelPlan(planName string) *models.ModelPlan {
	return suite.createModelPlanWithID(planName, nil)
}

func (suite *ResolverSuite) createModelPlanWithID(planName string, id *uuid.UUID) *models.ModelPlan {
	mp, err := ModelPlanCreate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		planName,
		id,
		suite.testConfigs.Store,
		suite.testConfigs.Principal,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.NoError(err)
	return mp
}

func (suite *ResolverSuite) createPlanDiscussion(mp *models.ModelPlan, content string) *models.PlanDiscussion {
	taggedContent, err := models.NewTaggedContentFromString(content)
	suite.NoError(err)
	input := &model.PlanDiscussionCreateInput{
		ModelPlanID:         mp.ID,
		Content:             models.TaggedHTML(taggedContent),
		UserRole:            models.DiscussionUserRolePointer(models.DiscussionRoleNoneOfTheAbove),
		UserRoleDescription: models.StringPointer("test role"),
	}
	pd, err := CreatePlanDiscussion(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.NoError(err)
	return pd
}

func (suite *ResolverSuite) createDiscussionReply(
	pd *models.PlanDiscussion,
	content string,
) *models.DiscussionReply {

	taggedContent, err := models.NewTaggedContentFromString(content)
	suite.NoError(err)
	input := &model.DiscussionReplyCreateInput{
		DiscussionID:        pd.ID,
		Content:             models.TaggedHTML(taggedContent),
		UserRole:            models.DiscussionUserRolePointer(models.DiscussionRoleNoneOfTheAbove),
		UserRoleDescription: models.StringPointer("this is a test"),
	}
	dr, err := CreateDiscussionReply(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		nil,
		nil,
		email.AddressBook{},
		input,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.NoError(err)
	return dr
}

func (suite *ResolverSuite) createPlanCollaborator(mp *models.ModelPlan, userName string, teamRoles []models.TeamRole) *models.PlanCollaborator {
	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: mp.ID,
		UserName:    userName,
		TeamRoles:   teamRoles,
	}

	mockController := gomock.NewController(suite.T())
	mockEmailService := oddmail.NewMockEmailService(mockController)
	mockEmailTemplateService := email.NewMockTemplateService(mockController)

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

	testTemplate, expectedSubject, expectedBody := emailtestconfigs.CreateTemplateCacheHelper(mp.ModelName, mp)
	mockEmailTemplateService.
		EXPECT().
		GetEmailTemplate(gomock.Eq(email.AddedAsCollaboratorTemplateName)).
		Return(testTemplate, nil).
		AnyTimes()

	mockEmailService.
		EXPECT().
		Send(
			gomock.Any(),
			gomock.Eq([]string{collaboratorInput.UserName + ".doe@local.fake"}), //this comes from the stub user info function
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
	suite.NoError(err)
	return collaborator
}

func (suite *ResolverSuite) createPlanCR(mp *models.ModelPlan, idNumber string, dateInitated time.Time, dateImplemented time.Time, title string, note string) *models.PlanCR {
	input := &model.PlanCRCreateInput{
		ModelPlanID:     mp.ID,
		IDNumber:        idNumber,
		DateInitiated:   dateInitated,
		DateImplemented: dateImplemented,
		Title:           title,
		Note:            &note,
	}
	cr, err := PlanCRCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return cr
}

func (suite *ResolverSuite) createPlanTDL(mp *models.ModelPlan, idNumber string, dateInitated time.Time, title string, note string) *models.PlanTDL {
	input := &model.PlanTDLCreateInput{
		ModelPlanID:   mp.ID,
		IDNumber:      idNumber,
		DateInitiated: dateInitated,
		Title:         title,
		Note:          &note,
	}
	tdl, err := PlanTDLCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	return tdl
}

func (suite *ResolverSuite) createOperationalSolution() (*models.OperationalSolution, *models.OperationalNeed, *models.ModelPlan) {
	planName := "Plan For Milestones"
	plan := suite.createModelPlan(planName)
	needType := models.OpNKManageCd

	need, err := suite.testConfigs.Store.OperationalNeedGetByModelPlanIDAndType(suite.testConfigs.Logger, plan.ID, needType)
	suite.NoError(err)
	changes := map[string]interface{}{
		"nameOther": "AnotherSolution",
	}
	operationalSolution, err := OperationalSolutionCreate(suite.testConfigs.Context, suite.testConfigs.Store, suite.testConfigs.Logger, nil, nil, email.AddressBook{}, need.ID, nil, changes, suite.testConfigs.Principal)
	suite.NoError(err)
	return operationalSolution, need, plan
}

func (suite *ResolverSuite) createOperationalSolutionSubtask() *models.OperationalSolutionSubtask {
	operationalSolution, _, _ := suite.createOperationalSolution()

	return suite.createOperationalSolutionSubtaskWithSolution(operationalSolution)
}

func (suite *ResolverSuite) createOperationalSolutionSubtaskWithSolution(
	operationalSolution *models.OperationalSolution) *models.OperationalSolutionSubtask {
	inputs := []*model.CreateOperationalSolutionSubtaskInput{{
		Name:   "Test Operational Solution Input",
		Status: models.OperationalSolutionSubtaskStatusTodo,
	}}

	return suite.createOperationalSolutionSubtasksWithSolution(operationalSolution, inputs)[0]
}

func (suite *ResolverSuite) createMultipleOperationSolutionSubtasks() []*models.OperationalSolutionSubtask {
	operationalSolution, _, _ := suite.createOperationalSolution()

	createOperationalSolutionInput := []*model.CreateOperationalSolutionSubtaskInput{
		{
			Name:   "Subtask A",
			Status: models.OperationalSolutionSubtaskStatusTodo,
		},
		{
			Name:   "Subtask B",
			Status: models.OperationalSolutionSubtaskStatusInProgress,
		},
	}

	subtasks := suite.createOperationalSolutionSubtasksWithSolution(
		operationalSolution,
		createOperationalSolutionInput,
	)
	return subtasks
}

func (suite *ResolverSuite) createOperationalSolutionSubtasksWithSolution(
	operationalSolution *models.OperationalSolution,
	inputs []*model.CreateOperationalSolutionSubtaskInput) []*models.OperationalSolutionSubtask {
	subtasks, err := OperationalSolutionSubtasksCreate(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		inputs,
		operationalSolution.ID,
		suite.testConfigs.Principal)
	suite.NoError(err)
	suite.NotNil(subtasks)
	suite.Len(subtasks, len(inputs))
	return subtasks
}

func (suite *ResolverSuite) convertOperationalSubtasksToUpdateInputs(
	subtasks []*models.OperationalSolutionSubtask) []*model.UpdateOperationalSolutionSubtaskInput {
	var updateInputs []*model.UpdateOperationalSolutionSubtaskInput
	for _, subtask := range subtasks {
		updateInputs = append(
			updateInputs,
			&model.UpdateOperationalSolutionSubtaskInput{
				ID: subtask.ID,
				Changes: map[string]interface{}{
					"name":   subtask.Name,
					"status": subtask.Status,
				},
			},
		)
	}
	return updateInputs
}

func (suite *ResolverSuite) createAnalyzedAuditChange(modelNameChange string,
	modelStatusChanges []string,
	documentCount int,
	crTdlActivity bool,
	updatedSections []models.TableName,
	reviewSections []models.TableName,
	clearanceSections []models.TableName,
	addedLeads []models.AnalyzedModelLeadInfo, discussionActivity bool) *models.AnalyzedAuditChange {

	auditChange := models.AnalyzedAuditChange{
		ModelPlan: &models.AnalyzedModelPlan{
			OldName:       modelNameChange,
			StatusChanges: modelStatusChanges,
		},
		Documents: &models.AnalyzedDocuments{
			Count: documentCount,
		},
		CrTdls: &models.AnalyzedCrTdls{
			Activity: crTdlActivity,
		},
		PlanSections: &models.AnalyzedPlanSections{
			Updated:           updatedSections,
			ReadyForReview:    reviewSections,
			ReadyForClearance: clearanceSections,
		},
		ModelLeads: &models.AnalyzedModelLeads{
			Added: addedLeads,
		},
		PlanDiscussions: &models.AnalyzedPlanDiscussions{
			Activity: discussionActivity,
		},
	}

	return &auditChange
}

// createAnalyzedAudit is a helper function to just store an analyzed audit to the DB, without using a resolver
func (suite *ResolverSuite) createAnalyzedAudit(mp *models.ModelPlan, date time.Time, changes models.AnalyzedAuditChange) *models.AnalyzedAudit {
	principal := suite.getTestPrincipal(suite.testConfigs.Store, "TEST")
	newAnalyzedAudit, err := models.NewAnalyzedAudit(principal.UserAccount.ID, mp.ID, mp.ModelName, date, changes)
	suite.NoError(err)

	analyzedAudit, err := suite.testConfigs.Store.AnalyzedAuditCreate(suite.testConfigs.Logger, newAnalyzedAudit)
	suite.NoError(err)

	return analyzedAudit
}

func (suite *ResolverSuite) createDefaultTestAnalyzedAudit(mp *models.ModelPlan, date time.Time, callbacks ...func(*models.AnalyzedAuditChange)) *models.AnalyzedAudit {
	modelNameChange := "Old Name"
	modelStatusChange := []string{"OMB_ASRF_CLEARANCE"}
	documentCount := 2
	crTdlActivity := true
	updatedSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	reviewSections := []models.TableName{"plan_payments", "plan_ops_eval_and_learning"}
	clearanceSections := []models.TableName{"plan_participants_and_providers", "plan_general_characteristics", "plan_basics"}
	addedLead := []models.AnalyzedModelLeadInfo{{CommonName: "New Lead"}}
	discussionActivity := true

	auditChange := suite.createAnalyzedAuditChange(modelNameChange, modelStatusChange, documentCount,
		crTdlActivity, updatedSections, reviewSections, clearanceSections, addedLead, discussionActivity)

	for _, cb := range callbacks {
		cb(auditChange)

	}
	suite.NotNil(auditChange)

	return suite.createAnalyzedAudit(mp, date, *auditChange)

}

// TestResolverSuite runs the resolver test suite
func TestResolverSuite(t *testing.T) {
	rs := new(ResolverSuite)
	rs.testConfigs = GetDefaultTestConfigs()
	err := echimptestdata.SeedEChimpTestData(rs.testConfigs.EChimpS3Client, rs.testConfigs.viperConfig)
	if !assert.NoError(t, err) {

		assert.Fail(t, "unable to seed test echimp data")

	}
	suite.Run(t, rs)
}

// func (suite *ResolverSuite) HandleStats(suiteName string, stats *suite.SuiteInformation) {
// 	// suite.T().Log("Writing Statistics")
// 	// suite.T().Log(stats)
// }
