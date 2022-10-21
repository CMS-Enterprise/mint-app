package resolvers

// PossibleOperationalNeedCollectionGet returns all possible OperationalNeeds
func (suite *ResolverSuite) TestPossibleOperationalNeedCollectionGet() {

	posNeeds, err := PossibleOperationalNeedCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(posNeeds)
	possibleCount := len(posNeeds)

	suite.Greater(possibleCount, 1) //the number of possible needs is determined in the DB. Assert that there is at least more than 1.

}
