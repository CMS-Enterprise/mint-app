package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestMTOCommonSolutionGetByModelPlanIDLOADER() {

	commonSolutionKey := models.MTOCSKInnovation
	contacts, err := MTOCommonSolutionContactInformationGetByKeyLOADER(suite.testConfigs.Context, commonSolutionKey)

	suite.NoError(err)
	suite.NotNil(contacts)
	suite.Len(contacts.PointsOfContact, 5) //currently there are five solutions for  4innovation (4i)

	primary, err := contacts.PrimaryContact()
	suite.NoError(err)
	suite.NotNil(primary)

}
