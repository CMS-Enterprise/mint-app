package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) createMTOCategory(catName string, modelPlanID uuid.UUID, parentID *uuid.UUID) *models.MTOCategory {
	category, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, catName, modelPlanID, parentID)
	suite.NoError(err)
	suite.NoError(err)

	suite.Equal(catName, category.Name)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, category.CreatedBy)
	suite.NotNil(category.CreatedDts)
	if parentID == nil {
		suite.Nil(category.ParentID, "parent ID wasn't provided, so the category should have a nil category id")
	} else {
		if suite.NotNil(category.ParentID) {
			suite.EqualValues(*parentID, *category.ParentID, "the returned category doesn't have a parent id as expected")
		}

	}

	suite.Nil(category.ModifiedBy)
	suite.Nil(category.ModifiedDts)
	suite.EqualValues(modelPlanID, category.ModelPlanID)

	return category
}

// createSubcategories creates multiple subcategories under a specified parent category.
// Each subcategory is added with a unique position under the parent category.
func (suite *ResolverSuite) createMultipleMTOcategories(categoryNames []string, modelPlanID uuid.UUID, parentID *uuid.UUID) []*models.MTOCategory {
	var subcategories []*models.MTOCategory

	for _, name := range categoryNames {
		subcategory := suite.createMTOCategory(name, modelPlanID, parentID)
		subcategories = append(subcategories, subcategory)
	}

	return subcategories
}

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

	plan1 := suite.createModelPlan("testing category reorder plan 1")
	plan2 := suite.createModelPlan("testing category reorder plan 2")
	plan2CatName := "Category for plan 2"

	plan2Cat, err := MTOCategoryCreate(ctx, logger, principal, store, plan2CatName, plan2.ID, nil)
	suite.NoError(err)
	suite.NotNil(plan2Cat)
	// Make top level and sub categories
	cat0Name := "Category 0"
	cat0SubAName := "Category 0A"
	cat0SubBName := "Category 0B"

	category0, err := MTOCategoryCreate(ctx, logger, principal, store, cat0Name, plan1.ID, nil)
	suite.NoError(err)
	// Assert all fields are as expected for first model
	suite.Equal(0, category0.Position, "Categories should be added to the next available position")
	suite.Equal(cat0Name, category0.Name)
	suite.Equal(principal.UserAccount.ID, category0.CreatedBy)
	suite.NotNil(category0.CreatedDts)
	suite.Nil(category0.ParentID)
	suite.Nil(category0.ModifiedBy)
	suite.Nil(category0.ModifiedDts)
	suite.EqualValues(plan1.ID, category0.ModelPlanID)

	category0SubA, err := MTOCategoryCreate(ctx, logger, principal, store, cat0SubAName, plan1.ID, &category0.ID)
	suite.NoError(err)
	suite.Equal(0, category0SubA.Position, "Categories should be added to the next available position")
	if suite.NotNil(category0SubA.ParentID) {
		suite.EqualValues(category0.ID, *category0SubA.ParentID)
	}
	suite.EqualValues(plan1.ID, category0SubA.ModelPlanID)

	category0SubB, err := MTOCategoryCreate(ctx, logger, principal, store, cat0SubBName, plan1.ID, &category0.ID)
	suite.NoError(err)
	suite.Equal(1, category0SubB.Position, "Categories should be added to the next available position")
	if suite.NotNil(category0SubB.ParentID) {
		suite.EqualValues(category0.ID, *category0SubB.ParentID)
	}
	suite.EqualValues(plan1.ID, category0SubB.ModelPlanID)

	cat1Name := "Category 1"
	cat1SubAName := "Category 1A"
	cat1SubBName := "Category 1B"

	category1, err := MTOCategoryCreate(ctx, logger, principal, store, cat1Name, plan1.ID, nil)
	suite.NoError(err)
	//Second top level category
	suite.Equal(1, category1.Position, "Categories should be added to the next available position")

	category1SubA, err := MTOCategoryCreate(ctx, logger, principal, store, cat1SubAName, plan1.ID, &category1.ID)
	suite.NoError(err)
	suite.Equal(0, category1SubA.Position, "Categories should be added to the next available position")
	category1SubB, err := MTOCategoryCreate(ctx, logger, principal, store, cat1SubBName, plan1.ID, &category1.ID)
	suite.NoError(err)
	suite.Equal(1, category1SubB.Position, "Categories should be added to the next available position")

	cat2Name := "Category 2"

	category2, err := MTOCategoryCreate(ctx, logger, principal, store, cat2Name, plan1.ID, nil)
	suite.NoError(err)
	//Third top level category
	suite.Equal(2, category2.Position, "Categories should be added to the next available position")

	category2To0, err := MTOCategoryReorder(ctx, logger, principal, store, category2.ID, 0)
	suite.NoError(err)
	//It's the same category
	suite.Equal(category2.ID, category2To0.ID)
	suite.EqualValues(0, category2To0.Position)

	// this returns uncategorized as well, expect 4
	topCategoriesModel1, err := MTOCategoryGetByModelPlanIDLOADER(ctx, plan1.ID)
	suite.NoError(err)
	suite.NotNil(topCategoriesModel1)
	suite.Len(topCategoriesModel1, 4)
	//Assert the categories are as expected and in the expected position  (and returned in order by position)
	// Assert 0 to 1
	category0To1 := topCategoriesModel1[1]
	suite.Equal(category0.ID, category0To1.ID)
	suite.EqualValues(1, category0To1.Position)
	//Assert 1 to 2
	category1To2 := topCategoriesModel1[2]
	suite.Equal(category1.ID, category1To2.ID)
	suite.EqualValues(2, category1To2.Position)

	//
	uncategorized := topCategoriesModel1[3]
	suite.Equal(uuid.Nil, uncategorized.ID)
	suite.True(uncategorized.IsUncategorized())
	// TODO (mto) should we add a position to the uncategorized one?
	// suite.EqualValues(2, uncategorized.Position)

	// Assert other models not affected
	// this returns uncategorized as well, expect 4
	topCategoriesModel2, err := MTOCategoryGetByModelPlanIDLOADER(ctx, plan2.ID)
	suite.NoError(err)
	suite.NotNil(topCategoriesModel2)
	suite.Len(topCategoriesModel2, 2)
	//Assert the categories are as expected and in the expected position  (and returned in order by position)
	suite.EqualValues(0, topCategoriesModel2[0].Position)
	suite.EqualValues(plan2Cat.ID, topCategoriesModel2[0].ID)
	uncategorizedModelPlan2 := topCategoriesModel2[1]
	suite.Equal(uuid.Nil, uncategorizedModelPlan2.ID)
	suite.True(uncategorizedModelPlan2.IsUncategorized())

	// Child categories are unaffected
	category0To1SubCategories, err := MTOSubcategoryGetByParentIDLoader(ctx, plan1.ID, category0To1.ID)
	suite.NoError(err)
	suite.NotNil(category0To1SubCategories)
	suite.Len(category0To1SubCategories, 3)

	category0SubAReorder := category0To1SubCategories[0]
	suite.EqualValues(0, category0SubAReorder.Position)
	suite.EqualValues(category0SubA.ID, category0SubAReorder.ID)

	category0SubBReorder := category0To1SubCategories[1]
	suite.EqualValues(1, category0SubBReorder.Position)
	suite.EqualValues(category0SubB.ID, category0SubBReorder.ID)

	/****
	// Move Category back down to old position
	****/

	category2To0To2, err := MTOCategoryReorder(ctx, logger, principal, store, category2.ID, 2)
	suite.NoError(err)
	//It's the same category
	suite.Equal(category2To0.ID, category2To0To2.ID)
	suite.EqualValues(2, category2To0To2.Position)

	// this returns uncategorized as well, expect 4
	topCategoriesModel1Again, err := MTOCategoryGetByModelPlanIDLOADER(ctx, plan1.ID)
	suite.NoError(err)
	suite.NotNil(topCategoriesModel1)
	suite.Len(topCategoriesModel1, 4)
	//Assert the categories are as expected and in the expected position  (and returned in order by position)
	// Assert 0 to 1 to 0
	category0To1To0 := topCategoriesModel1Again[0]
	suite.Equal(category0.ID, category0To1To0.ID)
	suite.EqualValues(0, category0To1To0.Position)
	//Assert 1 to 2 to 1
	category1To2To1 := topCategoriesModel1Again[1]
	suite.Equal(category1.ID, category1To2To1.ID)
	suite.EqualValues(1, category1To2To1.Position)

	movedCategory := topCategoriesModel1Again[2]
	suite.Equal(category2To0To2.ID, movedCategory.ID)

	//
	uncategorizedAgain := topCategoriesModel1Again[3]
	suite.Equal(uuid.Nil, uncategorizedAgain.ID)
	suite.True(uncategorizedAgain.IsUncategorized())

	/***
	Reorder a child and make sure the order remains as expected
	***/

	category0SubBTo0, err := MTOCategoryReorder(ctx, logger, principal, store, category0SubB.ID, 0)
	suite.NoError(err)
	//It's the same category
	suite.Equal(category0SubB.ID, category0SubBTo0.ID)
	suite.EqualValues(0, category0SubBTo0.Position)

	category0SubCategories, err := MTOSubcategoryGetByParentIDLoader(ctx, plan1.ID, category0.ID)
	suite.NoError(err)
	suite.NotNil(category0SubCategories)
	suite.Len(category0SubCategories, 3)

	category0SubBReorder0 := category0SubCategories[0]
	suite.EqualValues(0, category0SubBReorder0.Position)
	suite.EqualValues(category0SubB.ID, category0SubBTo0.ID)

	category0SubAReorder1 := category0SubCategories[1]
	suite.EqualValues(1, category0SubAReorder1.Position)
	suite.EqualValues(category0SubA.ID, category0SubAReorder1.ID)

}

func (suite *ResolverSuite) TestCategoryCreationAndDefaults() {
	plan := suite.createModelPlan("Testing Plan for Default Categories")

	// Test creation of top-level category
	topCategory := suite.createMTOCategory("Top Category", plan.ID, nil)
	suite.Equal(0, topCategory.Position, "Top-level categories should start at position 0")

	// Test creation of subcategory with default position
	subCategory := suite.createMTOCategory("Sub Category A", plan.ID, &topCategory.ID)
	suite.Equal(0, subCategory.Position, "Subcategories should start at position 0 within their parent")
}

func (suite *ResolverSuite) TestMultipleCategoriesWithPositioning() {
	plan := suite.createModelPlan("Testing Plan for Multiple Categories")
	cat0Name := "Category 0"
	cat1Name := "Category 1"
	cat2Name := "Category 2"

	names := []string{cat0Name, cat1Name, cat2Name}
	categories := suite.createMultipleMTOcategories(names, plan.ID, nil)
	suite.Len(categories, 3)

	// Create multiple categories and assert position are correct
	cat0, cat1, cat2 := categories[0], categories[1], categories[2]
	suite.EqualValues(cat0Name, cat0.Name)
	suite.EqualValues(cat1Name, cat1.Name)
	suite.EqualValues(cat2Name, cat2.Name)

	suite.Equal(0, cat0.Position)
	suite.Equal(1, cat1.Position, "Category 1 should be positioned at 1 after Category 0")
	suite.Equal(2, cat2.Position, "Category 2 should be positioned at 2 after Category 1")

	plan2 := suite.createModelPlan("Testing Plan for Multiple Categories")
	plan2Cat := suite.createMTOCategory("placeholder", plan2.ID, nil)
	suite.Equal(0, plan2Cat.Position)

}

func (suite *ResolverSuite) TestCategoryReorderToPositionZero() {
	plan := suite.createModelPlan("Testing Plan for Reordering")

	// Create multiple categories for model plan
	cat0Name := "Category 0"
	cat1Name := "Category 1"
	cat2Name := "Category 2"
	cat2SubName := "Category 2 Sub"
	names := []string{cat0Name, cat1Name, cat2Name}
	categories := suite.createMultipleMTOcategories(names, plan.ID, nil)
	suite.Len(categories, 3)

	cat0, cat1, cat2 := categories[0], categories[1], categories[2]

	// Make child for category 2
	cat2ChildCategory := suite.createMTOCategory(cat2SubName, plan.ID, &cat2.ID)
	suite.Equal(0, cat2ChildCategory.Position)

	// Create a category for another model plan
	plan2 := suite.createModelPlan("Testing Plan for Multiple Categories")
	plan2Cat := suite.createMTOCategory("placeholder", plan2.ID, nil)
	plan2CatSub := suite.createMTOCategory("placeholder sub", plan2.ID, &plan2Cat.ID)
	suite.Equal(0, plan2Cat.Position)
	suite.Equal(0, plan2CatSub.Position)

	// Move cat2 to position 0 and verify reordering
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2.ID, 0)
	suite.NoError(err)

	// Verify positions after reordering
	retCategories, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(retCategories, 4)

	suite.EqualValues(cat2.ID, retCategories[0].ID, "Category 2 should now be in position 0")
	suite.EqualValues(cat0.ID, retCategories[1].ID, "Category 0 should move to position 1")
	suite.EqualValues(cat1.ID, retCategories[2].ID, "Category 1 should move to position 2")

	//Verify that a child category isn't updated if parent is reordered
	retSubCategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat2.ID)
	suite.NoError(err)
	suite.Len(retSubCategories, 2, "There should be two sub categories (including uncategorized)")
	suite.EqualValues(cat2ChildCategory.ID, retSubCategories[0].ID, "Category 2 Sub should remain in position 0")

	/***** verify that a category for another model plan isn't updated
	*****/
	// Verify positions after reordering for other Model Plan
	retCategoriesPLan2, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan2.ID)
	suite.NoError(err)
	suite.Len(retCategoriesPLan2, 2)
	//Verify that a child category isn't updated if parent is reordered
	retSubCategoriesPlan2, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan2.ID, plan2Cat.ID)
	suite.NoError(err)
	suite.Len(retSubCategoriesPlan2, 2, "There should be two sub categories (including uncategorized)")
	suite.EqualValues(plan2CatSub.ID, retSubCategoriesPlan2[0].ID, "Category 2 Sub should remain in position 0")
	/*end */
}

func (suite *ResolverSuite) TestCategoryReorderToPositionTwo() {
	plan := suite.createModelPlan("Testing Plan for Reordering")

	// Create multiple categories for model plan
	cat0Name := "Category 0"
	cat1Name := "Category 1"
	cat2Name := "Category 2"
	cat2SubName := "Category 2 Sub"
	names := []string{cat0Name, cat1Name, cat2Name}
	categories := suite.createMultipleMTOcategories(names, plan.ID, nil)
	suite.Len(categories, 3)

	cat0, cat1, cat2 := categories[0], categories[1], categories[2]

	// Make child for category 2
	cat2ChildCategory := suite.createMTOCategory(cat2SubName, plan.ID, &cat2.ID)
	suite.Equal(0, cat2ChildCategory.Position)

	// Create a category for another model plan
	plan2 := suite.createModelPlan("Testing Plan for Multiple Categories")
	plan2Cat := suite.createMTOCategory("placeholder", plan2.ID, nil)
	plan2CatSub := suite.createMTOCategory("placeholder sub", plan2.ID, &plan2Cat.ID)
	suite.Equal(0, plan2Cat.Position)
	suite.Equal(0, plan2CatSub.Position)

	// Move cat0 to position 2 and verify reordering
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat0.ID, 2)
	suite.NoError(err)

	// Verify positions after reordering
	retCategories, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(retCategories, 4)

	suite.EqualValues(cat1.ID, retCategories[0].ID, "Category 1 should now be in position 0")
	suite.EqualValues(cat2.ID, retCategories[1].ID, "Category 2 should move to position 1")
	suite.EqualValues(cat0.ID, retCategories[2].ID, "Category 0 should move to position 2")

	//Verify that a child category isn't updated if parent is reordered
	retSubCategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat2.ID)
	suite.NoError(err)
	suite.Len(retSubCategories, 2, "There should be two sub categories (including uncategorized)")
	suite.EqualValues(cat2ChildCategory.ID, retSubCategories[0].ID, "Category 2 Sub should remain in position 0")

	/***** verify that a category for another model plan isn't updated
	*****/
	// Verify positions after reordering for other Model Plan
	retCategoriesPLan2, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan2.ID)
	suite.NoError(err)
	suite.Len(retCategoriesPLan2, 2)
	//Verify that a child category isn't updated if parent is reordered
	retSubCategoriesPlan2, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan2.ID, plan2Cat.ID)
	suite.NoError(err)
	suite.Len(retSubCategoriesPlan2, 2, "There should be two sub categories (including uncategorized)")
	suite.EqualValues(plan2CatSub.ID, retSubCategoriesPlan2[0].ID, "Category 2 Sub should remain in position 0")
	/*end */
}

// TestMTOSubCategoryReorderToPositionTwo validates that the sub categories move as expected
func (suite *ResolverSuite) TestMTOSubCategoryReorderToPositionTwo() {
	plan := suite.createModelPlan("Testing Plan for Reordering")

	// Create multiple categories for model plan
	cat0Name := "Category 0"
	cat1Name := "Category 1"
	cat2Name := "Category 2"
	cat2Sub0Name := "Category 2 Sub 0"
	cat2Sub1Name := "Category 2 Sub 1"
	cat2Sub2Name := "Category 2 Sub 2"
	names := []string{cat0Name, cat1Name, cat2Name}
	categories := suite.createMultipleMTOcategories(names, plan.ID, nil)
	suite.Len(categories, 3)

	cat0, cat1, cat2 := categories[0], categories[1], categories[2]

	// Make child for category 2
	subCategoryNames := []string{cat2Sub0Name, cat2Sub1Name, cat2Sub2Name}
	cat2SubCategories := suite.createMultipleMTOcategories(subCategoryNames, plan.ID, &cat2.ID)
	cat2Sub0, cat2Sub1, cat2Sub2 := cat2SubCategories[0], cat2SubCategories[1], cat2SubCategories[2]

	// Create a category for another model plan
	plan2 := suite.createModelPlan("Testing Plan for Multiple Categories")
	plan2Cat := suite.createMTOCategory("placeholder", plan2.ID, nil)
	plan2CatSub := suite.createMTOCategory("placeholder sub", plan2.ID, &plan2Cat.ID)
	suite.Equal(0, plan2Cat.Position)
	suite.Equal(0, plan2CatSub.Position)

	// reorder the subcategory
	// Move cat2Sub0 to position 2 and verify reordering
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2Sub0.ID, 2)
	suite.NoError(err)

	retSubcategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat2.ID)
	suite.NoError(err)
	suite.EqualValues(cat2Sub1.ID, retSubcategories[0].ID, "Subcategory 1 should now be in position 0")
	suite.EqualValues(cat2Sub2.ID, retSubcategories[1].ID, "Subcategory 2 should move to position 1")
	suite.EqualValues(cat2Sub0.ID, retSubcategories[2].ID, "Subcategory 0 should move to position 2")

	// Verify positions after reordering
	//verify parent categories are unaffected
	retCategories, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(retCategories, 4)

	suite.EqualValues(cat0.ID, retCategories[0].ID, "Category 0 should now be in position 0")
	suite.EqualValues(cat1.ID, retCategories[1].ID, "Category 1 should move to position 1")
	suite.EqualValues(cat2.ID, retCategories[2].ID, "Category 2 should move to position 2")

	/***** verify that a category for another model plan isn't updated
	*****/
	// Verify positions after reordering for other Model Plan
	retCategoriesPLan2, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan2.ID)
	suite.NoError(err)
	suite.Len(retCategoriesPLan2, 2)
	//Verify that a child category isn't updated if parent is reordered
	retSubCategoriesPlan2, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan2.ID, plan2Cat.ID)
	suite.NoError(err)
	suite.Len(retSubCategoriesPlan2, 2, "There should be two sub categories (including uncategorized)")
	suite.EqualValues(plan2CatSub.ID, retSubCategoriesPlan2[0].ID, "Category 2 Sub should remain in position 0")
	/*end */
}
