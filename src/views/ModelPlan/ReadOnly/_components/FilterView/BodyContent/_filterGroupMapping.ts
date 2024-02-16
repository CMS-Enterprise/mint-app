import { ModelViewFilter } from 'gql/gen/graphql';

import { getKeys } from 'types/translation';

// Importing ModelViewFilter enum and converting to lowercase to work easily with FE routes
export const filterGroups = getKeys(ModelViewFilter).map(filter =>
  filter.toLowerCase()
);

export type FilterGroup = typeof filterGroups[number];

// Map for url route params to ModelViewFilter enum
export const filterGroupKey: Record<string, ModelViewFilter> = {
  cbosc: ModelViewFilter.CBOSC,
  ccw: ModelViewFilter.CCW,
  cmmi: ModelViewFilter.CMMI,
  dfsdm: ModelViewFilter.DFSDM,
  iccod: ModelViewFilter.IDDOC,
  ipc: ModelViewFilter.IPC,
  mdm: ModelViewFilter.MDM,
  oact: ModelViewFilter.OACT,
  pbg: ModelViewFilter.PBG
};

const FilterGroupMap: Record<typeof filterGroups[number], any> = {
  cmmi: {
    'general-characteristics': [
      'alternativePaymentModelTypes',
      'alternativePaymentModelTypesNote',
      'keyCharacteristics',
      'keyCharacteristicsNote',
      'keyCharacteristicsOther',
      'participationOptions',
      'participationOptionsNote',
      'agreementTypes',
      'agreementTypesOther',
      'multiplePatricipationAgreementsNeeded',
      'multiplePatricipationAgreementsNeededNote',
      'authorityAllowances',
      'authorityAllowancesOther',
      'authorityAllowancesNote',
      'waiversRequired',
      'waiversRequiredTypes',
      'waiversRequiredNote'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'selectionMethod',
      'selectionOther',
      'selectionNote'
    ],
    beneficiaries: [
      'beneficiarySelectionMethod',
      'beneficiarySelectionOther',
      'beneficiarySelectionNote',
      'beneficiarySelectionFrequency',
      'beneficiarySelectionFrequencyOther',
      'beneficiarySelectionFrequencyNote'
    ],
    'ops-eval-and-learning': [
      'benchmarkForPerformance',
      'benchmarkForPerformanceNote',
      'computePerformanceScores',
      'computePerformanceScoresNote',
      'riskAdjustPerformance',
      'riskAdjustNote',
      'riskAdjustPayments',
      'dataNeededForMonitoring',
      'dataNeededForMonitoringOther',
      'dataNeededForMonitoringNote',
      'dataToSendParticicipants',
      'dataToSendParticicipantsOther',
      'dataToSendParticicipantsNote',
      'shareCclfData',
      'developNewQualityMeasures',
      'developNewQualityMeasuresNote',
      'qualityPerformanceImpactsPayment',
      'qualityPerformanceImpactsPaymentNote',
      'dataSharingFrequency',
      'dataSharingFrequencyOther',
      'dataSharingFrequencyNote',
      'dataCollectionFrequency',
      'dataCollectionFrequencyOther',
      'dataCollectionFrequencyNote'
    ],
    payments: [
      'payType',
      'payTypeNote',
      'payClaims',
      'payClaimsOther',
      'payClaimsNote',
      'nonClaimsPayments',
      'nonClaimsPaymentOther',
      'nonClaimsPaymentsNote',
      'canParticipantsSelectBetweenPaymentMechanisms',
      'canParticipantsSelectBetweenPaymentMechanismsHow',
      'canParticipantsSelectBetweenPaymentMechanismsNote',
      'anticipatedPaymentFrequency',
      'anticipatedPaymentFrequencyOther',
      'anticipatedPaymentFrequencyNote',
      'willRecoverPayments',
      'willRecoverPaymentsNote'
    ]
  },
  oact: {
    basics: ['nameHistory'],
    'general-characteristics': [
      'alternativePaymentModelTypes',
      'alternativePaymentModelTypesNote'
    ],
    'participants-and-providers': [
      'providerAdditionFrequency',
      'providerAdditionFrequencyOther',
      'providerAdditionFrequencyNote',
      'providerAddMethod',
      'providerAddMethodOther',
      'providerAddMethodNote',
      'providerLeaveMethod',
      'providerLeaveMethodOther',
      'providerLeaveMethodNote'
    ],
    beneficiaries: [
      'precedenceRules',
      'precedenceRulesYes',
      'precedenceRulesNo',
      'precedenceRulesNote'
    ],
    payments: [
      'fundingSource',
      'fundingSourceMedicareAInfo',
      'fundingSourceMedicareBInfo',
      'fundingSourceOther',
      'fundingSourceNote',
      'fundingSourceR',
      'fundingSourceRMedicareAInfo',
      'fundingSourceRMedicareBInfo',
      'fundingSourceROther',
      'fundingSourceRNote',
      'payClaims',
      'payClaimsOther',
      'payClaimsNote',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices',
      'waiveBeneficiaryCostSharingServiceSpecification',
      'waiveBeneficiaryCostSharingNote'
    ]
  },
  dfsdm: {
    basics: [
      'nameHistory',
      'modelType',
      'modelTypeOther',
      'goal',
      'performancePeriodStarts'
    ],
    'participants-and-providers': [
      'expectedNumberOfParticipants',
      'estimateConfidence',
      'confidenceNote'
    ],
    payments: [
      'fundingSource',
      'fundingSourceMedicareAInfo',
      'fundingSourceMedicareBInfo',
      'fundingSourceOther',
      'fundingSourceNote',
      'fundingSourceR',
      'fundingSourceRMedicareAInfo',
      'fundingSourceRMedicareBInfo',
      'fundingSourceROther',
      'fundingSourceRNote',
      'numberPaymentsPerPayCycle',
      'numberPaymentsPerPayCycleNote',
      'planningToUseInnovationPaymentContractor',
      'planningToUseInnovationPaymentContractorNote',
      'anticipatedPaymentFrequency',
      'anticipatedPaymentFrequencyOther',
      'anticipatedPaymentFrequencyNote',
      'paymentStartDate',
      'paymentStartDateNote'
    ]
  },
  ccw: {
    basics: ['nameHistory', 'performancePeriodStarts'],
    'participants-and-providers': [
      'expectedNumberOfParticipants',
      'estimateConfidence',
      'confidenceNote'
    ],
    'ops-eval-and-learning': [
      'ccmInvolvment',
      'ccmInvolvmentOther',
      'ccmInvolvmentNote',
      'sendFilesBetweenCcw',
      'sendFilesBetweenCcwNote',
      'appToSendFilesToKnown',
      'appToSendFilesToWhich',
      'appToSendFilesToNote',
      'useCcwForFileDistribiutionToParticipants',
      'useCcwForFileDistribiutionToParticipantsNote'
    ],
    payments: [
      'sharedSystemsInvolvedAdditionalClaimPayment',
      'sharedSystemsInvolvedAdditionalClaimPaymentNote'
    ]
  },
  ipc: {
    basics: [
      'nameHistory',
      'modelCategory',
      'cmsCenters',
      'cmmiGroups',
      'modelType',
      'modelTypeOther',
      'goal',
      'completeICIP',
      'clearanceStarts',
      'clearanceEnds',
      'announced',
      'applicationsStart',
      'applicationsEnd',
      'performancePeriodStarts',
      'performancePeriodEnds',
      'wrapUpEnds'
    ],
    'general-characteristics': [
      'rulemakingRequired',
      'rulemakingRequiredDescription',
      'rulemakingRequiredNote'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'expectedNumberOfParticipants',
      'estimateConfidence',
      'confidenceNote',
      'providerAdditionFrequency',
      'providerAdditionFrequencyOther',
      'providerAdditionFrequencyNote',
      'providerAddMethod',
      'providerAddMethodOther',
      'providerAddMethodNote',
      'providerLeaveMethod',
      'providerLeaveMethodOther',
      'providerLeaveMethodNote'
    ],
    payments: [
      'fundingSource',
      'fundingSourceMedicareAInfo',
      'fundingSourceMedicareBInfo',
      'fundingSourceOther',
      'fundingSourceNote',
      'fundingSourceR',
      'fundingSourceRMedicareAInfo',
      'fundingSourceRMedicareBInfo',
      'fundingSourceROther',
      'fundingSourceRNote',
      'payType',
      'payTypeNote',
      'nonClaimsPayments',
      'nonClaimsPaymentOther',
      'nonClaimsPaymentsNote',
      'numberPaymentsPerPayCycle',
      'numberPaymentsPerPayCycleNote',
      'planningToUseInnovationPaymentContractor',
      'planningToUseInnovationPaymentContractorNote',
      'anticipatedPaymentFrequency',
      'anticipatedPaymentFrequencyOther',
      'anticipatedPaymentFrequencyNote',
      'willRecoverPayments',
      'willRecoverPaymentsNote',
      'anticipateReconcilingPaymentsRetrospectively',
      'anticipateReconcilingPaymentsRetrospectivelyNote',
      'paymentDemandRecoupmentFrequency',
      'paymentDemandRecoupmentFrequencyNote',
      'paymentStartDate',
      'paymentStartDateNote'
    ]
  },
  iddoc: {
    basics: [
      'nameHistory',
      'modelType',
      'modelTypeOther',
      'goal',
      'announced',
      'performancePeriodStarts',
      'phasedIn',
      'phasedInNote'
    ],
    'general-characteristics': [
      'keyCharacteristics',
      'keyCharacteristicsNote',
      'keyCharacteristicsOther',
      'geographiesTargeted',
      'geographiesTargetedNote',
      'geographiesTargetedTypes',
      'geographiesTargetedTypesOther',
      'geographiesTargetedAppliedTo',
      'geographiesTargetedAppliedToOther',
      'rulemakingRequired',
      'rulemakingRequiredDescription',
      'rulemakingRequiredNote'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'modelApplicationLevel',
      'selectionMethod',
      'selectionOther',
      'selectionNote',
      'participantsIds',
      'participantsIdsOther',
      'participantsIdsNote',
      'providerOverlap',
      'providerOverlapHierarchy',
      'providerOverlapNote'
    ],
    beneficiaries: [
      'treatDualElligibleDifferent',
      'treatDualElligibleDifferentHow',
      'treatDualElligibleDifferentNote',
      'excludeCertainCharacteristics',
      'excludeCertainCharacteristicsCriteria',
      'excludeCertainCharacteristicsNote'
    ],
    'ops-eval-and-learning': [
      'contractorSupport',
      'contractorSupportOther',
      'contractorSupportHow',
      'contractorSupportNote',
      'iddocSupport',
      'iddocSupportNote',
      'technicalContactsIdentified',
      'technicalContactsIdentifiedDetail',
      'technicalContactsIdentifiedNote',
      'captureParticipantInfo',
      'captureParticipantInfoNote',
      'icdOwner',
      'draftIcdDueDate',
      'icdNote',
      'uatNeeds',
      'stcNeeds',
      'testingTimelines',
      'dataMonitoringFileTypes',
      'dataResponseType',
      'dataResponseFileFrequency',
      'dataFullTimeOrIncremental',
      'unsolicitedAdjustmentsIncluded',
      'produceBenefitEnhancementFiles',
      'fileNamingConventions',
      'dataNeededForMonitoring',
      'dataNeededForMonitoringOther',
      'dataNeededForMonitoringNote',
      'dataSharingStarts',
      'dataSharingStartsOther',
      'dataSharingFrequency',
      'dataSharingFrequencyOther',
      'dataSharingFrequencyNote',
      'dataCollectionStarts',
      'dataCollectionStartsOther',
      'anticipatedChallenges'
    ],
    payments: [
      'shouldAnyProvidersExcludedFFSSystems',
      'shouldAnyProviderExcludedFFSSystemsNote',
      'changesMedicarePhysicianFeeSchedule',
      'changesMedicarePhysicianFeeScheduleNote',
      'affectsMedicareSecondaryPayerClaims',
      'affectsMedicareSecondaryPayerClaimsHow',
      'affectsMedicareSecondaryPayerClaimsNote',
      'payModelDifferentiation',
      'creatingDependenciesBetweenServices',
      'creatingDependenciesBetweenServicesNote',
      'needsClaimsDataCollection',
      'needsClaimsDataCollectionNote',
      'providingThirdPartyFile',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices',
      'waiveBeneficiaryCostSharingServiceSpecification',
      'waiveBeneficiaryCostSharingNote',
      'nonClaimsPayments',
      'nonClaimsPaymentOther',
      'nonClaimsPaymentsNote',
      'waiverOnlyAppliesPartOfPayment',
      'waiveBeneficiaryCostSharingNote',
      'planningToUseInnovationPaymentContractor',
      'planningToUseInnovationPaymentContractorNote',
      'anticipateReconcilingPaymentsRetrospectively',
      'anticipateReconcilingPaymentsRetrospectivelyNote'
    ]
  },
  pbg: {
    basics: [
      'nameHistory',
      'modelType',
      'modelTypeOther',
      'goal',
      'announced',
      'performancePeriodStarts',
      'phasedIn',
      'phasedInNote'
    ],
    'general-characteristics': [
      'keyCharacteristics',
      'keyCharacteristicsNote',
      'keyCharacteristicsOther',
      'geographiesTargeted',
      'geographiesTargetedNote',
      'geographiesTargetedTypes',
      'geographiesTargetedTypesOther',
      'geographiesTargetedAppliedTo',
      'geographiesTargetedAppliedToOther',
      'rulemakingRequired',
      'rulemakingRequiredDescription',
      'rulemakingRequiredNote'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'modelApplicationLevel',
      'selectionMethod',
      'selectionOther',
      'selectionNote',
      'providerOverlap',
      'providerOverlapHierarchy',
      'providerOverlapNote'
    ],
    beneficiaries: [
      'treatDualElligibleDifferent',
      'treatDualElligibleDifferentHow',
      'treatDualElligibleDifferentNote',
      'excludeCertainCharacteristics',
      'excludeCertainCharacteristicsCriteria',
      'excludeCertainCharacteristicsNote'
    ],
    'ops-eval-and-learning': [
      'contractorSupport',
      'contractorSupportHow',
      'anticipatedChallenges'
    ],
    payments: [
      'shouldAnyProvidersExcludedFFSSystems',
      'shouldAnyProviderExcludedFFSSystemsNote',
      'changesMedicarePhysicianFeeSchedule',
      'changesMedicarePhysicianFeeScheduleNote',
      'affectsMedicareSecondaryPayerClaims',
      'affectsMedicareSecondaryPayerClaimsHow',
      'affectsMedicareSecondaryPayerClaimsNote',
      'payModelDifferentiation',
      'creatingDependenciesBetweenServices',
      'creatingDependenciesBetweenServicesNote',
      'needsClaimsDataCollection',
      'needsClaimsDataCollectionNote',
      'providingThirdPartyFile',
      'isContractorAwareTestDataRequirements',
      'waiverOnlyAppliesPartOfPayment',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices',
      'waiveBeneficiaryCostSharingServiceSpecification',
      'waiveBeneficiaryCostSharingNote',
      'nonClaimsPayments',
      'nonClaimsPaymentOther',
      'nonClaimsPaymentsNote',
      'planningToUseInnovationPaymentContractor',
      'planningToUseInnovationPaymentContractorNote',
      'anticipateReconcilingPaymentsRetrospectively',
      'anticipateReconcilingPaymentsRetrospectivelyNote'
    ]
  },
  mdm: {
    basics: ['nameHistory'],
    beneficiaries: [
      'beneficiaries',
      'beneficiariesOther',
      'beneficiariesNote',
      'numberPeopleImpacted',
      'estimateConfidence',
      'beneficiaryOverlap',
      'beneficiaryOverlapNote',
      'precedenceRules',
      'precedenceRulesYes',
      'precedenceRulesNo',
      'precedenceRulesNote'
    ]
  },
  cbosc: {
    basics: [
      'nameHistory',
      'announced',
      'applicationsStart',
      'performancePeriodStarts'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'expectedNumberOfParticipants',
      'estimateConfidence',
      'confidenceNote',
      'communicationMethod',
      'communicationMethodOther',
      'communicationMethodNote'
    ],
    'ops-eval-and-learning': [
      'stakeholders',
      'stakeholdersOther',
      'stakeholdersNote',
      'helpdeskUse',
      'helpdeskUseNote',
      'contractorSupport',
      'contractorSupportOther',
      'contractorSupportHow',
      'contractorSupportNote'
    ]
  }
};

export default FilterGroupMap;
