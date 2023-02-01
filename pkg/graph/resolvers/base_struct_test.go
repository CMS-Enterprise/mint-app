package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *ResolverSuite) TestCreatedByUserAccount() {
	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "FRND", models.TeamRoleArchitect)
	createdAcount := colab.CreatedByUserAccount(suite.testConfigs.Context) //the same as the config test principal

	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, createdAcount.ID)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.CommonName, createdAcount.CommonName)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.Email, createdAcount.Email)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.Username, createdAcount.Username)

}

func (suite *ResolverSuite) TestModifiedByUserAccount() {
	updaterPrincipal := getTestPrincipal(suite.testConfigs.Store, "BTMN")

	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "FRND", models.TeamRoleArchitect)
	// createdAcount := colab.CreatedByUserAccount(suite.testConfigs.Context) //the same as the config test principal

	nilModifiedAccount := colab.ModifiedByUserAccount(suite.testConfigs.Context)
	suite.Nil(nilModifiedAccount)

	updatedCollab, err := UpdatePlanCollaborator(suite.testConfigs.Logger, colab.ID, models.TeamRoleITLead, updaterPrincipal, suite.testConfigs.Store)
	suite.NoError(err)
	modifiedAccount := updatedCollab.ModifiedByUserAccount(suite.testConfigs.Context)

	suite.EqualValues(updaterPrincipal.UserAccount.ID, modifiedAccount.ID)
	suite.EqualValues(updaterPrincipal.UserAccount.CommonName, modifiedAccount.CommonName)
	suite.EqualValues(updaterPrincipal.UserAccount.Email, modifiedAccount.Email)
	suite.EqualValues(updaterPrincipal.UserAccount.Username, modifiedAccount.Username)

}
