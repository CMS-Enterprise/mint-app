package resolvers

func (suite *ResolverSuite) TestPossibleOperationalSolutionCollectionGetAll() {

	posSols, err := PossibleOperationalSolutionCollectionGetAll(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(posSols)
	possibleCount := len(posSols)

	suite.Greater(possibleCount, 1) // the number of possible needs is determined in the DB. Assert that there is at least more than 1.

}
