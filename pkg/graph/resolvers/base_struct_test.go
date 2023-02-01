package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *ResolverSuite) TestCreatedByUserAccount() {
	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "FRND", models.TeamRoleArchitect)
	createdAccount := colab.CreatedByUserAccount(suite.testConfigs.Context) //the same as the config test principal

	suite.Equal(suite.testConfigs.Principal.UserAccount, createdAccount)
}

func (suite *ResolverSuite) TestModifiedByUserAccount() {
	updaterPrincipal := getTestPrincipal(suite.testConfigs.Store, "BTMN")

	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "FRND", models.TeamRoleArchitect)

	nilModifiedAccount := colab.ModifiedByUserAccount(suite.testConfigs.Context)
	suite.Nil(nilModifiedAccount)

	updatedCollab, err := UpdatePlanCollaborator(suite.testConfigs.Logger, colab.ID, models.TeamRoleITLead, updaterPrincipal, suite.testConfigs.Store)
	suite.NoError(err)
	modifiedAccount := updatedCollab.ModifiedByUserAccount(suite.testConfigs.Context)

	suite.Equal(updaterPrincipal.UserAccount, modifiedAccount)
}
