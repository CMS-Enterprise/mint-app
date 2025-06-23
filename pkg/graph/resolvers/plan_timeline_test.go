package resolvers

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
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

func (suite *ResolverSuite) TestPlanTimelineDataLoader() {
	plan1 := suite.createModelPlan("Plan For PlanTimeline 1")
	plan2 := suite.createModelPlan("Plan For PlanTimeline 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanTimelineLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanTimelineLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

	// go verifyPlanTimelineLoader(ctx, plan1.ID)
	// go verifyPlanTimelineLoader(ctx, plan2.ID)

}
func verifyPlanTimelineLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	planPlanTimeline, err := PlanTimelineGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != planPlanTimeline.ModelPlanID {
		return fmt.Errorf("planPlanTimeline returned model plan ID %s, expected %s", planPlanTimeline.ModelPlanID, modelPlanID)
	}
	return nil
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
