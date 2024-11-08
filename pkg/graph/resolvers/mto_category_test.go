package resolvers

func (suite *ResolverSuite) TestMTOCategoryGetByModelPlanIDLOADER() {
	//TODO when data exchange approach is complete, use the generic testing functionality introduced to write a unit test for this loader
}

// TestMTOCategoryCreate validates fields are generated and categories are created as expected for an MTO category
// Special emphasis on the order of the category when it is placed into a model
func (suite *ResolverSuite) TestMTOCategoryCreate() {

	plan := suite.createModelPlan("testing category creation plan")
	// Make top level and sub categories
	cat1Name := "Category 1"
	cat1SubAName := "Category 1A"
	cat1SubBName := "Category 1B"

	category1, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat1Name, plan.ID, nil)
	suite.NoError(err)
	// Assert all fields are as expected for first model
	suite.Equal(0, category1.Position, "Categories should be added to the next available position")
	suite.Equal(cat1Name, category1.Name)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, category1.CreatedBy)
	suite.NotNil(category1.CreatedDts)
	suite.Nil(category1.ParentID)
	suite.Nil(category1.ModifiedBy)
	suite.Nil(category1.ModifiedDts)
	suite.EqualValues(plan.ID, category1.ModelPlanID)

	category1SubA, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat1SubAName, plan.ID, &category1.ID)
	suite.NoError(err)
	suite.Equal(0, category1SubA.Position, "Categories should be added to the next available position")
	if suite.NotNil(category1SubA.ParentID) {
		suite.EqualValues(category1.ID, *category1SubA.ParentID)
	}
	suite.EqualValues(plan.ID, category1SubA.ModelPlanID)

	category1SubB, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat1SubBName, plan.ID, &category1.ID)
	suite.NoError(err)
	suite.Equal(1, category1SubB.Position, "Categories should be added to the next available position")
	if suite.NotNil(category1SubB.ParentID) {
		suite.EqualValues(category1.ID, *category1SubB.ParentID)
	}
	suite.EqualValues(plan.ID, category1SubB.ModelPlanID)

	cat2Name := "Category 2"
	cat2SubAName := "Category 2A"
	cat2SubBName := "Category 2B"

	category2, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2Name, plan.ID, nil)
	suite.NoError(err)
	//Second top level category
	suite.Equal(1, category2.Position, "Categories should be added to the next available position")

	category2SubA, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2SubAName, plan.ID, &category2.ID)
	suite.NoError(err)
	suite.Equal(0, category2SubA.Position, "Categories should be added to the next available position")
	category2SubB, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2SubBName, plan.ID, &category2.ID)
	suite.NoError(err)
	suite.Equal(1, category2SubB.Position, "Categories should be added to the next available position")

	cat3Name := "Category 3"

	category3, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat3Name, plan.ID, nil)
	suite.NoError(err)
	//Third top level category
	suite.Equal(2, category3.Position, "Categories should be added to the next available position")

}
