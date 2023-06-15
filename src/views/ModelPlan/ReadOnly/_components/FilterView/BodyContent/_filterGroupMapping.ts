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
    beneficiaries: [],
    'ops-eval-and-learning': [],
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
      'providerLeaveMethod',
      'providerOverlap'
    ],
    beneficiaries: [],
    payments: [
      'fundingSource',
      'payClaims',
      'isContractorAwareTestDataRequirements',
      'beneficiaryCostSharingLevelAndHandling',
      'waiveBeneficiaryCostSharingForAnyServices'
    ]
  },
  dfsdm: {
    basics: ['nameHistory'],
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
    'ops-eval-and-learning': [],
    payments: ['sharedSystemsInvolvedAdditionalClaimPayment']
  },
  ipc: {
    basics: ['nameHistory'],
    'general-characteristics': [
      'isNewModel',
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
      'providerOverlap'
    ],
    beneficiaries: [],
    'ops-eval-and-learning': [],
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
      'providerOverlap'
    ],
    beneficiaries: [],
    'ops-eval-and-learning': [],
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
    basics: ['nameHistory'],
    'participants-and-providers': [
      'participants',
      'howManyParticipants',
      'estimateConfidence',
      'communicationMethod'
    ],
    'ops-eval-and-learning': []
  }
};

export default FilterGroupMap;
