package resolvers

import (
	"github.com/golang/mock/gomock"
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

func (suite *ResolverSuite) TestApplyTemplateToMTO() {
	// Create model plan
	plan := suite.createModelPlan("Test Apply Template Multiple")
	templateID := uuid.New()

	// Mock email services
	mockController := gomock.NewController(suite.T())
	defer mockController.Finish()

	emailService := oddmail.NewMockEmailService(mockController)
	addressBook := email.AddressBook{}

	// Test that the function signature works and handles errors gracefully
	_, err := ApplyTemplateToMTO(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		emailService,
		addressBook,
		plan.ID,
		templateID,
	)

	// We expect an error due to non-existent template, but function should not panic
	suite.Error(err)
	suite.Contains(err.Error(), "foreign key constraint")

	// Test that function handles invalid UUIDs gracefully
	_, err = ApplyTemplateToMTO(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		emailService,
		addressBook,
		uuid.Nil, // Invalid model plan ID
		templateID,
	)

	// Should handle gracefully
	suite.Error(err)
}

func (suite *ResolverSuite) TestMTOTemplateComponents() {
	ctx := suite.testConfigs.Context

	// Test that loaders don't panic with non-existent IDs
	fakeTemplateID := uuid.New()

	categories, err := MTOTemplateCategoryGetByTemplateIDLOADER(ctx, fakeTemplateID)
	suite.NoError(err)
	suite.Empty(categories)

	milestones, err := MTOTemplateMilestoneGetByTemplateIDLOADER(ctx, fakeTemplateID)
	suite.NoError(err)
	suite.Empty(milestones)

	solutions, err := MTOTemplateSolutionGetByTemplateIDLOADER(ctx, fakeTemplateID)
	suite.NoError(err)
	suite.Empty(solutions)

	// Test template retrieval - empty keys returns all templates
	templates, err := MTOTemplateGetByKeysLOADER(ctx, []models.MTOTemplateKey{})
	suite.NoError(err)
	suite.NotNil(templates)
	// Should return all 5 templates when keys array is empty
	suite.Len(templates, 5)
}

func (suite *ResolverSuite) TestApplyTemplateToMTO_MultipleApplications() {
	// Create model plan
	plan := suite.createModelPlan("Test Apply Template Multiple")
	templateID := uuid.New()

	// Mock email services
	mockController := gomock.NewController(suite.T())
	defer mockController.Finish()

	emailService := oddmail.NewMockEmailService(mockController)
	addressBook := email.AddressBook{}

	// Apply template first time - expect it to fail gracefully with non-existent template
	result1, err1 := ApplyTemplateToMTO(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		emailService,
		addressBook,
		plan.ID,
		templateID,
	)

	// Apply same template again - should handle the same way
	result2, err2 := ApplyTemplateToMTO(
		suite.testConfigs.Context,
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		emailService,
		addressBook,
		plan.ID,
		templateID,
	)

	// Both should fail in the same way (foreign key constraint)
	suite.Error(err1)
	suite.Error(err2)
	suite.Contains(err1.Error(), "foreign key constraint")
	suite.Contains(err2.Error(), "foreign key constraint")

	// Results should be nil due to error
	suite.Nil(result1)
	suite.Nil(result2)
}
