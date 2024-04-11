package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/models"
)

//go:embed translation/participantsAndProviders2.json
var partsAndProvidersTranslationJSON []byte

// translationParticipantsAndProviders shows the translation for every field in the Participants and Providers Data type
type translationParticipantsAndProviders struct {
	Participants                           TranslationFieldPropertiesWithOptionsAndParent `json:"participants" db:"participants"`
	MedicareProviderType                   TranslationFieldProperties                     `json:"medicareProviderType" db:"medicare_provider_type"`
	StatesEngagement                       TranslationFieldProperties                     `json:"statesEngagement" db:"states_engagement"`
	ParticipantsOther                      TranslationFieldProperties                     `json:"participantsOther" db:"participants_other"`
	ParticipantsNote                       TranslationFieldProperties                     `json:"participantsNote" db:"participants_note"`
	ParticipantsCurrentlyInModels          TranslationFieldProperties                     `json:"participantsCurrentlyInModels" db:"participants_currently_in_models" statusWeight:"1"`
	ParticipantsCurrentlyInModelsNote      TranslationFieldProperties                     `json:"participantsCurrentlyInModelsNote" db:"participants_currently_in_models_note"`
	ModelApplicationLevel                  TranslationFieldProperties                     `json:"modelApplicationLevel" db:"model_application_level"`
	ExpectedNumberOfParticipants           TranslationFieldProperties                     `json:"expectedNumberOfParticipants" db:"expected_number_of_participants" statusWeight:"1"`
	EstimateConfidence                     TranslationFieldPropertiesWithOptions          `json:"estimateConfidence" db:"estimate_confidence" statusWeight:"1"`
	ConfidenceNote                         TranslationFieldProperties                     `json:"confidenceNote" db:"confidence_note"`
	RecruitmentMethod                      TranslationFieldPropertiesWithOptions          `json:"recruitmentMethod" db:"recruitment_method" statusWeight:"1"`
	RecruitmentOther                       TranslationFieldProperties                     `json:"recruitmentOther" db:"recruitment_other"`
	RecruitmentNote                        TranslationFieldProperties                     `json:"recruitmentNote" db:"recruitment_note"`
	SelectionMethod                        TranslationFieldPropertiesWithOptions          `json:"selectionMethod" db:"selection_method"`
	SelectionOther                         TranslationFieldProperties                     `json:"selectionOther" db:"selection_other"`
	SelectionNote                          TranslationFieldProperties                     `json:"selectionNote" db:"selection_note"`
	ParticipantAddedFrequency              TranslationFieldPropertiesWithOptions          `json:"participantAddedFrequency" db:"participant_added_frequency" statusWeight:"1"`
	ParticipantAddedFrequencyContinually   TranslationFieldProperties                     `json:"participantAddedFrequencyContinually" db:"participant_added_frequency_continually"`
	ParticipantAddedFrequencyOther         TranslationFieldProperties                     `json:"participantAddedFrequencyOther" db:"participant_added_frequency_other"`
	ParticipantAddedFrequencyNote          TranslationFieldProperties                     `json:"participantAddedFrequencyNote" db:"participant_added_frequency_note"`
	ParticipantRemovedFrequency            TranslationFieldPropertiesWithOptions          `json:"participantRemovedFrequency" db:"participant_removed_frequency" statusWeight:"1"`
	ParticipantRemovedFrequencyContinually TranslationFieldProperties                     `json:"participantRemovedFrequencyContinually" db:"participant_removed_frequency_continually"`
	ParticipantRemovedFrequencyOther       TranslationFieldProperties                     `json:"participantRemovedFrequencyOther" db:"participant_removed_frequency_other"`
	ParticipantRemovedFrequencyNote        TranslationFieldProperties                     `json:"participantRemovedFrequencyNote" db:"participant_removed_frequency_note"`
	CommunicationMethod                    TranslationFieldPropertiesWithOptions          `json:"communicationMethod" db:"communication_method"`
	CommunicationMethodOther               TranslationFieldProperties                     `json:"communicationMethodOther" db:"communication_method_other"`
	CommunicationNote                      TranslationFieldProperties                     `json:"communicationNote" db:"communication_note"`
	RiskType                               TranslationFieldPropertiesWithOptions          `json:"riskType" db:"risk_type"`
	RiskOther                              TranslationFieldProperties                     `json:"riskOther" db:"risk_other"`
	RiskNote                               TranslationFieldProperties                     `json:"riskNote" db:"risk_note"`
	WillRiskChange                         TranslationFieldProperties                     `json:"willRiskChange" db:"will_risk_change" statusWeight:"1"`
	WillRiskChangeNote                     TranslationFieldProperties                     `json:"willRiskChangeNote" db:"will_risk_change_note"`
	CoordinateWork                         TranslationFieldPropertiesWithOptions          `json:"coordinateWork" db:"coordinate_work" statusWeight:"1"`
	CoordinateWorkNote                     TranslationFieldProperties                     `json:"coordinateWorkNote" db:"coordinate_work_note"`
	GainsharePayments                      TranslationFieldPropertiesWithOptions          `json:"gainsharePayments" db:"gainshare_payments" statusWeight:"1"`
	GainsharePaymentsTrack                 TranslationFieldProperties                     `json:"gainsharePaymentsTrack" db:"gainshare_payments_track"`
	GainsharePaymentsEligibility           TranslationFieldPropertiesWithOptions          `json:"gainsharePaymentsEligibility" db:"gainshare_payments_eligibility"`
	GainsharePaymentsEligibilityOther      TranslationFieldProperties                     `json:"gainsharePaymentsEligibilityOther" db:"gainshare_payments_eligibility_other"`
	GainsharePaymentsNote                  TranslationFieldProperties                     `json:"gainsharePaymentsNote" db:"gainshare_payments_note"`
	ParticipantsIds                        TranslationFieldPropertiesWithOptions          `json:"participantsIds" db:"participants_ids"`
	ParticipantsIdsOther                   TranslationFieldProperties                     `json:"participantsIdsOther" db:"participants_ids_other"`
	ParticipantsIDSNote                    TranslationFieldProperties                     `json:"participantsIDSNote" db:"participants_ids_note"`
	ProviderAdditionFrequency              TranslationFieldPropertiesWithOptions          `json:"providerAdditionFrequency" db:"provider_addition_frequency" statusWeight:"1"`
	ProviderAdditionFrequencyContinually   TranslationFieldProperties                     `json:"providerAdditionFrequencyContinually" db:"provider_addition_frequency_continually"`
	ProviderAdditionFrequencyOther         TranslationFieldProperties                     `json:"providerAdditionFrequencyOther" db:"provider_addition_frequency_other"`
	ProviderAdditionFrequencyNote          TranslationFieldProperties                     `json:"providerAdditionFrequencyNote" db:"provider_addition_frequency_note"`
	ProviderAddMethod                      TranslationFieldPropertiesWithOptions          `json:"providerAddMethod" db:"provider_add_method"`
	ProviderAddMethodOther                 TranslationFieldProperties                     `json:"providerAddMethodOther" db:"provider_add_method_other"`
	ProviderAddMethodNote                  TranslationFieldProperties                     `json:"providerAddMethodNote" db:"provider_add_method_note"`
	ProviderLeaveMethod                    TranslationFieldPropertiesWithOptions          `json:"providerLeaveMethod" db:"provider_leave_method"`
	ProviderLeaveMethodOther               TranslationFieldProperties                     `json:"providerLeaveMethodOther" db:"provider_leave_method_other"`
	ProviderLeaveMethodNote                TranslationFieldProperties                     `json:"providerLeaveMethodNote" db:"provider_leave_method_note"`
	ProviderRemovalFrequency               TranslationFieldPropertiesWithOptions          `json:"providerRemovalFrequency" db:"provider_removal_frequency" statusWeight:"1"`
	ProviderRemovalFrequencyContinually    TranslationFieldProperties                     `json:"providerRemovalFrequencyContinually" db:"provider_removal_frequency_continually"`
	ProviderRemovalFrequencyOther          TranslationFieldProperties                     `json:"providerRemovalFrequencyOther" db:"provider_removal_frequency_other"`
	ProviderRemovalFrequencyNote           TranslationFieldProperties                     `json:"providerRemovalFrequencyNote" db:"provider_removal_frequency_note"`
	ProviderOverlap                        TranslationFieldPropertiesWithOptions          `json:"providerOverlap" db:"provider_overlap" statusWeight:"1"`
	ProviderOverlapHierarchy               TranslationFieldProperties                     `json:"providerOverlapHierarchy" db:"provider_overlap_hierarchy"`
	ProviderOverlapNote                    TranslationFieldProperties                     `json:"providerOverlapNote" db:"provider_overlap_note"`
	Status                                 TranslationFieldPropertiesWithOptions          `json:"status" db:"status"`
}

// ParticipantsAndProvidersTranslation Provides the translation for Participants and Providers
func ParticipantsAndProvidersTranslation() (*translationParticipantsAndProviders, error) {
	var participantsTranslation translationParticipantsAndProviders
	err := json.Unmarshal(partsAndProvidersTranslationJSON, &participantsTranslation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return nil, err
	}
	return &participantsTranslation, nil

}

// TableName returns the table name for this translation, satisfying the Translation interface
func (tpp *translationParticipantsAndProviders) TableName() string {
	return "plan_participants_and_providers"
}

// ToMap translates this translation to a map, satisfying the Translation interface
func (tpp *translationParticipantsAndProviders) ToMap() (map[string]models.ITranslationField, error) {
	return models.StructToTranslationMap(*tpp)
}
