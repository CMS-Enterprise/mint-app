package resolvers

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestIDDOCQuestionnaireUpdate_BasicFields tests updating basic questionnaire fields
func (suite *ResolverSuite) TestIDDOCQuestionnaireUpdate_BasicFields() {
	plan := suite.createModelPlan("Test Plan")

	// Get the questionnaire that was auto-created with the model plan
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.NotNil(questionnaire)

	// Verify initial status is READY
	suite.Equal(models.IDDOCQuestionnaireReady, questionnaire.Status)

	// Update some fields
	uatNeeds := "Some UAT requirements"
	stcNeeds := "Some STC needs"
	changes := map[string]any{
		"uatNeeds": &uatNeeds,
		"stcNeeds": &stcNeeds,
	}

	result, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		questionnaire.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.NotNil(result.UatNeeds)
	suite.Equal(uatNeeds, *result.UatNeeds)
	suite.NotNil(result.StcNeeds)
	suite.Equal(stcNeeds, *result.StcNeeds)
	// Should auto-transition to IN_PROGRESS when fields are updated
	suite.Equal(models.IDDOCQuestionnaireInProgress, result.Status)
}

// TestIDDOCQuestionnaireUpdate_Complete tests marking questionnaire as complete
func (suite *ResolverSuite) TestIDDOCQuestionnaireUpdate_Complete() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	isComplete := true
	changes := map[string]any{
		"isComplete": &isComplete,
	}

	result, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		questionnaire.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.Equal(models.IDDOCQuestionnaireComplete, result.Status)
	suite.NotNil(result.CompletedBy)
	suite.Equal(suite.testConfigs.Principal.Account().ID, *result.CompletedBy)
	suite.NotNil(result.CompletedDts)
}

// TestIDDOCQuestionnaireUpdate_Incomplete tests marking a completed questionnaire as incomplete
func (suite *ResolverSuite) TestIDDOCQuestionnaireUpdate_Incomplete() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	// First mark as complete
	isComplete := true
	changes := map[string]any{
		"isComplete": &isComplete,
	}
	completed, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		questionnaire.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	// Now mark as incomplete
	isIncomplete := false
	changes = map[string]any{
		"isComplete": &isIncomplete,
	}
	result, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		completed.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	// Should be IN_PROGRESS because questionnaire has been modified
	suite.Equal(models.IDDOCQuestionnaireInProgress, result.Status)
	suite.Nil(result.CompletedBy)
	suite.Nil(result.CompletedDts)
}

// TestIDDOCQuestionnaireUpdate_BooleanFields tests updating boolean fields
func (suite *ResolverSuite) TestIDDOCQuestionnaireUpdate_BooleanFields() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	technicalContacts := true
	eftSetUp := false
	changes := map[string]any{
		"technicalContactsIdentified": &technicalContacts,
		"eftSetUp":                    &eftSetUp,
	}

	result, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		questionnaire.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.NotNil(result.TechnicalContactsIdentified)
	suite.True(*result.TechnicalContactsIdentified)
	suite.NotNil(result.EftSetUp)
	suite.False(*result.EftSetUp)
}

// TestIDDOCQuestionnaireUpdate_DateFields tests updating date fields
func (suite *ResolverSuite) TestIDDOCQuestionnaireUpdate_DateFields() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	dueDate := time.Date(2026, 6, 15, 0, 0, 0, 0, time.UTC)
	changes := map[string]any{
		"draftIcdDueDate": &dueDate,
	}

	result, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		questionnaire.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.NotNil(result.DraftIcdDueDate)
	suite.WithinDuration(dueDate, *result.DraftIcdDueDate, time.Second)
}

// TestIDDOCQuestionnaireUpdate_EnumFields tests updating enum fields
func (suite *ResolverSuite) TestIDDOCQuestionnaireUpdate_EnumFields() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	fullTimeType := models.IDDOCFullTimeOrIncrementalTypeFullTime
	changes := map[string]any{
		"dataFullTimeOrIncremental": &fullTimeType,
	}

	result, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		questionnaire.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.NotNil(result.DataFullTimeOrIncremental)
	suite.Equal(fullTimeType, *result.DataFullTimeOrIncremental)
}

// TestIDDOCQuestionnaireGetByIDLoader tests the data loader function
func (suite *ResolverSuite) TestIDDOCQuestionnaireGetByIDLoader() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	result, err := IDDOCQuestionnaireGetByIDLoader(suite.testConfigs.Context, questionnaire.ID)

	suite.NoError(err)
	suite.NotNil(result)
	suite.Equal(questionnaire.ID, result.ID)
	suite.Equal(plan.ID, result.ModelPlanID)
}

// TestIDDOCQuestionnaireGetByModelPlanIDLoader tests the model plan ID loader
func (suite *ResolverSuite) TestIDDOCQuestionnaireGetByModelPlanIDLoader() {
	plan := suite.createModelPlan("Test Plan")

	result, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)

	suite.NoError(err)
	suite.NotNil(result)
	suite.Equal(plan.ID, result.ModelPlanID)
}

// TestIDDOCQuestionnaire_IsComplete tests the IsComplete method
func (suite *ResolverSuite) TestIDDOCQuestionnaire_IsComplete() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	// Initially not complete
	suite.False(questionnaire.IsComplete())

	// Mark as complete
	isComplete := true
	changes := map[string]any{
		"isComplete": &isComplete,
	}
	result, err := IDDOCQuestionnaireUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		questionnaire.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.True(result.IsComplete())
}

// TestIDDOCQuestionnaire_TaskListStatus tests the TaskListStatus method
func (suite *ResolverSuite) TestIDDOCQuestionnaire_TaskListStatus() {
	plan := suite.createModelPlan("Test Plan")
	questionnaire, err := IDDOCQuestionnaireGetByModelPlanIDLoader(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	// Initially needed=false, so should return NOT_NEEDED
	suite.False(questionnaire.Needed)
	suite.Equal(models.IDDOCQuestionnaireTaskListStatusNotNeeded, questionnaire.TaskListStatus())

	// Test with needed=true and different statuses
	questionnaire.Needed = true
	questionnaire.Status = models.IDDOCQuestionnaireReady
	suite.Equal(models.IDDOCQuestionnaireTaskListStatusReady, questionnaire.TaskListStatus())

	questionnaire.Status = models.IDDOCQuestionnaireInProgress
	suite.Equal(models.IDDOCQuestionnaireTaskListStatusInProgress, questionnaire.TaskListStatus())

	questionnaire.Status = models.IDDOCQuestionnaireComplete
	suite.Equal(models.IDDOCQuestionnaireTaskListStatusComplete, questionnaire.TaskListStatus())
}

// TestNewIDDOCQuestionnaire tests the constructor function
func (suite *ResolverSuite) TestNewIDDOCQuestionnaire() {
	createdBy := uuid.New()
	modelPlanID := uuid.New()

	questionnaire := models.NewIDDOCQuestionnaire(createdBy, modelPlanID)

	suite.NotNil(questionnaire)
	suite.Equal(modelPlanID, questionnaire.ModelPlanID)
	suite.Equal(createdBy, questionnaire.CreatedBy)
	suite.False(questionnaire.Needed)
	suite.Equal(models.IDDOCQuestionnaireReady, questionnaire.Status)
	suite.Nil(questionnaire.CompletedBy)
	suite.Nil(questionnaire.CompletedDts)
}
