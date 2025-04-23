import { ModelShareSection } from 'gql/generated/graphql';
import i18next from 'i18next';

type CSVLabel = {
  label: string;
  value: string;
};

const csvFieldsModelPlan: (CSVLabel | string)[] = [
  {
    label: i18next.t<string, {}, string>('modelPlanMisc:modelID'),
    value: 'id'
  },
  'modelName',
  {
    label: i18next.t<string, {}, string>('modelPlan:previousName.label'),
    value: 'nameHistory'
  },
  'abbreviation',
  {
    label: i18next.t<string, {}, string>('modelPlan:archived.label'),
    value: 'archived'
  },
  {
    label: i18next.t<string, {}, string>('modelPlanMisc:createdBy'),
    value: 'createdByUserAccount.commonName'
  },
  {
    label: i18next.t<string, {}, string>('modelPlanMisc:createdAt'),
    value: 'createdDts'
  },
  'status',

  // Basics
  'basics.modelCategory',
  'basics.amsModelID',
  'basics.demoCode',
  'basics.cmsCenters', // array
  'basics.cmmiGroups', // array
  'basics.modelType',
  'basics.modelTypeOther',
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
  'basics.readyForReviewByUserAccount.commonName',
  'basics.readyForReviewDts',
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
  'generalCharacteristics.isNewModel',
  'generalCharacteristics.existingModel',
  'generalCharacteristics.resemblesExistingModel',
  'generalCharacteristics.resemblesExistingModelWhyHow',
  'generalCharacteristics.resemblesExistingModelHow',
  'generalCharacteristics.resemblesExistingModelOtherSpecify',
  'generalCharacteristics.resemblesExistingModelWhich',
  'generalCharacteristics.resemblesExistingModelOtherOption',
  'generalCharacteristics.resemblesExistingModelNote',
  'generalCharacteristics.participationInModelPrecondition',
  'generalCharacteristics.participationInModelPreconditionOtherSpecify',
  'generalCharacteristics.participationInModelPreconditionWhich',
  'generalCharacteristics.participationInModelPreconditionOtherOption',
  'generalCharacteristics.participationInModelPreconditionWhyHow',
  'generalCharacteristics.participationInModelPreconditionNote',
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
  'generalCharacteristics.agencyOrStateHelp', // array
  'generalCharacteristics.agencyOrStateHelpOther',
  'generalCharacteristics.agencyOrStateHelpNote',
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
  'generalCharacteristics.geographiesStatesAndTerritories', // array
  'generalCharacteristics.geographiesRegionTypes', // array
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
  'generalCharacteristics.readyForReviewByUserAccount.commonName',
  'generalCharacteristics.readyForReviewDts',
  'generalCharacteristics.status',

  // Participants and Providers
  'participantsAndProviders.participantAddedFrequency',
  'participantsAndProviders.participantAddedFrequencyContinually',
  'participantsAndProviders.participantAddedFrequencyOther',
  'participantsAndProviders.participantAddedFrequencyNote',
  'participantsAndProviders.participantRemovedFrequency',
  'participantsAndProviders.participantRemovedFrequencyContinually',
  'participantsAndProviders.participantRemovedFrequencyOther',
  'participantsAndProviders.participantRemovedFrequencyNote',
  'participantsAndProviders.communicationMethod', // array
  'participantsAndProviders.communicationMethodOther',
  'participantsAndProviders.communicationNote',
  'participantsAndProviders.riskType',
  'participantsAndProviders.riskOther',
  'participantsAndProviders.riskNote',
  'participantsAndProviders.willRiskChange',
  'participantsAndProviders.willRiskChangeNote',
  'participantsAndProviders.participantRequireFinancialGuarantee',
  'participantsAndProviders.participantRequireFinancialGuaranteeType', // array
  'participantsAndProviders.participantRequireFinancialGuaranteeOther',
  'participantsAndProviders.participantRequireFinancialGuaranteeNote',
  'participantsAndProviders.coordinateWork',
  'participantsAndProviders.coordinateWorkNote',
  'participantsAndProviders.gainsharePayments',
  'participantsAndProviders.gainsharePaymentsTrack',
  'participantsAndProviders.gainsharePaymentsEligibility',
  'participantsAndProviders.gainsharePaymentsEligibilityOther',
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
  'participantsAndProviders.isNewTypeOfProvidersOrSuppliers',
  'participantsAndProviders.statesEngagement',
  'participantsAndProviders.participantsOther',
  'participantsAndProviders.participantsNote',
  'participantsAndProviders.participantsCurrentlyInModels',
  'participantsAndProviders.participantsCurrentlyInModelsNote',
  'participantsAndProviders.modelApplicationLevel',
  'participantsAndProviders.providerAdditionFrequency',
  'participantsAndProviders.providerAdditionFrequencyContinually',
  'participantsAndProviders.providerAdditionFrequencyOther',
  'participantsAndProviders.providerAdditionFrequencyNote',
  'participantsAndProviders.providerAddMethod', // array
  'participantsAndProviders.providerAddMethodOther',
  'participantsAndProviders.providerAddMethodNote',
  'participantsAndProviders.providerLeaveMethod', // array
  'participantsAndProviders.providerLeaveMethodOther',
  'participantsAndProviders.providerLeaveMethodNote',
  'participantsAndProviders.providerRemovalFrequency',
  'participantsAndProviders.providerRemovalFrequencyContinually',
  'participantsAndProviders.providerRemovalFrequencyOther',
  'participantsAndProviders.providerRemovalFrequencyNote',
  'participantsAndProviders.providerOverlap',
  'participantsAndProviders.providerOverlapHierarchy',
  'participantsAndProviders.providerOverlapNote',
  'participantsAndProviders.readyForReviewByUserAccount.commonName',
  'participantsAndProviders.readyForReviewDts',
  'participantsAndProviders.status',

  // Beneficiaries
  'beneficiaries.beneficiaries', // array
  'beneficiaries.beneficiariesNote',
  'beneficiaries.beneficiariesOther',
  'beneficiaries.beneficiaryOverlap',
  'beneficiaries.beneficiaryOverlapNote',
  'beneficiaries.beneficiarySelectionNote',
  'beneficiaries.beneficiarySelectionOther',
  'beneficiaries.beneficiarySelectionMethod', // array
  'beneficiaries.treatDualElligibleDifferent',
  'beneficiaries.treatDualElligibleDifferentHow',
  'beneficiaries.treatDualElligibleDifferentNote',
  'beneficiaries.excludeCertainCharacteristics',
  'beneficiaries.excludeCertainCharacteristicsCriteria',
  'beneficiaries.excludeCertainCharacteristicsNote',
  'beneficiaries.beneficiarySelectionFrequency',
  'beneficiaries.beneficiarySelectionFrequencyContinually',
  'beneficiaries.beneficiarySelectionFrequencyNote',
  'beneficiaries.beneficiarySelectionFrequencyOther',
  'beneficiaries.beneficiaryRemovalFrequency',
  'beneficiaries.beneficiaryRemovalFrequencyContinually',
  'beneficiaries.beneficiaryRemovalFrequencyNote',
  'beneficiaries.beneficiaryRemovalFrequencyOther',
  'beneficiaries.precedenceRules',
  'beneficiaries.precedenceRulesYes',
  'beneficiaries.precedenceRulesNo',
  'beneficiaries.precedenceRulesNote',
  'beneficiaries.numberPeopleImpacted',
  'beneficiaries.estimateConfidence',
  'beneficiaries.confidenceNote',
  'beneficiaries.readyForReviewByUserAccount.commonName',
  'beneficiaries.readyForReviewDts',
  'beneficiaries.status',

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
  'opsEvalAndLearning.dataSharingFrequencyContinually',
  'opsEvalAndLearning.dataSharingFrequencyOther',
  'opsEvalAndLearning.dataSharingStartsNote',
  'opsEvalAndLearning.dataCollectionStarts',
  'opsEvalAndLearning.dataCollectionStartsOther',
  'opsEvalAndLearning.dataCollectionFrequency', // array
  'opsEvalAndLearning.dataCollectionFrequencyContinually',
  'opsEvalAndLearning.dataCollectionFrequencyOther',
  'opsEvalAndLearning.dataCollectionFrequencyNote',
  'opsEvalAndLearning.qualityReportingStarts',
  'opsEvalAndLearning.qualityReportingStartsOther',
  'opsEvalAndLearning.qualityReportingStartsNote',
  'opsEvalAndLearning.qualityReportingFrequency', // array
  'opsEvalAndLearning.qualityReportingFrequencyContinually',
  'opsEvalAndLearning.qualityReportingFrequencyOther',
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
  'opsEvalAndLearning.technicalContactsIdentifiedDetail',
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
  'opsEvalAndLearning.readyForReviewByUserAccount.commonName',
  'opsEvalAndLearning.readyForReviewDts',
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
  'payments.willBePaymentAdjustments',
  'payments.willBePaymentAdjustmentsNote',
  'payments.expectedCalculationComplexityLevel',
  'payments.expectedCalculationComplexityLevelNote',
  'payments.claimsProcessingPrecedence',
  'payments.claimsProcessingPrecedenceOther',
  'payments.claimsProcessingPrecedenceNote',
  'payments.canParticipantsSelectBetweenPaymentMechanisms',
  'payments.canParticipantsSelectBetweenPaymentMechanismsHow',
  'payments.canParticipantsSelectBetweenPaymentMechanismsNote',
  'payments.anticipatedPaymentFrequency', // array
  'payments.anticipatedPaymentFrequencyContinually',
  'payments.anticipatedPaymentFrequencyOther',
  'payments.anticipatedPaymentFrequencyNote',
  'payments.fundingSource', // array
  'payments.fundingSourcePatientProtectionInfo',
  'payments.fundingSourceMedicareAInfo',
  'payments.fundingSourceMedicareBInfo',
  'payments.fundingSourceOther',
  'payments.fundingSourceNote',
  'payments.fundingSourceR', // array
  'payments.fundingSourceRPatientProtectionInfo',
  'payments.fundingSourceRMedicareAInfo',
  'payments.fundingSourceRMedicareBInfo',
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
  'payments.paymentReconciliationFrequency',
  'payments.paymentReconciliationFrequencyContinually',
  'payments.paymentReconciliationFrequencyOther',
  'payments.paymentReconciliationFrequencyNote',
  'payments.paymentDemandRecoupmentFrequency',
  'payments.paymentDemandRecoupmentFrequencyContinually',
  'payments.paymentDemandRecoupmentFrequencyOther',
  'payments.paymentDemandRecoupmentFrequencyNote',
  'payments.paymentStartDate',
  'payments.paymentStartDateNote',
  'payments.readyForReviewByUserAccount.commonName',
  'payments.readyForReviewDts',
  'payments.status',

  // Data Exchange Approach
  'dataExchangeApproach.dataToCollectFromParticipants',
  'dataExchangeApproach.dataToCollectFromParticipantsReportsDetails',
  'dataExchangeApproach.dataToCollectFromParticipantsOther',
  'dataExchangeApproach.dataWillNotBeCollectedFromParticipants',
  'dataExchangeApproach.dataToCollectFromParticipantsNote',
  'dataExchangeApproach.dataToSendToParticipants',
  'dataExchangeApproach.dataToSendToParticipantsNote',
  'dataExchangeApproach.doesNeedToMakeMultiPayerDataAvailable',
  'dataExchangeApproach.anticipatedMultiPayerDataAvailabilityUseCase',
  'dataExchangeApproach.doesNeedToMakeMultiPayerDataAvailableNote',
  'dataExchangeApproach.doesNeedToCollectAndAggregateMultiSourceData',
  'dataExchangeApproach.multiSourceDataToCollect',
  'dataExchangeApproach.multiSourceDataToCollectOther',
  'dataExchangeApproach.doesNeedToCollectAndAggregateMultiSourceDataNote',
  'dataExchangeApproach.willImplementNewDataExchangeMethods',
  'dataExchangeApproach.newDataExchangeMethodsDescription',
  'dataExchangeApproach.newDataExchangeMethodsNote',
  'dataExchangeApproach.additionalDataExchangeConsiderationsDescription',
  'dataExchangeApproach.isDataExchangeApproachComplete',
  'dataExchangeApproach.markedCompleteByUserAccount.commonName',
  'dataExchangeApproach.markedCompleteDts',
  'dataExchangeApproach.status',

  // Collaborators
  {
    label: `${i18next.t<string, {}, string>(
      'collaboratorsMisc:csvTitle'
    )} ${i18next.t<string, {}, string>('collaboratorsMisc:EUAID')}`,
    value: 'collaborators.userAccount.username'
  },
  {
    label: `${i18next.t<string, {}, string>(
      'collaboratorsMisc:csvTitle'
    )} ${i18next.t<string, {}, string>('collaborators:username.label')}`,
    value: 'collaborators.userAccount.commonName'
  },
  {
    label: `${i18next.t<string, {}, string>(
      'collaboratorsMisc:csvTitle'
    )} ${i18next.t<string, {}, string>('collaborators:teamRoles.label')}`,
    value: 'collaborators.teamRoles'
  },

  // Discussions
  {
    label: i18next.t<string, {}, string>(
      'discussionsMisc:discussionCSV.content'
    ),
    value: 'discussions.content.rawContent'
  },
  {
    label: i18next.t<string, {}, string>(
      'discussionsMisc:discussionCSV.createdBy'
    ),
    value: 'discussions.createdByUserAccount.commonName'
  },
  {
    label: i18next.t<string, {}, string>(
      'discussionsMisc:discussionCSV.userRole'
    ),
    value: 'discussions.userRole'
  },
  {
    label: i18next.t<string, {}, string>(
      'discussionsMisc:discussionCSV.userRoleDescription'
    ),
    value: 'discussions.userRoleDescription'
  },
  {
    label: i18next.t<string, {}, string>(
      'discussionsMisc:discussionCSV.createdAt'
    ),
    value: 'discussions.createdDts'
  },

  // Discussion Replies
  {
    label: i18next.t<string, {}, string>('discussionsMisc:replyCSV.content'),
    value: 'discussions.replies.content.rawContent'
  },
  {
    label: i18next.t<string, {}, string>('discussionsMisc:replyCSV.createdBy'),
    value: 'discussions.replies.createdByUserAccount.commonName'
  },
  {
    label: i18next.t<string, {}, string>('discussionsMisc:replyCSV.userRole'),
    value: 'discussions.replies.userRole'
  },
  {
    label: i18next.t<string, {}, string>(
      'discussionsMisc:replyCSV.userRoleDescription'
    ),
    value: 'discussions.replies.userRoleDescription'
  },
  {
    label: i18next.t<string, {}, string>('discussionsMisc:replyCSV.createdAt'),
    value: 'discussions.replies.createdDts'
  }
];

const csvFieldsMTOMilestone: (CSVLabel | string)[] = [
  'mtoMilestone.name',
  'mtoMilestone.isDraft',
  {
    label: i18next.t<string, {}, string>(
      'modelToOperationsMisc:modal.milestone.milestoneCategory.label'
    ),
    value: 'mtoMilestone.categories.category.name'
  },
  {
    label: i18next.t<string, {}, string>(
      'modelToOperationsMisc:modal.milestone.milestoneSubcategory.label'
    ),
    value: 'mtoMilestone.categories.subCategory.name'
  },
  'mtoMilestone.facilitatedBy',
  'mtoMilestone.needBy',
  'mtoMilestone.status',
  'mtoMilestone.riskIndicator',
  'mtoMilestone.solutions'
];

const csvFieldsMTOSolution: (CSVLabel | string)[] = [
  'mtoSolution.name',
  'mtoSolution.facilitatedBy',
  'mtoSolution.neededBy',
  'mtoSolution.status',
  'mtoSolution.riskIndicator',
  'mtoSolution.milestones'
];

const csvFieldsMTO: (CSVLabel | string)[] = [
  ...csvFieldsMTOMilestone,
  ...csvFieldsMTOSolution,
  'mtoCategory.name',
  'modelToOperations.readyForReviewBy',
  'modelToOperations.readyForReviewDTS'
];

const csvFields: Record<ModelShareSection, (CSVLabel | string)[]> = {
  [ModelShareSection.MODEL_PLAN]: csvFieldsModelPlan,
  [ModelShareSection.MTO_ALL]: csvFieldsMTO,
  [ModelShareSection.MTO_MILESTONES]: csvFieldsMTOMilestone,
  [ModelShareSection.MTO_SOLUTIONS]: csvFieldsMTOSolution
};

const fieldsToUnwind: string[] = [
  'collaborators',
  'discussions',
  'discussions.replies',
  'mtoMilestone',
  'mtoSolution'
];

export { csvFields, fieldsToUnwind };
