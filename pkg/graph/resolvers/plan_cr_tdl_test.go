package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/graph/model"
)

// TestPlanCRCreate tests creating a new plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCRCreate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now()
	dateImplemented := time.Now().Add(time.Hour * 48)
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
	suite.EqualValues(*cr.DateInitiated, dateInitiated)
	suite.EqualValues(*cr.DateImplemented, dateImplemented)
	suite.EqualValues(cr.Title, "My CR")
	suite.EqualValues(*cr.Note, note)
}

// TestPlanTDLCreate tests creating a new plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanTDLCreate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now()
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
	suite.EqualValues(*tdl.DateInitiated, dateInitiated)
	suite.EqualValues(tdl.Title, "My TDL")
	suite.EqualValues(*tdl.Note, note)
}

// TestPlanCRUpdate tests updateing a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanCRUpdate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now()
	dateImplemented := time.Now().Add(time.Hour * 48)
	dateInitiatedNew := dateInitiated.Add(time.Hour * 48)
	dateImplementedNew := dateImplemented.Add(time.Hour * 48)
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
	suite.EqualValues(*result.DateInitiated, dateInitiatedNew)
	suite.EqualValues(*result.DateImplemented, dateImplementedNew)
	suite.EqualValues(result.IDNumber, changes["idNumber"])
	suite.EqualValues(*result.Note, changes["note"])
}

// TestPlanTDLUpdate tests updateing a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanTDLUpdate() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now()
	dateInitiatedNew := dateInitiated.Add(time.Hour * 48)
	tdl := suite.createPlanTDL(plan, "123-456", dateInitiated, "My TDL", "My comments")

	changes := map[string]interface{}{
		"title":         "My new title",
		"idNumber":      "654-321",
		"note":          "new comments",
		"dateInitiated": dateInitiatedNew,
	}

	result, err := PlanCRUpdate(suite.testConfigs.Logger, tdl.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(tdl.ID, result.ID)
	suite.EqualValues(tdl.ModelPlanID, result.ModelPlanID)
	suite.EqualValues(result.Title, changes["title"])
	suite.EqualValues(*result.DateInitiated, dateInitiatedNew)
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

// TestPlanTDLDelete tests deleting a plan_cr_tdl record in the database
func (suite *ResolverSuite) TestPlanTDLDelete() {

	plan := suite.createModelPlan("My Plan")

	tdl := suite.createPlanTDL(plan, "123-456", time.Now(), "My TDL", "My comments")

	del, err := PlanTDLDelete(suite.testConfigs.Logger, tdl.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(del.ID, tdl.ID)

	// TODO Should we fetch by ID / model plan collection and see that it's no longer there?
}

// TestPlanCRGet returns a plan_cr_tdl record
func (suite *ResolverSuite) TestPlanCRGet() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now()
	dateImplemented := time.Now().Add(time.Hour * 48)

	cr := suite.createPlanCR(plan, "123-456", dateInitiated, dateImplemented, "My CR", "My comments")

	retCR, err := PlanCRGet(suite.testConfigs.Logger, cr.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(retCR.ID, cr.ID)
	// TODO should we check more fields than just ID?
}

// TestPlanTDLGet returns a plan_cr_tdl record
func (suite *ResolverSuite) TestPlanTDLGet() {
	plan := suite.createModelPlan("My Plan")
	dateInitiated := time.Now()

	tdl := suite.createPlanTDL(plan, "123-456", dateInitiated, "My TDL", "My comments")

	retTDL, err := PlanTDLGet(suite.testConfigs.Logger, tdl.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(retTDL.ID, tdl.ID)
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
