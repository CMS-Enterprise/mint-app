package resolvers

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestFetchPlanMilestonesByModelPlanID() {
	plan := suite.createModelPlan("Plan For Milestones") // should create the milestones as part of the resolver

	milestones, err := FetchPlanMilestonesByModelPlanID(suite.testConfigs.Logger, &suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan.ID, milestones.ModelPlanID)
	suite.EqualValues(models.TaskReady, milestones.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, *milestones.CreatedBy)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, *milestones.ModifiedBy)

	// Many of the fields are nil upon creation
	suite.Nil(milestones.CompleteICIP)
	suite.Nil(milestones.ClearanceStarts)
	suite.Nil(milestones.ClearanceEnds)
	suite.Nil(milestones.Announced)
	suite.Nil(milestones.ApplicationsStart)
	suite.Nil(milestones.ApplicationsEnd)
	suite.Nil(milestones.PerformancePeriodStarts)
	suite.Nil(milestones.PerformancePeriodEnds)
	suite.Nil(milestones.WrapUpEnds)
	suite.Nil(milestones.HighLevelNote)
	suite.Nil(milestones.PhasedIn)
	suite.Nil(milestones.PhasedInNote)
}

func (suite *ResolverSuite) TestUpdatePlanMilestones() {
	plan := suite.createModelPlan("Plan For Milestones") // should create the milestones as part of the resolver

	milestones, err := FetchPlanMilestonesByModelPlanID(suite.testConfigs.Logger, &suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	changes := map[string]interface{}{
		"completeICIP":  "2020-05-13T20:47:50.12Z",
		"phasedIn":      true,
		"highLevelNote": "Some high level note",
	}
	updater := "UPDT"

	updatedMilestones, err := UpdatePlanMilestones(suite.testConfigs.Logger, milestones.ID, changes, updater, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(updater, *updatedMilestones.ModifiedBy)
	suite.EqualValues(true, updatedMilestones.CompleteICIP.Equal(time.Date(2020, 5, 13, 20, 47, 50, 120000000, time.UTC)))
	suite.Nil(updatedMilestones.ClearanceStarts)
	suite.Nil(updatedMilestones.ClearanceEnds)
	suite.Nil(updatedMilestones.Announced)
	suite.Nil(updatedMilestones.ApplicationsStart)
	suite.Nil(updatedMilestones.ApplicationsEnd)
	suite.Nil(updatedMilestones.PerformancePeriodStarts)
	suite.Nil(updatedMilestones.PerformancePeriodEnds)
	suite.Nil(updatedMilestones.WrapUpEnds)
	suite.EqualValues("Some high level note", *updatedMilestones.HighLevelNote)
	suite.EqualValues(true, *updatedMilestones.PhasedIn)
	suite.Nil(updatedMilestones.PhasedInNote)
}
