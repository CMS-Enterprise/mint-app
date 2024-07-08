package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) UserAccount() {

	updaterPrincipal := suite.GetTestPrincipal(suite.testConfigs.Store, "BTMN")

	plan := suite.createModelPlan("My Test plan")
	colab := suite.createPlanCollaborator(plan, "BTMN", []models.TeamRole{models.TeamRoleEvaluation})

	userAccount := colab.UserAccount(suite.testConfigs.Context)

	suite.Equal(updaterPrincipal.UserAccount, userAccount)
}
