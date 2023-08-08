/*
  Typed translation mappings for question centric architecture for a model plan
  Used to dynamically iterate/render questions, answers for functionality such as csv export and change history
*/
import { FilterGroup } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';

import {
  AgencyOrStateHelpType,
  AgreementType,
  AlternativePaymentModelType,
  AuthorityAllowance,
  BenchmarkForPerformanceType,
  BeneficiariesType,
  CcmInvolvmentType,
  CMMIGroup,
  CMSCenter,
  ConfidenceType,
  ContractorSupportType,
  DataForMonitoringType,
  DataFrequencyType,
  DataFullTimeOrIncrementalType,
  DataStartsType,
  DataToSendParticipantsType,
  EvaluationApproachType,
  FrequencyType,
  GeographyApplication,
  GeographyType,
  KeyCharacteristic,
  ModelCategory,
  ModelLearningSystemType,
  ModelType,
  MonitoringFileType,
  OverlapType,
  ParticipantCommunicationType,
  ParticipantRiskType,
  ParticipantSelectionType,
  ParticipantsIDType,
  ParticipantsType,
  ProviderAddType,
  ProviderLeaveType,
  RecruitmentType,
  SelectionMethodType,
  StakeholdersType,
  TaskStatus,
  TriStateAnswer,
  WaiverType
} from './graphql-global-types';

// Util used to preserve type defintions when mapping over keys of object
// https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

export enum Bool {
  true = 'true',
  false = 'false'
}

export type TranslationFieldProperties = {
  gqlField: string;
  goField: string;
  dbField: string;
  label: string;
  readonlyLabel?: string;
  sublabel?: string;
  multiSelectLabel?: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  isArray?: boolean;
  formType:
    | 'text'
    | 'textarea'
    | 'number'
    | 'boolean'
    | 'radio'
    | 'checkbox'
    | 'select'
    | 'multiSelect'
    | 'datePicker'
    | 'rangeInput';
  filterGroups?: FilterGroup[]; // Used to render questions within Readonly filter group view (Also CSV/PDF export)
  tags?: string[];
};

// Extended type for questions that have options - boolean, radio, checkbox, etc.
// Takes in a enum parameter for translation key
export type TranslationFieldPropertiesWithOptions<
  T extends keyof T | string
> = TranslationFieldProperties & {
  options: Record<T, string>;
  optionsLabels?: Record<T, string>;
};

// Model Plan
export type TranslationModelPlan = {
  modelName: TranslationFieldProperties;
  previousName: TranslationFieldProperties;
  abbreviation: TranslationFieldProperties;
};

// Basics
export type TranslationBasics = {
  // Model Plan
  amsModelID: TranslationFieldProperties;
  demoCode: TranslationFieldProperties;
  modelCategory: TranslationFieldPropertiesWithOptions<ModelCategory>;
  cmsCenters: TranslationFieldPropertiesWithOptions<CMSCenter>;
  cmmiGroups: TranslationFieldPropertiesWithOptions<CMMIGroup>;
  // Overview
  modelType: TranslationFieldPropertiesWithOptions<ModelType>;
  problem: TranslationFieldProperties;
  goal: TranslationFieldProperties;
  testInterventions: TranslationFieldProperties;
  note: TranslationFieldProperties;
  // Milestones
  completeICIP: TranslationFieldProperties;
  clearanceStarts: TranslationFieldProperties;
  clearanceEnds: TranslationFieldProperties;
  announced: TranslationFieldProperties;
  applicationsStart: TranslationFieldProperties;
  applicationsEnd: TranslationFieldProperties;
  performancePeriodStarts: TranslationFieldProperties;
  performancePeriodEnds: TranslationFieldProperties;
  highLevelNote: TranslationFieldProperties;
  wrapUpEnds: TranslationFieldProperties;
  phasedIn: TranslationFieldPropertiesWithOptions<Bool>;
  phasedInNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

// General Characteristics
export type TranslationGeneralCharacteristics = {
  isNewModel: TranslationFieldPropertiesWithOptions<Bool>;
  existingModel: TranslationFieldProperties;
  existingModelLinks: TranslationFieldProperties;
  resemblesExistingModel: TranslationFieldPropertiesWithOptions<Bool>;
  resemblesExistingModelHow: TranslationFieldProperties;
  resemblesExistingModelNote: TranslationFieldProperties;
  hasComponentsOrTracks: TranslationFieldPropertiesWithOptions<Bool>;
  hasComponentsOrTracksDiffer: TranslationFieldProperties;
  hasComponentsOrTracksNote: TranslationFieldProperties;
  // Key Characteristics
  alternativePaymentModelTypes: TranslationFieldPropertiesWithOptions<AlternativePaymentModelType>;
  alternativePaymentModelNote: TranslationFieldProperties;
  keyCharacteristics: TranslationFieldPropertiesWithOptions<KeyCharacteristic>;
  keyCharacteristicsNote: TranslationFieldProperties;
  keyCharacteristicsOther: TranslationFieldProperties;
  collectPlanBids: TranslationFieldPropertiesWithOptions<Bool>;
  collectPlanBidsNote: TranslationFieldProperties;
  managePartCDEnrollment: TranslationFieldPropertiesWithOptions<Bool>;
  managePartCDEnrollmentNote: TranslationFieldProperties;
  planContractUpdated: TranslationFieldPropertiesWithOptions<Bool>;
  planContractUpdatedNote: TranslationFieldProperties;
  // Involvements
  careCoordinationInvolved: TranslationFieldPropertiesWithOptions<Bool>;
  careCoordinationInvolvedDescription: TranslationFieldProperties;
  careCoordinationInvolvedNote: TranslationFieldProperties;
  additionalServicesInvolved: TranslationFieldPropertiesWithOptions<Bool>;
  additionalServicesInvolvedDescription: TranslationFieldProperties;
  additionalServicesInvolvedNote: TranslationFieldProperties;
  communityPartnersInvolved: TranslationFieldPropertiesWithOptions<Bool>;
  communityPartnersInvolvedDescription: TranslationFieldProperties;
  communityPartnersInvolvedNote: TranslationFieldProperties;
  // Targets and Options
  geographiesTargeted: TranslationFieldPropertiesWithOptions<Bool>;
  geographiesTargetedTypes: TranslationFieldPropertiesWithOptions<GeographyType>;
  geographiesTargetedTypesOther: TranslationFieldProperties;
  geographiesTargetedAppliedTo: TranslationFieldPropertiesWithOptions<GeographyApplication>;
  geographiesTargetedAppliedToOther: TranslationFieldProperties;
  geographiesTargetedNote: TranslationFieldProperties;
  participationOptions: TranslationFieldPropertiesWithOptions<Bool>;
  participationOptionsNote: TranslationFieldProperties;
  agreementTypes: TranslationFieldPropertiesWithOptions<AgreementType>;
  agreementTypesOther: TranslationFieldProperties;
  multiplePatricipationAgreementsNeeded: TranslationFieldPropertiesWithOptions<Bool>;
  multiplePatricipationAgreementsNeededNote: TranslationFieldProperties;
  // Authority
  rulemakingRequired: TranslationFieldPropertiesWithOptions<Bool>;
  rulemakingRequiredDescription: TranslationFieldProperties;
  rulemakingRequiredNote: TranslationFieldProperties;
  authorityAllowances: TranslationFieldPropertiesWithOptions<AuthorityAllowance>;
  authorityAllowancesOther: TranslationFieldProperties;
  authorityAllowancesNote: TranslationFieldProperties;
  waiversRequired: TranslationFieldPropertiesWithOptions<Bool>;
  waiversRequiredTypes: TranslationFieldPropertiesWithOptions<WaiverType>;
  waiversRequiredNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

// Participants and Providers
export type TranslationParticipantsAndProviders = {
  participants: TranslationFieldPropertiesWithOptions<ParticipantsType>;
  medicareProviderType: TranslationFieldProperties;
  statesEngagement: TranslationFieldProperties;
  participantsOther: TranslationFieldProperties;
  participantsNote: TranslationFieldProperties;
  participantsCurrentlyInModels: TranslationFieldPropertiesWithOptions<Bool>;
  participantsCurrentlyInModelsNote: TranslationFieldProperties;
  modelApplicationLevel: TranslationFieldProperties;
  // Participant Options
  expectedNumberOfParticipants: TranslationFieldProperties;
  estimateConfidence: TranslationFieldPropertiesWithOptions<ConfidenceType>;
  confidenceNote: TranslationFieldProperties;
  recruitmentMethod: TranslationFieldPropertiesWithOptions<RecruitmentType>;
  recruitmentOther: TranslationFieldProperties;
  recruitmentNote: TranslationFieldProperties;
  selectionMethod: TranslationFieldPropertiesWithOptions<ParticipantSelectionType>;
  selectionOther: TranslationFieldProperties;
  selectionNote: TranslationFieldProperties;
  // Communication
  communicationMethod: TranslationFieldPropertiesWithOptions<ParticipantCommunicationType>;
  communicationMethodOther: TranslationFieldProperties;
  communicationNote: TranslationFieldProperties;
  participantAssumeRisk: TranslationFieldPropertiesWithOptions<Bool>;
  riskType: TranslationFieldPropertiesWithOptions<ParticipantRiskType>;
  riskOther: TranslationFieldProperties;
  riskNote: TranslationFieldProperties;
  willRiskChange: TranslationFieldPropertiesWithOptions<Bool>;
  willRiskChangeNote: TranslationFieldProperties;
  // Coordination
  coordinateWork: TranslationFieldPropertiesWithOptions<Bool>;
  coordinateWorkNote: TranslationFieldProperties;
  gainsharePayments: TranslationFieldPropertiesWithOptions<Bool>;
  gainsharePaymentsTrack: TranslationFieldPropertiesWithOptions<Bool>;
  gainsharePaymentsNote: TranslationFieldProperties;
  participantsIds: TranslationFieldPropertiesWithOptions<ParticipantsIDType>;
  participantsIdsOther: TranslationFieldProperties;
  participantsIDSNote: TranslationFieldProperties;
  // Provider Options
  providerAdditionFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  providerAdditionFrequencyOther: TranslationFieldProperties;
  providerAdditionFrequencyNote: TranslationFieldProperties;
  providerAddMethod: TranslationFieldPropertiesWithOptions<ProviderAddType>;
  providerAddMethodOther: TranslationFieldProperties;
  providerAddMethodNote: TranslationFieldProperties;
  providerLeaveMethod: TranslationFieldPropertiesWithOptions<ProviderLeaveType>;
  providerLeaveMethodOther: TranslationFieldProperties;
  providerLeaveMethodNote: TranslationFieldProperties;
  providerOverlap: TranslationFieldPropertiesWithOptions<OverlapType>;
  providerOverlapHierarchy: TranslationFieldProperties;
  providerOverlapNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

// Beneficiaries
export type TranslationBeneficiaries = {
  beneficiaries: TranslationFieldPropertiesWithOptions<BeneficiariesType>;
  beneficiariesOther: TranslationFieldProperties;
  beneficiariesNote: TranslationFieldProperties;
  treatDualElligibleDifferent: TranslationFieldPropertiesWithOptions<TriStateAnswer>;
  treatDualElligibleDifferentHow: TranslationFieldProperties;
  treatDualElligibleDifferentNote: TranslationFieldProperties;
  excludeCertainCharacteristics: TranslationFieldPropertiesWithOptions<TriStateAnswer>;
  excludeCertainCharacteristicsCriteria: TranslationFieldProperties;
  excludeCertainCharacteristicsNote: TranslationFieldProperties;
  // People Impact
  numberPeopleImpacted: TranslationFieldProperties;
  estimateConfidence: TranslationFieldPropertiesWithOptions<ConfidenceType>;
  confidenceNote: TranslationFieldProperties;
  beneficiarySelectionMethod: TranslationFieldPropertiesWithOptions<SelectionMethodType>;
  beneficiarySelectionNote: TranslationFieldProperties;
  beneficiarySelectionOther: TranslationFieldProperties;
  // Frequency
  beneficiarySelectionFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  beneficiarySelectionFrequencyNote: TranslationFieldProperties;
  beneficiarySelectionFrequencyOther: TranslationFieldProperties;
  beneficiaryOverlap: TranslationFieldPropertiesWithOptions<OverlapType>;
  beneficiaryOverlapNote: TranslationFieldProperties;
  precedenceRules: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

// Operations Evaluation and Learning
export type TranslationOpsEvalAndLearning = {
  agencyOrStateHelp: TranslationFieldPropertiesWithOptions<AgencyOrStateHelpType>;
  agencyOrStateHelpOther: TranslationFieldProperties;
  agencyOrStateHelpNote: TranslationFieldProperties;
  stakeholders: TranslationFieldPropertiesWithOptions<StakeholdersType>;
  stakeholdersOther: TranslationFieldProperties;
  stakeholdersNote: TranslationFieldProperties;
  helpdeskUse: TranslationFieldPropertiesWithOptions<Bool>;
  helpdeskUseNote: TranslationFieldProperties;
  contractorSupport: TranslationFieldPropertiesWithOptions<ContractorSupportType>;
  contractorSupportOther: TranslationFieldProperties;
  contractorSupportHow: TranslationFieldProperties;
  contractorSupportNote: TranslationFieldProperties;
  iddocSupport: TranslationFieldPropertiesWithOptions<Bool>;
  iddocSupportNote: TranslationFieldProperties;
  // IDDOC
  technicalContactsIdentified: TranslationFieldPropertiesWithOptions<Bool>;
  technicalContactsIdentifiedDetail: TranslationFieldProperties;
  technicalContactsIdentifiedNote: TranslationFieldProperties;
  captureParticipantInfo: TranslationFieldPropertiesWithOptions<Bool>;
  captureParticipantInfoNote: TranslationFieldProperties;
  icdOwner: TranslationFieldProperties;
  draftIcdDueDate: TranslationFieldProperties;
  icdNote: TranslationFieldProperties;
  // IDDOC Testing
  uatNeeds: TranslationFieldProperties;
  stcNeeds: TranslationFieldProperties;
  testingTimelines: TranslationFieldProperties;
  testingNote: TranslationFieldProperties;
  dataMonitoringFileTypes: TranslationFieldPropertiesWithOptions<MonitoringFileType>;
  dataMonitoringFileOther: TranslationFieldProperties;
  dataResponseType: TranslationFieldProperties;
  dataResponseFileFrequency: TranslationFieldProperties;
  // IDDOC Monitoring
  dataFullTimeOrIncremental: TranslationFieldPropertiesWithOptions<DataFullTimeOrIncrementalType>;
  eftSetUp: TranslationFieldPropertiesWithOptions<Bool>;
  unsolicitedAdjustmentsIncluded: TranslationFieldPropertiesWithOptions<Bool>;
  dataFlowDiagramsNeeded: TranslationFieldPropertiesWithOptions<Bool>;
  produceBenefitEnhancementFiles: TranslationFieldPropertiesWithOptions<Bool>;
  fileNamingConventions: TranslationFieldProperties;
  dataMonitoringNote: TranslationFieldProperties;
  // Performance
  benchmarkForPerformance: TranslationFieldPropertiesWithOptions<BenchmarkForPerformanceType>;
  benchmarkForPerformanceNote: TranslationFieldProperties;
  computePerformanceScores: TranslationFieldPropertiesWithOptions<Bool>;
  computePerformanceScoresNote: TranslationFieldProperties;
  riskAdjustPerformance: TranslationFieldPropertiesWithOptions<Bool>;
  riskAdjustFeedback: TranslationFieldPropertiesWithOptions<Bool>;
  riskAdjustPayments: TranslationFieldPropertiesWithOptions<Bool>;
  riskAdjustOther: TranslationFieldPropertiesWithOptions<Bool>;
  riskAdjustNote: TranslationFieldProperties;
  appealPerformance: TranslationFieldPropertiesWithOptions<Bool>;
  appealFeedback: TranslationFieldPropertiesWithOptions<Bool>;
  appealPayments: TranslationFieldPropertiesWithOptions<Bool>;
  appealOther: TranslationFieldPropertiesWithOptions<Bool>;
  appealNote: TranslationFieldProperties;
  // Evaluation
  evaluationApproaches: TranslationFieldPropertiesWithOptions<EvaluationApproachType>;
  evaluationApproachOther: TranslationFieldProperties;
  evalutaionApproachNote: TranslationFieldProperties;
  ccmInvolvment: TranslationFieldPropertiesWithOptions<CcmInvolvmentType>;
  ccmInvolvmentOther: TranslationFieldProperties;
  ccmInvolvmentNote: TranslationFieldProperties;
  dataNeededForMonitoring: TranslationFieldPropertiesWithOptions<DataForMonitoringType>;
  dataNeededForMonitoringOther: TranslationFieldProperties;
  dataNeededForMonitoringNote: TranslationFieldProperties;
  dataToSendParticicipants: TranslationFieldPropertiesWithOptions<DataToSendParticipantsType>;
  dataToSendParticicipantsOther: TranslationFieldProperties;
  dataToSendParticicipantsNote: TranslationFieldProperties;
  shareCclfData: TranslationFieldPropertiesWithOptions<Bool>;
  shareCclfDataNote: TranslationFieldProperties;
  // CCW And Quality
  sendFilesBetweenCcw: TranslationFieldPropertiesWithOptions<Bool>;
  sendFilesBetweenCcwNote: TranslationFieldProperties;
  appToSendFilesToKnown: TranslationFieldPropertiesWithOptions<Bool>;
  appToSendFilesToWhich: TranslationFieldProperties;
  appToSendFilesToNote: TranslationFieldProperties;
  useCcwForFileDistribiutionToParticipants: TranslationFieldPropertiesWithOptions<Bool>;
  useCcwForFileDistribiutionToParticipantsNote: TranslationFieldProperties;
  developNewQualityMeasures: TranslationFieldPropertiesWithOptions<Bool>;
  developNewQualityMeasuresNote: TranslationFieldProperties;
  qualityPerformanceImpactsPayment: TranslationFieldPropertiesWithOptions<Bool>;
  qualityPerformanceImpactsPaymentNote: TranslationFieldProperties;
  // Data Sharing
  dataSharingStarts: TranslationFieldPropertiesWithOptions<DataStartsType>;
  dataSharingStartsOther: TranslationFieldProperties;
  dataSharingFrequency: TranslationFieldPropertiesWithOptions<DataFrequencyType>;
  dataSharingFrequencyOther: TranslationFieldProperties;
  dataSharingStartsNote: TranslationFieldProperties;
  dataCollectionStarts: TranslationFieldPropertiesWithOptions<DataStartsType>;
  dataCollectionStartsOther: TranslationFieldProperties;
  dataCollectionFrequency: TranslationFieldPropertiesWithOptions<DataFrequencyType>;
  dataCollectionFrequencyOther: TranslationFieldProperties;
  dataCollectionFrequencyNote: TranslationFieldProperties;
  qualityReportingStarts: TranslationFieldPropertiesWithOptions<DataStartsType>;
  qualityReportingStartsOther: TranslationFieldProperties;
  qualityReportingStartsNote: TranslationFieldProperties;
  // Learning
  modelLearningSystems: TranslationFieldPropertiesWithOptions<ModelLearningSystemType>;
  modelLearningSystemsOther: TranslationFieldProperties;
  modelLearningSystemsNote: TranslationFieldProperties;
  anticipatedChallenges: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

export type TranslationPlan = {
  modelPlan: TranslationModelPlan;
  basics: TranslationBasics;
  generalCharacteristics: TranslationGeneralCharacteristics;
  participantsAndProviders: TranslationParticipantsAndProviders;
  beneficiaries: TranslationBeneficiaries;
  opsEvalAndLearning: TranslationOpsEvalAndLearning;
};
