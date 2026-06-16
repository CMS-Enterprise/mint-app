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

func (suite *ResolverSuite) TestPlanBasicsGetByModelPlanID() {
	plan := suite.createModelPlan("Plan For Basics") // should create the basics as part of the resolver

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)

	suite.NoError(err)
	suite.EqualValues(plan.ID, basics.ModelPlanID)
	suite.EqualValues(models.TaskReady, basics.Status)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, basics.CreatedBy)

	suite.Nil(basics.DemoCode)
	suite.Nil(basics.AmsModelID)

	// Many of the fields are nil upon creation
	suite.Nil(basics.ModelType)
	suite.Nil(basics.ModelTypeOther)
	suite.Nil(basics.Problem)
	suite.Nil(basics.Goal)
	suite.Nil(basics.ModelCategory)
	suite.Nil(basics.CMSCenters)
	suite.Nil(basics.CMMIGroups)
	suite.Nil(basics.TestInterventions)
	suite.Nil(basics.Note)
}

func (suite *ResolverSuite) TestPlanBasicsDataLoader() {
	plan1 := suite.createModelPlan("Plan For Basics 1")
	plan2 := suite.createModelPlan("Plan For Basics 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyBasicsLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyBasicsLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

	// go verifyBasicsLoader(ctx, plan1.ID)
	// go verifyBasicsLoader(ctx, plan2.ID)

}
func verifyBasicsLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	basics, err := PlanBasicsGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != basics.ModelPlanID {
		return fmt.Errorf("basics returned model plan ID %s, expected %s", basics.ModelPlanID, modelPlanID)
	}
	return nil
}

func (suite *ResolverSuite) TestUpdatePlanBasics() {
	plan := suite.createModelPlan("Plan For Basics") // should create the milestones as part of the resolver

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"modelType":      []models.ModelType{models.MTVoluntary},
		"modelTypeOther": "Some model type other note",
		"goal":           "Some goal",
		"cmsCenters":     []string{"CMMI"},
		"cmmiGroups":     []string{"PATIENT_CARE_MODELS_GROUP", "SEAMLESS_CARE_MODELS_GROUP"},
	}

	updatedBasics, err := UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)

	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.Account().ID, *updatedBasics.ModifiedBy)
	suite.EqualValues(models.TaskInProgress, updatedBasics.Status)
	suite.EqualValues([]models.ModelType{models.MTVoluntary}, models.ConvertEnums[models.ModelType](updatedBasics.ModelType))
	suite.EqualValues(changes["modelTypeOther"], *updatedBasics.ModelTypeOther)
	suite.Nil(updatedBasics.Problem)
	suite.EqualValues("Some goal", *updatedBasics.Goal)
	suite.EqualValues(changes["cmsCenters"], updatedBasics.CMSCenters)
	suite.EqualValues(changes["cmmiGroups"], updatedBasics.CMMIGroups)
	suite.Nil(updatedBasics.TestInterventions)
	suite.Nil(updatedBasics.Note)
}

// TestUpdatePlanBasics_MandatoryModelTypeClearsTimelineApplicationDates verifies that saving a mandatory
// model type clears plan timeline application period dates (see PlanBasicsUpdate transaction behavior).
func (suite *ResolverSuite) TestUpdatePlanBasics_MandatoryModelTypeClearsTimelineApplicationDates() {
	plan := suite.createModelPlan("Plan mandatory clears application dates")

	planTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	start := time.Date(2025, 1, 10, 12, 0, 0, 0, time.UTC)
	end := time.Date(2025, 3, 15, 12, 0, 0, 0, time.UTC)

	timelineChanges := map[string]interface{}{
		"applicationsStart": start.Format(time.RFC3339),
		"applicationsEnd":   end.Format(time.RFC3339),
	}

	_, err = UpdatePlanTimeline(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		planTimeline.ID,
		timelineChanges,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	planTimeline, err = PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.WithinDuration(start, *planTimeline.ApplicationsStart, 0)
	suite.WithinDuration(end, *planTimeline.ApplicationsEnd, 0)

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	basicsChanges := map[string]interface{}{
		"modelType": []models.ModelType{models.MTMandatoryNational},
		"goal":      "Goal text",
	}

	updatedBasics, err := UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		basicsChanges,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.EqualValues(models.TaskInProgress, updatedBasics.Status)
	suite.EqualValues([]models.ModelType{models.MTMandatoryNational}, models.ConvertEnums[models.ModelType](updatedBasics.ModelType))

	updatedPlanTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Nil(updatedPlanTimeline.ApplicationsStart)
	suite.Nil(updatedPlanTimeline.ApplicationsEnd)
}

// TestUpdatePlanBasics_VoluntaryModelTypeKeepsTimelineApplicationDates verifies that a voluntary model type
// does not clear existing plan timeline application period dates.
func (suite *ResolverSuite) TestUpdatePlanBasics_VoluntaryModelTypeKeepsTimelineApplicationDates() {
	plan := suite.createModelPlan("Plan voluntary keeps application dates")

	planTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	start := time.Date(2024, 6, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2024, 12, 1, 0, 0, 0, 0, time.UTC)

	timelineChanges := map[string]interface{}{
		"applicationsStart": start.Format(time.RFC3339),
		"applicationsEnd":   end.Format(time.RFC3339),
	}

	_, err = UpdatePlanTimeline(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		planTimeline.ID,
		timelineChanges,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	planTimeline, err = PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.WithinDuration(start, *planTimeline.ApplicationsStart, 0)
	suite.WithinDuration(end, *planTimeline.ApplicationsEnd, 0)

	basics, err := PlanBasicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	basicsChanges := map[string]interface{}{
		"modelType": []models.ModelType{models.MTVoluntary},
		"goal":      "Another goal",
	}

	updatedBasics, err := UpdatePlanBasics(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		basics.ID,
		basicsChanges,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.EqualValues(models.TaskInProgress, updatedBasics.Status)
	suite.EqualValues([]models.ModelType{models.MTVoluntary}, models.ConvertEnums[models.ModelType](updatedBasics.ModelType))

	updatedPlanTimeline, err := PlanTimelineGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.WithinDuration(start, *updatedPlanTimeline.ApplicationsStart, 0)
	suite.WithinDuration(end, *updatedPlanTimeline.ApplicationsEnd, 0)
}
