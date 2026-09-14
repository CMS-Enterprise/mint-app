package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestUpdateSelectedWaivers verifies that UpdateSelectedWaivers can insert new waiver
// selections and later update them via the same JSON_TO_RECORDSET-backed upsert query.
// This guards against regressions in the upsert_collection.sql column definition list,
// which JSON_TO_RECORDSET requires to parse the JSON payload into typed rows.
func (suite *ResolverSuite) TestUpdateSelectedWaivers() {
	plan := suite.createModelPlan("plan for update selected waivers")

	created, err := UpdateSelectedWaivers(
		suite.testConfigs.Logger,
		plan.ID,
		[]*models.WaiverSelectionInput{
			{
				CommonWaiverID: medicarePaymentWaiver1ID,
				WillUseWaiver:  true,
				NotUsingReason: nil,
			},
		},
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
	)
	suite.NoError(err)
	suite.Require().Len(created, 1)
	suite.Equal(medicarePaymentWaiver1ID, created[0].CommonWaiverID)
	suite.Require().NotNil(created[0].WillUseWaiver)
	suite.True(*created[0].WillUseWaiver)
	suite.Nil(created[0].NotUsingReason)

	notUsingReason := "Not applicable to this model"
	updated, err := UpdateSelectedWaivers(
		suite.testConfigs.Logger,
		plan.ID,
		[]*models.WaiverSelectionInput{
			{
				CommonWaiverID: medicarePaymentWaiver1ID,
				WillUseWaiver:  false,
				NotUsingReason: &notUsingReason,
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
	suite.False(*updated[0].WillUseWaiver)
	suite.Require().NotNil(updated[0].NotUsingReason)
	suite.Equal(notUsingReason, *updated[0].NotUsingReason)
}
