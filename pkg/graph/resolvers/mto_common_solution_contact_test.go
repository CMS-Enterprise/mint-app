package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// TestMTOCommonSolutionGetByModelPlanIDLOADER validated that data loader call to fetch the wrapped ContactInformation resolver works as anticipated
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

// MTOMCommonSolutionContactLoaderTest validates the underlying behavior of the data loader. It validates the count of users that are returned for each solution
func (suite *ResolverSuite) TestMTOMCommonSolutionContactLoader() {

	// we verify the expected returned count of contacts
	expectedResults := []loaders.KeyAndExpected[models.MTOCommonSolutionKey, int]{
		{Key: models.MTOCSKInnovation, Expected: 5},
		{Key: models.MTOCSKAcoOs, Expected: 4},
		{Key: models.MTOCSKApps, Expected: 2},
		{Key: models.MTOCSKCdx, Expected: 1},
		{Key: models.MTOCSKCcw, Expected: 1},
		{Key: models.MTOCSKCmsBox, Expected: 1},
		{Key: models.MTOCSKCmsQualtrics, Expected: 1},
		{Key: models.MTOCSKCbosc, Expected: 3},
	}

	verifyFunc := func(data []*models.MTOCommonSolutionContact, expected int) bool {
		return suite.Len(data, expected)
	}
	// Call the helper method to validate all results
	loaders.VerifyLoaders[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContact, int](suite.testConfigs.Context, &suite.Suite, loaders.MTOCommonSolutionContact.ByCommonSolutionKey,
		expectedResults, verifyFunc)

}
