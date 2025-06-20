package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestTimelineGetByModelPlanID() {
	plan := suite.createModelPlan("Plan For Timeline") // should create the timeline as part of the resolver

	timeline, err := TimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)

	suite.NoError(err)
	suite.EqualValues(plan.ID, timeline.ModelPlanID)
	suite.EqualValues(models.TaskReady, timeline.Status)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, timeline.CreatedBy)

	suite.Nil(timeline.CompleteICIP)
	suite.Nil(timeline.ClearanceStarts)
	suite.Nil(timeline.ClearanceEnds)
	suite.Nil(timeline.Announced)
	suite.Nil(timeline.ApplicationsStart)
	suite.Nil(timeline.ApplicationsEnd)
	suite.Nil(timeline.PerformancePeriodStarts)
	suite.Nil(timeline.PerformancePeriodEnds)
	suite.Nil(timeline.WrapUpEnds)
	suite.Nil(timeline.HighLevelNote)
}

func (suite *ResolverSuite) TestTimelineDataLoader() {
	plan1 := suite.createModelPlan("Plan For Timeline 1")
	plan2 := suite.createModelPlan("Plan For Timeline 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyTimelineLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyTimelineLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

	// go verifyTimelineLoader(ctx, plan1.ID)
	// go verifyTimelineLoader(ctx, plan2.ID)

}
func verifyTimelineLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	timeline, err := TimelineGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != timeline.ModelPlanID {
		return fmt.Errorf("timeline returned model plan ID %s, expected %s", timeline.ModelPlanID, modelPlanID)
	}
	return nil
}

// func (suite *ResolverSuite) TestUpdateTimeline() {
// 	plan := suite.createModelPlan("Plan For Timeline") // should create the milestones as part of the resolver

// 	timeline, err := TimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
// 	suite.NoError(err)

// 	changes := map[string]interface{}{
// 		"modelType":      []models.ModelType{models.MTVoluntary},
// 		"modelTypeOther": "Some model type other note",
// 		"goal":           "Some goal",
// 		"cmsCenters":     []string{"CMMI"},
// 		"cmmiGroups":     []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
// 		"completeICIP":   "2020-05-13T20:47:50.12Z",
// 		"phasedIn":       true,
// 		"highLevelNote":  "Some high level note",
// 	}

// 	updatedTimeline, err := UpdateTimeline(
// 		suite.testConfigs.Context,
// 		suite.testConfigs.Logger,
// 		timeline.ID,
// 		changes,
// 		suite.testConfigs.Principal,
// 		suite.testConfigs.Store,
// 		nil,
// 		nil,
// 		email.AddressBook{},
// 	)

// 	suite.NoError(err)
// 	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedTimeline.ModifiedBy)
// 	suite.EqualValues(models.TaskInProgress, updatedTimeline.Status)
// 	suite.EqualValues([]models.ModelType{models.MTVoluntary}, models.ConvertEnums[models.ModelType](updatedTimeline.ModelType))
// 	suite.EqualValues(changes["modelTypeOther"], *updatedTimeline.ModelTypeOther)
// 	suite.Nil(updatedTimeline.Problem)
// 	suite.EqualValues("Some goal", *updatedTimeline.Goal)
// 	suite.EqualValues(changes["cmsCenters"], updatedTimeline.CMSCenters)
// 	suite.EqualValues(changes["cmmiGroups"], updatedTimeline.CMMIGroups)
// 	suite.WithinDuration(time.Date(2020, 5, 13, 20, 47, 50, 120000000, time.UTC), *updatedTimeline.CompleteICIP, 0)
// 	suite.EqualValues(changes["highLevelNote"], *updatedTimeline.HighLevelNote)
// 	suite.EqualValues(changes["phasedIn"], *updatedTimeline.PhasedIn)
// 	suite.Nil(updatedTimeline.TestInterventions)
// 	suite.Nil(updatedTimeline.Note)
// }
