package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

// TestPlanParticipantsAndProvidersUpdate tests PlanParticipantsAndProvidersUpdate
func (suite *ResolverSuite) TestPlanParticipantsAndProvidersUpdate() {
	plan := suite.createModelPlan("Plan for Participants and Providers")

	pp, err := PlanParticipantsAndProvidersGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	changes := map[string]interface{}{
		"confidenceNote":     "This is a confidence note",
		"recruitmentNote":    "This is a recruitment note",
		"estimateConfidence": string(models.ConfidenceSlightly),
	}

	updatedPP, err := PlanParticipantsAndProvidersUpdate(suite.testConfigs.Logger, pp.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)

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
	suite.Nil(updatedPP.CommunicationMethod)
	suite.Nil(updatedPP.CommunicationNote)
	suite.Nil(updatedPP.ParticipantAssumeRisk)
	suite.Nil(updatedPP.RiskType)
	suite.Nil(updatedPP.RiskOther)
	suite.Nil(updatedPP.RiskNote)
	suite.Nil(updatedPP.WillRiskChange)
	suite.Nil(updatedPP.WillRiskChangeNote)
	suite.Nil(updatedPP.CoordinateWork)
	suite.Nil(updatedPP.CoordinateWorkNote)
	suite.Nil(updatedPP.GainsharePayments)
	suite.Nil(updatedPP.GainsharePaymentsTrack)
	suite.Nil(updatedPP.GainsharePaymentsNote)
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
	suite.Nil(updatedPP.ProviderOverlap)
	suite.Nil(updatedPP.ProviderOverlapHierarchy)
	suite.Nil(updatedPP.ProviderOverlapNote)

}

// TestPlanParticipantsAndProvidersGetByModelPlanID tests PlanParticipantsAndProvidersGetByModelPlanID
func (suite *ResolverSuite) TestPlanParticipantsAndProvidersGetByModelPlanID() {

	plan := suite.createModelPlan("Plan for Participants and Providers")

	pp, err := PlanParticipantsAndProvidersGetByModelPlanID(suite.testConfigs.Logger, plan.ID, suite.testConfigs.Store)
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
	suite.Nil(pp.CommunicationMethod)
	suite.Nil(pp.CommunicationNote)
	suite.Nil(pp.ParticipantAssumeRisk)
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
	suite.Nil(pp.ParticipantsIds)
	suite.Nil(pp.ParticipantsIdsOther)
	suite.Nil(pp.ParticipantsIDSNote)
	suite.Nil(pp.ProviderAdditionFrequency)
	suite.Nil(pp.ProviderAdditionFrequencyOther)
	suite.Nil(pp.ProviderAdditionFrequencyNote)
	suite.Nil(pp.ProviderAddMethod)
	suite.Nil(pp.ProviderAddMethodOther)
	suite.Nil(pp.ProviderAddMethodNote)
	suite.Nil(pp.ProviderLeaveMethod)
	suite.Nil(pp.ProviderLeaveMethodOther)
	suite.Nil(pp.ProviderLeaveMethodNote)
	suite.Nil(pp.ProviderOverlap)
	suite.Nil(pp.ProviderOverlapHierarchy)
	suite.Nil(pp.ProviderOverlapNote)
}
