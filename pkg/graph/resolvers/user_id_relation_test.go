package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) UserAccount() {

	updaterPrincipal := getTestPrincipal(suite.testConfigs.Store, "BTMN")

	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "BTMN", models.TeamRoleArchitect)

	userAccount := colab.UserAccount(suite.testConfigs.Context)

	suite.EqualValues(updaterPrincipal.UserAccount.ID, userAccount.ID)
	suite.EqualValues(updaterPrincipal.UserAccount.CommonName, userAccount.CommonName)
	suite.EqualValues(updaterPrincipal.UserAccount.Email, userAccount.Email)
	suite.EqualValues(updaterPrincipal.UserAccount.Username, userAccount.Username)
}
