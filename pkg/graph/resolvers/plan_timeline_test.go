package resolvers

import (
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestPlanTimelineGetByModelPlanID() {
	plan := suite.createModelPlan("Plan For PlanTimeline") // should create the planTimeline as part of the resolver

	planTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)

	suite.NoError(err)
	suite.EqualValues(plan.ID, planTimeline.ModelPlanID)
	suite.EqualValues(models.TaskReady, planTimeline.Status)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, planTimeline.CreatedBy)

	suite.Nil(planTimeline.CompleteICIP)
	suite.Nil(planTimeline.ClearanceStarts)
	suite.Nil(planTimeline.ClearanceEnds)
	suite.Nil(planTimeline.Announced)
	suite.Nil(planTimeline.ApplicationsStart)
	suite.Nil(planTimeline.ApplicationsEnd)
	suite.Nil(planTimeline.PerformancePeriodStarts)
	suite.Nil(planTimeline.PerformancePeriodEnds)
	suite.Nil(planTimeline.WrapUpEnds)
	suite.Nil(planTimeline.HighLevelNote)

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, uuid.UUID]{
		{Key: plan.ID, Expected: planTimeline.ID},
	}

	verifyFunc := func(data *models.PlanTimeline, expected uuid.UUID) bool {
		if suite.NotNil(data) {
			return suite.EqualValues(expected, data.ID)
		}
		return false
	}

	loaders.VerifyLoaders[uuid.UUID, *models.PlanTimeline, uuid.UUID](suite.testConfigs.Context, &suite.Suite, loaders.PlanTimeline.ByModelPlanID,
		expectedResults, verifyFunc)
}

func (suite *ResolverSuite) TestUpdatePlanTimeline() {
	plan := suite.createModelPlan("Plan For PlanTimeline") // should create the milestones as part of the resolver

	planTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"completeICIP":  "2020-05-13T20:47:50.12Z",
		"highLevelNote": "Some high level note",
	}

	updatedPlanTimeline, err := UpdatePlanTimeline(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		planTimeline.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedPlanTimeline.ModifiedBy)
	suite.EqualValues(models.TaskInProgress, updatedPlanTimeline.Status)
	suite.WithinDuration(time.Date(2020, 5, 13, 20, 47, 50, 120000000, time.UTC), *updatedPlanTimeline.CompleteICIP, 0)
	suite.EqualValues(changes["highLevelNote"], *updatedPlanTimeline.HighLevelNote)
}
