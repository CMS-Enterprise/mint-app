package resolvers

import (
	"context"
	"time"

	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/userhelpers"
)

func (suite *ResolverSuite) TestModelPlanCreate() {
	planName := "Test Plan"
	result, err := ModelPlanCreate(context.Background(), suite.testConfigs.Logger, planName, suite.testConfigs.Store, suite.testConfigs.Principal, userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo))

	suite.NoError(err)
	suite.NotNil(result.ID)
	suite.EqualValues(planName, result.ModelName)
	suite.EqualValues(false, result.Archived)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	suite.Nil(result.ModifiedBy)
	suite.Nil(result.ModifiedDts)
	suite.EqualValues(models.ModelStatusPlanDraft, result.Status)
}

func (suite *ResolverSuite) TestModelPlanUpdate() {
	plan := suite.createModelPlan("Test Plan")

	changes := map[string]interface{}{
		"modelName": "NEW_AND_IMPROVED",
		"status":    models.ModelStatusIcipComplete,
		"archived":  true,
	}
	result, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store) // update plan with new user "UPDT"

	suite.NoError(err)
	suite.EqualValues(plan.ID, result.ID)
	suite.EqualValues(changes["modelName"], result.ModelName)
	suite.EqualValues(changes["archived"], result.Archived)

	suite.EqualValues(changes["status"], result.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, result.CreatedBy)
	suite.NotNil(result.ModifiedBy)
	suite.NotNil(result.ModifiedDts)
	suite.EqualValues(suite.testConfigs.Principal.Username, *result.ModifiedBy)
}

func (suite *ResolverSuite) TestModelPlanGetByID() {
	plan := suite.createModelPlan("Test Plan")

	result, err := ModelPlanGetByID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan, result)
}

func (suite *ResolverSuite) TestModelPlanCollection() {
	// Create 3 plans without additional collaborators (TEST is the only one, by default)
	_ = suite.createModelPlan("Test Plan")
	_ = suite.createModelPlan("Test Plan 2")
	planWithCRTDLs := suite.createModelPlan("Test Plan with CRTDL")

	// Create a plan that has CLAB as a collaborator (along with TEST)
	planWithCollab := suite.createModelPlan("Test Plan 4 (Collab)")
	suite.createPlanCollaborator(planWithCollab, "CLAB", models.TeamRoleEvaluation)

	suite.createPlanCrTdl(planWithCRTDLs, "Happy Happy Test", time.Now(), "Good CRTDL", "This is a test")

	// Get plan collection as CLAB
	clabPrincipal := getTestPrincipal(suite.testConfigs.Store, "CLAB")
	clabPrincipal.JobCodeASSESSMENT = false

	// Assert that CLAB only sees 1 model plan with collab only filter
	result, err := ModelPlanCollection(suite.testConfigs.Logger, clabPrincipal, suite.testConfigs.Store, model.ModelPlanFilterCollabOnly)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 1)

	// Assert that CLAB sees all 4 model plans with include all filter
	result, err = ModelPlanCollection(suite.testConfigs.Logger, clabPrincipal, suite.testConfigs.Store, model.ModelPlanFilterIncludeAll)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 4)

	// Assert that TEST only sees all 4 model plans with collab only filter (as they're a collaborator on all of them)
	result, err = ModelPlanCollection(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, model.ModelPlanFilterCollabOnly)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 4)

	// Assert that TEST sees all 4 model plans with include all filter
	result, err = ModelPlanCollection(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, model.ModelPlanFilterIncludeAll)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 4)

	// Assert that TEST sees all 1 model plan when CRDTL is seelcted
	result, err = ModelPlanCollection(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, model.ModelPlanFilterWithCrTdls)
	suite.NoError(err)
	suite.NotNil(result)
	suite.Len(result, 1)
}

func (suite *ResolverSuite) TestModelPlanNameHistory() {

	modelNames := []string{"Plan For History0", "Plan For History1", "Plan For History2", "Plan For History3"}

	plan := suite.createModelPlan(modelNames[0])

	for i := 1; i < len(modelNames); i++ {
		changes := map[string]interface{}{
			"modelName": modelNames[i],
		}
		_, err := ModelPlanUpdate(suite.testConfigs.Logger, plan.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
		suite.NoError(err)
	}

	historyAsc, err := ModelPlanNameHistory(suite.testConfigs.Logger, plan.ID, models.SortAsc, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(modelNames, historyAsc)

	//Reverse the order of the strings
	last := len(modelNames) - 1
	for i := 0; i < len(modelNames)/2; i++ {
		modelNames[i], modelNames[last-i] = modelNames[last-i], modelNames[i]
	}

	historyDesc, err := ModelPlanNameHistory(suite.testConfigs.Logger, plan.ID, models.SortDesc, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(modelNames, historyDesc)

}
