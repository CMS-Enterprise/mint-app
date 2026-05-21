package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// SeedSuggestedWaivers creates a suggested_waiver row for every common_waiver, giving a
// new model plan the full set of suggestions before any survey answers are recorded.
func SeedSuggestedWaivers(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	modelPlanID uuid.UUID,
	principal authentication.Principal,
) error {
	commonWaivers, err := storage.CommonWaiverGetAll(np, logger)
	if err != nil {
		return err
	}

	for _, cw := range commonWaivers {
		sw := models.NewSuggestedWaiver(principal.Account().ID, modelPlanID, cw.ID)
		if _, err := storage.SuggestedWaiverCreate(np, logger, sw); err != nil {
			return err
		}
	}
	return nil
}

// RecalculateSuggestedWaivers replaces all suggested_waiver rows for the model plan based on
// the current survey answers. A common waiver is included when:
//   - its survey_question_field is nil (no mapping yet → always suggest), or
//   - the corresponding survey field is nil (unanswered → still suggest), or
//   - the corresponding survey field is true (model needs this waiver type).
//
// When real waiver→question mappings are available, populate common_waiver.survey_question_field
// via a migration — no Go code changes needed.
func RecalculateSuggestedWaivers(
	np sqlutils.NamedPreparer,
	logger *zap.Logger,
	survey *models.WaiverAssessmentSurvey,
	principal authentication.Principal,
) error {
	if _, err := storage.SuggestedWaiverDeleteAllByModelPlanID(np, logger, survey.ModelPlanID); err != nil {
		return err
	}

	commonWaivers, err := storage.CommonWaiverGetAll(np, logger)
	if err != nil {
		return err
	}

	for _, cw := range commonWaivers {
		if !shouldSuggestWaiver(cw, survey) {
			continue
		}
		sw := models.NewSuggestedWaiver(principal.Account().ID, survey.ModelPlanID, cw.ID)
		if _, err := storage.SuggestedWaiverCreate(np, logger, sw); err != nil {
			return err
		}
	}
	return nil
}

// shouldSuggestWaiver returns false only when the waiver has a survey_question_field mapping
// AND that survey question was explicitly answered false.
func shouldSuggestWaiver(cw *models.CommonWaiver, survey *models.WaiverAssessmentSurvey) bool {
	if cw.SurveyQuestionField == nil {
		return true
	}
	val := surveyBoolField(survey, *cw.SurveyQuestionField)
	if val == nil {
		return true // unanswered — keep suggesting
	}
	return *val
}

// surveyBoolField looks up a boolean field on WaiverAssessmentSurvey by its DB column name.
// Returns nil if the column name is unknown or the field is unset.
// Add new cases here when new survey questions are introduced.
func surveyBoolField(s *models.WaiverAssessmentSurvey, col string) *bool {
	switch col {
	case "modifies_medicare_savings_programs":
		return s.ModifiesMedicareSavingsPrograms
	case "bundles_payments":
		return s.BundlesPayments
	case "offers_risk_sharing_arrangements":
		return s.OffersRiskSharingArrangements
	case "impacts_site_of_care_payments":
		return s.ImpactsSiteOfCarePayments
	case "modifies_care_team_scope_of_practice":
		return s.ModifiesCareTeamScopeOfPractice
	case "modifies_care_delivery_with_claims_based_payments":
		return s.ModifiesCareDeliveryWithClaimsBasedPayments
	case "modifies_quality_measurements_or_payments_via_waivers":
		return s.ModifiesQualityMeasurementsOrPaymentsViaWaivers
	case "impacts_medicaid_only_beneficiaries":
		return s.ImpactsMedicaidOnlyBeneficiaries
	case "impacts_home_community_based_service_payments":
		return s.ImpactsHomeCommunityBasedServicePayments
	case "impacts_managed_care_waivers":
		return s.ImpactsManagedCareWaivers
	default:
		return nil
	}
}
