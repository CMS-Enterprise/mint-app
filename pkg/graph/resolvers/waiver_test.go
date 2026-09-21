package resolvers

import (
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestUpdateSelectedWaivers verifies that UpdateSelectedWaivers can insert new waiver
// selections and later update them via the same JSON_TO_RECORDSET-backed upsert query.
// This guards against regressions in the upsert_collection.sql column definition list,
// which JSON_TO_RECORDSET requires to parse the JSON payload into typed rows.
func (suite *ResolverSuite) TestUpdateSelectedWaivers() {
	plan := suite.createModelPlan("plan for update selected waivers")
	commonWaivers, err := GetAllCommonWaiversByModelPlanID(suite.testConfigs.Context, &plan.ID)
	suite.NoError(err)
	commonWaiver, found := lo.Find(commonWaivers, func(cw *models.CommonWaiver) bool {
		return cw.Name == "Non-duplication"
	})
	suite.Require().True(found)

	created, err := UpdateSelectedWaivers(
		suite.testConfigs.Logger,
		plan.ID,
		[]*models.WaiverSelectionInput{
			{
				CommonWaiverID: commonWaiver.ID,
				WillUseWaiver:  new(true),
				UsingReason:    nil,
				NotUsingReason: nil,
			},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.Require().Len(created, 1)
	suite.Equal(commonWaiver.ID, created[0].CommonWaiverID)
	suite.Require().NotNil(created[0].WillUseWaiver)
	suite.True(*created[0].WillUseWaiver)
	suite.Nil(created[0].UsingReason)
	suite.Nil(created[0].NotUsingReason)

	usingReason := "Supports the model's payment approach"
	notUsingReason := "Not applicable to this model"
	updated, err := UpdateSelectedWaivers(
		suite.testConfigs.Logger,
		plan.ID,
		[]*models.WaiverSelectionInput{
			{
				CommonWaiverID: commonWaiver.ID,
				WillUseWaiver:  new(true),
				UsingReason:    &usingReason,
			},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.Require().Len(updated, 1)
	// The upsert must hit the existing row (same model plan + common waiver), not create a second one.
	suite.Equal(created[0].ID, updated[0].ID)
	suite.Require().NotNil(updated[0].WillUseWaiver)
	suite.True(*updated[0].WillUseWaiver)
	suite.Require().NotNil(updated[0].UsingReason)
	suite.Equal(usingReason, *updated[0].UsingReason)
	suite.Nil(updated[0].NotUsingReason)

	updated, err = UpdateSelectedWaivers(
		suite.testConfigs.Logger,
		plan.ID,
		[]*models.WaiverSelectionInput{
			{
				CommonWaiverID: commonWaiver.ID,
				WillUseWaiver:  new(false),
				NotUsingReason: &notUsingReason,
			},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.Require().Len(updated, 1)
	suite.Require().NotNil(updated[0].WillUseWaiver)
	suite.False(*updated[0].WillUseWaiver)
	suite.Nil(updated[0].UsingReason)
	suite.Require().NotNil(updated[0].NotUsingReason)
	suite.Equal(notUsingReason, *updated[0].NotUsingReason)

	updated, err = UpdateSelectedWaivers(
		suite.testConfigs.Logger,
		plan.ID,
		[]*models.WaiverSelectionInput{
			{
				CommonWaiverID: commonWaiver.ID,
				WillUseWaiver:  nil,
			},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.Require().Len(updated, 1)
	suite.Nil(updated[0].WillUseWaiver)
}

func (suite *ResolverSuite) TestUpdateSelectedWaiversRejectsNonCollaborator() {
	plan := suite.createModelPlan("plan protected from non-collaborator waiver updates")
	commonWaivers, err := GetAllCommonWaiversByModelPlanID(suite.testConfigs.Context, &plan.ID)
	suite.Require().NoError(err)
	suite.Require().NotEmpty(commonWaivers)

	nonCollaborator := suite.getTestPrincipal(suite.testConfigs.Store, "waiver-non-collaborator")
	nonCollaborator.JobCodeASSESSMENT = false

	_, err = UpdateSelectedWaivers(
		suite.testConfigs.Logger,
		plan.ID,
		[]*models.WaiverSelectionInput{
			{
				CommonWaiverID: commonWaivers[0].ID,
				WillUseWaiver:  new(true),
			},
		},
		nonCollaborator,
		suite.testConfigs.Store,
	)
	suite.Error(err)
}
