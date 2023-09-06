const csvFields = [
  {
    label: 'Model ID',
    value: 'id'
  },
  'modelName',
  {
    label: 'Previous name',
    value: 'nameHistory'
  },
  'abbreviation',
  'status',
  {
    label: 'Created By',
    value: 'createdBy'
  },
  {
    label: 'Created At',
    value: 'createdDts'
  },
  {
    label: 'Modified By',
    value: 'modifiedBy'
  },
  {
    label: 'Modified At',
    value: 'modifiedDts'
  },

  // Basics
  'basics.modelCategory',
  'basics.amsModelID',
  'basics.demoCode',
  'basics.cmsCenters', // array
  'basics.cmmiGroups', // array
  'basics.cmsOther',
  'basics.modelType',
  'basics.problem',
  'basics.goal',
  'basics.testInterventions',
  'basics.note',
  'basics.completeICIP',
  'basics.clearanceStarts',
  'basics.clearanceEnds',
  'basics.announced',
  'basics.applicationsStart',
  'basics.applicationsEnd',
  'basics.performancePeriodStarts',
  'basics.performancePeriodEnds',
  'basics.highLevelNote',
  'basics.wrapUpEnds',
  'basics.phasedIn',
  'basics.phasedInNote',
  'basics.status',

  // General Characteristics
  'generalCharacteristics.rulemakingRequired',
  'generalCharacteristics.rulemakingRequiredDescription',
  'generalCharacteristics.rulemakingRequiredNote',
  'generalCharacteristics.authorityAllowances', // array
  'generalCharacteristics.authorityAllowancesOther',
  'generalCharacteristics.authorityAllowancesNote',
  'generalCharacteristics.waiversRequired',
  'generalCharacteristics.waiversRequiredTypes', // array
  'generalCharacteristics.waiversRequiredNote',
  'generalCharacteristics.readyForReviewBy',
  'generalCharacteristics.readyForReviewDts',
  'generalCharacteristics.status',
  'generalCharacteristics.isNewModel',
  'generalCharacteristics.existingModel',
  'generalCharacteristics.resemblesExistingModel',
  'generalCharacteristics.existingModelLinks', // array
  'generalCharacteristics.resemblesExistingModelHow',
  'generalCharacteristics.resemblesExistingModelNote',
  'generalCharacteristics.hasComponentsOrTracks',
  'generalCharacteristics.hasComponentsOrTracksDiffer',
  'generalCharacteristics.hasComponentsOrTracksNote',
  'generalCharacteristics.careCoordinationInvolved',
  'generalCharacteristics.careCoordinationInvolvedDescription',
  'generalCharacteristics.careCoordinationInvolvedNote',
  'generalCharacteristics.additionalServicesInvolved',
  'generalCharacteristics.additionalServicesInvolvedDescription',
  'generalCharacteristics.additionalServicesInvolvedNote',
  'generalCharacteristics.communityPartnersInvolved',
  'generalCharacteristics.communityPartnersInvolvedDescription',
  'generalCharacteristics.communityPartnersInvolvedNote',
  'generalCharacteristics.alternativePaymentModel',
  'generalCharacteristics.alternativePaymentModelTypes', // array
  'generalCharacteristics.alternativePaymentModelNote',
  'generalCharacteristics.keyCharacteristics', // array
  'generalCharacteristics.keyCharacteristicsNote',
  'generalCharacteristics.keyCharacteristicsOther',
  'generalCharacteristics.collectPlanBids',
  'generalCharacteristics.collectPlanBidsNote',
  'generalCharacteristics.managePartCDEnrollment',
  'generalCharacteristics.managePartCDEnrollmentNote',
  'generalCharacteristics.planContractUpdated',
  'generalCharacteristics.planContractUpdatedNote',
  'generalCharacteristics.geographiesTargeted',
  'generalCharacteristics.geographiesTargetedTypes', // array
  'generalCharacteristics.geographiesTargetedTypesOther',
  'generalCharacteristics.geographiesTargetedAppliedTo', // array
  'generalCharacteristics.geographiesTargetedAppliedToOther',
  'generalCharacteristics.geographiesTargetedNote',
  'generalCharacteristics.participationOptions',
  'generalCharacteristics.participationOptionsNote',
  'generalCharacteristics.agreementTypes', // array
  'generalCharacteristics.agreementTypesOther',
  'generalCharacteristics.multiplePatricipationAgreementsNeeded',
  'generalCharacteristics.multiplePatricipationAgreementsNeededNote',

  // Participants and Providers
  'participantsAndProviders.communicationMethod', // array
  'participantsAndProviders.communicationMethodOther',
  'participantsAndProviders.communicationNote',
  'participantsAndProviders.participantAssumeRisk',
  'participantsAndProviders.riskType',
  'participantsAndProviders.riskOther',
  'participantsAndProviders.riskNote',
  'participantsAndProviders.willRiskChange',
  'participantsAndProviders.willRiskChangeNote',
  'participantsAndProviders.coordinateWork',
  'participantsAndProviders.coordinateWorkNote',
  'participantsAndProviders.gainsharePayments',
  'participantsAndProviders.gainsharePaymentsTrack',
  'participantsAndProviders.gainsharePaymentsNote',
  'participantsAndProviders.participantsIds', // array
  'participantsAndProviders.participantsIdsOther',
  'participantsAndProviders.participantsIDSNote',
  'participantsAndProviders.expectedNumberOfParticipants',
  'participantsAndProviders.estimateConfidence',
  'participantsAndProviders.confidenceNote',
  'participantsAndProviders.recruitmentMethod',
  'participantsAndProviders.recruitmentOther',
  'participantsAndProviders.recruitmentNote',
  'participantsAndProviders.selectionMethod', // array
  'participantsAndProviders.selectionOther',
  'participantsAndProviders.selectionNote',
  'participantsAndProviders.participants', // array
  'participantsAndProviders.medicareProviderType',
  'participantsAndProviders.statesEngagement',
  'participantsAndProviders.participantsOther',
  'participantsAndProviders.participantsNote',
  'participantsAndProviders.participantsCurrentlyInModels',
  'participantsAndProviders.participantsCurrentlyInModelsNote',
  'participantsAndProviders.modelApplicationLevel',
  'participantsAndProviders.providerAdditionFrequency',
  'participantsAndProviders.providerAdditionFrequencyOther',
  'participantsAndProviders.providerAdditionFrequencyNote',
  'participantsAndProviders.providerAddMethod', // array
  'participantsAndProviders.providerAddMethodOther',
  'participantsAndProviders.providerAddMethodNote',
  'participantsAndProviders.providerLeaveMethod', // array
  'participantsAndProviders.providerLeaveMethodOther',
  'participantsAndProviders.providerLeaveMethodNote',
  'participantsAndProviders.providerOverlap',
  'participantsAndProviders.providerOverlapHierarchy',
  'participantsAndProviders.providerOverlapNote',
  'participantsAndProviders.readyForReviewBy',
  'participantsAndProviders.readyForReviewDts',
  'participantsAndProviders.status',

  // Beneficiaries
  'beneficiaries.beneficiaries', // array
  'beneficiaries.beneficiarySelectionMethod', // array
  'beneficiaries.beneficiariesNote',
  'beneficiaries.beneficiariesOther',
  'beneficiaries.beneficiaryOverlap',
  'beneficiaries.beneficiaryOverlapNote',
  'beneficiaries.beneficiarySelectionNote',
  'beneficiaries.beneficiarySelectionOther',
  'beneficiaries.beneficiarySelectionMethod',
  'beneficiaries.treatDualElligibleDifferent',
  'beneficiaries.treatDualElligibleDifferentHow',
  'beneficiaries.treatDualElligibleDifferentNote',
  'beneficiaries.excludeCertainCharacteristics',
  'beneficiaries.excludeCertainCharacteristicsCriteria',
  'beneficiaries.excludeCertainCharacteristicsNote',
  'beneficiaries.beneficiarySelectionFrequency',
  'beneficiaries.beneficiarySelectionFrequencyNote',
  'beneficiaries.beneficiarySelectionFrequencyOther',
  'beneficiaries.precedenceRules',
  'beneficiaries.status',
  'beneficiaries.numberPeopleImpacted',
  'beneficiaries.estimateConfidence',
  'beneficiaries.confidenceNote',

  // Ops and Eval Learning
  'opsEvalAndLearning.ccmInvolvment', // array
  'opsEvalAndLearning.ccmInvolvmentOther',
  'opsEvalAndLearning.ccmInvolvmentNote',
  'opsEvalAndLearning.iddocSupport',
  'opsEvalAndLearning.iddocSupportNote',
  'opsEvalAndLearning.sendFilesBetweenCcw',
  'opsEvalAndLearning.sendFilesBetweenCcwNote',
  'opsEvalAndLearning.appToSendFilesToKnown',
  'opsEvalAndLearning.appToSendFilesToWhich',
  'opsEvalAndLearning.appToSendFilesToNote',
  'opsEvalAndLearning.useCcwForFileDistribiutionToParticipants',
  'opsEvalAndLearning.useCcwForFileDistribiutionToParticipantsNote',
  'opsEvalAndLearning.developNewQualityMeasures',
  'opsEvalAndLearning.developNewQualityMeasuresNote',
  'opsEvalAndLearning.qualityPerformanceImpactsPayment',
  'opsEvalAndLearning.qualityPerformanceImpactsPaymentNote',
  'opsEvalAndLearning.dataSharingStarts',
  'opsEvalAndLearning.dataSharingStartsOther',
  'opsEvalAndLearning.dataSharingFrequency', // array
  'opsEvalAndLearning.dataSharingFrequencyOther',
  'opsEvalAndLearning.dataSharingStartsNote',
  'opsEvalAndLearning.dataCollectionStarts',
  'opsEvalAndLearning.dataCollectionStartsOther',
  'opsEvalAndLearning.dataCollectionFrequency', // array
  'opsEvalAndLearning.dataCollectionFrequencyOther',
  'opsEvalAndLearning.dataCollectionFrequencyNote',
  'opsEvalAndLearning.qualityReportingStarts',
  'opsEvalAndLearning.qualityReportingStartsOther',
  'opsEvalAndLearning.qualityReportingStartsNote',
  'opsEvalAndLearning.evaluationApproaches', // array
  'opsEvalAndLearning.evaluationApproachOther',
  'opsEvalAndLearning.evalutaionApproachNote',
  'opsEvalAndLearning.dataNeededForMonitoring', // array
  'opsEvalAndLearning.dataNeededForMonitoringOther',
  'opsEvalAndLearning.dataNeededForMonitoringNote',
  'opsEvalAndLearning.dataToSendParticicipants', // array
  'opsEvalAndLearning.dataToSendParticicipantsOther',
  'opsEvalAndLearning.dataToSendParticicipantsNote',
  'opsEvalAndLearning.shareCclfData',
  'opsEvalAndLearning.shareCclfDataNote',
  'opsEvalAndLearning.technicalContactsIdentified',
  'opsEvalAndLearning.technicalContactsIdentifiedDeta',
  'opsEvalAndLearning.technicalContactsIdentifiedNote',
  'opsEvalAndLearning.captureParticipantInfo',
  'opsEvalAndLearning.captureParticipantInfoNote',
  'opsEvalAndLearning.icdOwner',
  'opsEvalAndLearning.draftIcdDueDate',
  'opsEvalAndLearning.icdNote',
  'opsEvalAndLearning.dataFullTimeOrIncremental',
  'opsEvalAndLearning.eftSetUp',
  'opsEvalAndLearning.unsolicitedAdjustmentsIncluded',
  'opsEvalAndLearning.dataFlowDiagramsNeeded',
  'opsEvalAndLearning.produceBenefitEnhancementFiles',
  'opsEvalAndLearning.fileNamingConventions',
  'opsEvalAndLearning.dataMonitoringNote',
  'opsEvalAndLearning.uatNeeds',
  'opsEvalAndLearning.stcNeeds',
  'opsEvalAndLearning.testingTimelines',
  'opsEvalAndLearning.testingNote',
  'opsEvalAndLearning.dataMonitoringFileTypes', // array
  'opsEvalAndLearning.dataMonitoringFileOther',
  'opsEvalAndLearning.dataResponseType',
  'opsEvalAndLearning.dataResponseFileFrequency',
  'opsEvalAndLearning.modelLearningSystems', // array
  'opsEvalAndLearning.modelLearningSystemsOther',
  'opsEvalAndLearning.modelLearningSystemsNote',
  'opsEvalAndLearning.anticipatedChallenges',
  'opsEvalAndLearning.readyForReviewBy',
  'opsEvalAndLearning.readyForReviewDts',
  'opsEvalAndLearning.agencyOrStateHelp', // array
  'opsEvalAndLearning.agencyOrStateHelpOther',
  'opsEvalAndLearning.agencyOrStateHelpNote',
  'opsEvalAndLearning.stakeholders', // array
  'opsEvalAndLearning.stakeholdersOther',
  'opsEvalAndLearning.stakeholdersNote',
  'opsEvalAndLearning.helpdeskUse',
  'opsEvalAndLearning.helpdeskUseNote',
  'opsEvalAndLearning.contractorSupport', // array
  'opsEvalAndLearning.contractorSupportOther',
  'opsEvalAndLearning.contractorSupportHow',
  'opsEvalAndLearning.contractorSupportNote',
  'opsEvalAndLearning.benchmarkForPerformance',
  'opsEvalAndLearning.benchmarkForPerformanceNote',
  'opsEvalAndLearning.computePerformanceScores',
  'opsEvalAndLearning.computePerformanceScoresNote',
  'opsEvalAndLearning.riskAdjustPerformance',
  'opsEvalAndLearning.riskAdjustFeedback',
  'opsEvalAndLearning.riskAdjustPayments',
  'opsEvalAndLearning.riskAdjustOther',
  'opsEvalAndLearning.riskAdjustNote',
  'opsEvalAndLearning.appealPerformance',
  'opsEvalAndLearning.appealFeedback',
  'opsEvalAndLearning.appealPayments',
  'opsEvalAndLearning.appealOther',
  'opsEvalAndLearning.appealNote',
  'opsEvalAndLearning.status',

  // Payments
  'payments.payType', // array
  'payments.payTypeNote',
  'payments.payClaims', // array
  'payments.payClaimsNote',
  'payments.payClaimsOther',
  'payments.creatingDependenciesBetweenServices',
  'payments.creatingDependenciesBetweenServicesNote',
  'payments.needsClaimsDataCollection',
  'payments.needsClaimsDataCollectionNote',
  'payments.providingThirdPartyFile',
  'payments.isContractorAwareTestDataRequirements',
  'payments.beneficiaryCostSharingLevelAndHandling',
  'payments.waiveBeneficiaryCostSharingForAnyServices',
  'payments.waiveBeneficiaryCostSharingServiceSpecification',
  'payments.waiverOnlyAppliesPartOfPayment',
  'payments.waiveBeneficiaryCostSharingNote',
  'payments.shouldAnyProvidersExcludedFFSSystems',
  'payments.shouldAnyProviderExcludedFFSSystemsNote',
  'payments.changesMedicarePhysicianFeeSchedule',
  'payments.changesMedicarePhysicianFeeScheduleNote',
  'payments.affectsMedicareSecondaryPayerClaims',
  'payments.affectsMedicareSecondaryPayerClaimsHow',
  'payments.affectsMedicareSecondaryPayerClaimsNote',
  'payments.payModelDifferentiation',
  'payments.expectedCalculationComplexityLevel',
  'payments.expectedCalculationComplexityLevelNote',
  'payments.canParticipantsSelectBetweenPaymentMechanisms',
  'payments.canParticipantsSelectBetweenPaymentMechanismsHow',
  'payments.canParticipantsSelectBetweenPaymentMechanismsNote',
  'payments.anticipatedPaymentFrequency', // array
  'payments.anticipatedPaymentFrequencyOther',
  'payments.anticipatedPaymentFrequencyNote',
  'payments.fundingSource', // array
  'payments.fundingSourceOther',
  'payments.fundingSourceNote',
  'payments.fundingSourceR', // array
  'payments.fundingSourceROther',
  'payments.fundingSourceRNote',
  'payments.payRecipients', // array
  'payments.payRecipientsOtherSpecification',
  'payments.payRecipientsNote',
  'payments.nonClaimsPayments', // array
  'payments.nonClaimsPaymentOther',
  'payments.paymentCalculationOwner',
  'payments.numberPaymentsPerPayCycle',
  'payments.numberPaymentsPerPayCycleNote',
  'payments.sharedSystemsInvolvedAdditionalClaimPayment',
  'payments.sharedSystemsInvolvedAdditionalClaimPaymentNote',
  'payments.planningToUseInnovationPaymentContractor',
  'payments.planningToUseInnovationPaymentContractorNote',
  'payments.willRecoverPayments',
  'payments.willRecoverPaymentsNote',
  'payments.anticipateReconcilingPaymentsRetrospectively',
  'payments.anticipateReconcilingPaymentsRetrospectivelyNote',
  'payments.paymentStartDate',
  'payments.paymentStartDateNote',
  'payments.status',

  // Collaborators
  {
    label: 'Collaborator EUA ID',
    value: 'collaborators.userAccount.username'
  },
  {
    label: 'Collaborator User name',
    value: 'collaborators.userAccount.commonName'
  },
  {
    label: 'Collaborator Team member role',
    value: 'collaborators.userAccount.username'
  },

  // Discussions
  {
    label: 'Discussion content',
    value: 'discussions.content'
  },
  {
    label: 'Discussion Created by',
    value: 'discussions.createdBy'
  },
  {
    label: 'Discussion Created',
    value: 'discussions.createdDts'
  },
  {
    label: 'Discussion Status',
    value: 'discussions.status'
  },

  // Discussion Replies
  {
    label: 'Discussion ID',
    value: 'replies.content'
  },
  {
    label: 'Discussion content',
    value: 'replies.content'
  },
  {
    label: 'Reply created by',
    value: 'replies.createdBy'
  },
  {
    label: 'Reply Created',
    value: 'replies.createdDts'
  },
  {
    label: 'Reply resolution',
    value: 'replies.resolution'
  }
];

const fieldsToUnwind = [
  'collaborators',
  'nameHistory',
  'basics.cmsCenters',
  'basics.cmmiGroups',
  'beneficiaries.beneficiaries',
  'beneficiaries.beneficiarySelectionMethod',
  'discussions',
  'discussions.replies',
  'generalCharacteristics.authorityAllowances',
  'generalCharacteristics.waiversRequiredTypes',
  'generalCharacteristics.resemblesExistingModelWhich',
  'generalCharacteristics.alternativePaymentModelTypes',
  'generalCharacteristics.keyCharacteristics',
  'generalCharacteristics.geographiesTargetedTypes',
  'generalCharacteristics.geographiesTargetedAppliedTo',
  'generalCharacteristics.agreementTypes',
  'opsEvalAndLearning.agencyOrStateHelp',
  'opsEvalAndLearning.ccmInvolvment',
  'opsEvalAndLearning.contractorSupport',
  'opsEvalAndLearning.dataCollectionFrequency',
  'opsEvalAndLearning.dataMonitoringFileTypes',
  'opsEvalAndLearning.dataNeededForMonitoring',
  'opsEvalAndLearning.dataSharingFrequency',
  'opsEvalAndLearning.dataToSendParticicipants',
  'opsEvalAndLearning.evaluationApproaches',
  'opsEvalAndLearning.modelLearningSystems',
  'opsEvalAndLearning.stakeholders',
  'participantsAndProviders.communicationMethod',
  'participantsAndProviders.participants',
  'participantsAndProviders.participantsIds',
  'participantsAndProviders.providerAddMethod',
  'participantsAndProviders.providerLeaveMethod',
  'participantsAndProviders.selectionMethod',
  'payments.anticipatedPaymentFrequency',
  'payments.fundingSource',
  'payments.fundingSourceR',
  'payments.nonClaimsPayments',
  'payments.payClaims',
  'payments.payRecipients',
  'payments.payType'
];

export { csvFields, fieldsToUnwind };
