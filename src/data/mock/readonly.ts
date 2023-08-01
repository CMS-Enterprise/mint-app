import GetModelPlanCollaborators from 'queries/Collaborators/GetModelCollaborators';
import { GetModelCollaborators_modelPlan_collaborators as GetModelCollaboratorsType } from 'queries/Collaborators/types/GetModelCollaborators';
import GetAllBasics from 'queries/ReadOnly/GetAllBasics';
import GetAllBeneficiaries from 'queries/ReadOnly/GetAllBeneficiaries';
import GetAllGeneralCharacteristics from 'queries/ReadOnly/GetAllGeneralCharacteristics';
import GetAllParticipants from 'queries/ReadOnly/GetAllParticipants';
import GetAllPayments from 'queries/ReadOnly/GetAllPayments';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import GetAllOpsEvalAndLearning from 'queries/ReadOnly/GettAllOpsEvalAndLearning';
import { GetAllBasics_modelPlan_basics as GetAllBasicsTypes } from 'queries/ReadOnly/types/GetAllBasics';
import { GetAllBeneficiaries_modelPlan_beneficiaries as AllBeneficiariesTypes } from 'queries/ReadOnly/types/GetAllBeneficiaries';
import { GetAllGeneralCharacteristics_modelPlan_generalCharacteristics as GetAllGeneralCharacteristicsTypes } from 'queries/ReadOnly/types/GetAllGeneralCharacteristics';
import { GetAllOpsEvalAndLearning_modelPlan_opsEvalAndLearning as AllOpsEvalAndLearningTypes } from 'queries/ReadOnly/types/GetAllOpsEvalAndLearning';
import { GetAllParticipants_modelPlan_participantsAndProviders as GetAllParticipantsTypes } from 'queries/ReadOnly/types/GetAllParticipants';
import { GetAllPayments_modelPlan_payments as PaymentTypes } from 'queries/ReadOnly/types/GetAllPayments';
import { GetModelSummary_modelPlan as GetModelSummaryTypes } from 'queries/ReadOnly/types/GetModelSummary';
import {
  AgencyOrStateHelpType,
  AgreementType,
  AlternativePaymentModelType,
  AnticipatedPaymentFrequencyType,
  AuthorityAllowance,
  BeneficiariesType,
  CcmInvolvmentType,
  ClaimsBasedPayType,
  CMMIGroup,
  CMSCenter,
  ComplexityCalculationLevelType,
  ConfidenceType,
  ContractorSupportType,
  DataForMonitoringType,
  DataFrequencyType,
  DataToSendParticipantsType,
  EvaluationApproachType,
  FrequencyType,
  FundingSource,
  GeographyApplication,
  GeographyType,
  KeyCharacteristic,
  ModelCategory,
  ModelLearningSystemType,
  ModelStatus,
  ModelType,
  MonitoringFileType,
  NonClaimsBasedPayType,
  OverlapType,
  ParticipantCommunicationType,
  ParticipantRiskType,
  ParticipantSelectionType,
  ParticipantsIDType,
  ParticipantsType,
  PayRecipient,
  PayType,
  ProviderAddType,
  ProviderLeaveType,
  RecruitmentType,
  SelectionMethodType,
  StakeholdersType,
  TaskStatus,
  TeamRole,
  TriStateAnswer,
  WaiverType
} from 'types/graphql-global-types';

export const modelID: string = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const modelBasicsData: GetAllBasicsTypes = {
  __typename: 'PlanBasics',
  id: '123',
  demoCode: '1234',
  amsModelID: '43532323',
  modelCategory: ModelCategory.PRIMARY_CARE_TRANSFORMATION,
  cmsCenters: [CMSCenter.CENTER_FOR_MEDICARE, CMSCenter.OTHER],
  cmsOther: 'The Center for Awesomeness',
  cmmiGroups: [
    CMMIGroup.STATE_AND_POPULATION_HEALTH_GROUP,
    CMMIGroup.POLICY_AND_PROGRAMS_GROUP
  ],
  modelType: ModelType.MANDATORY,
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
      query: GetAllBasics,
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
  resemblesExistingModel: true,
  resemblesExistingModelHow: null,
  resemblesExistingModelNote: 'THIS IS A NEW NOTE',
  hasComponentsOrTracks: true,
  hasComponentsOrTracksDiffer: 'In every way',
  hasComponentsOrTracksNote: 'Tracks note',
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
  geographiesTargetedTypes: [GeographyType.OTHER],
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
      query: GetAllGeneralCharacteristics,
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
  communicationMethod: [
    ParticipantCommunicationType.IT_TOOL,
    ParticipantCommunicationType.MASS_EMAIL
  ],
  communicationMethodOther: 'Comm method other',
  communicationNote: 'Comm note',
  participantAssumeRisk: true,
  riskType: ParticipantRiskType.CAPITATION,
  riskOther: 'Risk other',
  riskNote: 'Note risk',
  willRiskChange: true,
  willRiskChangeNote: 'My risk change ntoe',
  coordinateWork: true,
  coordinateWorkNote: 'Coornidate work note',
  gainsharePayments: true,
  gainsharePaymentsTrack: true,
  gainsharePaymentsNote: 'Track note',
  participantsIds: [ParticipantsIDType.CCNS],
  participantsIdsOther: 'PArt ids other',
  participantsIDSNote: 'Note for particpants',
  providerAdditionFrequency: FrequencyType.BIANNUALLY,
  providerAdditionFrequencyOther: 'Freq other',
  providerAdditionFrequencyNote: 'Note freq',
  providerAddMethod: [ProviderAddType.RETROSPECTIVELY],
  providerAddMethodOther: 'Add other',
  providerAddMethodNote: 'Add note',
  providerLeaveMethod: [ProviderLeaveType.NOT_APPLICABLE],
  providerLeaveMethodOther: 'Leave other',
  providerLeaveMethodNote: 'Note leave',
  providerOverlap: OverlapType.NO,
  providerOverlapHierarchy: 'This is the hierarchy',
  providerOverlapNote: 'Overlap note',
  status: TaskStatus.IN_PROGRESS
};

export const participantsAndProvidersMocks = [
  {
    request: {
      query: GetAllParticipants,
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
  beneficiariesOther: null,
  beneficiariesNote: null,
  treatDualElligibleDifferent: TriStateAnswer.YES,
  treatDualElligibleDifferentHow: 'null',
  treatDualElligibleDifferentNote: null,
  excludeCertainCharacteristics: TriStateAnswer.NO,
  excludeCertainCharacteristicsCriteria: null,
  excludeCertainCharacteristicsNote: null,
  numberPeopleImpacted: 1234,
  estimateConfidence: ConfidenceType.COMPLETELY,
  confidenceNote: null,
  beneficiarySelectionMethod: [SelectionMethodType.HISTORICAL],
  beneficiarySelectionOther: null,
  beneficiarySelectionNote: null,
  beneficiarySelectionFrequency: FrequencyType.ANNUALLY,
  beneficiarySelectionFrequencyOther: null,
  beneficiarySelectionFrequencyNote: null,
  beneficiaryOverlap: OverlapType.YES_NEED_POLICIES,
  beneficiaryOverlapNote: null,
  precedenceRules: null,
  status: TaskStatus.IN_PROGRESS
};

export const benficiaryMocks = [
  {
    request: {
      query: GetAllBeneficiaries,
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
  agencyOrStateHelp: [
    AgencyOrStateHelpType.YES_STATE,
    AgencyOrStateHelpType.OTHER
  ],
  agencyOrStateHelpOther: null,
  agencyOrStateHelpNote: null,
  stakeholders: [
    StakeholdersType.BENEFICIARIES,
    StakeholdersType.PARTICIPANTS,
    StakeholdersType.PROVIDERS
  ],
  stakeholdersOther: null,
  stakeholdersNote: null,
  helpdeskUse: null,
  helpdeskUseNote: null,
  contractorSupport: [
    ContractorSupportType.MULTIPLE,
    ContractorSupportType.OTHER
  ],
  contractorSupportOther: null,
  contractorSupportHow: null,
  contractorSupportNote: null,
  iddocSupport: null,
  iddocSupportNote: null,
  technicalContactsIdentified: null,
  technicalContactsIdentifiedDetail: null,
  technicalContactsIdentifiedNote: null,
  captureParticipantInfo: null,
  captureParticipantInfoNote: null,
  icdOwner: null,
  draftIcdDueDate: null,
  icdNote: null,
  uatNeeds: null,
  stcNeeds: null,
  testingTimelines: null,
  testingNote: null,
  dataMonitoringFileTypes: [
    MonitoringFileType.PART_A,
    MonitoringFileType.PART_B
  ],
  dataMonitoringFileOther: null,
  dataResponseType: null,
  dataResponseFileFrequency: null,
  dataFullTimeOrIncremental: null,
  eftSetUp: null,
  unsolicitedAdjustmentsIncluded: null,
  dataFlowDiagramsNeeded: null,
  produceBenefitEnhancementFiles: null,
  fileNamingConventions: null,
  dataMonitoringNote: null,
  benchmarkForPerformance: null,
  benchmarkForPerformanceNote: null,
  computePerformanceScores: null,
  computePerformanceScoresNote: null,
  riskAdjustPerformance: null,
  riskAdjustFeedback: null,
  riskAdjustPayments: null,
  riskAdjustOther: null,
  riskAdjustNote: null,
  appealPerformance: null,
  appealFeedback: null,
  appealPayments: null,
  appealOther: null,
  appealNote: null,
  evaluationApproaches: [
    EvaluationApproachType.INTERRUPTED_TIME,
    EvaluationApproachType.OTHER
  ],
  evaluationApproachOther: null,
  evalutaionApproachNote: null,
  ccmInvolvment: [CcmInvolvmentType.YES_EVALUATION, CcmInvolvmentType.OTHER],
  ccmInvolvmentOther: null,
  ccmInvolvmentNote: null,
  dataNeededForMonitoring: [
    DataForMonitoringType.CLINICAL_DATA,
    DataForMonitoringType.MEDICARE_CLAIMS,
    DataForMonitoringType.OTHER
  ],
  dataNeededForMonitoringOther: null,
  dataNeededForMonitoringNote: null,
  dataToSendParticicipants: [
    DataToSendParticipantsType.BASELINE_HISTORICAL_DATA,
    DataToSendParticipantsType.BENEFICIARY_LEVEL_DATA,
    DataToSendParticipantsType.OTHER_MIPS_DATA
  ],
  dataToSendParticicipantsOther: null,
  dataToSendParticicipantsNote: null,
  shareCclfData: null,
  shareCclfDataNote: null,
  sendFilesBetweenCcw: null,
  sendFilesBetweenCcwNote: null,
  appToSendFilesToKnown: null,
  appToSendFilesToWhich: null,
  appToSendFilesToNote: null,
  useCcwForFileDistribiutionToParticipants: null,
  useCcwForFileDistribiutionToParticipantsNote: null,
  developNewQualityMeasures: null,
  developNewQualityMeasuresNote: null,
  qualityPerformanceImpactsPayment: null,
  qualityPerformanceImpactsPaymentNote: null,
  dataSharingStarts: null,
  dataSharingStartsOther: null,
  dataSharingFrequency: [DataFrequencyType.DAILY],
  dataSharingFrequencyOther: null,
  dataSharingStartsNote: null,
  dataCollectionStarts: null,
  dataCollectionStartsOther: null,
  dataCollectionFrequency: [DataFrequencyType.MONTHLY],
  dataCollectionFrequencyOther: null,
  dataCollectionFrequencyNote: null,
  qualityReportingStarts: null,
  qualityReportingStartsOther: null,
  qualityReportingStartsNote: null,
  modelLearningSystems: [
    ModelLearningSystemType.IT_PLATFORM_CONNECT,
    ModelLearningSystemType.NO_LEARNING_SYSTEM,
    ModelLearningSystemType.OTHER
  ],
  modelLearningSystemsOther: null,
  modelLearningSystemsNote: null,
  anticipatedChallenges: null
};

export const opsEvalAndLearningMocks = [
  {
    request: {
      query: GetAllOpsEvalAndLearning,
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
  fundingSourceTrustFund: null,
  fundingSourceOther: null,
  fundingSourceNote: null,
  fundingSourceR: [FundingSource.PATIENT_PROTECTION_AFFORDABLE_CARE_ACT],
  fundingSourceRTrustFund: null,
  fundingSourceROther: null,
  fundingSourceRNote: null,
  payRecipients: [PayRecipient.BENEFICIARIES],
  payRecipientsOtherSpecification: null,
  payRecipientsNote: null,
  payType: [PayType.CLAIMS_BASED_PAYMENTS],
  payTypeNote: null,
  payClaims: [ClaimsBasedPayType.ADJUSTMENTS_TO_FFS_PAYMENTS],
  payClaimsOther: null,
  payClaimsNote: null,
  shouldAnyProvidersExcludedFFSSystems: true,
  shouldAnyProviderExcludedFFSSystemsNote: null,
  changesMedicarePhysicianFeeSchedule: true,
  changesMedicarePhysicianFeeScheduleNote: null,
  affectsMedicareSecondaryPayerClaims: true,
  affectsMedicareSecondaryPayerClaimsHow: null,
  affectsMedicareSecondaryPayerClaimsNote: null,
  payModelDifferentiation: null,
  creatingDependenciesBetweenServices: true,
  creatingDependenciesBetweenServicesNote: null,
  needsClaimsDataCollection: true,
  needsClaimsDataCollectionNote: null,
  providingThirdPartyFile: true,
  isContractorAwareTestDataRequirements: true,
  beneficiaryCostSharingLevelAndHandling: null,
  waiveBeneficiaryCostSharingForAnyServices: true,
  waiveBeneficiaryCostSharingServiceSpecification: null,
  waiverOnlyAppliesPartOfPayment: true,
  waiveBeneficiaryCostSharingNote: null,
  nonClaimsPayments: [NonClaimsBasedPayType.ADVANCED_PAYMENT],
  nonClaimsPaymentsNote: '',
  nonClaimsPaymentOther: null,
  paymentCalculationOwner: null,
  numberPaymentsPerPayCycle: null,
  numberPaymentsPerPayCycleNote: null,
  sharedSystemsInvolvedAdditionalClaimPayment: true,
  sharedSystemsInvolvedAdditionalClaimPaymentNote: null,
  planningToUseInnovationPaymentContractor: true,
  planningToUseInnovationPaymentContractorNote: null,
  fundingStructure: null,
  expectedCalculationComplexityLevel: ComplexityCalculationLevelType.HIGH,
  expectedCalculationComplexityLevelNote: null,
  canParticipantsSelectBetweenPaymentMechanisms: true,
  canParticipantsSelectBetweenPaymentMechanismsHow: null,
  canParticipantsSelectBetweenPaymentMechanismsNote: null,
  anticipatedPaymentFrequency: [AnticipatedPaymentFrequencyType.BIANNUALLY],
  anticipatedPaymentFrequencyOther: null,
  anticipatedPaymentFrequencyNote: null,
  willRecoverPayments: true,
  willRecoverPaymentsNote: null,
  anticipateReconcilingPaymentsRetrospectively: true,
  anticipateReconcilingPaymentsRetrospectivelyNote: null,
  paymentStartDate: '2022-06-03T19:32:24.412662Z',
  paymentStartDateNote: null,
  status: TaskStatus.IN_PROGRESS
};

export const paymentsMocks = [
  {
    request: {
      query: GetAllPayments,
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
      teamRole: TeamRole.MODEL_LEAD,
      __typename: 'PlanCollaborator'
    }
  ],
  crTdls: [
    {
      __typename: 'PlanCrTdl',
      idNumber: 'TDL-123'
    }
  ]
};

export const summaryMock = [
  {
    request: {
      query: GetModelSummary,
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
    teamRole: TeamRole.MODEL_LEAD,
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
    teamRole: TeamRole.LEADERSHIP,
    createdDts: '2022-06-03T19:32:24.412662Z',
    __typename: 'PlanCollaborator'
  }
];

export const collaboratorsMocks = [
  {
    request: {
      query: GetModelPlanCollaborators,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          __typename: 'ModelPlan',
          id: modelID,
          modelName: 'My Model',
          collaborators: collaboratorsData
        }
      }
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
