package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanOpsEvalAndLearningDataLoader() {
	plan1 := suite.createModelPlan("Plan For OEL 1")
	plan2 := suite.createModelPlan("Plan For OEL 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanOpsEvalAndLearningLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanOpsEvalAndLearningLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyPlanOpsEvalAndLearningLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	oel, err := PlanOpsEvalAndLearningGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != oel.ModelPlanID {
		return fmt.Errorf("plan Operations Evaluation And Learning returned model plan ID %s, expected %s", oel.ModelPlanID, modelPlanID)
	}
	return nil
}

func (suite *ResolverSuite) TestPlanParticipantsAndProvidersDataLoader() {
	plan1 := suite.createModelPlan("Plan For PandP 1")
	plan2 := suite.createModelPlan("Plan For PandP 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyPlanParticipantsAndProvidersLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyPlanParticipantsAndProvidersLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyPlanParticipantsAndProvidersLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	pAndP, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != pAndP.ModelPlanID {
		return fmt.Errorf("plan Participants and Providers returned model plan ID %s, expected %s", pAndP.ModelPlanID, modelPlanID)
	}
	return nil
}

// TestPlanParticipantsAndProvidersUpdate tests PlanParticipantsAndProvidersUpdate
func (suite *ResolverSuite) TestPlanParticipantsAndProvidersUpdate() {
	plan := suite.createModelPlan("Plan for Participants and Providers")

	pp, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)
	isNewTypeOfProvidersOrSuppliersExpected := true

	changes := map[string]interface{}{
		"confidenceNote":                       "This is a confidence note",
		"recruitmentNote":                      "This is a recruitment note",
		"estimateConfidence":                   string(models.ConfidenceSlightly),
		"providerAdditionFrequencyContinually": "This is a provider addition frequency continually note",
		"isNewTypeOfProvidersOrSuppliers":      isNewTypeOfProvidersOrSuppliersExpected,
	}

	updatedPP, err := PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

	suite.EqualValues("This is a provider addition frequency continually note", *updatedPP.ProviderAdditionFrequencyContinually)
	if suite.NotNil(updatedPP.IsNewTypeOfProvidersOrSuppliers) {
		suite.EqualValues(isNewTypeOfProvidersOrSuppliersExpected, *updatedPP.IsNewTypeOfProvidersOrSuppliers)
	}

	suite.Nil(updatedPP.Participants)
	suite.Nil(updatedPP.MedicareProviderType)
	suite.Nil(updatedPP.StatesEngagement)
	suite.Nil(updatedPP.ParticipantsOther)
	suite.Nil(updatedPP.ParticipantsNote)
	suite.Nil(updatedPP.ParticipantsCurrentlyInModels)
	suite.Nil(updatedPP.ParticipantsCurrentlyInModelsNote)
	suite.Nil(updatedPP.ModelApplicationLevel)
	suite.Nil(updatedPP.ExpectedNumberOfParticipants)
	// suite.Nil(updatedPP.EstimateConfidence)
	// suite.Nil(updatedPP.ConfidenceNote)
	suite.Nil(updatedPP.RecruitmentMethod)
	suite.Nil(updatedPP.RecruitmentOther)
	// suite.Nil(updatedPP.RecruitmentNote)
	suite.Nil(updatedPP.SelectionMethod)
	suite.Nil(updatedPP.SelectionOther)
	suite.Nil(updatedPP.SelectionNote)
	suite.Nil(updatedPP.ParticipantAddedFrequency)
	suite.Nil(updatedPP.ParticipantAddedFrequencyContinually)
	suite.Nil(updatedPP.ParticipantAddedFrequencyOther)
	suite.Nil(updatedPP.ParticipantAddedFrequencyNote)
	suite.Nil(updatedPP.ParticipantRemovedFrequency)
	suite.Nil(updatedPP.ParticipantRemovedFrequencyContinually)
	suite.Nil(updatedPP.ParticipantRemovedFrequencyOther)
	suite.Nil(updatedPP.ParticipantRemovedFrequencyNote)
	suite.Nil(updatedPP.CommunicationMethod)
	suite.Nil(updatedPP.CommunicationNote)
	suite.Nil(updatedPP.RiskType)
	suite.Nil(updatedPP.RiskOther)
	suite.Nil(updatedPP.RiskNote)
	suite.Nil(updatedPP.WillRiskChange)
	suite.Nil(updatedPP.WillRiskChangeNote)
	suite.Nil(updatedPP.ParticipantRequireFinancialGuarantee)
	suite.Nil(updatedPP.ParticipantRequireFinancialGuaranteeType)
	suite.Nil(updatedPP.ParticipantRequireFinancialGuaranteeOther)
	suite.Nil(updatedPP.ParticipantRequireFinancialGuaranteeNote)
	suite.Nil(updatedPP.CoordinateWork)
	suite.Nil(updatedPP.CoordinateWorkNote)
	suite.Nil(updatedPP.GainsharePayments)
	suite.Nil(updatedPP.GainsharePaymentsTrack)
	suite.Nil(updatedPP.GainsharePaymentsNote)
	suite.Nil(updatedPP.GainsharePaymentsEligibility)
	suite.Nil(updatedPP.GainsharePaymentsEligibilityOther)
	suite.Nil(updatedPP.ParticipantsIds)
	suite.Nil(updatedPP.ParticipantsIdsOther)
	suite.Nil(updatedPP.ParticipantsIDSNote)
	suite.Nil(updatedPP.ProviderAdditionFrequency)
	suite.Nil(updatedPP.ProviderAdditionFrequencyOther)
	suite.Nil(updatedPP.ProviderAdditionFrequencyNote)
	suite.Nil(updatedPP.ProviderAddMethod)
	suite.Nil(updatedPP.ProviderAddMethodOther)
	suite.Nil(updatedPP.ProviderAddMethodNote)
	suite.Nil(updatedPP.ProviderLeaveMethod)
	suite.Nil(updatedPP.ProviderLeaveMethodOther)
	suite.Nil(updatedPP.ProviderLeaveMethodNote)
	suite.Nil(updatedPP.ProviderRemovalFrequency)
	suite.Nil(updatedPP.ProviderRemovalFrequencyContinually)
	suite.Nil(updatedPP.ProviderRemovalFrequencyOther)
	suite.Nil(updatedPP.ProviderRemovalFrequencyNote)
	suite.Nil(updatedPP.ProviderOverlap)
	suite.Nil(updatedPP.ProviderOverlapHierarchy)
	suite.Nil(updatedPP.ProviderOverlapNote)

}

// TestPlanParticipantsAndProvidersGetByModelPlanID tests PlanParticipantsAndProvidersGetByModelPlanID
func (suite *ResolverSuite) TestPlanParticipantsAndProvidersGetByModelPlanID() {

	plan := suite.createModelPlan("Plan for Participants and Providers")

	pp, err := PlanParticipantsAndProvidersGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	suite.EqualValues(plan.ID, pp.ModelPlanID)
	suite.EqualValues(models.TaskReady, pp.Status)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, pp.CreatedBy)
	suite.Nil(pp.ModifiedBy)

	//Asset these fields are nil upon creation
	suite.Nil(pp.Participants)
	suite.Nil(pp.MedicareProviderType)
	suite.Nil(pp.StatesEngagement)
	suite.Nil(pp.ParticipantsOther)
	suite.Nil(pp.ParticipantsNote)
	suite.Nil(pp.ParticipantsCurrentlyInModels)
	suite.Nil(pp.ParticipantsCurrentlyInModelsNote)
	suite.Nil(pp.ModelApplicationLevel)
	suite.Nil(pp.ExpectedNumberOfParticipants)
	suite.Nil(pp.EstimateConfidence)
	suite.Nil(pp.ConfidenceNote)
	suite.Nil(pp.RecruitmentMethod)
	suite.Nil(pp.RecruitmentOther)
	suite.Nil(pp.RecruitmentNote)
	suite.Nil(pp.SelectionMethod)
	suite.Nil(pp.SelectionOther)
	suite.Nil(pp.SelectionNote)
	suite.Nil(pp.ParticipantAddedFrequency)
	suite.Nil(pp.ParticipantAddedFrequencyContinually)
	suite.Nil(pp.ParticipantAddedFrequencyOther)
	suite.Nil(pp.ParticipantAddedFrequencyNote)
	suite.Nil(pp.ParticipantRemovedFrequency)
	suite.Nil(pp.ParticipantRemovedFrequencyContinually)
	suite.Nil(pp.ParticipantRemovedFrequencyOther)
	suite.Nil(pp.ParticipantRemovedFrequencyNote)
	suite.Nil(pp.CommunicationMethod)
	suite.Nil(pp.CommunicationNote)
	suite.Nil(pp.RiskType)
	suite.Nil(pp.RiskOther)
	suite.Nil(pp.RiskNote)
	suite.Nil(pp.WillRiskChange)
	suite.Nil(pp.WillRiskChangeNote)
	suite.Nil(pp.CoordinateWork)
	suite.Nil(pp.CoordinateWorkNote)
	suite.Nil(pp.GainsharePayments)
	suite.Nil(pp.GainsharePaymentsTrack)
	suite.Nil(pp.GainsharePaymentsNote)
	suite.Nil(pp.GainsharePaymentsEligibility)
	suite.Nil(pp.GainsharePaymentsEligibilityOther)
	suite.Nil(pp.ParticipantsIds)
	suite.Nil(pp.ParticipantsIdsOther)
	suite.Nil(pp.ParticipantsIDSNote)
	suite.Nil(pp.ProviderAdditionFrequency)
	suite.Nil(pp.ProviderAdditionFrequencyContinually)
	suite.Nil(pp.ProviderAdditionFrequencyOther)
	suite.Nil(pp.ProviderAdditionFrequencyNote)
	suite.Nil(pp.ProviderAddMethod)
	suite.Nil(pp.ProviderAddMethodOther)
	suite.Nil(pp.ProviderAddMethodNote)
	suite.Nil(pp.ProviderLeaveMethod)
	suite.Nil(pp.ProviderLeaveMethodOther)
	suite.Nil(pp.ProviderLeaveMethodNote)
	suite.Nil(pp.ProviderRemovalFrequency)
	suite.Nil(pp.ProviderRemovalFrequencyContinually)
	suite.Nil(pp.ProviderRemovalFrequencyOther)
	suite.Nil(pp.ProviderRemovalFrequencyNote)
	suite.Nil(pp.ProviderOverlap)
	suite.Nil(pp.ProviderOverlapHierarchy)
	suite.Nil(pp.ProviderOverlapNote)
}
