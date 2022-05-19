package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestCreatePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaboratorInput := &model.PlanCollaboratorCreateInput{
		ModelPlanID: plan.ID,
		EuaUserID:   "CLAB",
		FullName:    "Clab O' Rater",
		TeamRole:    models.TeamRoleLeadership,
	}
	collaborator, err := CreatePlanCollaborator(suite.testConfigs.Logger, collaboratorInput, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan.ID, collaborator.ModelPlanID)
	suite.EqualValues("CLAB", collaborator.EUAUserID)
	suite.EqualValues("Clab O' Rater", collaborator.FullName)
	suite.EqualValues(models.TeamRoleLeadership, collaborator.TeamRole)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, *collaborator.ModifiedBy)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, *collaborator.CreatedBy)
}

func (suite *ResolverSuite) TestUpdatePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "CLAB", "Clab O' Rater", models.TeamRoleLeadership)

	updatedCollaborator, err := UpdatePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, models.TeamRoleEvaluation, "UPDT", suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues("UPDT", *updatedCollaborator.ModifiedBy)
	suite.EqualValues("CLAB", updatedCollaborator.EUAUserID)
	suite.EqualValues("Clab O' Rater", updatedCollaborator.FullName)
	suite.EqualValues(models.TeamRoleEvaluation, updatedCollaborator.TeamRole)
}

func (suite *ResolverSuite) TestUpdatePlanCollaboratorLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, &suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	collaborator := collaborators[0]
	updatedPlanCollaborator, err := UpdatePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, models.TeamRoleEvaluation, "UPDT", suite.testConfigs.Store)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(updatedPlanCollaborator)
}

func (suite *ResolverSuite) TestFetchCollaboratorsByModelPlanID() {
	plan := suite.createModelPlan("Plan For Milestones")
	_ = suite.createPlanCollaborator(plan, "SCND", "Mr. Second Collaborator", models.TeamRoleLeadership)

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, &suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Len(collaborators, 2)
	suite.NotEqual(collaborators[0].ID, collaborators[1].ID) // two different collaborators
	for _, i := range collaborators {
		suite.Contains([]string{"TEST", "SCND"}, i.EUAUserID) // contains default collaborator and new one
	}
}

func (suite *ResolverSuite) TestFetchCollaboratorByID() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "SCND", "Mr. Second Collaborator", models.TeamRoleLeadership)

	collaboratorByID, err := FetchCollaboratorByID(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(collaboratorByID, collaborator)
}

func (suite *ResolverSuite) TestDeletePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "SCND", "Mr. Second Collaborator", models.TeamRoleLeadership)

	// Delete the 2nd collaborator
	deletedCollaborator, err := DeletePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.UserInfo.EuaUserID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(deletedCollaborator, collaborator)

	// Ensure we get nil when we fetch it
	// TODO: FetchByID methods should probably error if they don't find what they're looking for,
	// but FetchByModelPlanID shouldn't (just return an empty slice)
	collaboratorByID, err := FetchCollaboratorByID(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Store)
	suite.NoError(err)
	suite.Nil(collaboratorByID)
}

func (suite *ResolverSuite) TestDeletePlanCollaboratorLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, &suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	collaborator := collaborators[0]
	deletedPlanCollaborator, err := DeletePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, "UPDT", suite.testConfigs.Store)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(deletedPlanCollaborator)
}
