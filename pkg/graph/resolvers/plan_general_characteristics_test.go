package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
)

func (suite *ResolverSuite) TestPlanGeneralCharacteristicsDataLoader() {
	plan1 := suite.createModelPlan("Plan For GC 1")
	plan2 := suite.createModelPlan("Plan For GC 2")

	g, ctx := errgroup.WithContext(suite.testConfigs.Context)
	g.Go(func() error {
		return verifyGeneralCharacteristicsLoader(ctx, plan1.ID)
	})
	g.Go(func() error {
		return verifyGeneralCharacteristicsLoader(ctx, plan2.ID)
	})
	err := g.Wait()
	suite.NoError(err)

}
func verifyGeneralCharacteristicsLoader(ctx context.Context, modelPlanID uuid.UUID) error {

	gc, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(ctx, modelPlanID)
	if err != nil {
		return err
	}

	if modelPlanID != gc.ModelPlanID {
		return fmt.Errorf("general characteristics returned model plan ID %s, expected %s", gc.ModelPlanID, modelPlanID)
	}
	return nil
}

func (suite *ResolverSuite) TestFetchPlanGeneralCharacteristicsByModelPlanID() {
	plan := suite.createModelPlan("Plan For General Characteristics") // should create the general characteristics as part of the resolver

	gc, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)

	suite.NoError(err)
	suite.EqualValues(plan.ID, gc.ModelPlanID)
	suite.EqualValues(models.TaskReady, gc.Status)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, gc.CreatedBy)
	suite.Nil(gc.ModifiedBy)

	// Many of the fields are nil upon creation
	suite.Nil(gc.IsNewModel)
	suite.Nil(gc.ResemblesExistingModel)
	suite.Nil(gc.ResemblesExistingModelWhyHow)
	suite.Nil(gc.ResemblesExistingModelOtherSpecify)
	suite.Nil(gc.ResemblesExistingModelOtherSelected)
	suite.Nil(gc.ResemblesExistingModelOtherOption)
	suite.Nil(gc.ResemblesExistingModelHow)
	suite.Nil(gc.ResemblesExistingModelNote)
	suite.Nil(gc.HasComponentsOrTracks)
	suite.Nil(gc.HasComponentsOrTracksDiffer)
	suite.Nil(gc.HasComponentsOrTracksNote)
	suite.Nil(gc.AlternativePaymentModelTypes)
	suite.Nil(gc.AlternativePaymentModelNote)
	suite.Nil(gc.KeyCharacteristics)
	suite.Nil(gc.KeyCharacteristicsOther)
	suite.Nil(gc.KeyCharacteristicsNote)
	suite.Nil(gc.CollectPlanBids)
	suite.Nil(gc.CollectPlanBidsNote)
	suite.Nil(gc.ManagePartCDEnrollment)
	suite.Nil(gc.ManagePartCDEnrollmentNote)
	suite.Nil(gc.PlanContractUpdated)
	suite.Nil(gc.PlanContractUpdatedNote)
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
	suite.Nil(gc.GeographiesStatesAndTerritories)
	suite.Nil(gc.GeographiesRegionTypes)
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
	suite.Nil(gc.AgencyOrStateHelp)
	suite.Nil(gc.AgencyOrStateHelpOther)
	suite.Nil(gc.AgencyOrStateHelpNote)
}

func (suite *ResolverSuite) TestUpdatePlanGeneralCharacteristics() {
	plan := suite.createModelPlan("Plan For General Characteristics") // should create the general characteristics as part of the resolver

	gc, err := PlanGeneralCharacteristicsGetByModelPlanIDLOADER(suite.testConfigs.Context, plan.ID)
	suite.NoError(err)

	changes := map[string]interface{}{
		"hasComponentsOrTracks":           true,
		"hasComponentsOrTracksDiffer":     "One track does something one way, the other does it another way",
		"hasComponentsOrTracksNote":       "Look at the tracks carefully",
		"alternativePaymentModelTypes":    []string{model.AlternativePaymentModelTypeMips.String(), model.AlternativePaymentModelTypeAdvanced.String()},
		"AlternativePaymentModelNote":     "Has 2 APM types!",
		"GeographiesStatesAndTerritories": []string{"AL", "AK", "AZ"},
		"GeographiesRegionTypes":          []string{"CBSA", "HRR"},
		"agencyOrStateHelp":               []string{"YES_STATE", "YES_AGENCY_IDEAS", "OTHER"},
		"agencyOrStateHelpOther":          "Some other note",
		"agencyOrStateHelpNote":           "Some note",
	}

	updatedGeneralCharacteristics, err := UpdatePlanGeneralCharacteristics(suite.testConfigs.Logger, gc.ID, changes, suite.testConfigs.Principal, suite.testConfigs.Store)
	suite.NoError(err)
	suite.EqualValues(suite.testConfigs.Principal.UserAccount.ID, *updatedGeneralCharacteristics.ModifiedBy)

	// Assert that the updated fields are right
	suite.True(*updatedGeneralCharacteristics.HasComponentsOrTracks)
	suite.EqualValues("One track does something one way, the other does it another way", *updatedGeneralCharacteristics.HasComponentsOrTracksDiffer)
	suite.EqualValues("Look at the tracks carefully", *updatedGeneralCharacteristics.HasComponentsOrTracksNote)
	suite.EqualValues([]string{model.AlternativePaymentModelTypeMips.String(), model.AlternativePaymentModelTypeAdvanced.String()}, updatedGeneralCharacteristics.AlternativePaymentModelTypes)
	suite.EqualValues("Has 2 APM types!", *updatedGeneralCharacteristics.AlternativePaymentModelNote)
	suite.EqualValues(models.TaskInProgress, updatedGeneralCharacteristics.Status)
	suite.EqualValues([]string{"AL", "AK", "AZ"}, updatedGeneralCharacteristics.GeographiesStatesAndTerritories)
	suite.EqualValues([]string{"CBSA", "HRR"}, updatedGeneralCharacteristics.GeographiesRegionTypes)
	suite.EqualValues([]string{"YES_STATE", "YES_AGENCY_IDEAS", "OTHER"}, updatedGeneralCharacteristics.AgencyOrStateHelp)
	suite.EqualValues("Some other note", *updatedGeneralCharacteristics.AgencyOrStateHelpOther)
	suite.EqualValues("Some note", *updatedGeneralCharacteristics.AgencyOrStateHelpNote)

	// Assert that no other fields got updated
	suite.Nil(updatedGeneralCharacteristics.IsNewModel)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModel)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelWhyHow)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelOtherSpecify)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelOtherSelected)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelOtherOption)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelHow)
	suite.Nil(updatedGeneralCharacteristics.ResemblesExistingModelNote)
	suite.Nil(updatedGeneralCharacteristics.KeyCharacteristics)
	suite.Nil(updatedGeneralCharacteristics.KeyCharacteristicsOther)
	suite.Nil(updatedGeneralCharacteristics.KeyCharacteristicsNote)
	suite.Nil(updatedGeneralCharacteristics.CollectPlanBids)
	suite.Nil(updatedGeneralCharacteristics.CollectPlanBidsNote)
	suite.Nil(updatedGeneralCharacteristics.ManagePartCDEnrollment)
	suite.Nil(updatedGeneralCharacteristics.ManagePartCDEnrollmentNote)
	suite.Nil(updatedGeneralCharacteristics.PlanContractUpdated)
	suite.Nil(updatedGeneralCharacteristics.PlanContractUpdatedNote)
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
