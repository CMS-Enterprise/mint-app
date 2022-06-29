package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

// "github.com/cmsgov/mint-app/pkg/graph/model"
// "github.com/cmsgov/mint-app/pkg/models"
func (suite *ResolverSuite) TestPlanBeneficiariesUpdate() {
	plan := suite.createModelPlan("Plan For Beneficiaries") // should create the beneficiaries as part of the resolver

	b, err := PlanBeneficiariesGetByModelPlanID(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	changes := map[string]interface{}{
		"treatDualElligibleDifferent": "YES",
		"beneficiariesOther":          "The Gumdrop Kids",
		"beneficiarySelectionMethod":  models.SelectionMethodTypeG{models.SMTOther, models.SMTHistorical},
		"beneficiarySelectionNote":    "Priority given to provider sign up",
	}

	updater := "UPDT"

	updatedBeneficiary, err := PlanBeneficiariesUpdate(suite.testConfigs.Logger, b.ID, changes, updater, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(updater, *updatedBeneficiary.ModifiedBy)

	// Assert that the updated fields are right
	suite.EqualValues(*updatedBeneficiary.TreatDualElligibleDifferent, models.TriYes)
	suite.EqualValues(*updatedBeneficiary.BeneficiariesOther, "The Gumdrop Kids")
	suite.EqualValues(updatedBeneficiary.BeneficiarySelectionMethod, models.SelectionMethodTypeG{models.SMTOther, models.SMTHistorical})
	suite.EqualValues(*updatedBeneficiary.BeneficiarySelectionNote, "Priority given to provider sign up")

	// Assert that no other fields got updated
	suite.Nil(updatedBeneficiary.Beneficiaries)
	suite.Nil(updatedBeneficiary.BeneficiariesNote)
	suite.Nil(updatedBeneficiary.TreatDualElligibleDifferentHow)
	suite.Nil(updatedBeneficiary.TreatDualElligibleDifferentNote)
	suite.Nil(updatedBeneficiary.ExcludeCertainCharacteristics)
	suite.Nil(updatedBeneficiary.ExcludeCertainCharacteristicsCriteria)
	suite.Nil(updatedBeneficiary.ExcludeCertainCharacteristicsNote)
	suite.Nil(updatedBeneficiary.NumberPeopleImpacted)
	suite.Nil(updatedBeneficiary.EstimateConfidence)
	suite.Nil(updatedBeneficiary.ConfidenceNote)
	suite.Nil(updatedBeneficiary.BeneficiarySelectionOther)
	suite.Nil(updatedBeneficiary.BeneficiarySelectionFrequency)
	suite.Nil(updatedBeneficiary.BeneficiarySelectionFrequencyOther)
	suite.Nil(updatedBeneficiary.BeneficiarySelectionFrequencyNote)
	suite.Nil(updatedBeneficiary.BeneficiaryOverlap)
	suite.Nil(updatedBeneficiary.BeneficiaryOverlapNote)
	suite.Nil(updatedBeneficiary.PrecedenceRules)

}

func (suite *ResolverSuite) TestPlanBeneficiariesGetByModelPlanID() {
	plan := suite.createModelPlan("Plan For Beneficiaries") // should create the beneficiaries as part of the resolver

	b, err := PlanBeneficiariesGetByModelPlanID(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	suite.EqualValues(plan.ID, b.ModelPlanID)
	suite.EqualValues(models.TaskReady, b.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, b.CreatedBy)
	suite.Nil(b.ModifiedBy)

	// Many of the fields are nil upon creation
	suite.Nil(b.Beneficiaries)
	suite.Nil(b.BeneficiariesOther)
	suite.Nil(b.BeneficiariesNote)
	suite.Nil(b.TreatDualElligibleDifferent)
	suite.Nil(b.TreatDualElligibleDifferentHow)
	suite.Nil(b.TreatDualElligibleDifferentNote)
	suite.Nil(b.ExcludeCertainCharacteristics)
	suite.Nil(b.ExcludeCertainCharacteristicsCriteria)
	suite.Nil(b.ExcludeCertainCharacteristicsNote)
	suite.Nil(b.NumberPeopleImpacted)
	suite.Nil(b.EstimateConfidence)
	suite.Nil(b.ConfidenceNote)
	suite.Nil(b.BeneficiarySelectionMethod)
	suite.Nil(b.BeneficiarySelectionOther)
	suite.Nil(b.BeneficiarySelectionNote)
	suite.Nil(b.BeneficiarySelectionFrequency)
	suite.Nil(b.BeneficiarySelectionFrequencyOther)
	suite.Nil(b.BeneficiarySelectionFrequencyNote)
	suite.Nil(b.BeneficiaryOverlap)
	suite.Nil(b.BeneficiaryOverlapNote)
	suite.Nil(b.PrecedenceRules)

}
