package resolvers

// ExistingModelCollectionGet returns all existing models
func (suite *ResolverSuite) TestExistingModelCollectionGet() {
	existingModels, err := ExistingModelCollectionGet(suite.testConfigs.Logger, suite.testConfigs.Store)
	suite.NoError(err)
	suite.NotNil(existingModels)

}
