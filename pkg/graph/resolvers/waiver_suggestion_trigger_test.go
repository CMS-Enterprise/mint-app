package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

const productionCommonWaiverCount = 31

func (suite *ResolverSuite) TestWaiverSuggestionTrigger() {
	plan := suite.createModelPlan("plan for waiver suggestion trigger")

	allWaivers := suite.getCommonWaiversForSuggestionTest(plan.ID)
	suite.Len(allWaivers, productionCommonWaiverCount)
	suite.Len(suite.getSuggestedWaiversForSuggestionTest(plan.ID), productionCommonWaiverCount)

	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.Require().NoError(err)
	suite.Require().NotNil(survey)

	mappings := []struct {
		name          string
		inputField    string
		databaseField string
		waiverCount   int
	}{
		{
			name:          "care delivery with claims-based payments",
			inputField:    "modifiesCareDeliveryWithClaimsBasedPayments",
			databaseField: "modifies_care_delivery_with_claims_based_payments",
			waiverCount:   5,
		},
		{
			name:          "expense remuneration safe harbor protection",
			inputField:    "offersExpensesRemunerationSafeHarborProtection",
			databaseField: "offers_expenses_remuneration_safe_harbor_protection",
			waiverCount:   11,
		},
		{
			name:          "patient incentive safe harbor protection",
			inputField:    "offersPatientIncentivesSafeHarborProtection",
			databaseField: "offers_patient_incentives_safe_harbor_protection",
			waiverCount:   6,
		},
		{
			name:          "care team scope of practice",
			inputField:    "modifiesCareTeamScopeOfPractice",
			databaseField: "modifies_care_team_scope_of_practice",
			waiverCount:   2,
		},
		{
			name:          "home and community-based service payments",
			inputField:    "impactsHomeCommunityBasedServicePayments",
			databaseField: "impacts_home_community_based_service_payments",
			waiverCount:   1,
		},
		{
			name:          "bundled payments",
			inputField:    "bundlesPayments",
			databaseField: "bundles_payments",
			waiverCount:   1,
		},
		{
			name:          "Medicare savings programs",
			inputField:    "modifiesMedicareSavingsPrograms",
			databaseField: "modifies_medicare_savings_programs",
			waiverCount:   2,
		},
		{
			name:          "site of care payments",
			inputField:    "impactsSiteOfCarePayments",
			databaseField: "impacts_site_of_care_payments",
			waiverCount:   2,
		},
		{
			name:          "Medicaid-only beneficiaries",
			inputField:    "impactsMedicaidOnlyBeneficiaries",
			databaseField: "impacts_medicaid_only_beneficiaries",
			waiverCount:   1,
		},
	}

	for _, mapping := range mappings {
		suite.Run(mapping.name, func() {
			suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
				mapping.inputField: new(false),
			})

			suggested := suite.getSuggestedWaiversForSuggestionTest(plan.ID)
			suite.Len(suggested, productionCommonWaiverCount-mapping.waiverCount)
			suite.assertOnlyMappedWaiversRemoved(allWaivers, suggested, mapping.databaseField)

			suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
				mapping.inputField: new(true),
			})
			suite.Len(suite.getSuggestedWaiversForSuggestionTest(plan.ID), productionCommonWaiverCount)
		})
	}

	// Re-saving an unchanged answer does not recreate any remaining suggestion rows.
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"modifiesMedicareSavingsPrograms": new(false),
	})
	suggestionsAfterFalse := suggestedWaiverIDs(suite.getSuggestedWaiversForSuggestionTest(plan.ID))
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"modifiesMedicareSavingsPrograms": new(false),
	})
	suite.Equal(suggestionsAfterFalse, suggestedWaiverIDs(suite.getSuggestedWaiversForSuggestionTest(plan.ID)))

	// Clearing a false answer restores its mapped suggestions.
	updated := suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"modifiesMedicareSavingsPrograms": nil,
	})
	suite.Nil(updated.ModifiesMedicareSavingsPrograms)
	suite.Len(suite.getSuggestedWaiversForSuggestionTest(plan.ID), productionCommonWaiverCount)

	// Non-mapped fields, completion status, and completion metadata leave suggestions untouched.
	allSuggestionIDs := suggestedWaiverIDs(suite.getSuggestedWaiversForSuggestionTest(plan.ID))
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"modifiesMedicareSavingsProgramsExample": new("example"),
		"modifiesMedicareSavingsProgramsWhyNot":  new(models.NotSelectedReasonOther),
		"isComplete":                             new(true),
	})
	suite.Equal(allSuggestionIDs, suggestedWaiverIDs(suite.getSuggestedWaiversForSuggestionTest(plan.ID)))
}

func (suite *ResolverSuite) TestWaiverSuggestionTriggerMultipleFalseAnswers() {
	plan := suite.createModelPlan("plan with multiple waiver answers set to false")
	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.Require().NoError(err)
	suite.Require().NotNil(survey)

	// Five care-delivery waivers and two scope-of-practice waivers should be removed.
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"modifiesCareDeliveryWithClaimsBasedPayments": new(false),
		"modifiesCareTeamScopeOfPractice":             new(false),
	})

	suite.assertWaiverSuggestionCombination(
		plan.ID,
		24,
		"modifies_care_delivery_with_claims_based_payments",
		"modifies_care_team_scope_of_practice",
	)
}

func (suite *ResolverSuite) TestWaiverSuggestionTriggerMixedTrueAndFalseAnswers() {
	plan := suite.createModelPlan("plan with mixed waiver assessment answers")
	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.Require().NoError(err)
	suite.Require().NotNil(survey)

	// The 11 expense-remuneration and six patient-incentive waivers are ruled out.
	// The explicit true for bundled payments keeps its one mapped waiver suggested.
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"offersExpensesRemunerationSafeHarborProtection": new(false),
		"offersPatientIncentivesSafeHarborProtection":    new(false),
		"bundlesPayments": new(true),
	})

	suite.assertWaiverSuggestionCombination(
		plan.ID,
		14,
		"offers_expenses_remuneration_safe_harbor_protection",
		"offers_patient_incentives_safe_harbor_protection",
	)
}

func (suite *ResolverSuite) TestWaiverSuggestionTriggerPartialRestoration() {
	plan := suite.createModelPlan("plan with partially restored waiver suggestions")
	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.Require().NoError(err)
	suite.Require().NotNil(survey)

	// Start with four suggestions removed across two independently mapped questions.
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"modifiesMedicareSavingsPrograms": new(false),
		"impactsSiteOfCarePayments":       new(false),
	})
	suite.assertWaiverSuggestionCombination(
		plan.ID,
		27,
		"modifies_medicare_savings_programs",
		"impacts_site_of_care_payments",
	)

	// Clearing only the Medicare-savings answer restores its two waivers while the
	// two site-of-care waivers remain ruled out.
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"modifiesMedicareSavingsPrograms": nil,
	})
	suite.assertWaiverSuggestionCombination(
		plan.ID,
		29,
		"impacts_site_of_care_payments",
	)
}

func (suite *ResolverSuite) TestWaiverSuggestionTriggerSimultaneousRemovalAndRestoration() {
	plan := suite.createModelPlan("plan with waiver suggestions changing in both directions")
	survey, err := WaiverAssessmentSurveyGetByModelPlanID(suite.testConfigs.Context, plan.ID)
	suite.Require().NoError(err)
	suite.Require().NotNil(survey)

	// Initially rule out 17 waivers across three question groups.
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"offersExpensesRemunerationSafeHarborProtection": new(false),
		"modifiesCareDeliveryWithClaimsBasedPayments":    new(false),
		"impactsMedicaidOnlyBeneficiaries":               new(false),
	})
	suite.assertWaiverSuggestionCombination(
		plan.ID,
		14,
		"offers_expenses_remuneration_safe_harbor_protection",
		"modifies_care_delivery_with_claims_based_payments",
		"impacts_medicaid_only_beneficiaries",
	)

	// In one update, true restores the 11 expense-remuneration waivers, NULL restores
	// the five care-delivery waivers, and false removes the bundled-payment waiver.
	// The unchanged Medicaid answer remains false, so its waiver also stays removed.
	suite.updateWaiverAssessmentForSuggestionTest(survey.ID, map[string]any{
		"offersExpensesRemunerationSafeHarborProtection": new(true),
		"modifiesCareDeliveryWithClaimsBasedPayments":    nil,
		"bundlesPayments": new(false),
	})
	suite.assertWaiverSuggestionCombination(
		plan.ID,
		29,
		"bundles_payments",
		"impacts_medicaid_only_beneficiaries",
	)
}

func (suite *ResolverSuite) updateWaiverAssessmentForSuggestionTest(
	surveyID uuid.UUID,
	changes map[string]any,
) *models.WaiverAssessmentSurvey {
	updated, err := WaiverAssessmentSurveyUpdate(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		surveyID,
		changes,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		email.AddressBook{},
	)
	suite.Require().NoError(err)
	return updated
}

func (suite *ResolverSuite) getCommonWaiversForSuggestionTest(modelPlanID uuid.UUID) []*models.CommonWaiver {
	waivers, err := storage.CommonWaiverGetByModelPlanIDLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]uuid.UUID{modelPlanID},
	)
	suite.Require().NoError(err)
	return waivers
}

func (suite *ResolverSuite) getSuggestedWaiversForSuggestionTest(modelPlanID uuid.UUID) []*models.SuggestedWaiver {
	waivers, err := storage.SuggestedWaiverGetByModelPlanIDLoader(
		suite.testConfigs.Store,
		suite.testConfigs.Logger,
		[]uuid.UUID{modelPlanID},
	)
	suite.Require().NoError(err)
	return waivers
}

func (suite *ResolverSuite) assertOnlyMappedWaiversRemoved(
	allWaivers []*models.CommonWaiver,
	suggestedWaivers []*models.SuggestedWaiver,
	databaseField string,
) {
	suggestedIDs := suggestedWaiverIDs(suggestedWaivers)
	for _, waiver := range allWaivers {
		_, isSuggested := suggestedIDs[waiver.ID]
		suite.Equal(
			waiver.SurveyQuestionField != databaseField,
			isSuggested,
			"waiver %q suggestion state does not match its survey mapping",
			waiver.Name,
		)
	}
}

func (suite *ResolverSuite) assertWaiverSuggestionCombination(
	modelPlanID uuid.UUID,
	expectedSuggestedCount int,
	ruledOutFields ...string,
) {
	allWaivers := suite.getCommonWaiversForSuggestionTest(modelPlanID)
	suggestedWaivers := suite.getSuggestedWaiversForSuggestionTest(modelPlanID)
	suite.Len(suggestedWaivers, expectedSuggestedCount)

	ruledOutFieldSet := make(map[string]struct{}, len(ruledOutFields))
	for _, field := range ruledOutFields {
		ruledOutFieldSet[field] = struct{}{}
	}

	suggestedIDs := suggestedWaiverIDs(suggestedWaivers)
	for _, waiver := range allWaivers {
		_, shouldBeRuledOut := ruledOutFieldSet[waiver.SurveyQuestionField]
		_, isSuggested := suggestedIDs[waiver.ID]
		suite.Equal(
			!shouldBeRuledOut,
			isSuggested,
			"waiver %q mapped to %q has the wrong suggestion state",
			waiver.Name,
			waiver.SurveyQuestionField,
		)
	}
}

func suggestedWaiverIDs(waivers []*models.SuggestedWaiver) map[uuid.UUID]uuid.UUID {
	ids := make(map[uuid.UUID]uuid.UUID, len(waivers))
	for _, waiver := range waivers {
		ids[waiver.CommonWaiverID] = waiver.ID
	}
	return ids
}
