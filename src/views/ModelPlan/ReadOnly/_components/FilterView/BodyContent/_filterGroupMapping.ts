export const filterGroups = [
  'cmmi',
  'oact',
  'dfsdm',
  'ccw',
  'ipc',
  'iddoc',
  'pbg',
  'mdm',
  'cbosc'
] as const;

export type FilterGroup = typeof filterGroups[number];

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
      'dataCollectionFrequency'
    ],
    payments: [
      'payType',
      'payClaims',
      'nonClaimsPayments',
      'canParticipantsSelectBetweenPaymentMechanisms',
      'anticipatedPaymentFrequency',
      'willRecoverPayments'
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
    beneficiaries: ['precedenceRules'],
    payments: [
      'fundingSource',
      'fundingSourceTrustFund',
      'fundingSourceR',
      'fundingSourceRTrustFund',
      'payClaims',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices'
    ]
  },
  dfsdm: {
    basics: ['nameHistory', 'modelType', 'goal', 'performancePeriodStarts'],
    'participants-and-providers': [
      'expectedNumberOfParticipants',
      'estimateConfidence',
      'confidenceNote'
    ],
    payments: [
      'fundingSource',
      'fundingSourceTrustFund',
      'fundingSourceR',
      'numberPaymentsPerPayCycle',
      'planningToUseInnovationPaymentContractor',
      'anticipatedPaymentFrequency',
      'paymentStartDate'
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
    payments: ['sharedSystemsInvolvedAdditionalClaimPayment']
  },
  ipc: {
    basics: [
      'nameHistory',
      'modelCategory',
      'cmsCenters',
      'cmmiGroups',
      'modelType',
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
      'fundingSourceTrustFund',
      'fundingSourceR',
      'fundingSourceRTrustFund',
      'payType',
      'nonClaimsPayments',
      'numberPaymentsPerPayCycle',
      'planningToUseInnovationPaymentContractor',
      'anticipatedPaymentFrequency',
      'willRecoverPayments',
      'anticipateReconcilingPaymentsRetrospectively',
      'paymentStartDate'
    ]
  },
  iddoc: {
    basics: [
      'nameHistory',
      'modelType',
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
      'dataSharingFrequency',
      'dataCollectionStarts',
      'anticipatedChallenges'
    ],
    payments: [
      'shouldAnyProvidersExcludedFFSSystems',
      'changesMedicarePhysicianFeeSchedule',
      'affectsMedicareSecondaryPayerClaims',
      'payModelDifferentiation',
      'creatingDependenciesBetweenServices',
      'needsClaimsDataCollection',
      'providingThirdPartyFile',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices',
      'nonClaimsPayments',
      'waiverOnlyAppliesPartOfPayment',
      'planningToUseInnovationPaymentContractor',
      'anticipateReconcilingPaymentsRetrospectively'
    ]
  },
  pbg: {
    basics: [
      'nameHistory',
      'modelType',
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
      'changesMedicarePhysicianFeeSchedule',
      'affectsMedicareSecondaryPayerClaims',
      'payModelDifferentiation',
      'creatingDependenciesBetweenServices',
      'needsClaimsDataCollection',
      'providingThirdPartyFile',
      'isContractorAwareTestDataRequirements',
      'waiverOnlyAppliesPartOfPayment',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices',
      'nonClaimsPayments',
      'planningToUseInnovationPaymentContractor',
      'anticipateReconcilingPaymentsRetrospectively'
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
      'precedenceRules'
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
