package resolvers

import "github.com/cmsgov/mint-app/pkg/models"

func (suite *ResolverSuite) TestPossibleOperationalSolutionCollectionGetAll() {

	posSols, err := PossibleOperationalSolutionCollectionGetAll(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(posSols)
	possibleCount := len(posSols)

	suite.Greater(possibleCount, 1) // the number of possible needs is determined in the DB. Assert that there is at least more than 1.

}

// TODO: Add support for populating dummy operational solution contacts in the test database
func (suite *ResolverSuite) TestPossibleOperationalSolutionGetPrimaryContact() {
	possibleSolutionID := 1

	contacts, err := PossibleOperationalSolutionContactsGetByPossibleSolutionID(
		suite.testConfigs.Context,
		possibleSolutionID,
	)
	suite.NoError(err)
	suite.NotNil(contacts)
	suite.Greater(len(contacts), 1)

	// Find the first non-team and non-primary contact
	var nonPrimaryContact *models.PossibleOperationalSolutionContact
	for _, contact := range contacts {
		if (contact.IsPrimary == nil || *contact.IsPrimary == false) && contact.IsTeam == false {
			nonPrimaryContact = contact
			break
		}
	}

	success, err := PossibleOperationalSolutionSetPrimaryContactByID(
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
		possibleSolutionID,
		nonPrimaryContact.ID,
		suite.testConfigs.Principal,
	)
	suite.NoError(err)
	suite.True(success)

	primaryContact, err := suite.testConfigs.Store.PossibleOperationalSolutionPrimaryContactGetByPossibleSolutionID(
		suite.testConfigs.Logger,
		possibleSolutionID,
	)
	suite.NoError(err)
	suite.NotNil(primaryContact)
	suite.Equal(nonPrimaryContact.ID, primaryContact.ID)
}
