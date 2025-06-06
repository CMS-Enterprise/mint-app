package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
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
	plan1 := suite.createModelPlan("model plan 1")
	cat1Name := "Category 1"
	category1, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat1Name, plan1.ID, nil)
	suite.NoError(err)
	suite.NotNil(category1)
	suite.EqualValues(plan1.ID, category1.ModelPlanID)

	plan2 := suite.createModelPlan("model plan 2")
	cat2Name := "Category 2"
	category2, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2Name, plan2.ID, nil)
	suite.NoError(err)
	suite.NotNil(category2)
	suite.EqualValues(plan2.ID, category2.ModelPlanID)

	plan3 := suite.createModelPlan("model plan 3")
	cat3Name := "Category 3"
	category3, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat3Name, plan3.ID, nil)
	suite.NoError(err)
	suite.NotNil(category3)
	suite.EqualValues(plan3.ID, category3.ModelPlanID)

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, uuid.UUID]{
		{Key: plan1.ID, Expected: category1.ID},
		{Key: plan2.ID, Expected: category2.ID},
		{Key: plan3.ID, Expected: category3.ID},
	}
	verifyFunc := func(data []*models.MTOCategory, expected uuid.UUID) bool {
		if suite.NotNil(data) {
			suite.Len(data, 1) //if we want, we can verify multiple values are returned, this is testing that the correct one is returned at a minimum
			return suite.EqualValues(expected, data[0].ID)
		}
		return false
	}
	loaders.VerifyLoaders[uuid.UUID, []*models.MTOCategory, uuid.UUID](suite.testConfigs.Context, &suite.Suite, loaders.MTOCategory.ByModelPlanID,
		expectedResults, verifyFunc)

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

func (suite *ResolverSuite) TestMTOCategoryCreationAndDefaults() {
	plan := suite.createModelPlan("Testing Plan for Default Categories")

	// Test creation of top-level category
	topCategory := suite.createMTOCategory("Top Category", plan.ID, nil)
	suite.Equal(0, topCategory.Position, "Top-level categories should start at position 0")

	// Test creation of subcategory with default position
	subCategory := suite.createMTOCategory("Sub Category A", plan.ID, &topCategory.ID)
	suite.Equal(0, subCategory.Position, "Subcategories should start at position 0 within their parent")
}

func (suite *ResolverSuite) TestMultipleMTOCategoriesWithPositioning() {
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

// TestMTOCategoryReorderToPositionZero validates that category updates happen as expected when moving to a higher position
func (suite *ResolverSuite) TestMTOCategoryReorderToPositionZero() {
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
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2.ID, helpers.PointerTo[int](0), nil)
	suite.NoError(err)

	// Verify positions after reordering
	retCategories, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(retCategories, 4)

	suite.EqualValues(cat2.ID, retCategories[0].ID, "Category 2 should now be in position 0")
	suite.EqualValues(cat0.ID, retCategories[1].ID, "Category 0 should move to position 1")
	suite.EqualValues(cat1.ID, retCategories[2].ID, "Category 1 should move to position 2")
	suite.EqualValues(uuid.Nil, retCategories[3].ID, "Uncategorized should have the max position (3)")
	suite.EqualValues(3, retCategories[3].Position, "Uncategorized should have uuid.Nil")

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

// TestMTOCategoryReorderToPositionTwo validates that category updates happen as expected when moving to a lower position
func (suite *ResolverSuite) TestMTOCategoryReorderToPositionTwo() {
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
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat0.ID, helpers.PointerTo[int](2), nil)
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
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2Sub0.ID, helpers.PointerTo[int](2), nil)
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

// TestMTOSubCategoryReorderToPositionZero validates that the sub categories move as expected
func (suite *ResolverSuite) TestMTOSubCategoryReorderToPositionZero() {
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
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2Sub2.ID, helpers.PointerTo[int](0), nil)
	suite.NoError(err)

	retSubcategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat2.ID)
	suite.NoError(err)
	suite.EqualValues(cat2Sub2.ID, retSubcategories[0].ID, "Subcategory 2 should now be in position 0")
	suite.EqualValues(cat2Sub0.ID, retSubcategories[1].ID, "Subcategory 0 should move to position 1")
	suite.EqualValues(cat2Sub1.ID, retSubcategories[2].ID, "Subcategory 1 should move to position 2")

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

// TestMTOSubCategoryReorderToPositionZero validates that the sub categories move as expected
func (suite *ResolverSuite) TestMTOSubCategoryReorderToPositionZeroOfNewParent() {
	plan := suite.createModelPlan("Testing Plan for Reordering")

	// Create multiple categories for model plan
	cat0Name := "Category 0"
	cat0Sub0Name := "Category 0 Sub 0"
	cat0Sub1Name := "Category 0 Sub 1"
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
	cat0SubCategories := suite.createMultipleMTOcategories([]string{cat0Sub0Name, cat0Sub1Name}, plan.ID, &cat0.ID)
	cat0Sub0, cat0Sub1 := cat0SubCategories[0], cat0SubCategories[1]

	// Create a category for another model plan
	plan2 := suite.createModelPlan("Testing Plan for Multiple Categories")
	plan2Cat := suite.createMTOCategory("placeholder", plan2.ID, nil)
	plan2CatSub := suite.createMTOCategory("placeholder sub", plan2.ID, &plan2Cat.ID)
	suite.Equal(0, plan2Cat.Position)
	suite.Equal(0, plan2CatSub.Position)

	// reorder the subcategory
	// Move cat2Sub0 to position 0 of cat0 and verify reordering
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2Sub0.ID, helpers.PointerTo[int](0), &cat0.ID)
	suite.NoError(err)

	// validate the position of subcategories of old parent
	retSubcategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat2.ID)
	suite.Len(retSubcategories, 3)
	suite.NoError(err)
	suite.EqualValues(cat2Sub1.ID, retSubcategories[0].ID, "Subcategory 1 should now be in position 0")
	suite.EqualValues(cat2Sub2.ID, retSubcategories[1].ID, "Subcategory 2 should move to position 1")
	suite.EqualValues(uuid.Nil, retSubcategories[2].ID, "Uncategorized should be in position 2")

	// validate the position of subcategories of new parent
	retNewCategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat0.ID)
	suite.Len(retNewCategories, 4)
	suite.NoError(err)
	suite.EqualValues(cat2Sub0.ID, retNewCategories[0].ID, "Subcategory 0 from cat 2 should move to position 0 in new parent")
	suite.EqualValues(cat0Sub0.ID, retNewCategories[1].ID, "Subcategory 0 from cat 0 should move to position 1 in new parent")
	suite.EqualValues(cat0Sub1.ID, retNewCategories[2].ID, "Subcategory 1 from cat 0 should move to position 2 in new parent")
	suite.EqualValues(uuid.Nil, retNewCategories[3].ID, "Uncategorized should be in position 3 in new parent")

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

// TestMTOSubCategoryReorderToPositionTwo validates that the sub categories move as expected
func (suite *ResolverSuite) TestMTOSubCategoryReorderToNewParentOrderNotSpecified() {
	plan := suite.createModelPlan("Testing Plan for Reordering")

	// Create multiple categories for model plan
	cat0Name := "Category 0"
	cat0Sub0Name := "Category 0 Sub 0"
	cat0Sub1Name := "Category 0 Sub 1"
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
	cat0SubCategories := suite.createMultipleMTOcategories([]string{cat0Sub0Name, cat0Sub1Name}, plan.ID, &cat0.ID)
	cat0Sub0, cat0Sub1 := cat0SubCategories[0], cat0SubCategories[1]

	// Create a category for another model plan
	plan2 := suite.createModelPlan("Testing Plan for Multiple Categories")
	plan2Cat := suite.createMTOCategory("placeholder", plan2.ID, nil)
	plan2CatSub := suite.createMTOCategory("placeholder sub", plan2.ID, &plan2Cat.ID)
	suite.Equal(0, plan2Cat.Position)
	suite.Equal(0, plan2CatSub.Position)

	// reorder the subcategory
	// Move cat2Sub0 to undefined position of cat0 and verify reordering to the last position
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2Sub0.ID, nil, &cat0.ID)
	suite.NoError(err)

	// validate the position of subcategories of old parent
	retSubcategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat2.ID)
	suite.Len(retSubcategories, 3)
	suite.NoError(err)
	suite.EqualValues(cat2Sub1.ID, retSubcategories[0].ID, "Subcategory 1 should now be in position 0")
	suite.EqualValues(cat2Sub2.ID, retSubcategories[1].ID, "Subcategory 2 should move to position 1")
	suite.EqualValues(uuid.Nil, retSubcategories[2].ID, "Uncategorized should be in position 2")

	// validate the position of subcategories of new parent
	retNewCategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, cat0.ID)
	suite.Len(retNewCategories, 4)
	suite.NoError(err)

	suite.EqualValues(cat0Sub0.ID, retNewCategories[0].ID, "Subcategory 0 from cat 0 should move to position 0 in new parent")
	suite.EqualValues(cat0Sub1.ID, retNewCategories[1].ID, "Subcategory 1 from cat 0 should move to position 1 in new parent")
	suite.EqualValues(cat2Sub0.ID, retNewCategories[2].ID, "Subcategory 0 from cat 2 should move to position 2 in new parent")
	suite.EqualValues(uuid.Nil, retNewCategories[3].ID, "Uncategorized should be in position 3 in new parent")

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

// TestMTOCantMakeParentCategorySubCategory validates that a parent can't be made a child category
func (suite *ResolverSuite) TestMTOCantMakeParentCategorySubCategory() {
	plan := suite.createModelPlan("Testing Plan for Reordering")

	// Create multiple categories for model plan
	cat0Name := "Category 0"
	cat1Name := "Category 1"
	cat2Name := "Category 2"

	names := []string{cat0Name, cat1Name, cat2Name}
	categories := suite.createMultipleMTOcategories(names, plan.ID, nil)
	suite.Len(categories, 3)

	cat0, cat1, cat2 := categories[0], categories[1], categories[2]

	//Try to move cat 1 to be a child of cat 0
	_, err := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat1.ID, nil, &cat0.ID)
	suite.Error(err, "we expect that you can't make a parent category a child category. There should be an error for this operation.")

	// Try to reorder without specifying a new position or a new parent. Expect an error
	_, err2 := MTOCategoryReorder(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat2.ID, nil, nil)
	suite.Error(err2, "we expect that you can't reorder without specifying both order and parent . There should be an error for this operation.")

}

// TestMTOCreateStandardCategories validates expectations around the MTOCreateStandardCategories resolver
func (suite *ResolverSuite) TestMTOCreateStandardCategories() {
	plan := suite.createModelPlan("Plan with standard MTO Categories")

	// Call the storage method directly here since it doesn't append any `Uncategorized`, making it more useful for direct testing & validation
	initialCategories, err := MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(initialCategories, 0) // No categories to start

	// Create the standard categories
	_, err = MTOCreateStandardCategories(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)

	// Check all the categories again
	updatedCategories, err := MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	// Make sure it's the expected split of categories and subcategories
	numCategories := lo.CountBy(updatedCategories, func(c *models.MTOCategory) bool {
		return c.ParentID == nil
	})
	numSubcategories := lo.CountBy(updatedCategories, func(c *models.MTOCategory) bool {
		return c.ParentID != nil
	})
	suite.Len(updatedCategories, 24)  // total
	suite.Equal(9, numCategories)     // just top-level categories
	suite.Equal(15, numSubcategories) // just subcategories

	// Finally, we'll:
	// 1) rename one of the standard categories that has subcategories (i.e. "Participants")
	// 2) re-call the MTOCreateStandardCategories method
	// 3) assert we have +3 categories, since the resolver will create an entirely new "Participants", PLUS the 2 new subcategories to go under it

	// 1) Find and rename
	participantsCategory, found := lo.Find[*models.MTOCategory](updatedCategories, func(item *models.MTOCategory) bool {
		return item.Name == mtoCatParticipants
	})
	suite.True(found)
	_, err = MTOCategoryRename(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, participantsCategory.ID, "Participants (NEW AND IMPROVED)")
	suite.NoError(err)

	// 2) re-call MTOCreateStandardCategories resolver
	_, err = MTOCreateStandardCategories(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID)
	suite.NoError(err)

	// 3) Assert proper length
	categoriesAfterRename, err := MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	numCategories = lo.CountBy(categoriesAfterRename, func(c *models.MTOCategory) bool {
		return c.ParentID == nil
	})
	numSubcategories = lo.CountBy(categoriesAfterRename, func(c *models.MTOCategory) bool {
		return c.ParentID != nil
	})

	suite.Len(categoriesAfterRename, 27) // total (three more than before)
	suite.Equal(10, numCategories)       // just top-level categories (one more than before)
	suite.Equal(17, numSubcategories)    // just subcategories (two more than before)
}

func (suite *ResolverSuite) TestMTOCategoryDelete_NullID() {
	// Attempt to delete a category using a null (uuid.Nil) ID
	// Expectation: This should return an error indicating the category does not exist or invalid input.

	invalidID := uuid.Nil
	err := MTOCategoryDelete(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, invalidID)
	suite.Error(err, "Deleting a category with a null (uuid.Nil) ID should result in an error")
}

func (suite *ResolverSuite) TestMTOCategoryDelete_NoMilestones() {
	// Create a top-level category with no subcategories and no milestones.
	// Deleting it should work cleanly and simply remove the category.
	// Expectation: No error on deletion, and the category should no longer be retrievable.

	plan := suite.createModelPlan("Test Deletion Without Milestones")
	category := suite.createMTOCategory("No Milestones Category", plan.ID, nil)

	// Confirm category is retrievable before deletion
	catBeforeDelete, err := MTOCategoryGetByID(suite.testConfigs.Context, category.ID)
	suite.NoError(err)
	suite.Equal(category.ID, catBeforeDelete.ID, "Category should exist before deletion")

	// Delete the category
	err = MTOCategoryDelete(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, category.ID)
	suite.NoError(err, "Deleting a category with no milestones should succeed")

	// Confirm category no longer exists
	catAfterDelete, err := MTOCategoryGetByID(suite.testConfigs.Context, category.ID)
	suite.Error(err, "Category should not be found after deletion")
	suite.Nil(catAfterDelete, "Category should be nil after deletion")
}

func (suite *ResolverSuite) TestMTOCategoryDelete_TopLevelCategory() {
	// Create a top-level category with subcategories and milestones.
	// On delete:
	//   - All milestones referencing this top-level category and its subcategories should be uncategorized (mto_category_id = NULL).
	//   - All direct subcategories should be deleted.
	// Expectation:
	//   - No error on deletion.
	//   - Check milestones are now uncategorized.
	//   - Check subcategories are deleted.

	plan := suite.createModelPlan("Test Top-Level Deletion")
	topCategory := suite.createMTOCategory("Top Category To Delete", plan.ID, nil)

	// Create subcategories
	subCatNames := []string{"SubCat A", "SubCat B"}
	subCategories := suite.createMultipleMTOcategories(subCatNames, plan.ID, &topCategory.ID)

	// Create a milestone in the top-level category
	milestoneTop, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Milestone in Top", plan.ID, &topCategory.ID)
	suite.NoError(err)

	// Create a milestone in a subcategory
	milestoneSub, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Milestone in Sub", plan.ID, &subCategories[0].ID)
	suite.NoError(err)

	// Delete the top-level category
	err = MTOCategoryDelete(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, topCategory.ID)
	suite.NoError(err, "Deleting a top-level category should succeed")

	// Verify top-level category and its subcategories no longer exist
	_, err = MTOCategoryGetByID(suite.testConfigs.Context, topCategory.ID)
	suite.Error(err, "Top-level category should not exist after deletion")

	for _, sc := range subCategories {
		_, err := MTOCategoryGetByID(suite.testConfigs.Context, sc.ID)
		suite.Error(err, "Subcategory should not exist after top-level category deletion")
	}

	// Verify milestones are now uncategorized
	milestoneTopAfter, err := MTOMilestoneGetByIDLOADER(suite.testConfigs.Context, milestoneTop.ID)
	suite.NoError(err)
	suite.Nil(milestoneTopAfter.MTOCategoryID, "Milestone that was in the top-level category should now be uncategorized")

	milestoneSubAfter, err := MTOMilestoneGetByIDLOADER(suite.testConfigs.Context, milestoneSub.ID)
	suite.NoError(err)
	suite.Nil(milestoneSubAfter.MTOCategoryID, "Milestone that was in a subcategory should now be uncategorized")
}

func (suite *ResolverSuite) TestMTOCategoryDelete_SubCategory() {
	// Create a top-level category and a single subcategory with milestones.
	// On deleting the subcategory:
	//   - All milestones referencing that subcategory should be reassigned to the parent category.
	// Expectations:
	//   - No error on deletion.
	//   - Subcategory is deleted.
	//   - Milestones previously in the subcategory now reference the parent category (not nil).

	plan := suite.createModelPlan("Test Subcategory Deletion")
	parentCategory := suite.createMTOCategory("Parent Category", plan.ID, nil)
	subCategory := suite.createMTOCategory("SubCategory To Delete", plan.ID, &parentCategory.ID)

	// Create a milestone in the subcategory
	milestoneSub, err := MTOMilestoneCreateCustom(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		"SubCategory Milestone",
		plan.ID,
		&subCategory.ID,
	)
	suite.NoError(err, "Creating a milestone in the subcategory should succeed")

	// Delete the subcategory
	err = MTOCategoryDelete(suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, subCategory.ID)
	suite.NoError(err, "Deleting a subcategory should succeed")

	// Verify subcategory no longer exists
	_, err = MTOCategoryGetByID(suite.testConfigs.Context, subCategory.ID)
	suite.Error(err, "Subcategory should not exist after deletion")

	// Verify milestone has been reassigned to parent category
	milestoneSubAfter, err := MTOMilestoneGetByIDLOADER(suite.testConfigs.Context, milestoneSub.ID)
	suite.NoError(err, "Retrieving milestone after reassignment should not error")
	suite.NotNil(milestoneSubAfter, "Retrieved milestone should not be nil after reassignment")
	suite.NotNil(milestoneSubAfter.MTOCategoryID, "Milestone's MTOCategoryID should not be nil after reassignment")

	suite.Equal(parentCategory.ID, *milestoneSubAfter.MTOCategoryID,
		"Milestone should now reference the parent category after subcategory deletion")
}
