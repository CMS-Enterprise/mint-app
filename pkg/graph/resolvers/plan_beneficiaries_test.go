package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanBeneficiariesDataLoader() {
	plan1 := suite.createModelPlan("Plan For Benes 1")
	plan2 := suite.createModelPlan("Plan For Benes 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanBeneficiariesLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanBeneficiariesLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyPlanBeneficiariesLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	benes, err := PlanBeneficiariesGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != benes.ModelPlanID {
		return fmt.Errorf("plan Beneficiaries returned model plan ID %s, expected %s", benes.ModelPlanID, modelPlanID)
	}
	return nil
}
func (suite *ResolverSuite) TestPlanBeneficiariesUpdate() {
	plan := suite.createModelPlan("Plan For Beneficiaries") // should create the beneficiaries as part of the resolver

	b, err := PlanBeneficiariesGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"treatDualElligibleDifferent":              "YES",
		"beneficiariesOther":                       "The Gumdrop Kids",
		"beneficiarySelectionMethod":               []string{model.SelectionMethodTypeOther.String(), model.SelectionMethodTypeHistorical.String()},
		"beneficiarySelectionNote":                 "Priority given to provider sign up",
		"beneficiarySelectionFrequencyContinually": "some test value",
	}
	updatedBeneficiary, err := PlanBeneficiariesUpdate(suite.testConfigs.Logger, b.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, *updatedBeneficiary.ModifiedBy)

	// Assert that the updated fields are right
	suite.EqualValues(*updatedBeneficiary.TreatDualElligibleDifferent, models.TriYes)
	suite.EqualValues(*updatedBeneficiary.BeneficiariesOther, "The Gumdrop Kids")
	suite.EqualValues(updatedBeneficiary.BeneficiarySelectionMethod, []string{model.SelectionMethodTypeOther.String(), model.SelectionMethodTypeHistorical.String()})
	suite.EqualValues(*updatedBeneficiary.BeneficiarySelectionNote, "Priority given to provider sign up")
	suite.EqualValues(*updatedBeneficiary.BeneficiarySelectionFrequencyContinually, "some test value")

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
	suite.Nil(updatedBeneficiary.BeneficiaryRemovalFrequency)
	suite.Nil(updatedBeneficiary.BeneficiaryRemovalFrequencyContinually)
	suite.Nil(updatedBeneficiary.BeneficiaryRemovalFrequencyOther)
	suite.Nil(updatedBeneficiary.BeneficiaryRemovalFrequencyNote)
	suite.Nil(updatedBeneficiary.BeneficiaryOverlap)
	suite.Nil(updatedBeneficiary.BeneficiaryOverlapNote)
	suite.Nil(updatedBeneficiary.PrecedenceRules)
	suite.Nil(updatedBeneficiary.PrecedenceRulesYes)
	suite.Nil(updatedBeneficiary.PrecedenceRulesNo)
	suite.Nil(updatedBeneficiary.PrecedenceRulesNote)

}

func (suite *ResolverSuite) TestPlanBeneficiariesGetByModelPlanID() {
	plan := suite.createModelPlan("Plan For Beneficiaries") // should create the beneficiaries as part of the resolver

	b, err := PlanBeneficiariesGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	suite.EqualValues(plan.ID, b.ModelPlanID)
	suite.EqualValues(models.TaskReady, b.Status)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, b.CreatedBy)
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
	suite.Nil(b.BeneficiaryRemovalFrequency)
	suite.Nil(b.BeneficiaryRemovalFrequencyContinually)
	suite.Nil(b.BeneficiaryRemovalFrequencyOther)
	suite.Nil(b.BeneficiaryRemovalFrequencyNote)
	suite.Nil(b.BeneficiaryOverlap)
	suite.Nil(b.BeneficiaryOverlapNote)
	suite.Nil(b.PrecedenceRules)
	suite.Nil(b.PrecedenceRulesYes)
	suite.Nil(b.PrecedenceRulesNo)
	suite.Nil(b.PrecedenceRulesNote)

}
