package resolvers

import "github.com/google/uuid"

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

func (suite *ResolverSuite) TestMTOCategoryRename() {
	plan := suite.createModelPlan("testing category creation plan")
	// Make top level and sub categories
	cat1Name := "Category 1"
	cat1Rename := "Category 1 Renamed Hooray!"

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

	renamedCategory, err := MTOCategoryRename(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store,
		category1.ID, cat1Rename)
	suite.NoError(err)
	suite.EqualValues(cat1Rename, renamedCategory.Name)
	// This didn't affect the position
	suite.EqualValues(0, renamedCategory.Position)
	// This didn't affect model plan id
	suite.EqualValues(plan.ID, renamedCategory.ModelPlanID)

}
func (suite *ResolverSuite) TestMTOCategoryReordering() {
	ctx := suite.testConfigs.Context
	principal := suite.testConfigs.Principal
	store := suite.testConfigs.Store
	logger := suite.testConfigs.Logger

	plan := suite.createModelPlan("testing category creation plan")
	// Make top level and sub categories
	cat0Name := "Category 0"
	cat0SubAName := "Category 0A"
	cat0SubBName := "Category 0B"

	category0, err := MTOCategoryCreate(ctx, logger, principal, store, cat0Name, plan.ID, nil)
	suite.NoError(err)
	// Assert all fields are as expected for first model
	suite.Equal(0, category0.Position, "Categories should be added to the next available position")
	suite.Equal(cat0Name, category0.Name)
	suite.Equal(principal.UserAccount.ID, category0.CreatedBy)
	suite.NotNil(category0.CreatedDts)
	suite.Nil(category0.ParentID)
	suite.Nil(category0.ModifiedBy)
	suite.Nil(category0.ModifiedDts)
	suite.EqualValues(plan.ID, category0.ModelPlanID)

	category0SubA, err := MTOCategoryCreate(ctx, logger, principal, store, cat0SubAName, plan.ID, &category0.ID)
	suite.NoError(err)
	suite.Equal(0, category0SubA.Position, "Categories should be added to the next available position")
	if suite.NotNil(category0SubA.ParentID) {
		suite.EqualValues(category0.ID, *category0SubA.ParentID)
	}
	suite.EqualValues(plan.ID, category0SubA.ModelPlanID)

	category0SubB, err := MTOCategoryCreate(ctx, logger, principal, store, cat0SubBName, plan.ID, &category0.ID)
	suite.NoError(err)
	suite.Equal(1, category0SubB.Position, "Categories should be added to the next available position")
	if suite.NotNil(category0SubB.ParentID) {
		suite.EqualValues(category0.ID, *category0SubB.ParentID)
	}
	suite.EqualValues(plan.ID, category0SubB.ModelPlanID)

	cat1Name := "Category 1"
	cat1SubAName := "Category 1A"
	cat1SubBName := "Category 1B"

	category1, err := MTOCategoryCreate(ctx, logger, principal, store, cat1Name, plan.ID, nil)
	suite.NoError(err)
	//Second top level category
	suite.Equal(1, category1.Position, "Categories should be added to the next available position")

	category1SubA, err := MTOCategoryCreate(ctx, logger, principal, store, cat1SubAName, plan.ID, &category1.ID)
	suite.NoError(err)
	suite.Equal(0, category1SubA.Position, "Categories should be added to the next available position")
	category1SubB, err := MTOCategoryCreate(ctx, logger, principal, store, cat1SubBName, plan.ID, &category1.ID)
	suite.NoError(err)
	suite.Equal(1, category1SubB.Position, "Categories should be added to the next available position")

	cat2Name := "Category 2"

	category2, err := MTOCategoryCreate(ctx, logger, principal, store, cat2Name, plan.ID, nil)
	suite.NoError(err)
	//Third top level category
	suite.Equal(2, category2.Position, "Categories should be added to the next available position")

	category2To0, err := MTOCategoryReorder(ctx, logger, principal, store, category2.ID, 0)
	suite.NoError(err)
	//It's the same category
	suite.Equal(category2.ID, category2To0.ID)
	suite.EqualValues(0, category2To0.Position)

	// this returns uncategorized as well, expect 4
	topCategories, err := MTOCategoryGetByModelPlanIDLOADER(ctx, plan.ID)
	suite.NoError(err)
	suite.NotNil(topCategories)
	//TODO (mto), remove in favor of explicit checking?
	// for index, cat := range topCategories {
	// 	suite.EqualValues(index, cat.Position)
	// }
	suite.Len(topCategories, 4)
	// Assert 0 to 1
	category0To1 := topCategories[1]
	suite.Equal(category0.ID, category0To1.ID)
	suite.EqualValues(1, category0To1.Position)
	//Assert 1 to 2
	category1To2 := topCategories[2]
	suite.Equal(category1.ID, category1To2.ID)
	suite.EqualValues(2, category1To2.Position)

	uncategorized := topCategories[3]
	suite.Equal(uuid.Nil, uncategorized.ID)

	// TODO (mto) should we add a position to the uncategorized one?
	// suite.EqualValues(2, uncategorized.Position)

}
