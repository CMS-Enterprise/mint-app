package mappings

import (
	_ "embed"
	"encoding/json"
	"fmt"
)

//go:embed translation/participantsAndProviders.json
var partsAndProvidersTranslationJSON []byte

// translationParticipantsAndProviders shows the translation for every field in the Participants and Providers Data type
type translationParticipantsAndProviders struct {
	Participants                           TranslationFieldPropertiesWithOptionsAndParent `json:"participants"`
	MedicareProviderType                   TranslationFieldProperties                     `json:"medicareProviderType"`
	StatesEngagement                       TranslationFieldProperties                     `json:"statesEngagement"`
	ParticipantsOther                      TranslationFieldProperties                     `json:"participantsOther"`
	ParticipantsNote                       TranslationFieldProperties                     `json:"participantsNote"`
	ParticipantsCurrentlyInModels          TranslationFieldProperties                     `json:"participantsCurrentlyInModels"`
	ParticipantsCurrentlyInModelsNote      TranslationFieldProperties                     `json:"participantsCurrentlyInModelsNote"`
	ModelApplicationLevel                  TranslationFieldProperties                     `json:"modelApplicationLevel"`
	ExpectedNumberOfParticipants           TranslationFieldProperties                     `json:"expectedNumberOfParticipants"`
	EstimateConfidence                     TranslationFieldProperties                     `json:"estimateConfidence"`
	ConfidenceNote                         TranslationFieldProperties                     `json:"confidenceNote"`
	RecruitmentMethod                      TranslationFieldProperties                     `json:"recruitmentMethod"`
	RecruitmentOther                       TranslationFieldProperties                     `json:"recruitmentOther"`
	RecruitmentNote                        TranslationFieldProperties                     `json:"recruitmentNote"`
	SelectionMethod                        TranslationFieldPropertiesWithOptions          `json:"selectionMethod"`
	SelectionOther                         TranslationFieldProperties                     `json:"selectionOther"`
	SelectionNote                          TranslationFieldProperties                     `json:"selectionNote"`
	ParticipantAddedFrequency              TranslationFieldPropertiesWithOptions          `json:"participantAddedFrequency"`
	ParticipantAddedFrequencyContinually   TranslationFieldProperties                     `json:"participantAddedFrequencyContinually"`
	ParticipantAddedFrequencyOther         TranslationFieldProperties                     `json:"participantAddedFrequencyOther"`
	ParticipantAddedFrequencyNote          TranslationFieldProperties                     `json:"participantAddedFrequencyNote"`
	ParticipantRemovedFrequency            TranslationFieldPropertiesWithOptions          `json:"participantRemovedFrequency"`
	ParticipantRemovedFrequencyContinually TranslationFieldProperties                     `json:"participantRemovedFrequencyContinually"`
	ParticipantRemovedFrequencyOther       TranslationFieldProperties                     `json:"participantRemovedFrequencyOther"`
	ParticipantRemovedFrequencyNote        TranslationFieldProperties                     `json:"participantRemovedFrequencyNote"`
	CommunicationMethod                    TranslationFieldPropertiesWithOptions          `json:"communicationMethod"`
	CommunicationMethodOther               TranslationFieldProperties                     `json:"communicationMethodOther"`
	CommunicationNote                      TranslationFieldProperties                     `json:"communicationNote"`
	RiskType                               TranslationFieldPropertiesWithOptions          `json:"riskType"`
	RiskOther                              TranslationFieldProperties                     `json:"riskOther"`
	RiskNote                               TranslationFieldProperties                     `json:"riskNote"`
	WillRiskChange                         TranslationFieldProperties                     `json:"willRiskChange"`
	WillRiskChangeNote                     TranslationFieldProperties                     `json:"willRiskChangeNote"`
	CoordinateWork                         TranslationFieldPropertiesWithOptions          `json:"coordinateWork"`
	CoordinateWorkNote                     TranslationFieldProperties                     `json:"coordinateWorkNote"`
	GainsharePayments                      TranslationFieldPropertiesWithOptions          `json:"gainsharePayments"`
	GainsharePaymentsTrack                 TranslationFieldProperties                     `json:"gainsharePaymentsTrack"`
	GainsharePaymentsEligibility           TranslationFieldPropertiesWithOptions          `json:"gainsharePaymentsEligibility"`
	GainsharePaymentsEligibilityOther      TranslationFieldProperties                     `json:"gainsharePaymentsEligibilityOther"`
	GainsharePaymentsNote                  TranslationFieldProperties                     `json:"gainsharePaymentsNote"`
	ParticipantsIds                        TranslationFieldPropertiesWithOptions          `json:"participantsIds"`
	ParticipantsIdsOther                   TranslationFieldProperties                     `json:"participantsIdsOther"`
	ParticipantsIDSNote                    TranslationFieldProperties                     `json:"participantsIDSNote"`
	ProviderAdditionFrequency              TranslationFieldPropertiesWithOptions          `json:"providerAdditionFrequency"`
	ProviderAdditionFrequencyContinually   TranslationFieldProperties                     `json:"providerAdditionFrequencyContinually"`
	ProviderAdditionFrequencyOther         TranslationFieldProperties                     `json:"providerAdditionFrequencyOther"`
	ProviderAdditionFrequencyNote          TranslationFieldProperties                     `json:"providerAdditionFrequencyNote"`
	ProviderAddMethod                      TranslationFieldPropertiesWithOptions          `json:"providerAddMethod"`
	ProviderAddMethodOther                 TranslationFieldProperties                     `json:"providerAddMethodOther"`
	ProviderAddMethodNote                  TranslationFieldProperties                     `json:"providerAddMethodNote"`
	ProviderLeaveMethod                    TranslationFieldPropertiesWithOptions          `json:"providerLeaveMethod"`
	ProviderLeaveMethodOther               TranslationFieldProperties                     `json:"providerLeaveMethodOther"`
	ProviderLeaveMethodNote                TranslationFieldProperties                     `json:"providerLeaveMethodNote"`
	ProviderRemovalFrequency               TranslationFieldPropertiesWithOptions          `json:"providerRemovalFrequency"`
	ProviderRemovalFrequencyContinually    TranslationFieldProperties                     `json:"providerRemovalFrequencyContinually"`
	ProviderRemovalFrequencyOther          TranslationFieldProperties                     `json:"providerRemovalFrequencyOther"`
	ProviderRemovalFrequencyNote           TranslationFieldProperties                     `json:"providerRemovalFrequencyNote"`
	ProviderOverlap                        TranslationFieldPropertiesWithOptions          `json:"providerOverlap"`
	ProviderOverlapHierarchy               TranslationFieldProperties                     `json:"providerOverlapHierarchy"`
	ProviderOverlapNote                    TranslationFieldProperties                     `json:"providerOverlapNote"`
	Status                                 TranslationFieldPropertiesWithOptions          `json:"status"`
}

// var participantsAndProviders = getParticipantsAndProvidersTranslation()

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
