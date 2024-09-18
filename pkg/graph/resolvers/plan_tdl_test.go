package resolvers

import (
	"time"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

// TestPlanTDLCreate tests creating a new plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanTDLCreate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now().UTC()
	note := "My comments"

	input := &model.PlanTDLCreateInput{
		ModelPlanID:   plan.ID,
		IDNumber:      "123-456",
		DateInitiated: dateInitiated,
		Title:         "My TDL",
		Note:          &note,
	}

	tdl, err := PlanTDLCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(tdl.ModelPlanID, plan.ID)
	suite.EqualValues(tdl.IDNumber, "123-456")
	suite.WithinDuration(tdl.DateInitiated.UTC(), dateInitiated, time.Second) // psql truncates dates, so just make sure they're close
	suite.EqualValues(tdl.Title, "My TDL")
	suite.EqualValues(*tdl.Note, note)
}

// TestPlanTDLUpdate tests updateing a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanTDLUpdate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now().UTC()
	dateInitiatedNew := dateInitiated.Add(time.Hour * 48).UTC()
	tdl := suite.createPlanTDL(plan, "123-456", dateInitiated, "My TDL", "My comments")

	changes := map[string]interface{}{
		"title":         "My new title",
		"idNumber":      "654-321",
		"note":          "new comments",
		"dateInitiated": dateInitiatedNew,
	}

	result, err := PlanTDLUpdate(suite.testConfigs.Logger, tdl.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(tdl.ID, result.ID)
	suite.EqualValues(tdl.ModelPlanID, result.ModelPlanID)
	suite.EqualValues(result.Title, changes["title"])
	suite.WithinDuration(result.DateInitiated.UTC(), dateInitiatedNew, time.Second) // psql truncates dates, so just make sure they're close
	suite.EqualValues(result.IDNumber, changes["idNumber"])
	suite.EqualValues(*result.Note, changes["note"])
}

// TestPlanTDLDelete tests deleting a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanTDLDelete() {

	plan := suite.createModelPlan("My Plan")

	tdl := suite.createPlanTDL(plan, "123-456", time.Now(), "My TDL", "My comments")

	del, err := PlanTDLDelete(suite.testConfigs.Logger, tdl.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(del.ID, tdl.ID)

	// TODO Should we fetch by ID / model plan collection and see that it's no longer there?
}

// TestPlanTDLGet returns a plan_cr_tdl record
func (suite *ResolverSuite) TestPlanTDLGet() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now().UTC()

	tdl := suite.createPlanTDL(plan, "123-456", dateInitiated, "My TDL", "My comments")

	retTDL, err := PlanTDLGet(suite.testConfigs.Logger, tdl.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(retTDL.ID, tdl.ID)
	// TODO should we check more fields than just ID?
}

// TestPlanTDLsGetByModelPlanID tests returning all plan_cr_tdls associted with a plan
func (suite *ResolverSuite) TestPlanTDLsGetByModelPlanID() {
	plan := suite.createModelPlan("My Plan")

	_ = suite.createPlanTDL(plan, "123-456", time.Now(), "My CR", "My comments")

	result, err := PlanTDLsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 1)

	emptyPlan := suite.createModelPlan("My Empty Plan")
	emptyResult, errEmpty := PlanTDLsGetByModelPlanID(suite.testConfigs.Logger, emptyPlan.ID, suite.testConfigs.Store)
	suite.NoError(errEmpty)
	suite.Len(emptyResult, 0)
}
