import {
  AgencyOrStateHelpType,
  AgreementType,
  AlternativePaymentModelType,
  AuthorityAllowance,
  BenchmarkForPerformanceType,
  BeneficiariesType,
  CcmInvolvmentType,
  ClaimsBasedPayType,
  CmmiGroup,
  CmsCenter,
  ComplexityCalculationLevelType,
  ConfidenceType,
  ContractorSupportType,
  DataForMonitoringType,
  DataFullTimeOrIncrementalType,
  DataStartsType,
  DataToSendParticipantsType,
  EvaluationApproachType,
  FrequencyType,
  FundingSource,
  GainshareArrangementEligibility,
  GeographyApplication,
  GeographyRegionType,
  GeographyType,
  GetAllBasicsDocument,
  GetAllBasicsQuery,
  GetAllBeneficiariesDocument,
  GetAllBeneficiariesQuery,
  GetAllGeneralCharacteristicsDocument,
  GetAllGeneralCharacteristicsQuery,
  GetAllOpsEvalAndLearningDocument,
  GetAllOpsEvalAndLearningQuery,
  GetAllParticipantsAndProvidersDocument,
  GetAllParticipantsAndProvidersQuery,
  GetAllPaymentsDocument,
  GetAllPaymentsQuery,
  GetModelCollaboratorsDocument,
  GetModelCollaboratorsQuery,
  GetModelSummaryDocument,
  GetModelSummaryQuery,
  GetOperationalNeedsDocument,
  GetOperationalNeedsQuery,
  KeyCharacteristic,
  ModelCategory,
  ModelLearningSystemType,
  ModelStatus,
  ModelType,
  MonitoringFileType,
  NonClaimsBasedPayType,
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus,
  OverlapType,
  ParticipantCommunicationType,
  ParticipantRequireFinancialGuaranteeType,
  ParticipantRiskType,
  ParticipantSelectionType,
  ParticipantsIdType,
  ParticipantsType,
  PayRecipient,
  PayType,
  ProviderAddType,
  ProviderLeaveType,
  RecruitmentType,
  SelectionMethodType,
  StakeholdersType,
  StatesAndTerritories,
  TaskStatus,
  TeamRole,
  TriStateAnswer,
  WaiverType,
  YesNoOtherType,
  YesNoType
} from 'gql/gen/graphql';

export const modelID: string = 'f11eb129-2c80-4080-9440-439cbe1a286f';

type GetAllBasicsTypes = GetAllBasicsQuery['modelPlan']['basics'];
type GetAllGeneralCharacteristicsTypes = GetAllGeneralCharacteristicsQuery['modelPlan']['generalCharacteristics'];
type GetAllParticipantsTypes = GetAllParticipantsAndProvidersQuery['modelPlan']['participantsAndProviders'];
type AllBeneficiariesTypes = GetAllBeneficiariesQuery['modelPlan']['beneficiaries'];
type AllOpsEvalAndLearningTypes = GetAllOpsEvalAndLearningQuery['modelPlan']['opsEvalAndLearning'];
type PaymentTypes = GetAllPaymentsQuery['modelPlan']['payments'];
type GetModelCollaboratorsType = GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];
type GetModelSummaryTypes = GetModelSummaryQuery['modelPlan'];
type GetOperationalNeedsType = GetOperationalNeedsQuery;

const modelBasicsData: GetAllBasicsTypes = {
  __typename: 'PlanBasics',
  id: '123',
  demoCode: '1234',
  amsModelID: '43532323',
  modelCategory: ModelCategory.STATE_BASED,
  additionalModelCategories: [ModelCategory.ACCOUNTABLE_CARE],
  cmsCenters: [
    CmsCenter.CENTER_FOR_MEDICARE,
    CmsCenter.CENTER_FOR_MEDICAID_AND_CHIP_SERVICES
  ],
  cmmiGroups: [
    CmmiGroup.STATE_AND_POPULATION_HEALTH_GROUP,
    CmmiGroup.POLICY_AND_PROGRAMS_GROUP
  ],
  modelType: [ModelType.MANDATORY_NATIONAL],
  modelTypeOther: 'Other model',
  problem: 'There is not enough candy',
  goal: 'To get more candy',
  testInterventions: 'The great candy machine',
  note: "The machine doesn't work yet",
  completeICIP: '2022-06-03T19:32:24.412662Z',
  clearanceStarts: '2022-06-03T19:32:24.412662Z',
  clearanceEnds: '2022-06-03T19:32:24.412662Z',
  announced: '2022-06-03T19:32:24.412662Z',
  applicationsStart: '2022-06-03T19:32:24.412662Z',
  applicationsEnd: '2022-06-03T19:32:24.412662Z',
  performancePeriodStarts: '2022-06-03T19:32:24.412662Z',
  performancePeriodEnds: '2022-06-03T19:32:24.412662Z',
  wrapUpEnds: '2022-06-03T19:32:24.412662Z',
  highLevelNote: 'Theses are my best guess notes',
  phasedIn: false,
  phasedInNote: "This can't be phased in",
  status: TaskStatus.IN_PROGRESS
};

export const modelBasicsMocks = [
  {
    request: {
      query: GetAllBasicsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          nameHistory: ['First Name', 'Second Name'],
          basics: modelBasicsData
        }
      }
    }
  }
];

const generalCharacteristicData: GetAllGeneralCharacteristicsTypes = {
  __typename: 'PlanGeneralCharacteristics',
  id: '123',
  isNewModel: false,
  existingModel: 'Accountable Care Organizations (ACOs): General Information',
  resemblesExistingModel: YesNoOtherType.YES,
  resemblesExistingModelWhich: {
    __typename: 'ExistingModelLinks',
    names: ['name']
  },
  resemblesExistingModelWhyHow: 'We think it is right',
  resemblesExistingModelHow: null,
  resemblesExistingModelOtherSpecify: '',
  resemblesExistingModelOtherOption: 'Other model',
  resemblesExistingModelOtherSelected: true,
  resemblesExistingModelNote: 'THIS IS A NEW NOTE',
  participationInModelPrecondition: YesNoOtherType.YES,
  participationInModelPreconditionWhyHow: 'It is a condition',
  participationInModelPreconditionOtherSpecify: '',
  participationInModelPreconditionOtherOption: 'Other model',
  participationInModelPreconditionOtherSelected: true,
  participationInModelPreconditionWhich: {
    __typename: 'ExistingModelLinks',
    names: ['name']
  },
  participationInModelPreconditionNote: 'Precondition note',
  hasComponentsOrTracks: true,
  hasComponentsOrTracksDiffer: 'In every way',
  hasComponentsOrTracksNote: 'Tracks note',
  agencyOrStateHelp: [
    AgencyOrStateHelpType.YES_STATE,
    AgencyOrStateHelpType.OTHER
  ],
  agencyOrStateHelpOther: 'Agency other',
  agencyOrStateHelpNote: 'State note',
  alternativePaymentModelTypes: [
    AlternativePaymentModelType.REGULAR,
    AlternativePaymentModelType.MIPS
  ],
  alternativePaymentModelNote: 'asdfasd',
  keyCharacteristics: [
    KeyCharacteristic.POPULATION_BASED,
    KeyCharacteristic.PAYMENT,
    KeyCharacteristic.SERVICE_DELIVERY,
    KeyCharacteristic.OTHER
  ],
  keyCharacteristicsOther: 'Custom characteristic',
  keyCharacteristicsNote: 'test',
  collectPlanBids: true,
  collectPlanBidsNote: 'Collect bids note',
  managePartCDEnrollment: true,
  managePartCDEnrollmentNote: 'Manage enrollment note',
  planContractUpdated: true,
  planContractUpdatedNote: 'Contract updated note',
  careCoordinationInvolved: true,
  careCoordinationInvolvedDescription: 'Care description',
  careCoordinationInvolvedNote: 'Care note',
  additionalServicesInvolved: true,
  additionalServicesInvolvedDescription: 'Lots of additional services',
  additionalServicesInvolvedNote: 'Additional services note',
  communityPartnersInvolved: true,
  communityPartnersInvolvedDescription: 'Are community partners involved?\n\n',
  communityPartnersInvolvedNote: 'frwegqergqgrqwg planContractUpdatedNote',
  geographiesTargeted: true,
  geographiesTargetedTypes: [
    GeographyType.OTHER,
    GeographyType.STATE,
    GeographyType.REGION
  ],
  geographiesStatesAndTerritories: [
    StatesAndTerritories.CA,
    StatesAndTerritories.IN
  ],
  geographiesRegionTypes: [GeographyRegionType.CBSA],
  geographiesTargetedTypesOther: 'Geography type other',
  geographiesTargetedAppliedTo: [
    GeographyApplication.BENEFICIARIES,
    GeographyApplication.OTHER
  ],
  geographiesTargetedAppliedToOther: 'Geography applied other',
  geographiesTargetedNote: 'Geography note',
  participationOptions: true,
  participationOptionsNote: 'Participation options note',
  agreementTypes: [AgreementType.OTHER],
  agreementTypesOther: 'Other agreement',
  multiplePatricipationAgreementsNeeded: true,
  multiplePatricipationAgreementsNeededNote: 'We will need agreements',
  rulemakingRequired: true,
  rulemakingRequiredDescription: 'Lots of rules',
  rulemakingRequiredNote: 'My rulemaking note',
  authorityAllowances: [AuthorityAllowance.ACA, AuthorityAllowance.OTHER],
  authorityAllowancesOther: 'Other allowance',
  authorityAllowancesNote: 'Allowance note',
  waiversRequired: true,
  waiversRequiredTypes: [WaiverType.FRAUD_ABUSE, WaiverType.MEDICAID],
  waiversRequiredNote: 'My waiver note',
  status: TaskStatus.IN_PROGRESS
};

export const generalCharacteristicMocks = [
  {
    request: {
      query: GetAllGeneralCharacteristicsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          existingModelLinks: [],
          generalCharacteristics: generalCharacteristicData
        }
      }
    }
  }
];

const participantsAndProvidersData: GetAllParticipantsTypes = {
  __typename: 'PlanParticipantsAndProviders',
  id: '123',
  participants: [
    ParticipantsType.MEDICAID_PROVIDERS,
    ParticipantsType.STATES,
    ParticipantsType.STATE_MEDICAID_AGENCIES,
    ParticipantsType.OTHER
  ],
  medicareProviderType: null,
  isNewTypeOfProvidersOrSuppliers: true,
  statesEngagement: 'State',
  participantsOther: 'This is the other',
  participantsNote: 'Participant note',
  participantsCurrentlyInModels: true,
  participantsCurrentlyInModelsNote: 'Parts in model',
  modelApplicationLevel: 'App level',
  expectedNumberOfParticipants: 0,
  estimateConfidence: ConfidenceType.FAIRLY,
  confidenceNote: 'Confidence note',
  recruitmentMethod: RecruitmentType.NA,
  recruitmentOther: 'Other recruitment',
  recruitmentNote: 'Recruitment note',
  selectionMethod: [
    ParticipantSelectionType.APPLICATION_REVIEW_AND_SCORING_TOOL,
    ParticipantSelectionType.CMS_COMPONENT_OR_PROCESS
  ],
  selectionOther: 'Selection other',
  selectionNote: 'Note selection',
  participantAddedFrequency: [FrequencyType.CONTINUALLY],
  participantAddedFrequencyContinually: 'participant added continually',
  participantAddedFrequencyOther: '',
  participantAddedFrequencyNote: 'My note',
  participantRemovedFrequency: [FrequencyType.OTHER],
  participantRemovedFrequencyContinually: '',
  participantRemovedFrequencyOther: 'participant added other',
  participantRemovedFrequencyNote: 'Second note',
  communicationMethod: [
    ParticipantCommunicationType.IT_TOOL,
    ParticipantCommunicationType.MASS_EMAIL
  ],
  communicationMethodOther: 'Comm method other',
  communicationNote: 'Comm note',
  riskType: [ParticipantRiskType.CAPITATION],
  riskOther: 'Risk other',
  riskNote: 'Note risk',
  willRiskChange: true,
  willRiskChangeNote: 'My risk change ntoe',
  participantRequireFinancialGuarantee: true,
  participantRequireFinancialGuaranteeType: [
    ParticipantRequireFinancialGuaranteeType.ESCROW,
    ParticipantRequireFinancialGuaranteeType.OTHER
  ],
  participantRequireFinancialGuaranteeOther: 'Other Type',
  participantRequireFinancialGuaranteeNote: 'Notes',
  coordinateWork: true,
  coordinateWorkNote: 'Coornidate work note',
  gainsharePayments: true,
  gainsharePaymentsTrack: true,
  gainsharePaymentsNote: 'Track note',
  gainsharePaymentsEligibility: [GainshareArrangementEligibility.OTHER],
  gainsharePaymentsEligibilityOther: 'Other gainsharing',
  participantsIds: [ParticipantsIdType.CCNS],
  participantsIdsOther: 'PArt ids other',
  participantsIDSNote: 'Note for particpants',
  providerAdditionFrequency: [FrequencyType.OTHER],
  providerAdditionFrequencyContinually: '',
  providerAdditionFrequencyOther: 'Freq other',
  providerAdditionFrequencyNote: 'Note freq',
  providerAddMethod: [ProviderAddType.RETROSPECTIVELY],
  providerAddMethodOther: 'Add other',
  providerAddMethodNote: 'Add note',
  providerLeaveMethod: [ProviderLeaveType.NOT_APPLICABLE],
  providerLeaveMethodOther: 'Leave other',
  providerLeaveMethodNote: 'Note leave',
  providerRemovalFrequency: [FrequencyType.CONTINUALLY],
  providerRemovalFrequencyContinually: 'Freq cont',
  providerRemovalFrequencyOther: '',
  providerRemovalFrequencyNote: 'Note freq removal',
  providerOverlap: OverlapType.NO,
  providerOverlapHierarchy: 'This is the hierarchy',
  providerOverlapNote: 'Overlap note',
  status: TaskStatus.IN_PROGRESS
};

export const participantsAndProvidersMocks = [
  {
    request: {
      query: GetAllParticipantsAndProvidersDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          participantsAndProviders: participantsAndProvidersData
        }
      }
    }
  }
];

const beneficiaryData: AllBeneficiariesTypes = {
  __typename: 'PlanBeneficiaries',
  id: '123',
  modelPlanID: modelID,
  beneficiaries: [
    BeneficiariesType.DISEASE_SPECIFIC,
    BeneficiariesType.DUALLY_ELIGIBLE
  ],
  diseaseSpecificGroup: 'Other disease group',
  beneficiariesOther: 'Other beneficiary',
  beneficiariesNote: 'Note beneficiary',
  treatDualElligibleDifferent: TriStateAnswer.YES,
  treatDualElligibleDifferentHow: 'This is how',
  treatDualElligibleDifferentNote: 'Treat note',
  excludeCertainCharacteristics: TriStateAnswer.NO,
  excludeCertainCharacteristicsCriteria: 'Certain criteria',
  excludeCertainCharacteristicsNote: 'Exclude note',
  numberPeopleImpacted: 1234,
  estimateConfidence: ConfidenceType.COMPLETELY,
  confidenceNote: 'Note of confidence',
  beneficiarySelectionMethod: [SelectionMethodType.HISTORICAL],
  beneficiarySelectionOther: 'Selection other',
  beneficiarySelectionNote: 'Note selection',
  beneficiarySelectionFrequency: [FrequencyType.OTHER],
  beneficiarySelectionFrequencyContinually: '',
  beneficiarySelectionFrequencyOther: 'Frequency other',
  beneficiarySelectionFrequencyNote: 'Note frequency',
  beneficiaryRemovalFrequency: [FrequencyType.CONTINUALLY],
  beneficiaryRemovalFrequencyContinually: 'Frequency continually',
  beneficiaryRemovalFrequencyOther: '',
  beneficiaryRemovalFrequencyNote: 'Note frequency',
  beneficiaryOverlap: OverlapType.YES_NEED_POLICIES,
  beneficiaryOverlapNote: 'Note overlap',
  precedenceRules: [YesNoType.YES],
  precedenceRulesYes: 'Yes precedence rules',
  precedenceRulesNo: 'No precedence',
  precedenceRulesNote: 'Precedence note',
  status: TaskStatus.IN_PROGRESS
};

export const benficiaryMocks = [
  {
    request: {
      query: GetAllBeneficiariesDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          beneficiaries: beneficiaryData
        }
      }
    }
  }
];

const opsEvalAndLearningData: AllOpsEvalAndLearningTypes = {
  __typename: 'PlanOpsEvalAndLearning',
  id: '123',
  modelPlanID: modelID,
  status: TaskStatus.IN_PROGRESS,
  stakeholders: [
    StakeholdersType.BENEFICIARIES,
    StakeholdersType.PARTICIPANTS,
    StakeholdersType.PROVIDERS
  ],
  stakeholdersOther: 'Stateholders other',
  stakeholdersNote: 'Note stateholders',
  helpdeskUse: true,
  helpdeskUseNote: 'Note help desk',
  contractorSupport: [
    ContractorSupportType.MULTIPLE,
    ContractorSupportType.OTHER
  ],
  contractorSupportOther: 'Support other',
  contractorSupportHow: 'Support how',
  contractorSupportNote: 'Note for support',
  iddocSupport: true,
  iddocSupportNote: 'Note iddoc support',
  technicalContactsIdentified: true,
  technicalContactsIdentifiedDetail: 'Detail of technical contacts',
  technicalContactsIdentifiedNote: 'Note for contacts',
  captureParticipantInfo: true,
  captureParticipantInfoNote: 'Note for participants',
  icdOwner: 'ICD owner',
  draftIcdDueDate: '12/12/2026',
  icdNote: 'Note for icd',
  uatNeeds: 'UAT needs',
  stcNeeds: 'STC needs',
  testingTimelines: 'Testing timelines',
  testingNote: 'Note for testing',
  dataMonitoringFileTypes: [
    MonitoringFileType.PART_A,
    MonitoringFileType.PART_B
  ],
  dataMonitoringFileOther: 'Other data monitoring',
  dataResponseType: 'File',
  dataResponseFileFrequency: 'Every week',
  dataFullTimeOrIncremental: DataFullTimeOrIncrementalType.FULL_TIME,
  eftSetUp: true,
  unsolicitedAdjustmentsIncluded: true,
  dataFlowDiagramsNeeded: true,
  produceBenefitEnhancementFiles: true,
  fileNamingConventions: 'PDF',
  dataMonitoringNote: 'Note for monitoring',
  benchmarkForPerformance: BenchmarkForPerformanceType.YES_RECONCILE,
  benchmarkForPerformanceNote: 'Note for benchmark',
  computePerformanceScores: true,
  computePerformanceScoresNote: 'Note for computing',
  riskAdjustPerformance: true,
  riskAdjustFeedback: true,
  riskAdjustPayments: true,
  riskAdjustOther: true,
  riskAdjustNote: 'Note for risk ',
  appealPerformance: true,
  appealFeedback: true,
  appealPayments: true,
  appealOther: true,
  appealNote: 'Note for appeal',
  evaluationApproaches: [
    EvaluationApproachType.INTERRUPTED_TIME,
    EvaluationApproachType.OTHER
  ],
  evaluationApproachOther: 'Other eval approach',
  evalutaionApproachNote: 'Note for approach',
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION, CcmInvolvmentType.OTHER],
  ccmInvolvmentOther: 'CCM involvement other',
  ccmInvolvmentNote: 'Note for involvement',
  dataNeededForMonitoring: [
    DataForMonitoringType.CLINICAL_DATA,
    DataForMonitoringType.MEDICARE_CLAIMS,
    DataForMonitoringType.OTHER
  ],
  dataNeededForMonitoringOther: 'Data mon other',
  dataNeededForMonitoringNote: 'Note for data mon',
  dataToSendParticicipants: [
    DataToSendParticipantsType.BASELINE_HISTORICAL_DATA,
    DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA,
    DataToSendParticipantsType.OTHER_MIPS_DATA
  ],
  dataToSendParticicipantsOther: 'Data to send other',
  dataToSendParticicipantsNote: 'Note for data to send',
  shareCclfData: true,
  shareCclfDataNote: 'Note for cclf',
  sendFilesBetweenCcw: true,
  sendFilesBetweenCcwNote: 'Note for ccw',
  appToSendFilesToKnown: true,
  appToSendFilesToWhich: 'Which app to send',
  appToSendFilesToNote: 'Note for app to send',
  useCcwForFileDistribiutionToParticipants: true,
  useCcwForFileDistribiutionToParticipantsNote: 'Note for ccw disctro',
  developNewQualityMeasures: true,
  developNewQualityMeasuresNote: 'Note for develop measures',
  qualityPerformanceImpactsPayment: YesNoOtherType.OTHER,
  qualityPerformanceImpactsPaymentOther: 'Other text',
  qualityPerformanceImpactsPaymentNote: 'quality note',
  dataSharingStarts: DataStartsType.DURING_APPLICATION_PERIOD,
  dataSharingStartsOther: 'Data sharing starts other',
  dataSharingFrequency: [FrequencyType.MONTHLY],
  dataSharingFrequencyContinually: 'Data sharing cont',
  dataSharingFrequencyOther: 'Data frequency other',
  dataSharingStartsNote: 'Note for data freq',
  dataCollectionStarts: DataStartsType.EARLY_IN_THE_FIRST_PERFORMANCE_YEAR,
  dataCollectionStartsOther: 'Other collection start',
  dataCollectionFrequency: [FrequencyType.ANNUALLY],
  dataCollectionFrequencyContinually: 'Data coll cont',
  dataCollectionFrequencyOther: 'Data freq other',
  dataCollectionFrequencyNote: 'Note for data freq',
  qualityReportingStarts: DataStartsType.LATER_IN_THE_FIRST_PERFORMANCE_YEAR,
  qualityReportingStartsOther: 'Other qual report',
  qualityReportingStartsNote: 'Note for qual report',
  qualityReportingFrequency: [FrequencyType.OTHER],
  qualityReportingFrequencyContinually: '',
  qualityReportingFrequencyOther: 'Other frequency',
  modelLearningSystems: [
    ModelLearningSystemType.IT_PLATFORM_CONNECT,
    ModelLearningSystemType.NO_LEARNING_SYSTEM,
    ModelLearningSystemType.OTHER
  ],
  modelLearningSystemsOther: 'Other learning system',
  modelLearningSystemsNote: 'Note for learning system',
  anticipatedChallenges: 'Some challenges'
};

export const opsEvalAndLearningMocks = [
  {
    request: {
      query: GetAllOpsEvalAndLearningDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          opsEvalAndLearning: opsEvalAndLearningData
        }
      }
    }
  }
];

const paymentsData: PaymentTypes = {
  __typename: 'PlanPayments',
  fundingSource: [FundingSource.PATIENT_PROTECTION_AFFORDABLE_CARE_ACT],
  fundingSourceMedicareAInfo: 'PartA',
  fundingSourceMedicareBInfo: 'PartB',
  fundingSourceOther: 'Other funding source',
  fundingSourceNote: 'Funding source note',
  fundingSourceR: [FundingSource.PATIENT_PROTECTION_AFFORDABLE_CARE_ACT],
  fundingSourceRMedicareAInfo: 'PartRA',
  fundingSourceRMedicareBInfo: 'PartRB',
  fundingSourceROther: 'Other funding r',
  fundingSourceRNote: 'Funding r note',
  payRecipients: [PayRecipient.BENEFICIARIES],
  payRecipientsOtherSpecification: 'Pay specification',
  payRecipientsNote: 'Recipient note',
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payTypeNote: 'Pay type note',
  payClaims: [ClaimsBasedPayType.ADJUSTMENTS_TO_FFS_PAYMENTS],
  payClaimsOther: 'Other pay claims',
  payClaimsNote: 'Pay claims note',
  shouldAnyProvidersExcludedFFSSystems: true,
  shouldAnyProviderExcludedFFSSystemsNote: 'FFSS Note',
  changesMedicarePhysicianFeeSchedule: true,
  changesMedicarePhysicianFeeScheduleNote: 'Change medicare note',
  affectsMedicareSecondaryPayerClaims: true,
  affectsMedicareSecondaryPayerClaimsHow: 'Affect how',
  affectsMedicareSecondaryPayerClaimsNote: 'Affect payer note',
  payModelDifferentiation: 'Differ pay model',
  willBePaymentAdjustments: true,
  willBePaymentAdjustmentsNote: 'Payment adjustments note',
  creatingDependenciesBetweenServices: true,
  creatingDependenciesBetweenServicesNote: 'Creating dependencies note',
  needsClaimsDataCollection: true,
  needsClaimsDataCollectionNote: 'Need claims note',
  providingThirdPartyFile: true,
  isContractorAwareTestDataRequirements: true,
  beneficiaryCostSharingLevelAndHandling: 'Beneficiary handling',
  waiveBeneficiaryCostSharingForAnyServices: true,
  waiveBeneficiaryCostSharingServiceSpecification: 'Waive specification',
  waiverOnlyAppliesPartOfPayment: true,
  waiveBeneficiaryCostSharingNote: 'Cost sharing note',
  nonClaimsPayments: [NonClaimsBasedPayType.ADVANCED_PAYMENT],
  nonClaimsPaymentsNote: 'Non claims note',
  nonClaimsPaymentOther: 'Non claims other',
  paymentCalculationOwner: 'Payment calculator',
  numberPaymentsPerPayCycle: 'Number of payments per cycle',
  numberPaymentsPerPayCycleNote: 'Payments per cycle note',
  sharedSystemsInvolvedAdditionalClaimPayment: true,
  sharedSystemsInvolvedAdditionalClaimPaymentNote: 'Shared systems note',
  planningToUseInnovationPaymentContractor: true,
  planningToUseInnovationPaymentContractorNote: 'Contractor planning note',
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType.HIGH,
  expectedCalculationComplexityLevelNote: 'Expected complexity note',
  claimsProcessingPrecedence: true,
  claimsProcessingPrecedenceOther: 'other claims',
  claimsProcessingPrecedenceNote: 'claim note',
  canParticipantsSelectBetweenPaymentMechanisms: true,
  canParticipantsSelectBetweenPaymentMechanismsHow:
    'Can participants select how',
  canParticipantsSelectBetweenPaymentMechanismsNote: 'Payment mechanisms note',
  anticipatedPaymentFrequency: [FrequencyType.SEMIANNUALLY],
  anticipatedPaymentFrequencyContinually: 'Continually frequency',
  anticipatedPaymentFrequencyOther: 'Other frequency',
  anticipatedPaymentFrequencyNote: 'Payment frequency note',
  willRecoverPayments: true,
  willRecoverPaymentsNote: 'Will recover note',
  anticipateReconcilingPaymentsRetrospectively: true,
  anticipateReconcilingPaymentsRetrospectivelyNote: 'Anticipate note',
  paymentReconciliationFrequency: [FrequencyType.CONTINUALLY],
  paymentReconciliationFrequencyContinually: 'Continual Frequency',
  paymentReconciliationFrequencyOther: '',
  paymentReconciliationFrequencyNote: 'Reconciliation note',
  paymentDemandRecoupmentFrequency: [FrequencyType.CONTINUALLY],
  paymentDemandRecoupmentFrequencyContinually: 'Continual Frequency',
  paymentDemandRecoupmentFrequencyOther: '',
  paymentDemandRecoupmentFrequencyNote: 'Demand and Recoupment note',
  paymentStartDate: '2022-06-03T19:32:24.412662Z',
  paymentStartDateNote: 'Note for payment start date',
  status: TaskStatus.IN_PROGRESS
};

export const paymentsMocks = [
  {
    request: {
      query: GetAllPaymentsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          payments: paymentsData
        }
      }
    }
  }
];

const summaryData: GetModelSummaryTypes = {
  __typename: 'ModelPlan',
  id: modelID,
  isFavorite: false,
  modelName: 'Testing Model Summary',
  abbreviation: 'TMS',
  createdDts: '2022-08-23T04:00:00Z',
  modifiedDts: '2022-08-27T04:00:00Z',
  status: ModelStatus.PLAN_DRAFT,
  basics: {
    __typename: 'PlanBasics',
    goal: 'This is the goal',
    performancePeriodStarts: '2022-08-20T04:00:00Z'
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    keyCharacteristics: [KeyCharacteristic.EPISODE_BASED]
  },
  isCollaborator: true,

  collaborators: [
    {
      userAccount: {
        id: '890',
        __typename: 'UserAccount',
        email: '',
        username: 'MINT',
        commonName: 'First Collaborator'
      },
      teamRoles: [TeamRole.MODEL_LEAD],
      __typename: 'PlanCollaborator'
    }
  ],
  crs: [
    {
      __typename: 'PlanCR',
      id: '123',
      idNumber: 'CR 123'
    }
  ],
  tdls: [
    {
      __typename: 'PlanTDL',
      id: '456',
      idNumber: 'TDL 456'
    }
  ]
};

export const summaryMock = [
  {
    request: {
      query: GetModelSummaryDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          ...summaryData
        }
      }
    }
  }
];

const collaboratorsData: GetModelCollaboratorsType[] = [
  {
    id: '123',
    userID: 'LUKE',
    userAccount: {
      __typename: 'UserAccount',
      id: '890',
      email: 'luke@skywalker.com',
      username: '123',
      commonName: 'Luke Skywalker'
    },
    modelPlanID: modelID,
    teamRoles: [TeamRole.MODEL_LEAD],
    createdDts: '2022-06-03T19:32:24.412662Z',
    __typename: 'PlanCollaborator'
  },
  {
    id: '456',
    userID: 'BOBA',
    userAccount: {
      __typename: 'UserAccount',
      id: '891',
      email: 'boba@fett.com',
      username: '321',
      commonName: 'Boba Fett'
    },
    modelPlanID: modelID,
    teamRoles: [TeamRole.LEADERSHIP],
    createdDts: '2022-06-03T19:32:24.412662Z',
    __typename: 'PlanCollaborator'
  }
];

export const collaboratorsMocks = [
  {
    request: {
      query: GetModelCollaboratorsDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'Testing Model Summary',
          collaborators: collaboratorsData
        }
      }
    }
  }
];

const opNeedsData: GetOperationalNeedsType = {
  __typename: 'Query',
  modelPlan: {
    __typename: 'ModelPlan',
    id: modelID,
    isCollaborator: true,
    modelName: 'My excellent plan that I just initiated',
    operationalNeeds: [
      {
        __typename: 'OperationalNeed',
        id: '123',
        modelPlanID: modelID,
        name: 'Recruit participants',
        key: OperationalNeedKey.RECRUIT_PARTICIPANTS,
        nameOther: null,
        needed: true,
        modifiedDts: '2022-05-12T15:01:39.190679Z',
        solutions: [
          {
            __typename: 'OperationalSolution',
            id: '123',
            status: OpSolutionStatus.IN_PROGRESS,
            name: 'Shared Systems',
            key: OperationalSolutionKey.SHARED_SYSTEMS,
            otherHeader: '',
            mustStartDts: null,
            mustFinishDts: null,
            operationalSolutionSubtasks: [],
            needed: true,
            nameOther: null,
            pocEmail: null,
            pocName: null,
            createdBy: '',
            createdDts: ''
          }
        ]
      }
    ]
  }
};

export const operationalNeedsMock = [
  {
    request: {
      query: GetOperationalNeedsDocument,
      variables: { id: modelID }
    },
    result: {
      data: opNeedsData
    }
  }
];

const allMocks = [
  ...benficiaryMocks,
  ...generalCharacteristicMocks,
  ...modelBasicsMocks,
  ...opsEvalAndLearningMocks,
  ...participantsAndProvidersMocks,
  ...paymentsMocks,
  ...collaboratorsMocks
];

export default allMocks;
