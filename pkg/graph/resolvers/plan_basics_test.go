package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

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
	suite.Nil(basics.PhasedIn)
	suite.Nil(basics.PhasedInNote)
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
		"phasedIn":       true,
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
	suite.EqualValues(changes["phasedIn"], *updatedBasics.PhasedIn)
	suite.Nil(updatedBasics.TestInterventions)
	suite.Nil(updatedBasics.Note)
}
