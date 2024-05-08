package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *ResolverSuite) TestCreatedByUserAccount() {
	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "FRND", []models.TeamRole{models.TeamRoleEvaluation})
	createdAccount, err := colab.CreatedByUserAccount(suite.testConfigs.Context) //the same as the config test principal
	suite.NoError(err)

	suite.Equal(suite.testConfigs.Principal.UserAccount, createdAccount)
}

func (suite *ResolverSuite) TestModifiedByUserAccount() {
	updaterPrincipal := getTestPrincipal(suite.testConfigs.Store, "BTMN")

	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "FRND", []models.TeamRole{models.TeamRoleEvaluation})

	nilModifiedAccount, err := colab.ModifiedByUserAccount(suite.testConfigs.Context)
	suite.NoError(err)
	suite.Nil(nilModifiedAccount)

	updatedCollab, err := PlanCollaboratorUpdate(
		suite.testConfigs.Logger,
		colab.ID,
		[]models.TeamRole{models.TeamRoleITLead},
		updaterPrincipal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	modifiedAccount, err := updatedCollab.ModifiedByUserAccount(suite.testConfigs.Context)
	suite.NoError(err)

	suite.Equal(updaterPrincipal.UserAccount, modifiedAccount)
}
