package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) createKeyContactCategory(category string) *models.KeyContactCategory {
	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		category,
	)
	suite.NoError(err)

	return newCategory
}

// TestCreateKeyContactCategory tests creating a new key contact category.
func (suite *ResolverSuite) TestCreateKeyContactCategory() {
	categoryName := "Test Category"

	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		categoryName,
	)

	suite.NoError(err)
	suite.NotNil(newCategory)
	suite.NotEqual(uuid.Nil, newCategory.ID)
	suite.Equal(categoryName, newCategory.Category)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, newCategory.CreatedBy)
	suite.NotNil(newCategory.CreatedDts)
	suite.Nil(newCategory.ModifiedBy)
	suite.Nil(newCategory.ModifiedDts)
}

// TestUpdateKeyContactCategory tests updating an existing key contact category.
func (suite *ResolverSuite) TestUpdateKeyContactCategory() {
	originalCategoryName := "Original Category"
	updatedCategoryName := "Updated Category"

	// Create a category first
	category := suite.createKeyContactCategory(originalCategoryName)

	// Update the category
	changes := map[string]interface{}{
		"category": updatedCategoryName,
	}

	updatedCategory, err := UpdateKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		category.ID,
		changes,
	)

	suite.NoError(err)
	suite.NotNil(updatedCategory)
	suite.Equal(category.ID, updatedCategory.ID)
	suite.Equal(updatedCategoryName, updatedCategory.Category)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, updatedCategory.CreatedBy)
	suite.NotNil(updatedCategory.ModifiedBy)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, *updatedCategory.ModifiedBy)
	suite.NotNil(updatedCategory.ModifiedDts)
}

// TestUpdateKeyContactCategory_NotFound tests updating a non-existent category.
func (suite *ResolverSuite) TestUpdateKeyContactCategory_NotFound() {
	nonExistentID := uuid.New()
	changes := map[string]interface{}{
		"category": "Updated Category",
	}

	_, err := UpdateKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nonExistentID,
		changes,
	)

	suite.Error(err)
	suite.Contains(err.Error(), "no rows in result set")
}

// TestDeleteKeyContactCategory tests deleting a key contact category.
func (suite *ResolverSuite) TestDeleteKeyContactCategory() {
	category := suite.createKeyContactCategory("Category To Delete")

	// Verify category exists before deletion
	retrievedCategory, err := GetKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		category.ID,
	)
	suite.NoError(err)
	suite.NotNil(retrievedCategory)
	suite.Equal(category.ID, retrievedCategory.ID)

	// Delete the category
	deletedCategory, err := DeleteKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		category.ID,
	)

	suite.NoError(err)
	suite.NotNil(deletedCategory)
	suite.Equal(category.ID, deletedCategory.ID)

	// Verify category no longer exists
	_, err = GetKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		category.ID,
	)
	suite.Error(err)
	suite.Contains(err.Error(), "sql: no rows in result set")
}

// TestDeleteKeyContactCategory_NotFound tests deleting a non-existent category.
func (suite *ResolverSuite) TestDeleteKeyContactCategory_NotFound() {
	nonExistentID := uuid.New()

	_, err := DeleteKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nonExistentID,
	)

	suite.Error(err)
	suite.Contains(err.Error(), "sql: no rows in result set")
}

// TestGetKeyContactCategory tests retrieving a key contact category by ID.
func (suite *ResolverSuite) TestGetKeyContactCategory() {
	categoryName := "Category To Retrieve"
	category := suite.createKeyContactCategory(categoryName)

	retrievedCategory, err := GetKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		category.ID,
	)

	suite.NoError(err)
	suite.NotNil(retrievedCategory)
	suite.Equal(category.ID, retrievedCategory.ID)
	suite.Equal(categoryName, retrievedCategory.Category)
	suite.Equal(category.CreatedBy, retrievedCategory.CreatedBy)
}

// TestGetKeyContactCategory_NotFound tests retrieving a non-existent category.
func (suite *ResolverSuite) TestGetKeyContactCategory_NotFound() {
	nonExistentID := uuid.New()

	_, err := GetKeyContactCategory(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nonExistentID,
	)

	suite.Error(err)
	suite.Contains(err.Error(), "sql: no rows in result set")
}

// TestGetAllKeyContactCategories tests retrieving all key contact categories.
func (suite *ResolverSuite) TestGetAllKeyContactCategories() {
	// Create multiple categories
	category1 := suite.createKeyContactCategory("Category 1")
	category2 := suite.createKeyContactCategory("Category 2")
	category3 := suite.createKeyContactCategory("Category 3")

	// Retrieve all categories
	allCategories, err := GetAllKeyContactCategories(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
	)

	suite.NoError(err)
	suite.NotNil(allCategories)
	suite.GreaterOrEqual(len(allCategories), 3)

	// Verify our created categories are in the list
	categoryIDs := make(map[uuid.UUID]bool)
	for _, cat := range allCategories {
		categoryIDs[cat.ID] = true
	}

	suite.True(categoryIDs[category1.ID], "Category 1 should be in the results")
	suite.True(categoryIDs[category2.ID], "Category 2 should be in the results")
	suite.True(categoryIDs[category3.ID], "Category 3 should be in the results")
}

// TestGetAllKeyContactCategories_Empty tests retrieving all categories when none exist.
func (suite *ResolverSuite) TestGetAllKeyContactCategories_Empty() {
	// Retrieve all categories (should be empty since SetupTest truncates tables)
	allCategories, err := GetAllKeyContactCategories(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
	)

	suite.NoError(err)
	suite.Len(allCategories, 0)

	category := suite.createKeyContactCategory("Category To Retrieve")
	newAllCategories, err := GetAllKeyContactCategories(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.Len(newAllCategories, 1)
	suite.Equal(category.ID, newAllCategories[0].ID)
}
