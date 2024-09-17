package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) UserAccount() {

	updaterPrincipal := suite.getTestPrincipal(suite.testConfigs.Store, "BTMN")

	plan := suite.createModelPlan("My Test plan")
	collab := suite.createPlanCollaborator(plan, "BTMN", []models.TeamRole{models.TeamRoleEvaluation})

	userAccount, err := collab.UserAccount(suite.testConfigs.Context)
	suite.NoError(err)

	suite.Equal(updaterPrincipal.UserAccount, userAccount)
}
