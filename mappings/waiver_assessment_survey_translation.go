package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

//go:embed translation/waiver_assessment_survey.json
var waiverAssessmentSurveyJSON []byte

// waiverAssessmentSurveyTranslation holds the field-level translations for the waiver_assessment_survey table.
type waiverAssessmentSurveyTranslation struct {
	ModifiesMedicareSavingsPrograms                        models.TranslationField `json:"modifiesMedicareSavingsPrograms" db:"modifies_medicare_savings_programs"`
	ModifiesMedicareSavingsProgramsExample                 models.TranslationField `json:"modifiesMedicareSavingsProgramsExample" db:"modifies_medicare_savings_programs_example"`
	ModifiesMedicareSavingsProgramsNote                    models.TranslationField `json:"modifiesMedicareSavingsProgramsNote" db:"modifies_medicare_savings_programs_note"`
	BundlesPayments                                        models.TranslationField `json:"bundlesPayments" db:"bundles_payments"`
	BundlesPaymentsExample                                 models.TranslationField `json:"bundlesPaymentsExample" db:"bundles_payments_example"`
	BundlesPaymentsNote                                    models.TranslationField `json:"bundlesPaymentsNote" db:"bundles_payments_note"`
	OffersRiskSharingArrangements                          models.TranslationField `json:"offersRiskSharingArrangements" db:"offers_risk_sharing_arrangements"`
	OffersRiskSharingArrangementsExample                   models.TranslationField `json:"offersRiskSharingArrangementsExample" db:"offers_risk_sharing_arrangements_example"`
	OffersRiskSharingArrangementsNote                      models.TranslationField `json:"offersRiskSharingArrangementsNote" db:"offers_risk_sharing_arrangements_note"`
	ImpactsSiteOfCarePayments                              models.TranslationField `json:"impactsSiteOfCarePayments" db:"impacts_site_of_care_payments"`
	ImpactsSiteOfCarePaymentsExample                       models.TranslationField `json:"impactsSiteOfCarePaymentsExample" db:"impacts_site_of_care_payments_example"`
	ImpactsSiteOfCarePaymentsNote                          models.TranslationField `json:"impactsSiteOfCarePaymentsNote" db:"impacts_site_of_care_payments_note"`
	ModifiesCareTeamScopeOfPractice                        models.TranslationField `json:"modifiesCareTeamScopeOfPractice" db:"modifies_care_team_scope_of_practice"`
	ModifiesCareTeamScopeOfPracticeExample                 models.TranslationField `json:"modifiesCareTeamScopeOfPracticeExample" db:"modifies_care_team_scope_of_practice_example"`
	ModifiesCareTeamScopeOfPracticeNote                    models.TranslationField `json:"modifiesCareTeamScopeOfPracticeNote" db:"modifies_care_team_scope_of_practice_note"`
	ModifiesCareDeliveryWithClaimsBasedPayments            models.TranslationField `json:"modifiesCareDeliveryWithClaimsBasedPayments" db:"modifies_care_delivery_with_claims_based_payments"`
	ModifiesCareDeliveryWithClaimsBasedPaymentsExample     models.TranslationField `json:"modifiesCareDeliveryWithClaimsBasedPaymentsExample" db:"modifies_care_delivery_with_claims_based_payments_example"`
	ModifiesCareDeliveryWithClaimsBasedPaymentsNote        models.TranslationField `json:"modifiesCareDeliveryWithClaimsBasedPaymentsNote" db:"modifies_care_delivery_with_claims_based_payments_note"`
	ModifiesQualityMeasurementsOrPaymentsViaWaivers        models.TranslationField `json:"modifiesQualityMeasurementsOrPaymentsViaWaivers" db:"modifies_quality_measurements_or_payments_via_waivers"`
	ModifiesQualityMeasurementsOrPaymentsViaWaiversExample models.TranslationField `json:"modifiesQualityMeasurementsOrPaymentsViaWaiversExample" db:"modifies_quality_measurements_or_payments_via_waivers_example"`
	ModifiesQualityMeasurementsOrPaymentsViaWaiversNote    models.TranslationField `json:"modifiesQualityMeasurementsOrPaymentsViaWaiversNote" db:"modifies_quality_measurements_or_payments_via_waivers_note"`
	ImpactsMedicaidOnlyBeneficiaries                       models.TranslationField `json:"impactsMedicaidOnlyBeneficiaries" db:"impacts_medicaid_only_beneficiaries"`
	ImpactsMedicaidOnlyBeneficiariesExample                models.TranslationField `json:"impactsMedicaidOnlyBeneficiariesExample" db:"impacts_medicaid_only_beneficiaries_example"`
	ImpactsMedicaidOnlyBeneficiariesNote                   models.TranslationField `json:"impactsMedicaidOnlyBeneficiariesNote" db:"impacts_medicaid_only_beneficiaries_note"`
	ImpactsHomeCommunityBasedServicePayments               models.TranslationField `json:"impactsHomeCommunityBasedServicePayments" db:"impacts_home_community_based_service_payments"`
	ImpactsHomeCommunityBasedServicePaymentsExample        models.TranslationField `json:"impactsHomeCommunityBasedServicePaymentsExample" db:"impacts_home_community_based_service_payments_example"`
	ImpactsHomeCommunityBasedServicePaymentsNote           models.TranslationField `json:"impactsHomeCommunityBasedServicePaymentsNote" db:"impacts_home_community_based_service_payments_note"`
	ImpactsManagedCareWaivers                              models.TranslationField `json:"impactsManagedCareWaivers" db:"impacts_managed_care_waivers"`
	ImpactsManagedCareWaiversExample                       models.TranslationField `json:"impactsManagedCareWaiversExample" db:"impacts_managed_care_waivers_example"`
	ImpactsManagedCareWaiversNote                          models.TranslationField `json:"impactsManagedCareWaiversNote" db:"impacts_managed_care_waivers_note"`
	AdditionalMedicaidSpecificWaivers                      models.TranslationField `json:"additionalMedicaidSpecificWaivers" db:"additional_medicaid_specific_waivers"`
	Status                                                 models.TranslationField `json:"status" db:"status"`
}

// TableName satisfies the Translation interface
func (t *waiverAssessmentSurveyTranslation) TableName() models.TableName {
	return models.TNWaiverAssessmentSurvey
}

// ToMap satisfies the Translation interface
func (t *waiverAssessmentSurveyTranslation) ToMap() (map[string]models.ITranslationField, error) {
	return models.StructToTranslationMap(*t)
}

// WaiverAssessmentSurveyTranslation loads the translation for the waiver_assessment_survey table
func WaiverAssessmentSurveyTranslation() (*waiverAssessmentSurveyTranslation, error) {
	var translation waiverAssessmentSurveyTranslation
	if err := json.Unmarshal(waiverAssessmentSurveyJSON, &translation); err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &translation, nil
}
