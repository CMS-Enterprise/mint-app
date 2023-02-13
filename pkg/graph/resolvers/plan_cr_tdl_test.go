package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

// TestPlanCrTdlCreate tests creating a new plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCrTdlCreate() {

	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now()
	note := "My comments"

	input := &model.PlanCrTdlCreateInput{
		ModelPlanID:   plan.ID,
		IDNumber:      "123-456",
		DateInitiated: dateInitiated,
		Title:         "My CR",
		Note:          &note,
	}

	crTdl, err := PlanCrTdlCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(crTdl.ModelPlanID, plan.ID)
	suite.EqualValues(crTdl.IDNumber, "123-456")
	suite.EqualValues(crTdl.Title, "My CR")
	suite.EqualValues(*crTdl.Note, note)

}

// TestPlanCrTdlUpdate tests updateing a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCrTdlUpdate() {

	plan := suite.createModelPlan("My Plan")
	crTdl := suite.createPlanCrTdl(plan, "123-456", time.Now(), "My CR", "My comments")

	changes := map[string]interface{}{
		"title":    "My new title",
		"idNumber": "654-321",
		"note":     "new comments",
	}

	result, err := PlanCrTdlUpdate(suite.testConfigs.Logger, crTdl.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(crTdl.ID, result.ID)
	suite.EqualValues(crTdl.ModelPlanID, result.ModelPlanID)
	suite.EqualValues(result.Title, changes["title"])
	suite.EqualValues(result.IDNumber, changes["idNumber"])
	suite.EqualValues(*result.Note, changes["note"])
}

// TestPlanCrTdlDelete tests deleting a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCrTdlDelete() {

	plan := suite.createModelPlan("My Plan")

	crTdl := suite.createPlanCrTdl(plan, "123-456", time.Now(), "My CR", "My comments")

	del, err := PlanCrTdlDelete(suite.testConfigs.Logger, crTdl.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(del.ID, crTdl.ID)

}

// TestCrTdlGet returns a plan_cr_tdl record
func (suite *ResolverSuite) TestPlanCrTdlGet() {
	plan := suite.createModelPlan("My Plan")

	crTdl := suite.createPlanCrTdl(plan, "123-456", time.Now(), "My CR", "My comments")

	retCrTdl, err := PlanCrTdlGet(suite.testConfigs.Logger, crTdl.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(retCrTdl.ID, crTdl.ID)

}

// TestPlanCrTdlsGetByModelPlanID tests returning all plan_cr_tdls associted with a plan
func (suite *ResolverSuite) TestPlanCrTdlsGetByModelPlanID() {
	plan := suite.createModelPlan("My Plan")

	_ = suite.createPlanCrTdl(plan, "123-456", time.Now(), "My CR", "My comments")
	_ = suite.createPlanCrTdl(plan, "123-45678", time.Now(), "My CR 2", "My comments 2")

	result, err := PlanCrTdlsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 2)

	emptyPlan := suite.createModelPlan("My Empty Plan")
	emptyResult, errEmpty := PlanCrTdlsGetByModelPlanID(suite.testConfigs.Logger, emptyPlan.ID, suite.testConfigs.Store)
	suite.NoError(errEmpty)
	suite.Len(emptyResult, 0)
}
