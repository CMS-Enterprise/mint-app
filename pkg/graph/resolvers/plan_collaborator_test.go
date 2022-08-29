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
	collaborator, err := CreatePlanCollaborator(suite.testConfigs.Logger, collaboratorInput, suite.testConfigs.Principal, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan.ID, collaborator.ModelPlanID)
	suite.EqualValues("CLAB", collaborator.EUAUserID)
	suite.EqualValues("Clab O' Rater", collaborator.FullName)
	suite.EqualValues(models.TeamRoleLeadership, collaborator.TeamRole)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, collaborator.CreatedBy)
	suite.Nil(collaborator.ModifiedBy)
}

func (suite *ResolverSuite) TestUpdatePlanCollaborator() {
	plan := suite.createModelPlan("Plan For Milestones")
	collaborator := suite.createPlanCollaborator(plan, "CLAB", "Clab O' Rater", models.TeamRoleLeadership)
	suite.Nil(collaborator.ModifiedBy)
	suite.Nil(collaborator.ModifiedDts)

	updatedCollaborator, err := UpdatePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, models.TeamRoleEvaluation, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(updatedCollaborator.ModifiedBy)
	suite.NotNil(updatedCollaborator.ModifiedDts)
	suite.EqualValues(suite.testConfigs.Principal.EUAID, *updatedCollaborator.ModifiedBy)
	suite.EqualValues("CLAB", updatedCollaborator.EUAUserID)
	suite.EqualValues("Clab O' Rater", updatedCollaborator.FullName)
	suite.EqualValues(models.TeamRoleEvaluation, updatedCollaborator.TeamRole)
}

func (suite *ResolverSuite) TestUpdatePlanCollaboratorLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	collaborator := collaborators[0]
	updatedPlanCollaborator, err := UpdatePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, models.TeamRoleEvaluation, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(updatedPlanCollaborator)
}

func (suite *ResolverSuite) TestFetchCollaboratorsByModelPlanID() {
	plan := suite.createModelPlan("Plan For Milestones")
	_ = suite.createPlanCollaborator(plan, "SCND", "Mr. Second Collaborator", models.TeamRoleLeadership)

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
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
	deletedCollaborator, err := DeletePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(deletedCollaborator, collaborator)

	// Ensure we get an error when we try fetch it
	collaboratorByID, err := FetchCollaboratorByID(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Store)
	suite.Error(err)
	suite.Nil(collaboratorByID)
}

func (suite *ResolverSuite) TestDeletePlanCollaboratorLastModelLead() {
	plan := suite.createModelPlan("Plan For Milestones")

	collaborators, err := FetchCollaboratorsByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	collaborator := collaborators[0]
	deletedPlanCollaborator, err := DeletePlanCollaborator(suite.testConfigs.Logger, collaborator.ID, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.Error(err)
	suite.EqualValues("pq: There must be at least one MODEL_LEAD assigned to each model plan", err.Error())
	suite.Nil(deletedPlanCollaborator)
}
