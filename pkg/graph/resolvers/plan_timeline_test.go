package resolvers

import (
	"context"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

func (suite *ResolverSuite) TestPlanTimelineGetByModelPlanID() {
	plan := suite.createModelPlan("Plan For PlanTimeline") // should create the planPlanTimeline as part of the resolver

	planPlanTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)

	suite.NoError(err)
	suite.EqualValues(plan.ID, planPlanTimeline.ModelPlanID)
	suite.EqualValues(models.TaskReady, planPlanTimeline.Status)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, planPlanTimeline.CreatedBy)

	suite.Nil(planPlanTimeline.CompleteICIP)
	suite.Nil(planPlanTimeline.ClearanceStarts)
	suite.Nil(planPlanTimeline.ClearanceEnds)
	suite.Nil(planPlanTimeline.Announced)
	suite.Nil(planPlanTimeline.ApplicationsStart)
	suite.Nil(planPlanTimeline.ApplicationsEnd)
	suite.Nil(planPlanTimeline.PerformancePeriodStarts)
	suite.Nil(planPlanTimeline.PerformancePeriodEnds)
	suite.Nil(planPlanTimeline.WrapUpEnds)
	suite.Nil(planPlanTimeline.HighLevelNote)
}

func (suite *ResolverSuite) TestPlanTimelineDataLoader(ctx context.Context, modelPlanID uuid.UUID) {
	plan1 := suite.createModelPlan("Plan For PlanTimeline 1")
	plan2 := suite.createModelPlan("Plan For PlanTimeline 2")

	planTimeline1, err := PlanTimelineGetByModelPlanIDLOADER(ctx, plan1.ID)
	suite.NoError(err)
	planTimeline2, err2 := PlanTimelineGetByModelPlanIDLOADER(ctx, plan2.ID)
	suite.NoError(err2)

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, uuid.UUID]{
		{Key: plan1.ID, Expected: planTimeline1.ID},
		{Key: plan2.ID, Expected: planTimeline2.ID},
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

	planPlanTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"completeICIP":  "2020-05-13T20:47:50.12Z",
		"highLevelNote": "Some high level note",
	}

	updatedPlanTimeline, err := UpdatePlanTimeline(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		planPlanTimeline.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
	)

	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedPlanTimeline.ModifiedBy)
	suite.EqualValues(models.TaskInProgress, updatedPlanTimeline.Status)
	suite.WithinDuration(time.Date(2020, 5, 13, 20, 47, 50, 120000000, time.UTC), *updatedPlanTimeline.CompleteICIP, 0)
	suite.EqualValues(changes["highLevelNote"], *updatedPlanTimeline.HighLevelNote)
}
