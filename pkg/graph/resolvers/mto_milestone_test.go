package resolvers

import (
	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// This test ensures that we can properly create a Custom milestone with preset category information
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

// This test ensures that you get an error if you try and create 2 milestones with the same name (regardless of if they're in the same category or not)
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

// This test checks to see that we can create common milestones and that the appropriate categories are created automatically
func (suite *ResolverSuite) TestMTOMilestoneCreateCommonWithCategories() {
	// Create model plan
	plan := suite.createModelPlan("testing common milestone creation")

	// First, make sure there's no categories to start (except uncategorized)
	categories, err := MTOCategoryGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(categories, 1) // Just uncategorized

	// Then, create a common milestone
	milestone, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})
	suite.NoError(err)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone.CreatedBy)
	suite.Nil(milestone.ModifiedBy)
	suite.Nil(milestone.ModifiedDts)

	// We could potentially validate/check names of Categories on the Milestone object using MTOCategoriesGetByID,
	// but we already want to fetch the entire list of categories later to make sure the right number show up,
	// and we can just check for the right names to show up while we fetch them.

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
	milestone2, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyAppSupportCon, []models.MTOCommonSolutionKey{})
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

// This test makes sure that you get an error if you try and create 2 milestones sourced from the same common milestone
func (suite *ResolverSuite) TestMTOMilestoneCreateCommonDuplicates() {
	// Create model plan
	plan := suite.createModelPlan("testing common milestone creation")

	// First, create a common milestone
	milestone, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})
	suite.NoError(err)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, milestone.CreatedBy)
	suite.Nil(milestone.ModifiedBy)
	suite.Nil(milestone.ModifiedDts)

	// Then, try to create another with the same Common Milestone key and expect a failure
	milestoneDupe, err := MTOMilestoneCreateCommon(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})
	suite.Error(err)
	suite.Nil(milestoneDupe)
}

// TODO We might also want to test deleting a category and making sure it's re-created

// TODO We might also want to test making sure sub-categories also fail silently a category and making sure it's re-created

// TODO (mto) Write tests for MTOMilestoneUpdate

// TODO (mto) Maybe(?) write MTOMilestoneGetByModelPlanIDLOADER

// TODO (mto) Maybe(?) write MTOMilestoneGetByModelPlanIDAndCategoryIDLOADER

// TODO (mto) more dedicated tests for MTOMilestoneDelete

func (suite *ResolverSuite) TestCreateMilestoneSolutionLinks() {
	plan := suite.createModelPlan("plan for testing MTO create milestone solution links")
	commonMilestoneKey := models.MTOCommonMilestoneKeyAppSupportCon

	// create a milestone
	milestone := suite.createMilestoneCommon(plan.ID, commonMilestoneKey, []models.MTOCommonSolutionKey{
		models.MTOCSKCcw,
		models.MTOCSKApps,
	})

	// validate the created solutions
	solutions, err := MTOSolutionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	var commonSolutionKeys []models.MTOCommonSolutionKey
	for _, solution := range solutions {
		if solution.Key != nil {
			commonSolutionKeys = append(commonSolutionKeys, *solution.Key)
		}
	}

	// validate that the common solution keys are created
	suite.Len(commonSolutionKeys, 2)
	suite.Contains(commonSolutionKeys, models.MTOCSKCcw)
	suite.Contains(commonSolutionKeys, models.MTOCSKApps)

	// validate that the milestone links are created
	milestoneSolutionLinks, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		milestone.ID,
	)

	suite.NoError(err)
	suite.Len(milestoneSolutionLinks, 2)

	// finally, delete the milestone and ensure the links are removed (due to the `ON CASCADE DELETE`)
	err = MTOMilestoneDelete(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, milestone.ID)
	suite.NoError(err)
	milestoneSolutionLinksAfterDelete, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		milestone.ID,
	)
	suite.NoError(err)
	suite.Len(milestoneSolutionLinksAfterDelete, 0)
}

func (suite *ResolverSuite) TestCreateMilestoneSolutionLinksNoCommonSolutions() {
	plan := suite.createModelPlan("plan for testing MTO create milestone solution links")
	commonMilestoneKey := models.MTOCommonMilestoneKeyAppSupportCon

	// create a milestone
	milestone := suite.createMilestoneCommon(plan.ID, commonMilestoneKey, []models.MTOCommonSolutionKey{})

	// validate the created solutions
	solutions, err := MTOSolutionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	suite.Len(solutions, 0)

	// validate that the milestone links are created
	milestoneSolutionLinks, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		milestone.ID,
	)

	suite.NoError(err)
	suite.Len(milestoneSolutionLinks, 0)
}

func (suite *ResolverSuite) TestMTOMilestoneGetBySolutionIDLoader() {
	plan1 := suite.createModelPlan("model plan 1")
	commonMilestoneKey1 := models.MTOCommonMilestoneKeyAppSupportCon
	milestone1 := suite.createMilestoneCommon(plan1.ID, commonMilestoneKey1, []models.MTOCommonSolutionKey{
		models.MTOCSKCcw,
		models.MTOCSKApps,
	})

	commonMilestoneKey2 := models.MTOCommonMilestoneKeyCommWPart
	milestone2 := suite.createMilestoneCommon(plan1.ID, commonMilestoneKey2, []models.MTOCommonSolutionKey{
		models.MTOCSKCcw,
		models.MTOCSKApps,
	})
	commonMilestoneKey3 := models.MTOCommonMilestoneKeyAcquireALearnCont
	milestone3 := suite.createMilestoneCommon(plan1.ID, commonMilestoneKey3, []models.MTOCommonSolutionKey{
		models.MTOCSKBcda,
		models.MTOCSKCmsBox,
		models.MTOCSKCcw,
	})
	/***
	Validate the created solutions and assign them by key
	***/

	solutions, err := MTOSolutionGetByModelPlanIDLOADER(suite.testConfigs.Context, plan1.ID)
	suite.NoError(err)
	suite.Len(solutions, 4)

	solMTOCSKCcw, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKCcw
		}
		return false
	})
	suite.True(ok)
	solMTOCSKApps, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKApps
		}
		return false
	})
	suite.True(ok)
	solMTOCSKBcda, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKBcda
		}
		return false
	})
	suite.True(ok)
	solMTOCSKCmsBox, ok := lo.Find(solutions, func(solution *models.MTOSolution) bool {
		if solution.Key != nil {
			return *solution.Key == models.MTOCSKCmsBox
		}
		return false
	})
	suite.True(ok)
	/***
	end select solutions
	***/

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, []uuid.UUID]{
		// All three milestones use this solution
		{Key: solMTOCSKCcw.ID, Expected: []uuid.UUID{milestone1.ID, milestone2.ID, milestone3.ID}},
		{Key: solMTOCSKApps.ID, Expected: []uuid.UUID{milestone1.ID, milestone2.ID}},
		{Key: solMTOCSKBcda.ID, Expected: []uuid.UUID{milestone3.ID}},
		{Key: solMTOCSKCmsBox.ID, Expected: []uuid.UUID{milestone3.ID}},
	}

	verifyFunc := func(data []*models.MTOMilestone, expected []uuid.UUID) bool {
		// Map the IDs from the milestones, assert they match the expected returned result
		dataIDs := lo.Map(data, func(item *models.MTOMilestone, _ int) uuid.UUID {
			return item.ID
		})
		return suite.ElementsMatch(dataIDs, expected)
	}
	// Call the helper method to validate all results
	loaders.VerifyLoaders[uuid.UUID, []*models.MTOMilestone, []uuid.UUID](suite.testConfigs.Context, &suite.Suite, loaders.MTOMilestone.BySolutionID,
		expectedResults, verifyFunc)

}

func (suite *ResolverSuite) TestMTOMilestoneUpdateLinkedSolutions_AddBySolutionID() {
	plan := suite.createModelPlan("plan for adding solutions by solution ID")
	// Create a milestone with no linked solutions
	milestone, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Initial Milestone", plan.ID, nil)
	suite.NoError(err)

	// Create a custom solution (no common key)
	solName := "Custom Solution 1"
	solType := models.MTOSolutionTypeOther
	sol, err := MTOSolutionCreateCustom(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		plan.ID,
		nil,
		solName,
		solType,
		nil,
		"POC Name",
		"poc@example.com",
	)
	suite.NoError(err)

	// Add the solution to the milestone by solution ID
	solutionLinks := &model.MTOSolutionLinks{
		SolutionIDs: []uuid.UUID{sol.ID},
	}
	updatedMilestone, err := MTOMilestoneUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
		map[string]interface{}{},
		solutionLinks,
	)
	suite.NoError(err)

	// Verify the solution is linked now
	linkedSolutions, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(suite.testConfigs.Store, suite.testConfigs.Logger, updatedMilestone.ID)
	suite.NoError(err)
	suite.Len(linkedSolutions, 1)
	suite.Equal(sol.ID, linkedSolutions[0].SolutionID)
}

func (suite *ResolverSuite) TestMTOMilestoneUpdateLinkedSolutions_AddByCommonKey() {
	plan := suite.createModelPlan("plan for adding solutions by common key")
	// Create a milestone with no linked solutions
	milestone, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Initial Milestone CK", plan.ID, nil)
	suite.NoError(err)

	// Use a known common solution key from your codebase
	commonKey := models.MTOCSKCcw // Example common solution key
	// Add the solution by common key
	solutionLinks := &model.MTOSolutionLinks{
		CommonSolutionKeys: []models.MTOCommonSolutionKey{commonKey},
	}
	updatedMilestone, err := MTOMilestoneUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
		map[string]interface{}{},
		solutionLinks,
	)
	suite.NoError(err)

	// Verify the solution is linked now by fetching solutions for this milestone
	linkedSolutions, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(suite.testConfigs.Store, suite.testConfigs.Logger, updatedMilestone.ID)
	suite.NoError(err)
	suite.Len(linkedSolutions, 1)

	// Fetch the solution and verify it has the common key
	solRetrieved, err := MTOSolutionGetByMilestoneIDLOADER(suite.testConfigs.Context, updatedMilestone.ID)
	suite.NoError(err)
	suite.Len(solRetrieved, 1)
	suite.NotNil(solRetrieved[0].Key)
	suite.Equal(commonKey, *solRetrieved[0].Key)
}

func (suite *ResolverSuite) TestMTOMilestoneUpdateLinkedSolutions_UnlinkBySolutionID() {
	plan := suite.createModelPlan("plan for unlinking solutions by solution ID")
	// Create a milestone and link a solution
	milestone, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Milestone to Unlink ID", plan.ID, nil)
	suite.NoError(err)

	solName := "To Unlink Solution"
	solType := models.MTOSolutionTypeOther
	sol, err := MTOSolutionCreateCustom(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		plan.ID,
		nil,
		solName,
		solType,
		nil,
		"POC Name",
		"poc@example.com",
	)
	suite.NoError(err)

	// Link the solution
	solutionLinks := &model.MTOSolutionLinks{
		SolutionIDs: []uuid.UUID{sol.ID},
	}
	_, err = MTOMilestoneUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
		map[string]interface{}{},
		solutionLinks,
	)
	suite.NoError(err)

	// Now unlink by providing an empty set
	solutionLinksEmpty := &model.MTOSolutionLinks{
		SolutionIDs: []uuid.UUID{},
	}
	_, err = MTOMilestoneUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
		map[string]interface{}{},
		solutionLinksEmpty,
	)
	suite.NoError(err)

	// Verify no solutions are linked now
	linkedSolutions, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(suite.testConfigs.Store, suite.testConfigs.Logger, milestone.ID)
	suite.NoError(err)
	suite.Len(linkedSolutions, 0)
}

func (suite *ResolverSuite) TestMTOMilestoneUpdateLinkedSolutions_UnlinkByCommonKey() {
	plan := suite.createModelPlan("plan for unlinking solutions by common key")
	// Create a milestone and link a common solution key
	milestone, err := MTOMilestoneCreateCustom(suite.testConfigs.Context, suite.testConfigs.Logger, suite.testConfigs.Principal, suite.testConfigs.Store, "Milestone Unlink CK", plan.ID, nil)
	suite.NoError(err)

	commonKey := models.MTOCSKCcw // Example common solution key

	// Link the common solution key
	solutionLinks := &model.MTOSolutionLinks{
		CommonSolutionKeys: []models.MTOCommonSolutionKey{commonKey},
	}
	_, err = MTOMilestoneUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
		map[string]interface{}{},
		solutionLinks,
	)
	suite.NoError(err)

	// Now unlink by providing an empty set of common keys
	solutionLinksEmpty := &model.MTOSolutionLinks{
		CommonSolutionKeys: []models.MTOCommonSolutionKey{},
	}
	_, err = MTOMilestoneUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
		map[string]interface{}{},
		solutionLinksEmpty,
	)
	suite.NoError(err)

	// Verify no solutions are linked now
	linkedSolutions, err := storage.MTOMilestoneSolutionLinkGetByMilestoneID(suite.testConfigs.Store, suite.testConfigs.Logger, milestone.ID)
	suite.NoError(err)
	suite.Len(linkedSolutions, 0)
}

func (suite *ResolverSuite) TestMTOMilestoneNoLinkedSolutions_SinglePlan() {
	// 1) Create a model plan
	plan := suite.createModelPlan("NoLinkedSolutions SinglePlan")

	// 2) Create multiple milestones for this plan
	//    We'll make one unlinked, one linked in some way
	unlinkedMilestone, err := MTOMilestoneCreateCustom(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		"Unlinked Milestone",
		plan.ID,
		nil, // no category
	)
	suite.NoError(err)

	linkedMilestone, err := MTOMilestoneCreateCustom(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		"Linked Milestone",
		plan.ID,
		nil,
	)
	suite.NoError(err)

	// 3) Link the second milestone in the direct milestone-to-solution table
	//    OR in the common link table. We'll demonstrate the direct link table:
	// Create or fetch a solution
	solName := "Any Custom Solution"
	solType := models.MTOSolutionTypeOther
	sol, solErr := MTOSolutionCreateCustom(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		plan.ID,
		nil, // no MTOCommonSolutionKey
		solName,
		solType,
		nil,
		"pocName",
		"pocEmail",
	)
	suite.NoError(solErr)

	// Link it
	link := models.NewMTOMilestoneSolutionLink(
		suite.testConfigs.Principal.Account().ID,
		linkedMilestone.ID,
		sol.ID,
	)
	_, linkErr := storage.MTOMilestoneSolutionLinkCreate(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		link,
	)
	suite.NoError(linkErr)

	// 4) Query the "no linked solutions" loader for a single plan ID
	milsNoLink, err := MTOMilestoneGetByModelPlanIDNoLinkedSolutionLoader(
		suite.testConfigs.Context,
		plan.ID,
	)
	suite.NoError(err)

	// 5) Check that the unlinked milestone is returned, linked is excluded
	gotIDs := make([]uuid.UUID, 0, len(milsNoLink))
	for _, m := range milsNoLink {
		gotIDs = append(gotIDs, m.ID)
	}
	suite.Contains(gotIDs, unlinkedMilestone.ID, "Unlinked milestone should be present")
	suite.NotContains(gotIDs, linkedMilestone.ID, "Linked milestone should be excluded from the results")
}

func (suite *ResolverSuite) TestMTOMilestoneNoLinkedSolutions_MultiplePlans() {
	// 1) Create multiple model plans
	planA := suite.createModelPlan("NoLinkedSolutions Plan A")
	planB := suite.createModelPlan("NoLinkedSolutions Plan B")

	// 2) Create an unlinked milestone in Plan A
	milUnlinkedA, err := MTOMilestoneCreateCustom(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		"Milestone A Unlinked",
		planA.ID,
		nil,
	)
	suite.NoError(err)

	// 3) Create a milestone in Plan B and link it in the "common" link table
	linkedMilB, err := MTOMilestoneCreateCustom(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		"Milestone B Linked",
		planB.ID,
		nil,
	)
	suite.NoError(err)

	// We'll assume the milestone references some MTOCommonMilestoneKey
	// to emulate the 'cLink' scenario:
	commonKey := models.MTOCommonMilestoneKeyManageCd
	linkedMilB.Key = &commonKey // assign the milestone's key in memory

	// We must update the milestone in DB to store that key
	_, err = storage.MTOMilestoneUpdate(suite.testConfigs.Store, suite.testConfigs.Logger, linkedMilB)
	suite.NoError(err)

	// Insert a row into mto_common_milestone_solution_link with that commonKey
	// so the query sees it as "linked" in the cLink table:

	// TODO: MERGE IN THE EDIT MILESTONE SOLUTION LINK PR TO FINISH THIS TEST
	panic("TODO: MERGE IN THE EDIT MILESTONE SOLUTION LINK PR TO FINISH THIS TEST")

	// 4) Call the "no linked solutions" loader with both plan IDs
	modelPlanIDs := []uuid.UUID{planA.ID, planB.ID}
	milsNoLink, err := storage.MTOMilestoneGetByModelPlanIDNoLinkedSolutionLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		modelPlanIDs,
	)
	suite.NoError(err)

	// 5) Evaluate results
	gotIDs := make([]uuid.UUID, 0, len(milsNoLink))
	for _, m := range milsNoLink {
		gotIDs = append(gotIDs, m.ID)
	}

	// The unlinked milestone in Plan A should appear
	suite.Contains(gotIDs, milUnlinkedA.ID, "Unlinked milestone in Plan A is expected")

	// The milestone in Plan B is "linked" via the cLink table, so exclude
	suite.NotContains(gotIDs, linkedMilB.ID, "Milestone in Plan B with a common link should be excluded")
}
