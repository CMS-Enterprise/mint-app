const FilterGroupMap = {
  cmmi: {
    'general-characteristics': [
      'modelAPM',
      'keyCharacteristics',
      'participationOptions',
      'agreementType',
      'moreParticipation',
      'authorityAllowed',
      'waiversRequired'
    ],
    'participants-and-providers': ['participants', 'selectionMethod'],
    beneficiaries: [
      'beneficiarySelectionMethod',
      'beneficiarySelectionFrequency'
    ],
    'ops-eval-and-learning': [
      'benchmarkForPerformance',
      'computePerformanceScores',
      'riskAdjustPerformance',
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
    'general-characteristics': ['modelAPM'],
    'participants-and-providers': [
      'providerAdditionFrequency',
      'providerAddMethod',
      'providerLeaveMethod'
    ],
    beneficiaries: ['precedenceRules'],
    payments: [
      'fundingSource',
      'payClaims',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices'
    ]
  },
  dfsdm: {
    basics: ['nameHistory', 'modelType', 'goal'],
    'participants-and-providers': ['howManyParticipants', 'estimateConfidence'],
    payments: [
      'numberPaymentsPerPayCycle',
      'planningToUseInnovationPaymentContractor',
      'fundingStructure',
      'anticipatedPaymentFrequency'
    ]
  },
  ccw: {
    basics: ['nameHistory'],
    'participants-and-providers': ['howManyParticipants', 'estimateConfidence'],
    'ops-eval-and-learning': [
      'ccmInvolvment',
      'sendFilesBetweenCcw',
      'appToSendFilesToKnown',
      'useCcwForFileDistribiutionToParticipants'
    ],
    payments: ['sharedSystemsInvolvedAdditionalClaimPayment']
  },
  ipc: {
    basics: ['nameHistory'],
    'general-characteristics': [
      'isNewModel',
      'whichExistingModel',
      'resembleModel',
      'modelResemblance',
      'waysResembleModel',
      'differentComponents'
    ],
    'participants-and-providers': [
      'participants',
      'howManyParticipants',
      'estimateConfidence'
    ],
    payments: [
      'fundingSource',
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
    basics: ['nameHistory'],
    'general-characteristics': [
      'keyCharacteristics',
      'specificGeographies',
      'geographyType',
      'geographyApplied',
      'rulemakingRequired'
    ],
    'participants-and-providers': [
      'participants',
      'modelLevel',
      'selectionMethod',
      'collectTINs',
      'providerOverlap',
      'overlapInfo'
    ],
    beneficiaries: ['dualEligibility', 'excludeCertainCharacteristics'],
    'ops-eval-and-learning': [
      'contractorSupport',
      'contractorSupport',
      'iddocSupport',
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
      'ancitipateCreatingDependencies',
      'needsClaimsDataCollection',
      'thirdParty',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices',
      'waiverOnlyAppliesPartOfPayment',
      'nonClaimsPayments',
      'planningToUseInnovationPaymentContractor',
      'anticipateReconcilingPaymentsRetrospectively'
    ]
  },
  pbg: {
    basics: ['modelType', 'goal'],
    'general-characteristics': [
      'keyCharacteristics',
      'specificGeographies',
      'geographyType',
      'geographyApplied',
      'rulemakingRequired'
    ],
    'participants-and-providers': [
      'participants',
      'modelLevel',
      'selectionMethod',
      'providerOverlap',
      'overlapInfo'
    ],
    beneficiaries: ['dualEligibility', 'excludeCertainCharacteristics'],
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
      'ancitipateCreatingDependencies',
      'needsClaimsDataCollection',
      'thirdParty',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices',
      'waiverOnlyAppliesPartOfPayment',
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
    basics: ['nameHistory'],
    'participants-and-providers': [
      'participants',
      'howManyParticipants',
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
