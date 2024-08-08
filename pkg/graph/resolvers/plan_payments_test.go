package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/models"
)

// TestPlanPaymentsUpdate tests PlanPaymentsUpdate
func (suite *ResolverSuite) TestPlanPaymentsUpdate() {
	plan := suite.createModelPlan("Plan Payments")

	pp, err := PlanPaymentsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	willBePaymentAdjustmentsExpected := true
	willBePaymentAdjustmentsNoteExpected := "note note note"

	patientProtectionString := "hello PATIENT_PROTECTION_AFFORDABLE_CARE_ACT A"
	patientProtectionRString := "hello PATIENT_PROTECTION_AFFORDABLE_CARE_ACT A"
	changes := map[string]interface{}{
		"fundingSource":                          []string{"OTHER"},
		"fundingSourcePatientProtectionInfo":     patientProtectionString,
		"fundingSourceRPatientProtectionInfo":    patientProtectionRString,
		"fundingSourceNote":                      "Ello gov'na",
		"payType":                                []string{"CLAIMS_BASED_PAYMENTS"},
		"anticipatedPaymentFrequencyContinually": "some test value for anticipated payment frequency continually",
		"willBePaymentAdjustments":               willBePaymentAdjustmentsExpected,
		"willBePaymentAdjustmentsNote":           willBePaymentAdjustmentsNoteExpected,
	}

	updatedPP, err := PlanPaymentsUpdate(suite.testConfigs.Logger, suite.testConfigs.Store, pp.ID, changes, suite.testConfigs.Principal)

	suite.NoError(err)
	suite.EqualValues(plan.ID, pp.ModelPlanID)
	suite.EqualValues(models.TaskReady, pp.Status)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, pp.CreatedBy)
	suite.EqualValues("some test value for anticipated payment frequency continually", *updatedPP.AnticipatedPaymentFrequencyContinually)

	if suite.NotNil(updatedPP.WillBePaymentAdjustments) {
		suite.EqualValues(willBePaymentAdjustmentsExpected, *updatedPP.WillBePaymentAdjustments)
	}
	if suite.NotNil(updatedPP.WillBePaymentAdjustmentsNote) {
		suite.EqualValues(willBePaymentAdjustmentsNoteExpected, *updatedPP.WillBePaymentAdjustmentsNote)
	}

	if suite.NotNil(updatedPP.FundingSourcePatientProtectionInfo) {
		suite.EqualValues(patientProtectionString, *updatedPP.FundingSourcePatientProtectionInfo)
	}
	if suite.NotNil(updatedPP.FundingSourceRPatientProtectionInfo) {
		suite.EqualValues(patientProtectionRString, *updatedPP.FundingSourceRPatientProtectionInfo)
	}

	suite.Nil(pp.ModifiedBy)

	//suite.Nil(updatedPP.FundingSource)
	suite.Nil(updatedPP.FundingSourceOther)
	//suite.Nil(updatedPP.FundingSourceNote)
	suite.Nil(updatedPP.FundingSourceR)
	suite.Nil(updatedPP.FundingSourceROther)
	suite.Nil(updatedPP.FundingSourceRNote)
	suite.Nil(updatedPP.PayRecipients)
	suite.Nil(updatedPP.PayRecipientsOtherSpecification)
	suite.Nil(updatedPP.PayRecipientsNote)
	//suite.Nil(updatedPP.PayType)
	suite.Nil(updatedPP.PayTypeNote)
	suite.Nil(updatedPP.PayClaims)
	suite.Nil(updatedPP.PayClaimsOther)
	suite.Nil(updatedPP.PayClaimsNote)
	suite.Nil(updatedPP.ShouldAnyProvidersExcludedFFSSystems)
	suite.Nil(updatedPP.ShouldAnyProviderExcludedFFSSystemsNote)
	suite.Nil(updatedPP.ChangesMedicarePhysicianFeeSchedule)
	suite.Nil(updatedPP.ChangesMedicarePhysicianFeeScheduleNote)
	suite.Nil(updatedPP.AffectsMedicareSecondaryPayerClaims)
	suite.Nil(updatedPP.AffectsMedicareSecondaryPayerClaimsHow)
	suite.Nil(updatedPP.AffectsMedicareSecondaryPayerClaimsNote)
	suite.Nil(updatedPP.PayModelDifferentiation)
	suite.Nil(updatedPP.CreatingDependenciesBetweenServices)
	suite.Nil(updatedPP.CreatingDependenciesBetweenServicesNote)
	suite.Nil(updatedPP.NeedsClaimsDataCollection)
	suite.Nil(updatedPP.NeedsClaimsDataCollectionNote)
	suite.Nil(updatedPP.ProvidingThirdPartyFile)
	suite.Nil(updatedPP.IsContractorAwareTestDataRequirements)
	suite.Nil(updatedPP.BeneficiaryCostSharingLevelAndHandling)
	suite.Nil(updatedPP.WaiveBeneficiaryCostSharingForAnyServices)
	suite.Nil(updatedPP.WaiveBeneficiaryCostSharingServiceSpecification)
	suite.Nil(updatedPP.WaiverOnlyAppliesPartOfPayment)
	suite.Nil(updatedPP.WaiveBeneficiaryCostSharingNote)
	suite.Nil(updatedPP.NonClaimsPayments)
	suite.Nil(updatedPP.NonClaimsPaymentsOther)
	suite.Nil(updatedPP.NonClaimsPaymentsNote)
	suite.Nil(updatedPP.PaymentCalculationOwner)
	suite.Nil(updatedPP.NumberPaymentsPerPayCycle)
	suite.Nil(updatedPP.NumberPaymentsPerPayCycleNote)
	suite.Nil(updatedPP.SharedSystemsInvolvedAdditionalClaimPayment)
	suite.Nil(updatedPP.SharedSystemsInvolvedAdditionalClaimPaymentNote)
	suite.Nil(updatedPP.PlanningToUseInnovationPaymentContractor)
	suite.Nil(updatedPP.PlanningToUseInnovationPaymentContractorNote)
	suite.Nil(updatedPP.ExpectedCalculationComplexityLevel)
	suite.Nil(updatedPP.ExpectedCalculationComplexityLevelNote)
	suite.Nil(updatedPP.ClaimsProcessingPrecedence)
	suite.Nil(updatedPP.ClaimsProcessingPrecedenceOther)
	suite.Nil(updatedPP.ClaimsProcessingPrecedenceNote)
	suite.Nil(updatedPP.CanParticipantsSelectBetweenPaymentMechanisms)
	suite.Nil(updatedPP.CanParticipantsSelectBetweenPaymentMechanismsHow)
	suite.Nil(updatedPP.CanParticipantsSelectBetweenPaymentMechanismsNote)
	suite.Nil(updatedPP.AnticipatedPaymentFrequency)
	suite.Nil(updatedPP.AnticipatedPaymentFrequencyOther)
	suite.Nil(updatedPP.AnticipatedPaymentFrequencyNote)
	suite.Nil(updatedPP.WillRecoverPayments)
	suite.Nil(updatedPP.WillRecoverPaymentsNote)
	suite.Nil(updatedPP.AnticipateReconcilingPaymentsRetrospectively)
	suite.Nil(updatedPP.AnticipateReconcilingPaymentsRetrospectivelyNote)
	suite.Nil(updatedPP.PaymentReconciliationFrequency)
	suite.Nil(updatedPP.PaymentReconciliationFrequencyContinually)
	suite.Nil(updatedPP.PaymentReconciliationFrequencyOther)
	suite.Nil(updatedPP.PaymentReconciliationFrequencyNote)
	suite.Nil(updatedPP.PaymentDemandRecoupmentFrequency)
	suite.Nil(updatedPP.PaymentDemandRecoupmentFrequencyContinually)
	suite.Nil(updatedPP.PaymentDemandRecoupmentFrequencyOther)
	suite.Nil(updatedPP.PaymentDemandRecoupmentFrequencyNote)
	suite.Nil(updatedPP.PaymentStartDate)
	suite.Nil(updatedPP.PaymentStartDateNote)
}

// TestPlanPaymentsReadByModelPlan tests PlanPaymentsReadByModelPlan
func (suite *ResolverSuite) TestPlanPaymentsReadByModelPlan() {
	plan := suite.createModelPlan("Plan Payments")

	pp, err := PlanPaymentsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	suite.EqualValues(plan.ID, pp.ModelPlanID)
	suite.EqualValues(models.TaskReady, pp.Status)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, pp.CreatedBy)
	suite.Nil(pp.ModifiedBy)

	//Asset these fields are nil upon creation

	suite.Nil(pp.FundingSource)

	suite.Nil(pp.FundingSourceOther)
	suite.Nil(pp.FundingSourceNote)
	suite.Nil(pp.FundingSourceR)
	suite.Nil(pp.FundingSourceROther)
	suite.Nil(pp.FundingSourceRNote)
	suite.Nil(pp.PayRecipients)
	suite.Nil(pp.PayRecipientsOtherSpecification)
	suite.Nil(pp.PayRecipientsNote)
	suite.Nil(pp.PayType)
	suite.Nil(pp.PayTypeNote)
	suite.Nil(pp.PayClaims)
	suite.Nil(pp.PayClaimsOther)
	suite.Nil(pp.PayClaimsNote)
	suite.Nil(pp.ShouldAnyProvidersExcludedFFSSystems)
	suite.Nil(pp.ShouldAnyProviderExcludedFFSSystemsNote)
	suite.Nil(pp.ChangesMedicarePhysicianFeeSchedule)
	suite.Nil(pp.ChangesMedicarePhysicianFeeScheduleNote)
	suite.Nil(pp.AffectsMedicareSecondaryPayerClaims)
	suite.Nil(pp.AffectsMedicareSecondaryPayerClaimsHow)
	suite.Nil(pp.AffectsMedicareSecondaryPayerClaimsNote)
	suite.Nil(pp.PayModelDifferentiation)
	suite.Nil(pp.CreatingDependenciesBetweenServices)
	suite.Nil(pp.CreatingDependenciesBetweenServicesNote)
	suite.Nil(pp.NeedsClaimsDataCollection)
	suite.Nil(pp.NeedsClaimsDataCollectionNote)
	suite.Nil(pp.ProvidingThirdPartyFile)
	suite.Nil(pp.IsContractorAwareTestDataRequirements)
	suite.Nil(pp.BeneficiaryCostSharingLevelAndHandling)
	suite.Nil(pp.WaiveBeneficiaryCostSharingForAnyServices)
	suite.Nil(pp.WaiveBeneficiaryCostSharingServiceSpecification)
	suite.Nil(pp.WaiverOnlyAppliesPartOfPayment)
	suite.Nil(pp.WaiveBeneficiaryCostSharingNote)
	suite.Nil(pp.NonClaimsPayments)
	suite.Nil(pp.NonClaimsPaymentsOther)
	suite.Nil(pp.NonClaimsPaymentsNote)
	suite.Nil(pp.PaymentCalculationOwner)
	suite.Nil(pp.NumberPaymentsPerPayCycle)
	suite.Nil(pp.NumberPaymentsPerPayCycleNote)
	suite.Nil(pp.SharedSystemsInvolvedAdditionalClaimPayment)
	suite.Nil(pp.SharedSystemsInvolvedAdditionalClaimPaymentNote)
	suite.Nil(pp.PlanningToUseInnovationPaymentContractor)
	suite.Nil(pp.PlanningToUseInnovationPaymentContractorNote)
	suite.Nil(pp.ExpectedCalculationComplexityLevel)
	suite.Nil(pp.ExpectedCalculationComplexityLevelNote)
	suite.Nil(pp.ClaimsProcessingPrecedence)
	suite.Nil(pp.ClaimsProcessingPrecedenceOther)
	suite.Nil(pp.ClaimsProcessingPrecedenceNote)
	suite.Nil(pp.CanParticipantsSelectBetweenPaymentMechanisms)
	suite.Nil(pp.CanParticipantsSelectBetweenPaymentMechanismsHow)
	suite.Nil(pp.CanParticipantsSelectBetweenPaymentMechanismsNote)
	suite.Nil(pp.AnticipatedPaymentFrequency)
	suite.Nil(pp.AnticipatedPaymentFrequencyOther)
	suite.Nil(pp.AnticipatedPaymentFrequencyNote)
	suite.Nil(pp.WillRecoverPayments)
	suite.Nil(pp.WillRecoverPaymentsNote)
	suite.Nil(pp.AnticipateReconcilingPaymentsRetrospectively)
	suite.Nil(pp.AnticipateReconcilingPaymentsRetrospectivelyNote)
	suite.Nil(pp.PaymentReconciliationFrequency)
	suite.Nil(pp.PaymentReconciliationFrequencyContinually)
	suite.Nil(pp.PaymentReconciliationFrequencyOther)
	suite.Nil(pp.PaymentReconciliationFrequencyNote)
	suite.Nil(pp.PaymentDemandRecoupmentFrequency)
	suite.Nil(pp.PaymentDemandRecoupmentFrequencyContinually)
	suite.Nil(pp.PaymentDemandRecoupmentFrequencyOther)
	suite.Nil(pp.PaymentDemandRecoupmentFrequencyNote)
	suite.Nil(pp.PaymentStartDate)
	suite.Nil(pp.PaymentStartDateNote)
}

func (suite *ResolverSuite) TestPlanPaymentsDataLoader() {
	plan1 := suite.createModelPlan("Plan For PAY 1")
	plan2 := suite.createModelPlan("Plan For PAY 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanPaymentsLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanPaymentsLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyPlanPaymentsLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	pay, err := PlanPaymentsGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != pay.ModelPlanID {
		return fmt.Errorf("plan Payments returned model plan ID %s, expected %s", pay.ModelPlanID, modelPlanID)
	}
	return nil
}
