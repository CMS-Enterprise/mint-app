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

const FilterGroupMap: Record<typeof filterGroups[number], any> = {
  cmmi: {
    'general-characteristics': [
      'alternativePaymentModelTypes',
      'keyCharacteristics',
      'participationOptions',
      'agreementTypes',
      'multiplePatricipationAgreementsNeeded',
      'authorityAllowances',
      'waiversRequired'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'selectionMethod'
    ],
    beneficiaries: [
      'beneficiarySelectionMethod',
      'beneficiarySelectionFrequency'
    ],
    'ops-eval-and-learning': [
      'benchmarkForPerformance',
      'computePerformanceScores',
      'riskAdjustPerformance',
      'riskAdjustPayments',
      'dataNeededForMonitoring',
      'dataToSendParticicipants',
      'shareCclfData',
      'developNewQualityMeasures',
      'qualityPerformanceImpactsPayment',
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
    'general-characteristics': ['alternativePaymentModelTypes'],
    'participants-and-providers': [
      'providerAdditionFrequency',
      'providerAddMethod',
      'providerLeaveMethod'
    ],
    beneficiaries: ['precedenceRules'],
    payments: [
      'fundingSource',
      'fundingSourceR',
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
      'estimateConfidence'
    ],
    payments: [
      'fundingSource',
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
      'estimateConfidence'
    ],
    'ops-eval-and-learning': [
      'ccmInvolvment',
      'sendFilesBetweenCcw',
      'appToSendFilesToKnown',
      'useCcwForFileDistribiutionToParticipants'
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
      'goal'
    ],
    'general-characteristics': ['rulemakingRequired'],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'expectedNumberOfParticipants',
      'estimateConfidence',
      'providerAdditionFrequency',
      'providerAddMethod',
      'providerLeaveMethod'
    ],
    payments: [
      'fundingSource',
      'fundingSourceR',
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
      'phasedIn'
    ],
    'general-characteristics': [
      'keyCharacteristics',
      'geographiesTargeted',
      'geographiesTargetedTypes',
      'geographiesTargetedAppliedTo',
      'rulemakingRequired'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'modelApplicationLevel',
      'selectionMethod',
      'participantsIds',
      'providerOverlap',
      'providerOverlapHierarchy'
    ],
    beneficiaries: [
      'treatDualElligibleDifferent',
      'excludeCertainCharacteristics'
    ],
    'ops-eval-and-learning': [
      'contractorSupport',
      'contractorSupportHow',
      'iddocSupport',
      'technicalContactsIdentified',
      'captureParticipantInfo',
      'icdOwner',
      'draftIcdDueDate',
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
      'phasedIn'
    ],
    'general-characteristics': [
      'keyCharacteristics',
      'geographiesTargeted',
      'geographiesTargetedTypes',
      'geographiesTargetedAppliedTo',
      'rulemakingRequired'
    ],
    'participants-and-providers': [
      'participants',
      'medicareProviderType',
      'statesEngagement',
      'modelApplicationLevel',
      'selectionMethod',
      'providerOverlap',
      'providerOverlapHierarchy'
    ],
    beneficiaries: [
      'treatDualElligibleDifferent',
      'excludeCertainCharacteristics'
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
      'numberPeopleImpacted',
      'estimateConfidence',
      'beneficiaryOverlap',
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
      'communicationMethod'
    ],
    'ops-eval-and-learning': [
      'stakeholders',
      'helpdeskUse',
      'contractorSupport',
      'contractorSupportHow'
    ]
  }
};

export default FilterGroupMap;
