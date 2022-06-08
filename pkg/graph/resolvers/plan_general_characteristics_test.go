package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestFetchPlanGeneralCharacteristicsByModelPlanID() {
	plan := suite.createModelPlan("Plan For General Characteristics") // should create the general characteristics as part of the resolver

	gc, err := FetchPlanGeneralCharacteristicsByModelPlanID(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)

	suite.NoError(err)
	suite.EqualValues(plan.ID, gc.ModelPlanID)
	suite.EqualValues(models.TaskReady, gc.Status)
	suite.EqualValues(suite.testConfigs.UserInfo.EuaUserID, gc.CreatedBy)
	suite.Nil(gc.ModifiedBy)

	// Many of the fields are nil upon creation
	suite.Nil(gc.IsNewModel)
	suite.Nil(gc.ExistingModel)
	suite.Nil(gc.ResemblesExistingModel)
	suite.Nil(gc.ResemblesExistingModelWhich)
	suite.Nil(gc.ResemblesExistingModelHow)
	suite.Nil(gc.ResemblesExistingModelNote)
	suite.Nil(gc.HasComponentsOrTracks)
	suite.Nil(gc.HasComponentsOrTracksDiffer)
	suite.Nil(gc.HasComponentsOrTracksNote)
	suite.Nil(gc.AlternativePaymentModel)
	suite.Nil(gc.AlternativePaymentModelTypes)
	suite.Nil(gc.AlternativePaymentModelNote)
	suite.Nil(gc.KeyCharacteristics)
	suite.Nil(gc.KeyCharacteristicsOther)
	suite.Nil(gc.KeyCharacteristicsNote)
	suite.Nil(gc.CollectPlanBids)
	suite.Nil(gc.CollectPlanBidsNote)
	suite.Nil(gc.ManagePartCDEnrollment)
	suite.Nil(gc.ManagePartCDEnrollmentNote)
	suite.Nil(gc.PlanContactUpdated)
	suite.Nil(gc.PlanContactUpdatedNote)
	suite.Nil(gc.CareCoordinationInvolved)
	suite.Nil(gc.CareCoordinationInvolvedDescription)
	suite.Nil(gc.CareCoordinationInvolvedNote)
	suite.Nil(gc.AdditionalServicesInvolved)
	suite.Nil(gc.AdditionalServicesInvolvedDescription)
	suite.Nil(gc.AdditionalServicesInvolvedNote)
	suite.Nil(gc.CommunityPartnersInvolved)
	suite.Nil(gc.CommunityPartnersInvolvedDescription)
	suite.Nil(gc.CommunityPartnersInvolvedNote)
	suite.Nil(gc.GeographiesTargeted)
	suite.Nil(gc.GeographiesTargetedTypes)
	suite.Nil(gc.GeographiesTargetedTypesOther)
	suite.Nil(gc.GeographiesTargetedAppliedTo)
	suite.Nil(gc.GeographiesTargetedAppliedToOther)
	suite.Nil(gc.GeographiesTargetedNote)
	suite.Nil(gc.ParticipationOptions)
	suite.Nil(gc.ParticipationOptionsNote)
	suite.Nil(gc.AgreementTypes)
	suite.Nil(gc.AgreementTypesOther)
	suite.Nil(gc.MultiplePatricipationAgreementsNeeded)
	suite.Nil(gc.MultiplePatricipationAgreementsNeededNote)
	suite.Nil(gc.RulemakingRequired)
	suite.Nil(gc.RulemakingRequiredDescription)
	suite.Nil(gc.RulemakingRequiredNote)
	suite.Nil(gc.AuthorityAllowances)
	suite.Nil(gc.AuthorityAllowancesOther)
	suite.Nil(gc.AuthorityAllowancesNote)
	suite.Nil(gc.WaiversRequired)
	suite.Nil(gc.WaiversRequiredTypes)
	suite.Nil(gc.WaiversRequiredNote)
}

func (suite *ResolverSuite) TestUpdatePlanGeneralCharacteristics() {
	plan := suite.createModelPlan("Plan For General Characteristics") // should create the general characteristics as part of the resolver

	gc, err := FetchPlanGeneralCharacteristicsByModelPlanID(suite.testConfigs.Logger, suite.testConfigs.UserInfo.EuaUserID, plan.ID, suite.testConfigs.Store)
	suite.NoError(err)

	changes := map[string]interface{}{
		"hasComponentsOrTracks":        true,
		"hasComponentsOrTracksDiffer":  "One track does something one way, the other does it another way",
		"hasComponentsOrTracksNote":    "Look at the tracks carefully",
		"alternativePaymentModel":      true,
		"alternativePaymentModelTypes": []string{model.AlternativePaymentModelTypeMips.String(), model.AlternativePaymentModelTypeAdvanced.String()},
		"AlternativePaymentModelNote":  "Has 2 APM types!",
	}
	updater := "UPDT"
	updatedGeneralCharacteristics, err := UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, updater, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(updater, *updatedGeneralCharacteristics.ModifiedBy)

	// Assert that the updated fields are right
	suite.True(*updatedGeneralCharacteristics.HasComponentsOrTracks)
	suite.EqualValues("One track does something one way, the other does it another way", *updatedGeneralCharacteristics.HasComponentsOrTracksDiffer)
	suite.EqualValues("Look at the tracks carefully", *updatedGeneralCharacteristics.HasComponentsOrTracksNote)
	suite.True(*updatedGeneralCharacteristics.AlternativePaymentModel)
	suite.EqualValues([]string{model.AlternativePaymentModelTypeMips.String(), model.AlternativePaymentModelTypeAdvanced.String()}, updatedGeneralCharacteristics.AlternativePaymentModelTypes)
	suite.EqualValues("Has 2 APM types!", *updatedGeneralCharacteristics.AlternativePaymentModelNote)
	suite.EqualValues(models.TaskInProgress, updatedGeneralCharacteristics.Status)

	// Assert that no other fields got updated
	suite.Nil(updatedGeneralCharacteristics.IsNewModel)
	suite.Nil(updatedGeneralCharacteristics.ExistingModel)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModel)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelWhich)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelHow)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelNote)
	suite.Nil(updatedGeneralCharacteristics.KeyCharacteristics)
	suite.Nil(updatedGeneralCharacteristics.KeyCharacteristicsOther)
	suite.Nil(updatedGeneralCharacteristics.KeyCharacteristicsNote)
	suite.Nil(updatedGeneralCharacteristics.CollectPlanBids)
	suite.Nil(updatedGeneralCharacteristics.CollectPlanBidsNote)
	suite.Nil(updatedGeneralCharacteristics.ManagePartCDEnrollment)
	suite.Nil(updatedGeneralCharacteristics.ManagePartCDEnrollmentNote)
	suite.Nil(updatedGeneralCharacteristics.PlanContactUpdated)
	suite.Nil(updatedGeneralCharacteristics.PlanContactUpdatedNote)
	suite.Nil(updatedGeneralCharacteristics.CareCoordinationInvolved)
	suite.Nil(updatedGeneralCharacteristics.CareCoordinationInvolvedDescription)
	suite.Nil(updatedGeneralCharacteristics.CareCoordinationInvolvedNote)
	suite.Nil(updatedGeneralCharacteristics.AdditionalServicesInvolved)
	suite.Nil(updatedGeneralCharacteristics.AdditionalServicesInvolvedDescription)
	suite.Nil(updatedGeneralCharacteristics.AdditionalServicesInvolvedNote)
	suite.Nil(updatedGeneralCharacteristics.CommunityPartnersInvolved)
	suite.Nil(updatedGeneralCharacteristics.CommunityPartnersInvolvedDescription)
	suite.Nil(updatedGeneralCharacteristics.CommunityPartnersInvolvedNote)
	suite.Nil(updatedGeneralCharacteristics.GeographiesTargeted)
	suite.Nil(updatedGeneralCharacteristics.GeographiesTargetedTypes)
	suite.Nil(updatedGeneralCharacteristics.GeographiesTargetedTypesOther)
	suite.Nil(updatedGeneralCharacteristics.GeographiesTargetedAppliedTo)
	suite.Nil(updatedGeneralCharacteristics.GeographiesTargetedAppliedToOther)
	suite.Nil(updatedGeneralCharacteristics.GeographiesTargetedNote)
	suite.Nil(updatedGeneralCharacteristics.ParticipationOptions)
	suite.Nil(updatedGeneralCharacteristics.ParticipationOptionsNote)
	suite.Nil(updatedGeneralCharacteristics.AgreementTypes)
	suite.Nil(updatedGeneralCharacteristics.AgreementTypesOther)
	suite.Nil(updatedGeneralCharacteristics.MultiplePatricipationAgreementsNeeded)
	suite.Nil(updatedGeneralCharacteristics.MultiplePatricipationAgreementsNeededNote)
	suite.Nil(updatedGeneralCharacteristics.RulemakingRequired)
	suite.Nil(updatedGeneralCharacteristics.RulemakingRequiredDescription)
	suite.Nil(updatedGeneralCharacteristics.RulemakingRequiredNote)
	suite.Nil(updatedGeneralCharacteristics.AuthorityAllowances)
	suite.Nil(updatedGeneralCharacteristics.AuthorityAllowancesOther)
	suite.Nil(updatedGeneralCharacteristics.AuthorityAllowancesNote)
	suite.Nil(updatedGeneralCharacteristics.WaiversRequired)
	suite.Nil(updatedGeneralCharacteristics.WaiversRequiredTypes)
	suite.Nil(updatedGeneralCharacteristics.WaiversRequiredNote)
}
