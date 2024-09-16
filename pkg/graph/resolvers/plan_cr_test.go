package resolvers

import (
	"time"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

// TestPlanCRCreate tests creating a new plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCRCreate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now().UTC()
	dateImplemented := time.Now().Add(time.Hour * 48).UTC()
	note := "My comments"

	input := &model.PlanCRCreateInput{
		ModelPlanID:     plan.ID,
		IDNumber:        "123-456",
		DateInitiated:   dateInitiated,
		DateImplemented: dateImplemented,
		Title:           "My CR",
		Note:            &note,
	}

	cr, err := PlanCRCreate(suite.testConfigs.Logger, input, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(cr.ModelPlanID, plan.ID)
	suite.EqualValues(cr.IDNumber, "123-456")
	suite.WithinDuration(cr.DateInitiated.UTC(), dateInitiated, time.Second)     // psql truncates dates, so just make sure they're close
	suite.WithinDuration(cr.DateImplemented.UTC(), dateImplemented, time.Second) // psql truncates dates, so just make sure they're close
	suite.EqualValues(cr.Title, "My CR")
	suite.EqualValues(*cr.Note, note)
}

// TestPlanCRUpdate tests updateing a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCRUpdate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now().UTC()
	dateImplemented := time.Now().Add(time.Hour * 48).UTC()
	dateInitiatedNew := dateInitiated.Add(time.Hour * 48).UTC()
	dateImplementedNew := dateImplemented.Add(time.Hour * 48).UTC()
	cr := suite.createPlanCR(plan, "123-456", dateInitiated, dateImplemented, "My CR", "My comments")

	changes := map[string]interface{}{
		"title":           "My new title",
		"idNumber":        "654-321",
		"note":            "new comments",
		"dateInitiated":   dateInitiatedNew,
		"dateImplemented": dateImplementedNew,
	}

	result, err := PlanCRUpdate(suite.testConfigs.Logger, cr.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(cr.ID, result.ID)
	suite.EqualValues(cr.ModelPlanID, result.ModelPlanID)
	suite.EqualValues(result.Title, changes["title"])
	suite.WithinDuration(result.DateInitiated.UTC(), dateInitiatedNew, time.Second)     // psql truncates dates, so just make sure they're close
	suite.WithinDuration(result.DateImplemented.UTC(), dateImplementedNew, time.Second) // psql truncates dates, so just make sure they're close
	suite.EqualValues(result.IDNumber, changes["idNumber"])
	suite.EqualValues(*result.Note, changes["note"])
}

// TestPlanCRDelete tests deleting a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCRDelete() {

	plan := suite.createModelPlan("My Plan")

	cr := suite.createPlanCR(plan, "123-456", time.Now(), time.Now(), "My CR", "My comments")

	del, err := PlanCRDelete(suite.testConfigs.Logger, cr.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(del.ID, cr.ID)

	// TODO Should we fetch by ID / model plan collection and see that it's no longer there?
}

// TestPlanCRGet returns a plan_cr_tdl record
func (suite *ResolverSuite) TestPlanCRGet() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now().UTC()
	dateImplemented := time.Now().Add(time.Hour * 48).UTC()

	cr := suite.createPlanCR(plan, "123-456", dateInitiated, dateImplemented, "My CR", "My comments")

	retCR, err := PlanCRGet(suite.testConfigs.Logger, cr.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(retCR.ID, cr.ID)
	// TODO should we check more fields than just ID?
}

// TestPlanCRsGetByModelPlanID tests returning all plan_cr_tdls associted with a plan
func (suite *ResolverSuite) TestPlanCRsGetByModelPlanID() {
	plan := suite.createModelPlan("My Plan")

	_ = suite.createPlanCR(plan, "123-456", time.Now(), time.Now(), "My CR", "My comments")

	result, err := PlanCRsGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(result, 1)

	emptyPlan := suite.createModelPlan("My Empty Plan")
	emptyResult, errEmpty := PlanCRsGetByModelPlanID(suite.testConfigs.Logger, emptyPlan.ID, suite.testConfigs.Store)
	suite.NoError(errEmpty)
	suite.Len(emptyResult, 0)
}
