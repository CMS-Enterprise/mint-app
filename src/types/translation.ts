/*
  Typed translation mappings for question centric architecture for a model plan
  Used to dynamically iterate/render questions, answers for functionality such as csv export and change history
*/
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
  KeyCharacteristic,
  ModelCategory,
  ModelLearningSystemType,
  ModelStatus,
  ModelType,
  ModelViewFilter,
  MonitoringFileType,
  NonClaimsBasedPayType,
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
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object';
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
  filterGroups?: ModelViewFilter[]; // Used to render questions within Readonly filter group view (Also CSV/PDF export)
  tags?: string[];
  isModelLinks?: boolean; // Used to designate if a field is a ExistingModelLinks type with nested fields - ex: names,
  isPageStart?: boolean; // Is the question the first question on a page - used for styling in ReadOnly
  readonlyHeader?: string; // Indicates if a header is required at the start of the question/section.  Normally used in conjunction with pageStart
  adjacentPositioning?: {
    // Designates if question should be rendered side by side. 'adjacentField' is the reference to the other field to be rendered adjacent to the current
    position: 'left' | 'right';
    adjacentField: string;
  };
  isOtherType?: boolean; // Is a question a followup to another that doesn't designate it's own readonly question/line,
  hideRelatedQuestionAlert?: boolean; // Ex: CCW and Quality questions do not need to render the alert immediately following the question
};

/* 
  Extended type for questions that are conditionally rendered by a parent evaluation
  Takes in a enum/generic for Parent field to check for condition
  Closure is needed to access parent scope of object
*/
type ParentRelation<T extends keyof T | string> = {
  parentRelation: () => TranslationConfigType<T>;
};

/* 
  References the parent option/enum value as the key and the child field it references as the value
  Child relations only pertain to specific questions that remain hidden in readonly per Figma
  This does not include generic "Other" questions or single line followups, unless specifically stated
  Closure is needed to access parent scope of object
*/
type ChildRelation<
  T extends keyof T | string,
  C extends keyof C | string | void = void
> = {
  childRelation: Partial<Record<T, (() => TranslationConfigType<T, C>)[]>>;
  disconnectedChildren?: boolean; // If child relations are not on the same page/sequential.  Readonly will render the parent question label if so
  disconnectedLabel?: string; // Translation key to readonly alt text to render on alerts if children are hidden
};

/* 
  Extended type for questions that have options - boolean, radio, checkbox, etc.
  Takes in a enum/generic for translation key
*/
type TranslationOptions<T extends keyof T | string> = {
  options: Record<T, string>;
  readonlyOptions?: Partial<Record<T, string>>; // An alternative set of translations for options specific to readonly
  optionsLabels?: Partial<Record<T, string>>; // Sub labels to be rendered directly underneath options
  tooltips?: Partial<Record<T, string>>; // Information to be rendered inside a tooltip
  optionsRelatedInfo?: Partial<Record<T, string>>; // T values should/could be a subset of the keys of enum values
};

/* 
  Extended type for questions that have options - boolean, radio, checkbox, etc.
  Takes in a enum/generic for translation key
*/
type OptionsWithChildRelation<
  T extends keyof T | string,
  C extends keyof C | string | void = void
> = TranslationOptions<T> & ChildRelation<T, C>;

/* 
  Apply/combine ParentRelation and TranslationFieldProperties to TranslationFieldPropertiesWithParent
*/
export type TranslationFieldPropertiesWithParent<
  T extends keyof T | string
> = TranslationFieldProperties & ParentRelation<T>;

/* 
  Apply/combine OptionsWithChildRelation and TranslationFieldProperties to TranslationFieldPropertiesWithOptions
*/
export type TranslationFieldPropertiesWithOptions<
  T extends keyof T | string
> = TranslationFieldProperties & TranslationOptions<T>;

/* 
  Extended type for questions that have options - boolean, radio, checkbox, etc. as well as conditional children
  Takes in a enum/generic for translation key
*/
export type TranslationFieldPropertiesWithOptionsAndChildren<
  T extends keyof T | string,
  C extends keyof C | string | void = void
> = TranslationFieldProperties & OptionsWithChildRelation<T, C>;

/* 
  Extended type for questions that have options - boolean, radio, checkbox, etc.
  Extended type for questions that are conditionally rendered by a parent evaluation
  Takes in a enum parameter for translation key as well as enum parameter fof Parent field to check for condition
*/
export type TranslationFieldPropertiesWithOptionsAndParent<
  T extends keyof T | string,
  C extends keyof C | string | void = void
> = TranslationFieldProperties & TranslationOptions<T> & ParentRelation<T>;

/* 
  Extended type for questions that are conditionally rendered by a parent evaluation and have condtionally rendered children as well
  Takes in a enum parameter for translation key as well as enum parameter fof Parent field to check for condition
*/
export type TranslationFieldPropertiesWithParentAndChildren<
  T extends keyof T | string,
  C extends keyof C | string | void = void
> = TranslationFieldProperties &
  TranslationFieldPropertiesWithOptionsAndChildren<T> &
  ParentRelation<T>;

/* 
  Union type for all translation types
*/
export type TranslationConfigType<
  T extends keyof T | string,
  C extends keyof C | string | void = void
> =
  | TranslationFieldProperties
  | TranslationFieldPropertiesWithParent<T>
  | TranslationFieldPropertiesWithOptions<T>
  | TranslationFieldPropertiesWithOptionsAndChildren<T, C>
  | TranslationFieldPropertiesWithOptionsAndParent<T, C>
  | TranslationFieldPropertiesWithParentAndChildren<T, C>;

/* 
  Type guard to check if config is of type TranslationFieldProperties
*/
export const isTranslationFieldProperties = <
  T extends keyof T | string,
  C extends keyof C | string | void = void
>(
  config: TranslationConfigType<T, C>
): config is TranslationFieldProperties => {
  return !Object.hasOwn(config, 'options');
};

/* 
  Type guard to check if config is of type TranslationFieldPropertiesWithParent
*/
export const isTranslationFieldPropertiesWithParent = <
  T extends keyof T | string,
  C extends keyof C | string | void = void
>(
  config: TranslationConfigType<T, C>
): config is TranslationFieldPropertiesWithParent<T> => {
  return Object.hasOwn(config, 'parentRelation');
};

/* 
  Type guard to check if config is of type TranslationFieldPropertiesWithOptions
*/
export const isTranslationFieldPropertiesWithOptions = <
  T extends keyof T | string,
  C extends keyof C | string | void = void
>(
  config: TranslationConfigType<T, C>
): config is TranslationFieldPropertiesWithOptions<T> => {
  return Object.hasOwn(config, 'options');
};

/* 
  Type guard to check if config is of type TranslationFieldPropertiesWithOptionsAndChildren
*/
export const isTranslationFieldPropertiesWithOptionsAndChildren = <
  T extends keyof T | string,
  C extends keyof C | string | void = void
>(
  config: TranslationConfigType<T, C>
): config is TranslationFieldPropertiesWithOptionsAndChildren<T, C> => {
  return Object.hasOwn(config, 'childRelation');
};

/* 
  Type guard to check if config is of type TranslationFieldPropertiesWithOptionsAndParent
*/
export const isTranslationFieldPropertiesWithOptionsAndParent = <
  T extends keyof T | string,
  C extends keyof C | string | void = void
>(
  config: TranslationConfigType<T, C>
): config is TranslationFieldPropertiesWithOptionsAndParent<T, C> => {
  return (
    Object.hasOwn(config, 'parentRelation') && Object.hasOwn(config, 'options')
  );
};

/* 
  Type guard to check if config is of type isTranslationFieldPropertiesWithParentAndChildren
*/
export const isTranslationFieldPropertiesWithParentAndChildren = <
  T extends keyof T | string,
  C extends keyof C | string | void = void
>(
  config: TranslationConfigType<T, C>
): config is TranslationFieldPropertiesWithParentAndChildren<T, C> => {
  return (
    Object.hasOwn(config, 'parentRelation') &&
    Object.hasOwn(config, 'childRelation')
  );
};

/* 
  Model Plan
*/
export type TranslationModelPlan = {
  modelName: TranslationFieldProperties;
  previousName: TranslationFieldProperties;
  nameHistory: TranslationFieldProperties;
  abbreviation: TranslationFieldProperties;
  archived: TranslationFieldPropertiesWithOptions<Bool>;
  status: TranslationFieldPropertiesWithOptions<ModelStatus>;
};

/* 
  Basics
*/
export type TranslationBasics = {
  // Model Plan
  amsModelID: TranslationFieldProperties;
  demoCode: TranslationFieldProperties;
  modelCategory: TranslationFieldPropertiesWithOptions<ModelCategory>;
  additionalModelCategories: TranslationFieldPropertiesWithOptions<ModelCategory>;
  cmsCenters: TranslationFieldPropertiesWithOptions<CmsCenter>;
  cmmiGroups: TranslationFieldPropertiesWithOptions<CmmiGroup>;
  // Overview
  modelType: TranslationFieldPropertiesWithOptions<ModelType>;
  modelTypeOther: TranslationFieldProperties;
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

/* 
  General Characteristics
*/
export type TranslationGeneralCharacteristics = {
  isNewModel: TranslationFieldPropertiesWithOptionsAndChildren<Bool>;
  existingModel: TranslationFieldPropertiesWithParent<Bool>;
  resemblesExistingModel: TranslationFieldPropertiesWithOptionsAndChildren<YesNoOtherType>;
  resemblesExistingModelWhyHow: TranslationFieldProperties;
  resemblesExistingModelHow: TranslationFieldPropertiesWithParent<YesNoOtherType>;
  resemblesExistingModelNote: TranslationFieldProperties;
  resemblesExistingModelWhich: TranslationFieldPropertiesWithOptionsAndParent<
    'Other',
    YesNoOtherType
  >;
  resemblesExistingModelOtherSpecify: TranslationFieldProperties;
  resemblesExistingModelOtherSelected: TranslationFieldPropertiesWithOptions<Bool>;
  resemblesExistingModelOtherOption: TranslationFieldProperties;
  participationInModelPrecondition: TranslationFieldPropertiesWithOptionsAndChildren<YesNoOtherType>;
  participationInModelPreconditionWhich: TranslationFieldPropertiesWithOptionsAndParent<
    'Other',
    YesNoOtherType
  >;
  participationInModelPreconditionOtherSpecify: TranslationFieldProperties;
  participationInModelPreconditionOtherSelected: TranslationFieldPropertiesWithOptions<Bool>;
  participationInModelPreconditionOtherOption: TranslationFieldProperties;
  participationInModelPreconditionWhyHow: TranslationFieldPropertiesWithParent<YesNoOtherType>;
  participationInModelPreconditionNote: TranslationFieldProperties;
  hasComponentsOrTracks: TranslationFieldPropertiesWithOptions<Bool>;
  hasComponentsOrTracksDiffer: TranslationFieldProperties;
  hasComponentsOrTracksNote: TranslationFieldProperties;
  // Key Characteristics
  agencyOrStateHelp: TranslationFieldPropertiesWithOptions<AgencyOrStateHelpType>;
  agencyOrStateHelpOther: TranslationFieldProperties;
  agencyOrStateHelpNote: TranslationFieldProperties;
  alternativePaymentModelTypes: TranslationFieldPropertiesWithOptions<AlternativePaymentModelType>;
  alternativePaymentModelNote: TranslationFieldProperties;
  keyCharacteristics: TranslationFieldPropertiesWithOptionsAndChildren<KeyCharacteristic>;
  keyCharacteristicsNote: TranslationFieldProperties;
  keyCharacteristicsOther: TranslationFieldProperties;
  collectPlanBids: TranslationFieldPropertiesWithOptionsAndParent<Bool>;
  collectPlanBidsNote: TranslationFieldProperties;
  managePartCDEnrollment: TranslationFieldPropertiesWithOptionsAndParent<Bool>;
  managePartCDEnrollmentNote: TranslationFieldProperties;
  planContractUpdated: TranslationFieldPropertiesWithOptionsAndParent<Bool>;
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
  geographiesTargeted: TranslationFieldPropertiesWithOptionsAndChildren<Bool>;
  geographiesTargetedTypes: TranslationFieldPropertiesWithParentAndChildren<
    GeographyType,
    Bool
  >;
  geographiesTargetedTypesOther: TranslationFieldProperties;
  geographiesStatesAndTerritories: TranslationFieldPropertiesWithOptionsAndParent<
    StatesAndTerritories,
    GeographyType
  >;
  geographiesRegionTypes: TranslationFieldPropertiesWithOptionsAndParent<
    GeographyRegionType,
    GeographyType
  >;
  geographiesTargetedAppliedTo: TranslationFieldPropertiesWithOptionsAndParent<GeographyApplication>;
  geographiesTargetedAppliedToOther: TranslationFieldProperties;
  geographiesTargetedNote: TranslationFieldProperties;
  participationOptions: TranslationFieldPropertiesWithOptions<Bool>;
  participationOptionsNote: TranslationFieldProperties;
  agreementTypes: TranslationFieldPropertiesWithOptionsAndChildren<AgreementType>;
  agreementTypesOther: TranslationFieldProperties;
  multiplePatricipationAgreementsNeeded: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    AgreementType
  >;
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

/* 
  Participants and Providers
*/
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
  participantAddedFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  participantAddedFrequencyContinually: TranslationFieldProperties;
  participantAddedFrequencyOther: TranslationFieldProperties;
  participantAddedFrequencyNote: TranslationFieldProperties;
  participantRemovedFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  participantRemovedFrequencyContinually: TranslationFieldProperties;
  participantRemovedFrequencyOther: TranslationFieldProperties;
  participantRemovedFrequencyNote: TranslationFieldProperties;
  communicationMethod: TranslationFieldPropertiesWithOptions<ParticipantCommunicationType>;
  communicationMethodOther: TranslationFieldProperties;
  communicationNote: TranslationFieldProperties;
  riskType: TranslationFieldPropertiesWithOptions<ParticipantRiskType>;
  riskOther: TranslationFieldProperties;
  riskNote: TranslationFieldProperties;
  willRiskChange: TranslationFieldPropertiesWithOptions<Bool>;
  willRiskChangeNote: TranslationFieldProperties;
  // Coordination
  participantRequireFinancialGuarantee: TranslationFieldPropertiesWithOptions<Bool>;
  participantRequireFinancialGuaranteeType: TranslationFieldPropertiesWithOptions<ParticipantRequireFinancialGuaranteeType>;
  participantRequireFinancialGuaranteeOther: TranslationFieldProperties;
  participantRequireFinancialGuaranteeNote: TranslationFieldProperties;
  coordinateWork: TranslationFieldPropertiesWithOptions<Bool>;
  coordinateWorkNote: TranslationFieldProperties;
  gainsharePayments: TranslationFieldPropertiesWithOptionsAndChildren<
    Bool,
    Bool
  >;
  gainsharePaymentsTrack: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  gainsharePaymentsEligibility: TranslationFieldPropertiesWithOptionsAndParent<
    GainshareArrangementEligibility,
    Bool
  >;
  gainsharePaymentsEligibilityOther: TranslationFieldProperties;
  gainsharePaymentsNote: TranslationFieldProperties;
  participantsIds: TranslationFieldPropertiesWithOptions<ParticipantsIdType>;
  participantsIdsOther: TranslationFieldProperties;
  participantsIDSNote: TranslationFieldProperties;
  // Provider Options
  providerAdditionFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  providerAdditionFrequencyContinually: TranslationFieldProperties;
  providerAdditionFrequencyOther: TranslationFieldProperties;
  providerAdditionFrequencyNote: TranslationFieldProperties;
  providerAddMethod: TranslationFieldPropertiesWithOptions<ProviderAddType>;
  providerAddMethodOther: TranslationFieldProperties;
  providerAddMethodNote: TranslationFieldProperties;
  providerLeaveMethod: TranslationFieldPropertiesWithOptions<ProviderLeaveType>;
  providerLeaveMethodOther: TranslationFieldProperties;
  providerLeaveMethodNote: TranslationFieldProperties;
  providerRemovalFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  providerRemovalFrequencyContinually: TranslationFieldProperties;
  providerRemovalFrequencyOther: TranslationFieldProperties;
  providerRemovalFrequencyNote: TranslationFieldProperties;
  providerOverlap: TranslationFieldPropertiesWithOptionsAndChildren<
    OverlapType,
    OverlapType
  >;
  providerOverlapHierarchy: TranslationFieldPropertiesWithParent<OverlapType>;
  providerOverlapNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

/* 
  Beneficiaries
*/
export type TranslationBeneficiaries = {
  beneficiaries: TranslationFieldPropertiesWithOptions<BeneficiariesType>;
  diseaseSpecificGroup: TranslationFieldProperties;
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
  beneficiarySelectionFrequencyContinually: TranslationFieldProperties;
  beneficiarySelectionFrequencyOther: TranslationFieldProperties;
  beneficiarySelectionFrequencyNote: TranslationFieldProperties;
  beneficiaryRemovalFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  beneficiaryRemovalFrequencyContinually: TranslationFieldProperties;
  beneficiaryRemovalFrequencyOther: TranslationFieldProperties;
  beneficiaryRemovalFrequencyNote: TranslationFieldProperties;
  beneficiaryOverlap: TranslationFieldPropertiesWithOptions<OverlapType>;
  beneficiaryOverlapNote: TranslationFieldProperties;
  precedenceRules: TranslationFieldPropertiesWithOptions<YesNoType>;
  precedenceRulesYes: TranslationFieldProperties;
  precedenceRulesNo: TranslationFieldProperties;
  precedenceRulesNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

/* 
  Operations Evaluation and Learning
*/
export type TranslationOpsEvalAndLearning = {
  stakeholders: TranslationFieldPropertiesWithOptions<StakeholdersType>;
  stakeholdersOther: TranslationFieldProperties;
  stakeholdersNote: TranslationFieldProperties;
  helpdeskUse: TranslationFieldPropertiesWithOptions<Bool>;
  helpdeskUseNote: TranslationFieldProperties;
  contractorSupport: TranslationFieldPropertiesWithOptionsAndChildren<ContractorSupportType>;
  contractorSupportOther: TranslationFieldProperties;
  contractorSupportHow: TranslationFieldPropertiesWithParent<ContractorSupportType>;
  contractorSupportNote: TranslationFieldProperties;
  iddocSupport: TranslationFieldPropertiesWithOptionsAndChildren<Bool>;
  iddocSupportNote: TranslationFieldProperties;
  // IDDOC
  technicalContactsIdentified: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  technicalContactsIdentifiedDetail: TranslationFieldProperties;
  technicalContactsIdentifiedNote: TranslationFieldProperties;
  captureParticipantInfo: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  captureParticipantInfoNote: TranslationFieldProperties;
  icdOwner: TranslationFieldPropertiesWithParent<Bool>;
  draftIcdDueDate: TranslationFieldPropertiesWithParent<Bool>;
  icdNote: TranslationFieldPropertiesWithParent<Bool>;
  // IDDOC Testing
  uatNeeds: TranslationFieldPropertiesWithParent<Bool>;
  stcNeeds: TranslationFieldPropertiesWithParent<Bool>;
  testingTimelines: TranslationFieldPropertiesWithParent<Bool>;
  testingNote: TranslationFieldProperties;
  dataMonitoringFileTypes: TranslationFieldPropertiesWithOptionsAndParent<
    MonitoringFileType,
    Bool
  >;
  dataMonitoringFileOther: TranslationFieldProperties;
  dataResponseType: TranslationFieldPropertiesWithParent<Bool>;
  dataResponseFileFrequency: TranslationFieldPropertiesWithParent<Bool>;
  // IDDOC Monitoring
  dataFullTimeOrIncremental: TranslationFieldPropertiesWithOptionsAndParent<
    DataFullTimeOrIncrementalType,
    Bool
  >;
  eftSetUp: TranslationFieldPropertiesWithOptionsAndParent<Bool, Bool>;
  unsolicitedAdjustmentsIncluded: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  dataFlowDiagramsNeeded: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  produceBenefitEnhancementFiles: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  fileNamingConventions: TranslationFieldPropertiesWithParent<Bool>;
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
  ccmInvolvment: TranslationFieldPropertiesWithOptionsAndChildren<CcmInvolvmentType>;
  ccmInvolvmentOther: TranslationFieldProperties;
  ccmInvolvmentNote: TranslationFieldProperties;
  dataNeededForMonitoring: TranslationFieldPropertiesWithOptionsAndChildren<DataForMonitoringType>;
  dataNeededForMonitoringOther: TranslationFieldProperties;
  dataNeededForMonitoringNote: TranslationFieldProperties;
  dataToSendParticicipants: TranslationFieldPropertiesWithOptions<DataToSendParticipantsType>;
  dataToSendParticicipantsOther: TranslationFieldProperties;
  dataToSendParticicipantsNote: TranslationFieldProperties;
  shareCclfData: TranslationFieldPropertiesWithOptions<Bool>;
  shareCclfDataNote: TranslationFieldProperties;
  // CCW And Quality
  sendFilesBetweenCcw: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  sendFilesBetweenCcwNote: TranslationFieldProperties;
  appToSendFilesToKnown: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  appToSendFilesToWhich: TranslationFieldProperties;
  appToSendFilesToNote: TranslationFieldProperties;
  useCcwForFileDistribiutionToParticipants: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    Bool
  >;
  useCcwForFileDistribiutionToParticipantsNote: TranslationFieldProperties;
  developNewQualityMeasures: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    DataForMonitoringType
  >;
  developNewQualityMeasuresNote: TranslationFieldProperties;
  qualityPerformanceImpactsPayment: TranslationFieldPropertiesWithOptionsAndParent<
    YesNoOtherType,
    DataForMonitoringType
  >;
  qualityPerformanceImpactsPaymentOther: TranslationFieldProperties;
  qualityPerformanceImpactsPaymentNote: TranslationFieldProperties;
  // Data Sharing
  dataSharingStarts: TranslationFieldPropertiesWithOptions<DataStartsType>;
  dataSharingStartsOther: TranslationFieldProperties;
  dataSharingFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  dataSharingFrequencyContinually: TranslationFieldProperties;
  dataSharingFrequencyOther: TranslationFieldProperties;
  dataSharingStartsNote: TranslationFieldProperties;
  dataCollectionStarts: TranslationFieldPropertiesWithOptions<DataStartsType>;
  dataCollectionStartsOther: TranslationFieldProperties;
  dataCollectionFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  dataCollectionFrequencyContinually: TranslationFieldProperties;
  dataCollectionFrequencyOther: TranslationFieldProperties;
  dataCollectionFrequencyNote: TranslationFieldProperties;
  qualityReportingStarts: TranslationFieldPropertiesWithOptions<DataStartsType>;
  qualityReportingStartsOther: TranslationFieldProperties;
  qualityReportingStartsNote: TranslationFieldProperties;
  qualityReportingFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  qualityReportingFrequencyContinually: TranslationFieldProperties;
  qualityReportingFrequencyOther: TranslationFieldProperties;
  // Learning
  modelLearningSystems: TranslationFieldPropertiesWithOptions<ModelLearningSystemType>;
  modelLearningSystemsOther: TranslationFieldProperties;
  modelLearningSystemsNote: TranslationFieldProperties;
  anticipatedChallenges: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

/* 
  Payments
*/
export type TranslationPayments = {
  fundingSource: TranslationFieldPropertiesWithOptions<FundingSource>;
  fundingSourceMedicareAInfo: TranslationFieldProperties;
  fundingSourceMedicareBInfo: TranslationFieldProperties;
  fundingSourceOther: TranslationFieldProperties;
  fundingSourceNote: TranslationFieldProperties;
  fundingSourceR: TranslationFieldPropertiesWithOptions<FundingSource>;
  fundingSourceRMedicareAInfo: TranslationFieldProperties;
  fundingSourceRMedicareBInfo: TranslationFieldProperties;
  fundingSourceROther: TranslationFieldProperties;
  fundingSourceRNote: TranslationFieldProperties;
  payRecipients: TranslationFieldPropertiesWithOptions<PayRecipient>;
  payRecipientsOtherSpecification: TranslationFieldProperties;
  payRecipientsNote: TranslationFieldProperties;
  payType: TranslationFieldPropertiesWithOptionsAndChildren<PayType>;
  payTypeNote: TranslationFieldProperties;
  // Claims Based Payment
  payClaims: TranslationFieldPropertiesWithParentAndChildren<
    ClaimsBasedPayType,
    PayType
  >;
  payClaimsOther: TranslationFieldProperties;
  payClaimsNote: TranslationFieldProperties;
  shouldAnyProvidersExcludedFFSSystems: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  shouldAnyProviderExcludedFFSSystemsNote: TranslationFieldProperties;
  changesMedicarePhysicianFeeSchedule: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  changesMedicarePhysicianFeeScheduleNote: TranslationFieldProperties;
  affectsMedicareSecondaryPayerClaims: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  affectsMedicareSecondaryPayerClaimsHow: TranslationFieldProperties;
  affectsMedicareSecondaryPayerClaimsNote: TranslationFieldProperties;
  payModelDifferentiation: TranslationFieldPropertiesWithParent<PayType>;
  // Anticipating Dependencies
  creatingDependenciesBetweenServices: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  creatingDependenciesBetweenServicesNote: TranslationFieldProperties;
  needsClaimsDataCollection: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  needsClaimsDataCollectionNote: TranslationFieldProperties;
  providingThirdPartyFile: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  isContractorAwareTestDataRequirements: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  // Beneficiary Cost Sharing
  beneficiaryCostSharingLevelAndHandling: TranslationFieldPropertiesWithParent<ClaimsBasedPayType>;
  waiveBeneficiaryCostSharingForAnyServices: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    ClaimsBasedPayType
  >;
  waiveBeneficiaryCostSharingServiceSpecification: TranslationFieldProperties;
  waiverOnlyAppliesPartOfPayment: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    ClaimsBasedPayType
  >;
  waiveBeneficiaryCostSharingNote: TranslationFieldProperties;
  // Non-Claims Based Payments
  nonClaimsPayments: TranslationFieldPropertiesWithOptionsAndParent<
    NonClaimsBasedPayType,
    PayType
  >;
  nonClaimsPaymentsNote: TranslationFieldProperties;
  nonClaimsPaymentOther: TranslationFieldProperties;
  paymentCalculationOwner: TranslationFieldPropertiesWithParent<PayType>;
  numberPaymentsPerPayCycle: TranslationFieldPropertiesWithParent<PayType>;
  numberPaymentsPerPayCycleNote: TranslationFieldProperties;
  sharedSystemsInvolvedAdditionalClaimPayment: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  sharedSystemsInvolvedAdditionalClaimPaymentNote: TranslationFieldProperties;
  planningToUseInnovationPaymentContractor: TranslationFieldPropertiesWithOptionsAndParent<
    Bool,
    PayType
  >;
  planningToUseInnovationPaymentContractorNote: TranslationFieldProperties;
  // Complexity
  expectedCalculationComplexityLevel: TranslationFieldPropertiesWithOptions<ComplexityCalculationLevelType>;
  expectedCalculationComplexityLevelNote: TranslationFieldProperties;
  claimsProcessingPrecedence: TranslationFieldPropertiesWithOptions<Bool>;
  claimsProcessingPrecedenceOther: TranslationFieldProperties;
  claimsProcessingPrecedenceNote: TranslationFieldProperties;
  canParticipantsSelectBetweenPaymentMechanisms: TranslationFieldPropertiesWithOptions<Bool>;
  canParticipantsSelectBetweenPaymentMechanismsHow: TranslationFieldProperties;
  canParticipantsSelectBetweenPaymentMechanismsNote: TranslationFieldProperties;
  anticipatedPaymentFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  anticipatedPaymentFrequencyContinually: TranslationFieldProperties;
  anticipatedPaymentFrequencyOther: TranslationFieldProperties;
  anticipatedPaymentFrequencyNote: TranslationFieldProperties;
  // Recover Payment
  willRecoverPayments: TranslationFieldPropertiesWithOptions<Bool>;
  willRecoverPaymentsNote: TranslationFieldProperties;
  anticipateReconcilingPaymentsRetrospectively: TranslationFieldPropertiesWithOptions<Bool>;
  anticipateReconcilingPaymentsRetrospectivelyNote: TranslationFieldProperties;
  paymentReconciliationFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  paymentReconciliationFrequencyContinually: TranslationFieldProperties;
  paymentReconciliationFrequencyOther: TranslationFieldProperties;
  paymentReconciliationFrequencyNote: TranslationFieldProperties;
  paymentDemandRecoupmentFrequency: TranslationFieldPropertiesWithOptions<FrequencyType>;
  paymentDemandRecoupmentFrequencyContinually: TranslationFieldProperties;
  paymentDemandRecoupmentFrequencyOther: TranslationFieldProperties;
  paymentDemandRecoupmentFrequencyNote: TranslationFieldProperties;
  paymentStartDate: TranslationFieldProperties;
  paymentStartDateNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

/* 
  Collaborators
*/
export type TranslationCollaborators = {
  teamRoles: TranslationFieldPropertiesWithOptions<TeamRole>;
  username: TranslationFieldProperties;
};

export type TranslationPlan = {
  modelPlan: TranslationModelPlan;
  basics: TranslationBasics;
  generalCharacteristics: TranslationGeneralCharacteristics;
  participantsAndProviders: TranslationParticipantsAndProviders;
  beneficiaries: TranslationBeneficiaries;
  opsEvalAndLearning: TranslationOpsEvalAndLearning;
  payments: TranslationPayments;
  collaborators: TranslationCollaborators;
};

export type TranslationPlanSection =
  | TranslationPlan['basics']
  | TranslationPlan['beneficiaries']
  | TranslationPlan['generalCharacteristics']
  | TranslationPlan['participantsAndProviders']
  | TranslationPlan['beneficiaries']
  | TranslationPlan['opsEvalAndLearning']
  | TranslationPlan['payments'];

export enum PlanSection {
  MODEL_PLAN = 'modelPlan',
  BASICS = 'basics',
  GENERAL_CHARACTERISTICS = 'generalCharacteristics',
  PARTICPANTS_AND_PROVIDERS = 'participantsAndProviders',
  BENEFICIARIES = 'beneficiaries',
  OPS_EVAL_AND_LEARNING = 'opsEvalAndLearning',
  PAYMENTS = 'payments',
  COLLABORATORS = 'collaborators'
}
