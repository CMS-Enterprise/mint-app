package resolvers

import (
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestMTOMilestoneCreateCustom() {
	// Create model plan
	plan := suite.createModelPlan("testing custom milestone creation")

	// Make a category and sub category
	cat1Name := "Category 1"
	cat1SubAName := "Category 1A"
	category1, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat1Name, plan.ID, nil)
	suite.NoError(err)
	category1SubA, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, cat1SubAName, plan.ID, &category1.ID)
	suite.NoError(err)

	// Create an uncategorized custom milestone
	milestone, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Custom Milestone", plan.ID, nil)
	suite.NoError(err)
	suite.Nil(milestone.MTOCategoryID)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone.CreatedBy)
	suite.Nil(milestone.ModifiedBy)
	suite.Nil(milestone.ModifiedDts)

	// Create a custom milestone under the parent category
	milestone1, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Custom Milestone 1", plan.ID, &category1.ID)
	suite.NoError(err)
	if suite.NotNil(milestone1.MTOCategoryID) {
		suite.Equal(category1.ID, *milestone1.MTOCategoryID)
	}
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone1.CreatedBy)
	suite.Nil(milestone1.ModifiedBy)
	suite.Nil(milestone1.ModifiedDts)

	// Create a custom milestone under the subcategory
	milestone1A, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Custom Milestone 1A", plan.ID, &category1SubA.ID)
	suite.NoError(err)
	if suite.NotNil(milestone1A.MTOCategoryID) {
		suite.Equal(category1SubA.ID, *milestone1A.MTOCategoryID)
	}
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone1A.CreatedBy)
	suite.Nil(milestone1A.ModifiedBy)
	suite.Nil(milestone1A.ModifiedDts)
}

func (suite *ResolverSuite) TestMTOMilestoneCreateCustomDuplicates() {
	// Create model plan
	plan := suite.createModelPlan("testing duplicate custom milestone creation")

	// Create an uncategorized custom milestone
	milestone, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Custom Milestone", plan.ID, nil)
	suite.NoError(err)
	suite.NotNil(milestone)

	// Try and create one with the same name
	milestoneDupe, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Custom Milestone", plan.ID, nil)
	suite.Error(err)
	suite.Nil(milestoneDupe)

	// Try and create one with the same even though it's in a different category
	category, err := MTOCategoryCreate(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Custom Category", plan.ID, nil)
	suite.NoError(err)
	milestoneDupe, err = MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Custom Milestone", plan.ID, &category.ID)
	suite.Error(err)
	suite.Nil(milestoneDupe)
}

func (suite *ResolverSuite) TestMTOMilestoneCreateCommon() {
	// Create model plan
	plan := suite.createModelPlan("testing common milestone creation")

	// First, make sure there's no categories to start (except uncategorized)
	categories, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(categories, 1) // Just uncategorized

	// Then, create a common milestone
	milestone, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyManageCd)
	suite.NoError(err)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone.CreatedBy)
	suite.Nil(milestone.ModifiedBy)
	suite.Nil(milestone.ModifiedDts)

	// Check and see if the categories came along as expected
	// You can check which we expect to get created with migrations/V190__Add_Common_Milestone_Library.sql (or future similar migrations that edit the library)
	// In this case MTOCommonMilestoneKeyManageCd should create 2 categories (parent, subcategory) of ('Operations','Participant and beneficiary tracking')
	categories, err = MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(categories, 2) // 1 new category (Operations) + Uncategorized

	operationsCategory, found := lo.Find(categories, func(item *models.MTOCategory) bool {
		return item != nil && item.Name == "Operations"
	})
	suite.True(found)

	operationsSubCategories, err := MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, operationsCategory.ID)
	suite.NoError(err)
	suite.Len(operationsSubCategories, 2) // should have 'Participant and beneficiary tracking' + Uncategorized
	participantSubcategory, found := lo.Find(operationsSubCategories, func(item *models.MTOSubcategory) bool {
		return item != nil && item.Name == "Participant and beneficiary tracking"
	})
	suite.True(found)

	if suite.NotNil(milestone.MTOCategoryID) {
		suite.Equal(participantSubcategory.ID, *milestone.MTOCategoryID) // ensure that the common milestone was created pointed to the subcategory
	}

	// Finally, do the same, but ensure that if we would try to create a duplicate category by name, we fail silently
	// For this example, models.MTOCommonMilestoneKeyAppSupportCon will attempt to create ('Operations','Internal functions'), but since
	// the 'Operations' category already exists, we should only see a single new subcategory ('Internal functions')
	milestone2, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyAppSupportCon)
	suite.NoError(err)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone2.CreatedBy)
	suite.Nil(milestone2.ModifiedBy)
	suite.Nil(milestone2.ModifiedDts)

	// Shouldn't have any new top-level categories, just 'Operations' and 'Uncategorized'
	categories, err = MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(categories, 2) // 1 existing category (Operations) + Uncategorized

	// Re-fetch subcategories to see if we see 3 total (since we added 'Internal functions')
	operationsSubCategories, err = MTOSubcategoryGetByParentIDLoader(suite.testConfigs.Context, plan.ID, operationsCategory.ID)
	suite.NoError(err)
	suite.Len(operationsSubCategories, 3) // should have 'Participant and beneficiary tracking', 'Internal functions', + Uncategorized

	// Find 'Participant and beneficiary tracking'
	_, foundParticipant := lo.Find(operationsSubCategories, func(item *models.MTOSubcategory) bool {
		return item != nil && item.Name == "Participant and beneficiary tracking"
	})
	suite.True(foundParticipant)

	// Find 'Internal functions'
	_, foundInternalFunctions := lo.Find(operationsSubCategories, func(item *models.MTOSubcategory) bool {
		return item != nil && item.Name == "Internal functions"
	})
	suite.True(foundInternalFunctions)
}

func (suite *ResolverSuite) TestMTOMilestoneCreateCommonDuplicates() {
	// Create model plan
	plan := suite.createModelPlan("testing common milestone creation")

	// First, create a common milestone
	milestone, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyManageCd)
	suite.NoError(err)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone.CreatedBy)
	suite.Nil(milestone.ModifiedBy)
	suite.Nil(milestone.ModifiedDts)

	// Then, try to create another with the same Common Milestone key and expect a failure
	milestoneDupe, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyManageCd)
	suite.Error(err)
	suite.Nil(milestoneDupe)
}

// TODO (mto) Write tests for MTOMilestoneUpdate

// TODO (mto) Maybe(?) write MTOMilestoneGetByModelPlanIDLOADER

// TODO (mto) Maybe(?) write MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER