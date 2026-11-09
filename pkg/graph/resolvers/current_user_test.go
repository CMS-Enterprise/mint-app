package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

func (suite *ResolverSuite) TestGetLeadModelPlanCount() {
	testUsername := "CLAB"
	testUser := suite.getTestPrincipal(suite.testConfigs.Store, testUsername)
	testUserID := testUser.Account().ID

	// Initial state is 0
	count, err := GetLeadModelPlanCount(suite.testConfigs.Context, suite.testConfigs.Store, testUserID)
	suite.NoError(err)
	suite.Equal(0, count)

	addCollaborator := func(plan *models.ModelPlan) {
		input := &model.PlanCollaboratorCreateInput{
			ModelPlanID: plan.ID,
			UserName:    testUsername,
			TeamRoles:   []models.TeamRole{models.TeamRoleModelLead},
		}
		_, _, err := PlanCollaboratorCreate(
			suite.testConfigs.Context,
			suite.testConfigs.Store,
			suite.testConfigs.Store,
			suite.testConfigs.Logger,
			nil,
			email.AddressBook{},
			input,
			suite.testConfigs.Principal,
			false,
			userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
			true,
		)
		suite.NoError(err)
	}

	// Create Model Plan 1 with MODEL_LEAD role
	plan1 := suite.createModelPlan("Test Plan")
	addCollaborator(plan1)

	// Count should now be 1
	count, err = GetLeadModelPlanCount(suite.testConfigs.Context, suite.testConfigs.Store, testUserID)
	suite.NoError(err)
	suite.Equal(1, count)

	// Create Model Plan 2 with MODEL_LEAD role then archive it
	plan2 := suite.createModelPlan("Test Plan 2")
	addCollaborator(plan2)

	changes := map[string]interface{}{
		"archived": true,
	}

	_, err = ModelPlanUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		plan2.ID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.NoError(err)

	// Count should be back to 1, because the second plan is archived.
	count, err = GetLeadModelPlanCount(suite.testConfigs.Context, suite.testConfigs.Store, testUserID)
	suite.NoError(err)
	suite.Equal(1, count, "Archived model plans should not be counted")
}
