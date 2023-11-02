import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Any represents any GraphQL value. */
  Any: { input: any; output: any; }
  /** Maps an arbitrary GraphQL value to a map[string]interface{} Go type. */
  Map: { input: any; output: any; }
  /** Time values are represented as strings using RFC3339 format, for example 2019-10-12T07:20:50G.52Z */
  Time: { input: any; output: any; }
  /** UUIDs are represented using 36 ASCII characters, for example B0511859-ADE6-4A67-8969-16EC280C0E1A */
  UUID: { input: any; output: any; }
  /**
   * https://gqlgen.com/reference/file-upload/
   * Represents a multipart file upload
   */
  Upload: { input: any; output: any; }
};

export enum ActionType {
  /** An administrative action */
  Admin = 'ADMIN',
  /** A normal flow action */
  Normal = 'NORMAL'
}

export enum AgencyOrStateHelpType {
  No = 'NO',
  Other = 'OTHER',
  YesAgencyIaa = 'YES_AGENCY_IAA',
  YesAgencyIdeas = 'YES_AGENCY_IDEAS',
  YesState = 'YES_STATE'
}

export enum AgreementType {
  Cooperative = 'COOPERATIVE',
  Other = 'OTHER',
  Participation = 'PARTICIPATION'
}

export enum AlternativePaymentModelType {
  Advanced = 'ADVANCED',
  Mips = 'MIPS',
  NotApm = 'NOT_APM',
  Regular = 'REGULAR'
}

export enum AnticipatedPaymentFrequencyType {
  Annually = 'ANNUALLY',
  Biannually = 'BIANNUALLY',
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Other = 'OTHER',
  Quarterly = 'QUARTERLY',
  Semimonthly = 'SEMIMONTHLY',
  Weekly = 'WEEKLY'
}

export type AuditChange = {
  __typename?: 'AuditChange';
  action: Scalars['String']['output'];
  fields: Scalars['Map']['output'];
  foreignKey?: Maybe<Scalars['UUID']['output']>;
  id: Scalars['Int']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  primaryKey: Scalars['UUID']['output'];
  tableName: Scalars['String']['output'];
};

export enum AuthorityAllowance {
  Aca = 'ACA',
  CongressionallyMandated = 'CONGRESSIONALLY_MANDATED',
  Other = 'OTHER',
  SsaPartB = 'SSA_PART_B'
}

export enum BenchmarkForPerformanceType {
  No = 'NO',
  YesNoReconcile = 'YES_NO_RECONCILE',
  YesReconcile = 'YES_RECONCILE'
}

export enum BeneficiariesType {
  DiseaseSpecific = 'DISEASE_SPECIFIC',
  DuallyEligible = 'DUALLY_ELIGIBLE',
  Medicaid = 'MEDICAID',
  MedicareAdvantage = 'MEDICARE_ADVANTAGE',
  MedicareFfs = 'MEDICARE_FFS',
  MedicarePartD = 'MEDICARE_PART_D',
  Na = 'NA',
  Other = 'OTHER'
}

export enum CmmiGroup {
  PatientCareModelsGroup = 'PATIENT_CARE_MODELS_GROUP',
  PolicyAndProgramsGroup = 'POLICY_AND_PROGRAMS_GROUP',
  SeamlessCareModelsGroup = 'SEAMLESS_CARE_MODELS_GROUP',
  StateAndPopulationHealthGroup = 'STATE_AND_POPULATION_HEALTH_GROUP',
  Tbd = 'TBD'
}

export enum CmsCenter {
  CenterForClinicalStandardsAndQuality = 'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY',
  CenterForMedicare = 'CENTER_FOR_MEDICARE',
  CenterForProgramIntegrity = 'CENTER_FOR_PROGRAM_INTEGRITY',
  Cmmi = 'CMMI',
  FederalCoordinatedHealthCareOffice = 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE',
  Other = 'OTHER'
}

export enum CcmInvolvmentType {
  No = 'NO',
  Other = 'OTHER',
  YesEvaluation = 'YES_EVALUATION',
  YesImplementation = 'YES__IMPLEMENTATION'
}

export enum ChangeHistorySortKey {
  /** Sort by the user who made the change */
  Actor = 'ACTOR',
  /** Sort by the date the change was made */
  ChangeDate = 'CHANGE_DATE',
  /** Sort by the model plan ID that was changed */
  ModelPlanId = 'MODEL_PLAN_ID',
  /** Sort by the table ID that was changed */
  TableId = 'TABLE_ID',
  /** Sort by the table name that was changed */
  TableName = 'TABLE_NAME'
}

export type ChangeHistorySortParams = {
  field: ChangeHistorySortKey;
  order: SortDirection;
};

export type ChangeTableRecord = {
  __typename?: 'ChangeTableRecord';
  action: Scalars['String']['output'];
  fields: ChangedFields;
  foreignKey?: Maybe<Scalars['UUID']['output']>;
  /**
   * Returns the table name in the format of the type returned in GraphQL
   * Example:  a table name of model_plan returns as ModelPlan
   */
  gqlTableName: GqlTableName;
  guid: Scalars['ID']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  primaryKey: Scalars['UUID']['output'];
  tableID: Scalars['Int']['output'];
  tableName: Scalars['String']['output'];
};

export enum ChangeType {
  Added = 'ADDED',
  Removed = 'REMOVED',
  Updated = 'UPDATED'
}

export type ChangedFields = {
  __typename?: 'ChangedFields';
  changes: Array<Field>;
};

export enum ClaimsBasedPayType {
  AdjustmentsToFfsPayments = 'ADJUSTMENTS_TO_FFS_PAYMENTS',
  CareManagementHomeVisits = 'CARE_MANAGEMENT_HOME_VISITS',
  Other = 'OTHER',
  ReductionsToBeneficiaryCostSharing = 'REDUCTIONS_TO_BENEFICIARY_COST_SHARING',
  ServicesNotCoveredThroughTraditionalMedicare = 'SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE',
  SnfClaimsWithout_3DayHospitalAdmissions = 'SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS',
  TelehealthServicesNotTraditionalMedicare = 'TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE'
}

export enum ComplexityCalculationLevelType {
  High = 'HIGH',
  Low = 'LOW',
  Middle = 'MIDDLE'
}

export enum ConfidenceType {
  Completely = 'COMPLETELY',
  Fairly = 'FAIRLY',
  NotAtAll = 'NOT_AT_ALL',
  Slightly = 'SLIGHTLY'
}

export enum ContractorSupportType {
  Multiple = 'MULTIPLE',
  None = 'NONE',
  One = 'ONE',
  Other = 'OTHER'
}

export type CreateOperationalSolutionSubtaskInput = {
  name: Scalars['String']['input'];
  status: OperationalSolutionSubtaskStatus;
};

/** The current user of the application */
export type CurrentUser = {
  __typename?: 'CurrentUser';
  launchDarkly: LaunchDarklySettings;
};

export enum DataForMonitoringType {
  ClinicalData = 'CLINICAL_DATA',
  EncounterData = 'ENCOUNTER_DATA',
  MedicaidClaims = 'MEDICAID_CLAIMS',
  MedicareClaims = 'MEDICARE_CLAIMS',
  NonClinicalData = 'NON_CLINICAL_DATA',
  NonMedicalData = 'NON_MEDICAL_DATA',
  NotPlanningToCollectData = 'NOT_PLANNING_TO_COLLECT_DATA',
  NoPayClaims = 'NO_PAY_CLAIMS',
  Other = 'OTHER',
  QualityClaimsBasedMeasures = 'QUALITY_CLAIMS_BASED_MEASURES',
  QualityReportedMeasures = 'QUALITY_REPORTED_MEASURES',
  SiteVisits = 'SITE_VISITS'
}

export enum DataFrequencyType {
  Annually = 'ANNUALLY',
  Biannually = 'BIANNUALLY',
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  NotPlanningToDoThis = 'NOT_PLANNING_TO_DO_THIS',
  Other = 'OTHER',
  Quarterly = 'QUARTERLY',
  SemiMonthly = 'SEMI_MONTHLY',
  Weekly = 'WEEKLY'
}

export enum DataFullTimeOrIncrementalType {
  FullTime = 'FULL_TIME',
  Incremental = 'INCREMENTAL'
}

export enum DataStartsType {
  AtSomeOtherPointInTime = 'AT_SOME_OTHER_POINT_IN_TIME',
  DuringApplicationPeriod = 'DURING_APPLICATION_PERIOD',
  EarlyInTheFirstPerformanceYear = 'EARLY_IN_THE_FIRST_PERFORMANCE_YEAR',
  InTheSubsequentPerformanceYear = 'IN_THE_SUBSEQUENT_PERFORMANCE_YEAR',
  LaterInTheFirstPerformanceYear = 'LATER_IN_THE_FIRST_PERFORMANCE_YEAR',
  NotPlanningToDoThis = 'NOT_PLANNING_TO_DO_THIS',
  Other = 'OTHER',
  ShortlyBeforeTheStartDate = 'SHORTLY_BEFORE_THE_START_DATE'
}

export enum DataToSendParticipantsType {
  BaselineHistoricalData = 'BASELINE_HISTORICAL_DATA',
  BeneficiaryLevelData = 'BENEFICIARY_LEVEL_DATA',
  ClaimsLevelData = 'CLAIMS_LEVEL_DATA',
  NotPlanningToSendData = 'NOT_PLANNING_TO_SEND_DATA',
  OtherMipsData = 'OTHER_MIPS_DATA',
  ParticipantLevelData = 'PARTICIPANT_LEVEL_DATA',
  ProviderLevelData = 'PROVIDER_LEVEL_DATA'
}

export type DateHistogramAggregationBucket = {
  __typename?: 'DateHistogramAggregationBucket';
  docCount: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  maxModifiedDts: Scalars['Time']['output'];
  minModifiedDts: Scalars['Time']['output'];
};

/** DiscussionReply represents a discussion reply */
export type DiscussionReply = {
  __typename?: 'DiscussionReply';
  content?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  discussionID: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  isAssessment: Scalars['Boolean']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  userRole?: Maybe<DiscussionUserRole>;
  userRoleDescription?: Maybe<Scalars['String']['output']>;
};

/**
 * DiscussionReplyChanges represents the possible changes you can make to a discussion reply when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type DiscussionReplyChanges = {
  content?: InputMaybe<Scalars['String']['input']>;
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']['input']>;
};

/** DiscussionReplyCreateInput represents the necessary fields to create a discussion reply */
export type DiscussionReplyCreateInput = {
  content: Scalars['String']['input'];
  discussionID: Scalars['UUID']['input'];
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']['input']>;
};

export type DiscussionRoleSelection = {
  __typename?: 'DiscussionRoleSelection';
  userRole: DiscussionUserRole;
  userRoleDescription?: Maybe<Scalars['String']['output']>;
};

export enum DiscussionUserRole {
  CmsSystemServiceTeam = 'CMS_SYSTEM_SERVICE_TEAM',
  ItArchitect = 'IT_ARCHITECT',
  Leadership = 'LEADERSHIP',
  MedicareAdministrativeContractor = 'MEDICARE_ADMINISTRATIVE_CONTRACTOR',
  MintTeam = 'MINT_TEAM',
  ModelItLead = 'MODEL_IT_LEAD',
  ModelTeam = 'MODEL_TEAM',
  NoneOfTheAbove = 'NONE_OF_THE_ABOVE',
  SharedSystemMaintainer = 'SHARED_SYSTEM_MAINTAINER'
}

export enum DocumentType {
  ConceptPaper = 'CONCEPT_PAPER',
  DesignParametersMemo = 'DESIGN_PARAMETERS_MEMO',
  IcipDraft = 'ICIP_DRAFT',
  MarketResearch = 'MARKET_RESEARCH',
  OfficeOfTheAdministratorPresentation = 'OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION',
  Other = 'OTHER',
  PolicyPaper = 'POLICY_PAPER'
}

export enum EaseOfUse {
  Agree = 'AGREE',
  Disagree = 'DISAGREE',
  Unsure = 'UNSURE'
}

export enum EvaluationApproachType {
  ComparisonMatch = 'COMPARISON_MATCH',
  ControlIntervention = 'CONTROL_INTERVENTION',
  InterruptedTime = 'INTERRUPTED_TIME',
  NonMedicareData = 'NON_MEDICARE_DATA',
  Other = 'OTHER'
}

/** ExistingModel represents a model that already exists outside of the scope of MINT */
export type ExistingModel = {
  __typename?: 'ExistingModel';
  authority?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  dateBegan?: Maybe<Scalars['Time']['output']>;
  dateEnded?: Maybe<Scalars['Time']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayModelSummary?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  keywords?: Maybe<Scalars['String']['output']>;
  modelName?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  numberOfBeneficiariesImpacted?: Maybe<Scalars['Int']['output']>;
  numberOfParticipants?: Maybe<Scalars['String']['output']>;
  numberOfPhysiciansImpacted?: Maybe<Scalars['Int']['output']>;
  stage: Scalars['String']['output'];
  states?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type ExistingModelLink = {
  __typename?: 'ExistingModelLink';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  currentModelPlan?: Maybe<ModelPlan>;
  currentModelPlanID?: Maybe<Scalars['UUID']['output']>;
  existingModel?: Maybe<ExistingModel>;
  existingModelID?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
};

export type Field = {
  __typename?: 'Field';
  name: Scalars['String']['output'];
  nameCamelCase: Scalars['String']['output'];
  value: FieldValue;
};

export type FieldValue = {
  __typename?: 'FieldValue';
  new?: Maybe<Scalars['Any']['output']>;
  old?: Maybe<Scalars['Any']['output']>;
};

export enum FrequencyType {
  Annually = 'ANNUALLY',
  Biannually = 'BIANNUALLY',
  Monthly = 'MONTHLY',
  Other = 'OTHER',
  Quarterly = 'QUARTERLY',
  Rolling = 'ROLLING'
}

export enum FundingSource {
  Other = 'OTHER',
  PatientProtectionAffordableCareAct = 'PATIENT_PROTECTION_AFFORDABLE_CARE_ACT',
  TrustFund = 'TRUST_FUND'
}

export enum GqlTableName {
  AnalyzedAudit = 'analyzedAudit',
  DiscussionReply = 'discussionReply',
  ExistingModel = 'existingModel',
  ExistingModelLink = 'existingModelLink',
  ModelPlan = 'modelPlan',
  NdaAgreement = 'ndaAgreement',
  OperationalNeed = 'operationalNeed',
  OperationalSolution = 'operationalSolution',
  OperationalSolutionSubtask = 'operationalSolutionSubtask',
  PlanBasics = 'planBasics',
  PlanBeneficiaries = 'planBeneficiaries',
  PlanCollaborator = 'planCollaborator',
  PlanCrTdl = 'planCrTdl',
  PlanDiscussion = 'planDiscussion',
  PlanDocument = 'planDocument',
  PlanDocumentSolutionLink = 'planDocumentSolutionLink',
  PlanGeneralCharacteristics = 'planGeneralCharacteristics',
  PlanOpsEvalAndLearning = 'planOpsEvalAndLearning',
  PlanParticipantsAndProviders = 'planParticipantsAndProviders',
  PlanPayments = 'planPayments',
  PossibleOperationalNeed = 'possibleOperationalNeed',
  PossibleOperationalSolution = 'possibleOperationalSolution',
  UserAccount = 'userAccount'
}

export enum GeographyApplication {
  Beneficiaries = 'BENEFICIARIES',
  Other = 'OTHER',
  Participants = 'PARTICIPANTS',
  Providers = 'PROVIDERS'
}

export enum GeographyType {
  Other = 'OTHER',
  Region = 'REGION',
  State = 'STATE'
}

export enum KeyCharacteristic {
  EpisodeBased = 'EPISODE_BASED',
  Other = 'OTHER',
  PartC = 'PART_C',
  PartD = 'PART_D',
  Payment = 'PAYMENT',
  PopulationBased = 'POPULATION_BASED',
  Preventative = 'PREVENTATIVE',
  ServiceDelivery = 'SERVICE_DELIVERY',
  SharedSavings = 'SHARED_SAVINGS'
}

/** The current user's Launch Darkly key */
export type LaunchDarklySettings = {
  __typename?: 'LaunchDarklySettings';
  signedHash: Scalars['String']['output'];
  userKey: Scalars['String']['output'];
};

export enum MintUses {
  ContributeDiscussions = 'CONTRIBUTE_DISCUSSIONS',
  EditModel = 'EDIT_MODEL',
  Other = 'OTHER',
  ShareModel = 'SHARE_MODEL',
  TrackSolutions = 'TRACK_SOLUTIONS',
  ViewHelp = 'VIEW_HELP',
  ViewModel = 'VIEW_MODEL'
}

export enum ModelCategory {
  AccountableCare = 'ACCOUNTABLE_CARE',
  DiseaseSpecificAndEpisodic = 'DISEASE_SPECIFIC_AND_EPISODIC',
  HealthPlan = 'HEALTH_PLAN',
  PrescriptionDrug = 'PRESCRIPTION_DRUG',
  StateBased = 'STATE_BASED',
  Statutory = 'STATUTORY',
  ToBeDetermined = 'TO_BE_DETERMINED'
}

export enum ModelLearningSystemType {
  EducateBeneficiaries = 'EDUCATE_BENEFICIARIES',
  ItPlatformConnect = 'IT_PLATFORM_CONNECT',
  LearningContractor = 'LEARNING_CONTRACTOR',
  NoLearningSystem = 'NO_LEARNING_SYSTEM',
  Other = 'OTHER',
  ParticipantCollaboration = 'PARTICIPANT_COLLABORATION'
}

/** ModelPlan represent the data point for plans about a model. It is the central data type in the application */
export type ModelPlan = {
  __typename?: 'ModelPlan';
  abbreviation?: Maybe<Scalars['String']['output']>;
  archived: Scalars['Boolean']['output'];
  basics: PlanBasics;
  beneficiaries: PlanBeneficiaries;
  collaborators: Array<PlanCollaborator>;
  crTdls: Array<PlanCrTdl>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  discussions: Array<PlanDiscussion>;
  documents: Array<PlanDocument>;
  existingModelLinks: Array<ExistingModelLink>;
  generalCharacteristics: PlanGeneralCharacteristics;
  id: Scalars['UUID']['output'];
  isCollaborator: Scalars['Boolean']['output'];
  isFavorite: Scalars['Boolean']['output'];
  modelName: Scalars['String']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  nameHistory: Array<Scalars['String']['output']>;
  operationalNeeds: Array<OperationalNeed>;
  opsEvalAndLearning: PlanOpsEvalAndLearning;
  participantsAndProviders: PlanParticipantsAndProviders;
  payments: PlanPayments;
  prepareForClearance: PrepareForClearance;
  status: ModelStatus;
};


/** ModelPlan represent the data point for plans about a model. It is the central data type in the application */
export type ModelPlanNameHistoryArgs = {
  sort?: SortDirection;
};

/**
 * ModelPlanChanges represents the possible changes you can make to a model plan when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type ModelPlanChanges = {
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  modelName?: InputMaybe<Scalars['String']['input']>;
  someNumbers?: InputMaybe<Array<Scalars['Int']['input']>>;
  status?: InputMaybe<ModelStatus>;
};

export enum ModelPlanFilter {
  CollabOnly = 'COLLAB_ONLY',
  IncludeAll = 'INCLUDE_ALL',
  WithCrTdls = 'WITH_CR_TDLS'
}

export enum ModelStatus {
  Active = 'ACTIVE',
  Announced = 'ANNOUNCED',
  Canceled = 'CANCELED',
  Cleared = 'CLEARED',
  CmsClearance = 'CMS_CLEARANCE',
  Ended = 'ENDED',
  HhsClearance = 'HHS_CLEARANCE',
  IcipComplete = 'ICIP_COMPLETE',
  InternalCmmiClearance = 'INTERNAL_CMMI_CLEARANCE',
  OmbAsrfClearance = 'OMB_ASRF_CLEARANCE',
  Paused = 'PAUSED',
  PlanComplete = 'PLAN_COMPLETE',
  PlanDraft = 'PLAN_DRAFT'
}

export enum ModelType {
  Mandatory = 'MANDATORY',
  Tbd = 'TBD',
  Voluntary = 'VOLUNTARY'
}

export enum ModelViewFilter {
  Cbosc = 'CBOSC',
  Ccw = 'CCW',
  Cmmi = 'CMMI',
  Dfsdm = 'DFSDM',
  Iddoc = 'IDDOC',
  Ipc = 'IPC',
  Mdm = 'MDM',
  Oact = 'OACT',
  Pbg = 'PBG'
}

export enum MonitoringFileType {
  Beneficiary = 'BENEFICIARY',
  Other = 'OTHER',
  PartA = 'PART_A',
  PartB = 'PART_B',
  Provider = 'PROVIDER'
}

/** Mutations definition for the schema */
export type Mutation = {
  __typename?: 'Mutation';
  addOrUpdateCustomOperationalNeed: OperationalNeed;
  addPlanFavorite: PlanFavorite;
  agreeToNDA: NdaInfo;
  createDiscussionReply: DiscussionReply;
  createModelPlan: ModelPlan;
  createOperationalSolution: OperationalSolution;
  createOperationalSolutionSubtasks?: Maybe<Array<OperationalSolutionSubtask>>;
  createPlanCollaborator: PlanCollaborator;
  createPlanCrTdl: PlanCrTdl;
  createPlanDiscussion: PlanDiscussion;
  createPlanDocumentSolutionLinks?: Maybe<Array<PlanDocumentSolutionLink>>;
  deleteDiscussionReply: DiscussionReply;
  deleteOperationalSolutionSubtask: Scalars['Int']['output'];
  deletePlanCollaborator: PlanCollaborator;
  deletePlanCrTdl: PlanCrTdl;
  deletePlanDiscussion: PlanDiscussion;
  deletePlanDocument: Scalars['Int']['output'];
  deletePlanFavorite: PlanFavorite;
  linkNewPlanDocument: PlanDocument;
  lockTaskListSection: Scalars['Boolean']['output'];
  removePlanDocumentSolutionLinks: Scalars['Boolean']['output'];
  reportAProblem: Scalars['Boolean']['output'];
  /** This mutation sends feedback about the MINT product to the MINT team */
  sendFeedbackEmail: Scalars['Boolean']['output'];
  shareModelPlan: Scalars['Boolean']['output'];
  unlockAllTaskListSections: Array<TaskListSectionLockStatus>;
  unlockTaskListSection: Scalars['Boolean']['output'];
  updateCustomOperationalNeedByID: OperationalNeed;
  updateDiscussionReply: DiscussionReply;
  updateExistingModelLinks: Array<ExistingModelLink>;
  updateModelPlan: ModelPlan;
  updateOperationalSolution: OperationalSolution;
  updateOperationalSolutionSubtasks?: Maybe<Array<OperationalSolutionSubtask>>;
  updatePlanBasics: PlanBasics;
  updatePlanBeneficiaries: PlanBeneficiaries;
  updatePlanCollaborator: PlanCollaborator;
  updatePlanCrTdl: PlanCrTdl;
  updatePlanDiscussion: PlanDiscussion;
  updatePlanGeneralCharacteristics: PlanGeneralCharacteristics;
  updatePlanOpsEvalAndLearning: PlanOpsEvalAndLearning;
  updatePlanParticipantsAndProviders: PlanParticipantsAndProviders;
  updatePlanPayments: PlanPayments;
  uploadNewPlanDocument: PlanDocument;
};


/** Mutations definition for the schema */
export type MutationAddOrUpdateCustomOperationalNeedArgs = {
  customNeedType: Scalars['String']['input'];
  modelPlanID: Scalars['UUID']['input'];
  needed: Scalars['Boolean']['input'];
};


/** Mutations definition for the schema */
export type MutationAddPlanFavoriteArgs = {
  modelPlanID: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationAgreeToNdaArgs = {
  agree?: Scalars['Boolean']['input'];
};


/** Mutations definition for the schema */
export type MutationCreateDiscussionReplyArgs = {
  input: DiscussionReplyCreateInput;
};


/** Mutations definition for the schema */
export type MutationCreateModelPlanArgs = {
  modelName: Scalars['String']['input'];
};


/** Mutations definition for the schema */
export type MutationCreateOperationalSolutionArgs = {
  changes: OperationalSolutionChanges;
  operationalNeedID: Scalars['UUID']['input'];
  solutionType?: InputMaybe<OperationalSolutionKey>;
};


/** Mutations definition for the schema */
export type MutationCreateOperationalSolutionSubtasksArgs = {
  inputs: Array<CreateOperationalSolutionSubtaskInput>;
  solutionID: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationCreatePlanCollaboratorArgs = {
  input: PlanCollaboratorCreateInput;
};


/** Mutations definition for the schema */
export type MutationCreatePlanCrTdlArgs = {
  input: PlanCrTdlCreateInput;
};


/** Mutations definition for the schema */
export type MutationCreatePlanDiscussionArgs = {
  input: PlanDiscussionCreateInput;
};


/** Mutations definition for the schema */
export type MutationCreatePlanDocumentSolutionLinksArgs = {
  documentIDs: Array<Scalars['UUID']['input']>;
  solutionID: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeleteDiscussionReplyArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeleteOperationalSolutionSubtaskArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanCollaboratorArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanCrTdlArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanDiscussionArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanDocumentArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanFavoriteArgs = {
  modelPlanID: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationLinkNewPlanDocumentArgs = {
  input: PlanDocumentLinkInput;
};


/** Mutations definition for the schema */
export type MutationLockTaskListSectionArgs = {
  modelPlanID: Scalars['UUID']['input'];
  section: TaskListSection;
};


/** Mutations definition for the schema */
export type MutationRemovePlanDocumentSolutionLinksArgs = {
  documentIDs: Array<Scalars['UUID']['input']>;
  solutionID: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationReportAProblemArgs = {
  input: ReportAProblemInput;
};


/** Mutations definition for the schema */
export type MutationSendFeedbackEmailArgs = {
  input: SendFeedbackEmailInput;
};


/** Mutations definition for the schema */
export type MutationShareModelPlanArgs = {
  modelPlanID: Scalars['UUID']['input'];
  optionalMessage?: InputMaybe<Scalars['String']['input']>;
  usernames: Array<Scalars['String']['input']>;
  viewFilter?: InputMaybe<ModelViewFilter>;
};


/** Mutations definition for the schema */
export type MutationUnlockAllTaskListSectionsArgs = {
  modelPlanID: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUnlockTaskListSectionArgs = {
  modelPlanID: Scalars['UUID']['input'];
  section: TaskListSection;
};


/** Mutations definition for the schema */
export type MutationUpdateCustomOperationalNeedByIdArgs = {
  customNeedType?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  needed: Scalars['Boolean']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdateDiscussionReplyArgs = {
  changes: DiscussionReplyChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdateExistingModelLinksArgs = {
  currentModelPlanIDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  existingModelIDs?: InputMaybe<Array<Scalars['Int']['input']>>;
  modelPlanID: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdateModelPlanArgs = {
  changes: ModelPlanChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdateOperationalSolutionArgs = {
  changes: OperationalSolutionChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdateOperationalSolutionSubtasksArgs = {
  inputs: Array<UpdateOperationalSolutionSubtaskInput>;
};


/** Mutations definition for the schema */
export type MutationUpdatePlanBasicsArgs = {
  changes: PlanBasicsChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanBeneficiariesArgs = {
  changes: PlanBeneficiariesChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanCollaboratorArgs = {
  id: Scalars['UUID']['input'];
  newRole: TeamRole;
};


/** Mutations definition for the schema */
export type MutationUpdatePlanCrTdlArgs = {
  changes: PlanCrTdlChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanDiscussionArgs = {
  changes: PlanDiscussionChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanGeneralCharacteristicsArgs = {
  changes: PlanGeneralCharacteristicsChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanOpsEvalAndLearningArgs = {
  changes: PlanOpsEvalAndLearningChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanParticipantsAndProvidersArgs = {
  changes: PlanParticipantsAndProvidersChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanPaymentsArgs = {
  changes: PlanPaymentsChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUploadNewPlanDocumentArgs = {
  input: PlanDocumentInput;
};

/** NDAInfo represents whether a user has agreed to an NDA or not. If agreed to previously, there will be a datestamp visible */
export type NdaInfo = {
  __typename?: 'NDAInfo';
  agreed: Scalars['Boolean']['output'];
  agreedDts?: Maybe<Scalars['Time']['output']>;
};

export enum NonClaimsBasedPayType {
  AdvancedPayment = 'ADVANCED_PAYMENT',
  BundledEpisodeOfCare = 'BUNDLED_EPISODE_OF_CARE',
  CapitationPopulationBasedFull = 'CAPITATION_POPULATION_BASED_FULL',
  CapitationPopulationBasedPartial = 'CAPITATION_POPULATION_BASED_PARTIAL',
  CareCoordinationManagementFee = 'CARE_COORDINATION_MANAGEMENT_FEE',
  GlobalBudget = 'GLOBAL_BUDGET',
  Grants = 'GRANTS',
  IncentivePayment = 'INCENTIVE_PAYMENT',
  MapdSharedSavings = 'MAPD_SHARED_SAVINGS',
  Other = 'OTHER',
  SharedSavings = 'SHARED_SAVINGS'
}

export enum OpSolutionStatus {
  AtRisk = 'AT_RISK',
  Backlog = 'BACKLOG',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED',
  Onboarding = 'ONBOARDING'
}

export type OperationalNeed = {
  __typename?: 'OperationalNeed';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  key?: Maybe<OperationalNeedKey>;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nameOther?: Maybe<Scalars['String']['output']>;
  needed?: Maybe<Scalars['Boolean']['output']>;
  section?: Maybe<TaskListSection>;
  solutions: Array<OperationalSolution>;
};


export type OperationalNeedSolutionsArgs = {
  includeNotNeeded?: Scalars['Boolean']['input'];
};

export enum OperationalNeedKey {
  AcquireAnEvalCont = 'ACQUIRE_AN_EVAL_CONT',
  AcquireALearnCont = 'ACQUIRE_A_LEARN_CONT',
  AdjustFfsClaims = 'ADJUST_FFS_CLAIMS',
  AppSupportCon = 'APP_SUPPORT_CON',
  ClaimsBasedMeasures = 'CLAIMS_BASED_MEASURES',
  CommWPart = 'COMM_W_PART',
  ComputeSharedSavingsPayment = 'COMPUTE_SHARED_SAVINGS_PAYMENT',
  DataToMonitor = 'DATA_TO_MONITOR',
  DataToSupportEval = 'DATA_TO_SUPPORT_EVAL',
  EducateBenef = 'EDUCATE_BENEF',
  EstablishBench = 'ESTABLISH_BENCH',
  HelpdeskSupport = 'HELPDESK_SUPPORT',
  IddocSupport = 'IDDOC_SUPPORT',
  ItPlatformForLearning = 'IT_PLATFORM_FOR_LEARNING',
  MakeNonClaimsBasedPayments = 'MAKE_NON_CLAIMS_BASED_PAYMENTS',
  ManageBenOverlap = 'MANAGE_BEN_OVERLAP',
  ManageCd = 'MANAGE_CD',
  ManageFfsExclPayments = 'MANAGE_FFS_EXCL_PAYMENTS',
  ManageProvOverlap = 'MANAGE_PROV_OVERLAP',
  PartToPartCollab = 'PART_TO_PART_COLLAB',
  ProcessPartAppeals = 'PROCESS_PART_APPEALS',
  QualityPerformanceScores = 'QUALITY_PERFORMANCE_SCORES',
  RecoverPayments = 'RECOVER_PAYMENTS',
  RecruitParticipants = 'RECRUIT_PARTICIPANTS',
  RevColBids = 'REV_COL_BIDS',
  RevScoreApp = 'REV_SCORE_APP',
  SendRepdataToPart = 'SEND_REPDATA_TO_PART',
  SignParticipationAgreements = 'SIGN_PARTICIPATION_AGREEMENTS',
  UpdateContract = 'UPDATE_CONTRACT',
  UtilizeQualityMeasuresDevelopmentContractor = 'UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR',
  VetProvidersForProgramIntegrity = 'VET_PROVIDERS_FOR_PROGRAM_INTEGRITY'
}

export type OperationalSolution = {
  __typename?: 'OperationalSolution';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  documents: Array<PlanDocument>;
  id: Scalars['UUID']['output'];
  isCommonSolution: Scalars['Boolean']['output'];
  isOther: Scalars['Boolean']['output'];
  key?: Maybe<OperationalSolutionKey>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  mustFinishDts?: Maybe<Scalars['Time']['output']>;
  mustStartDts?: Maybe<Scalars['Time']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  nameOther?: Maybe<Scalars['String']['output']>;
  needed?: Maybe<Scalars['Boolean']['output']>;
  operationalNeedID: Scalars['UUID']['output'];
  operationalSolutionSubtasks: Array<OperationalSolutionSubtask>;
  otherHeader?: Maybe<Scalars['String']['output']>;
  pocEmail?: Maybe<Scalars['String']['output']>;
  pocName?: Maybe<Scalars['String']['output']>;
  solutionType?: Maybe<Scalars['Int']['output']>;
  status: OpSolutionStatus;
};

export type OperationalSolutionChanges = {
  mustFinishDts?: InputMaybe<Scalars['Time']['input']>;
  mustStartDts?: InputMaybe<Scalars['Time']['input']>;
  nameOther?: InputMaybe<Scalars['String']['input']>;
  needed?: InputMaybe<Scalars['Boolean']['input']>;
  otherHeader?: InputMaybe<Scalars['String']['input']>;
  pocEmail?: InputMaybe<Scalars['String']['input']>;
  pocName?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OpSolutionStatus>;
};

export enum OperationalSolutionKey {
  AcoOs = 'ACO_OS',
  Apps = 'APPS',
  Ars = 'ARS',
  Bcda = 'BCDA',
  Cbosc = 'CBOSC',
  Ccw = 'CCW',
  Cdx = 'CDX',
  CmsBox = 'CMS_BOX',
  CmsQualtrics = 'CMS_QUALTRICS',
  Connect = 'CONNECT',
  Contractor = 'CONTRACTOR',
  CpiVetting = 'CPI_VETTING',
  CrossModelContract = 'CROSS_MODEL_CONTRACT',
  Edfr = 'EDFR',
  Eft = 'EFT',
  ExistingCmsDataAndProcess = 'EXISTING_CMS_DATA_AND_PROCESS',
  Govdelivery = 'GOVDELIVERY',
  Gs = 'GS',
  Hdr = 'HDR',
  Higlas = 'HIGLAS',
  Hpms = 'HPMS',
  Idr = 'IDR',
  Innovation = 'INNOVATION',
  InternalStaff = 'INTERNAL_STAFF',
  Ipc = 'IPC',
  Isp = 'ISP',
  Ldg = 'LDG',
  Loi = 'LOI',
  Lv = 'LV',
  Marx = 'MARX',
  Mdm = 'MDM',
  Mids = 'MIDS',
  OtherNewProcess = 'OTHER_NEW_PROCESS',
  OutlookMailbox = 'OUTLOOK_MAILBOX',
  PostPortal = 'POST_PORTAL',
  Qv = 'QV',
  Rfa = 'RFA',
  Rmada = 'RMADA',
  SharedSystems = 'SHARED_SYSTEMS'
}

export type OperationalSolutionSubtask = {
  __typename?: 'OperationalSolutionSubtask';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  name: Scalars['String']['output'];
  solutionID: Scalars['UUID']['output'];
  status: OperationalSolutionSubtaskStatus;
};

export enum OperationalSolutionSubtaskStatus {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

export enum OverlapType {
  No = 'NO',
  YesNeedPolicies = 'YES_NEED_POLICIES',
  YesNoIssues = 'YES_NO_ISSUES'
}

export type PageParams = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export enum ParticipantCommunicationType {
  ItTool = 'IT_TOOL',
  MassEmail = 'MASS_EMAIL',
  NoCommunication = 'NO_COMMUNICATION',
  Other = 'OTHER'
}

export enum ParticipantRiskType {
  Capitation = 'CAPITATION',
  OneSided = 'ONE_SIDED',
  Other = 'OTHER',
  TwoSided = 'TWO_SIDED'
}

export enum ParticipantSelectionType {
  ApplicationReviewAndScoringTool = 'APPLICATION_REVIEW_AND_SCORING_TOOL',
  ApplicationSupportContractor = 'APPLICATION_SUPPORT_CONTRACTOR',
  BasicCriteria = 'BASIC_CRITERIA',
  CmsComponentOrProcess = 'CMS_COMPONENT_OR_PROCESS',
  ModelTeamReviewApplications = 'MODEL_TEAM_REVIEW_APPLICATIONS',
  NoSelectingParticipants = 'NO_SELECTING_PARTICIPANTS',
  Other = 'OTHER',
  SupportFromCmmi = 'SUPPORT_FROM_CMMI'
}

export enum ParticipantsIdType {
  Ccns = 'CCNS',
  NoIdentifiers = 'NO_IDENTIFIERS',
  Npis = 'NPIS',
  Other = 'OTHER',
  Tins = 'TINS'
}

export enum ParticipantsType {
  CommercialPayers = 'COMMERCIAL_PAYERS',
  CommunityBasedOrganizations = 'COMMUNITY_BASED_ORGANIZATIONS',
  Convener = 'CONVENER',
  Entities = 'ENTITIES',
  MedicaidManagedCareOrganizations = 'MEDICAID_MANAGED_CARE_ORGANIZATIONS',
  MedicaidProviders = 'MEDICAID_PROVIDERS',
  MedicareAdvantagePlans = 'MEDICARE_ADVANTAGE_PLANS',
  MedicareAdvantagePrescriptionDrugPlans = 'MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS',
  MedicareProviders = 'MEDICARE_PROVIDERS',
  NonProfitOrganizations = 'NON_PROFIT_ORGANIZATIONS',
  Other = 'OTHER',
  StandalonePartDPlans = 'STANDALONE_PART_D_PLANS',
  States = 'STATES',
  StateMedicaidAgencies = 'STATE_MEDICAID_AGENCIES'
}

export enum PayRecipient {
  Beneficiaries = 'BENEFICIARIES',
  Other = 'OTHER',
  Participants = 'PARTICIPANTS',
  Providers = 'PROVIDERS',
  States = 'STATES'
}

export enum PayType {
  ClaimsBasedPayments = 'CLAIMS_BASED_PAYMENTS',
  Grants = 'GRANTS',
  NonClaimsBasedPayments = 'NON_CLAIMS_BASED_PAYMENTS'
}

/** Represents plan basics */
export type PlanBasics = {
  __typename?: 'PlanBasics';
  additionalModelCategories: Array<ModelCategory>;
  amsModelID?: Maybe<Scalars['String']['output']>;
  announced?: Maybe<Scalars['Time']['output']>;
  applicationsEnd?: Maybe<Scalars['Time']['output']>;
  applicationsStart?: Maybe<Scalars['Time']['output']>;
  clearanceEnds?: Maybe<Scalars['Time']['output']>;
  clearanceStarts?: Maybe<Scalars['Time']['output']>;
  cmmiGroups: Array<CmmiGroup>;
  cmsCenters: Array<CmsCenter>;
  cmsOther?: Maybe<Scalars['String']['output']>;
  completeICIP?: Maybe<Scalars['Time']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  demoCode?: Maybe<Scalars['String']['output']>;
  goal?: Maybe<Scalars['String']['output']>;
  highLevelNote?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  modelCategory?: Maybe<ModelCategory>;
  modelPlanID: Scalars['UUID']['output'];
  modelType?: Maybe<ModelType>;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  performancePeriodEnds?: Maybe<Scalars['Time']['output']>;
  performancePeriodStarts?: Maybe<Scalars['Time']['output']>;
  phasedIn?: Maybe<Scalars['Boolean']['output']>;
  phasedInNote?: Maybe<Scalars['String']['output']>;
  problem?: Maybe<Scalars['String']['output']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']['output']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']['output']>;
  readyForReviewBy?: Maybe<Scalars['UUID']['output']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']['output']>;
  status: TaskStatus;
  testInterventions?: Maybe<Scalars['String']['output']>;
  wrapUpEnds?: Maybe<Scalars['Time']['output']>;
};

/**
 * PlanBasicsChanges represents the possible changes you can make to a Plan Basics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanBasicsChanges = {
  additionalModelCategories?: InputMaybe<Array<ModelCategory>>;
  amsModelID?: InputMaybe<Scalars['String']['input']>;
  announced?: InputMaybe<Scalars['Time']['input']>;
  applicationsEnd?: InputMaybe<Scalars['Time']['input']>;
  applicationsStart?: InputMaybe<Scalars['Time']['input']>;
  clearanceEnds?: InputMaybe<Scalars['Time']['input']>;
  clearanceStarts?: InputMaybe<Scalars['Time']['input']>;
  cmmiGroups?: InputMaybe<Array<CmmiGroup>>;
  cmsCenters?: InputMaybe<Array<CmsCenter>>;
  cmsOther?: InputMaybe<Scalars['String']['input']>;
  completeICIP?: InputMaybe<Scalars['Time']['input']>;
  demoCode?: InputMaybe<Scalars['String']['input']>;
  goal?: InputMaybe<Scalars['String']['input']>;
  highLevelNote?: InputMaybe<Scalars['String']['input']>;
  modelCategory?: InputMaybe<ModelCategory>;
  modelType?: InputMaybe<ModelType>;
  note?: InputMaybe<Scalars['String']['input']>;
  performancePeriodEnds?: InputMaybe<Scalars['Time']['input']>;
  performancePeriodStarts?: InputMaybe<Scalars['Time']['input']>;
  phasedIn?: InputMaybe<Scalars['Boolean']['input']>;
  phasedInNote?: InputMaybe<Scalars['String']['input']>;
  problem?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatusInput>;
  testInterventions?: InputMaybe<Scalars['String']['input']>;
  wrapUpEnds?: InputMaybe<Scalars['Time']['input']>;
};

/** Plan Beneficiaries represents the the beneficiaries section of the task list */
export type PlanBeneficiaries = {
  __typename?: 'PlanBeneficiaries';
  beneficiaries: Array<BeneficiariesType>;
  beneficiariesNote?: Maybe<Scalars['String']['output']>;
  beneficiariesOther?: Maybe<Scalars['String']['output']>;
  beneficiaryOverlap?: Maybe<OverlapType>;
  beneficiaryOverlapNote?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionFrequency?: Maybe<FrequencyType>;
  beneficiarySelectionFrequencyNote?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionFrequencyOther?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionMethod: Array<SelectionMethodType>;
  beneficiarySelectionNote?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionOther?: Maybe<Scalars['String']['output']>;
  confidenceNote?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  estimateConfidence?: Maybe<ConfidenceType>;
  excludeCertainCharacteristics?: Maybe<TriStateAnswer>;
  excludeCertainCharacteristicsCriteria?: Maybe<Scalars['String']['output']>;
  excludeCertainCharacteristicsNote?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  numberPeopleImpacted?: Maybe<Scalars['Int']['output']>;
  precedenceRules?: Maybe<Scalars['String']['output']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']['output']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']['output']>;
  readyForReviewBy?: Maybe<Scalars['UUID']['output']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']['output']>;
  status: TaskStatus;
  treatDualElligibleDifferent?: Maybe<TriStateAnswer>;
  treatDualElligibleDifferentHow?: Maybe<Scalars['String']['output']>;
  treatDualElligibleDifferentNote?: Maybe<Scalars['String']['output']>;
};

export type PlanBeneficiariesChanges = {
  beneficiaries?: InputMaybe<Array<BeneficiariesType>>;
  beneficiariesNote?: InputMaybe<Scalars['String']['input']>;
  beneficiariesOther?: InputMaybe<Scalars['String']['input']>;
  beneficiaryOverlap?: InputMaybe<OverlapType>;
  beneficiaryOverlapNote?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionFrequency?: InputMaybe<FrequencyType>;
  beneficiarySelectionFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionMethod?: InputMaybe<Array<SelectionMethodType>>;
  beneficiarySelectionNote?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionOther?: InputMaybe<Scalars['String']['input']>;
  confidenceNote?: InputMaybe<Scalars['String']['input']>;
  estimateConfidence?: InputMaybe<ConfidenceType>;
  excludeCertainCharacteristics?: InputMaybe<TriStateAnswer>;
  excludeCertainCharacteristicsCriteria?: InputMaybe<Scalars['String']['input']>;
  excludeCertainCharacteristicsNote?: InputMaybe<Scalars['String']['input']>;
  numberPeopleImpacted?: InputMaybe<Scalars['Int']['input']>;
  precedenceRules?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatusInput>;
  treatDualElligibleDifferent?: InputMaybe<TriStateAnswer>;
  treatDualElligibleDifferentHow?: InputMaybe<Scalars['String']['input']>;
  treatDualElligibleDifferentNote?: InputMaybe<Scalars['String']['input']>;
};

/** PlanCollaborator represents a collaborator on a plan */
export type PlanCollaborator = {
  __typename?: 'PlanCollaborator';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  teamRole: TeamRole;
  userAccount: UserAccount;
  userID: Scalars['UUID']['output'];
};

/** PlanCollaboratorCreateInput represents the data required to create a collaborator on a plan */
export type PlanCollaboratorCreateInput = {
  modelPlanID: Scalars['UUID']['input'];
  teamRole: TeamRole;
  userName: Scalars['String']['input'];
};

export type PlanCrTdl = {
  __typename?: 'PlanCrTdl';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  dateInitiated: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  idNumber: Scalars['String']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type PlanCrTdlChanges = {
  dateInitiated?: InputMaybe<Scalars['Time']['input']>;
  idNumber?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PlanCrTdlCreateInput = {
  dateInitiated: Scalars['Time']['input'];
  idNumber: Scalars['String']['input'];
  modelPlanID: Scalars['UUID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

/** PlanDiscussion represents plan discussion */
export type PlanDiscussion = {
  __typename?: 'PlanDiscussion';
  content?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  isAssessment: Scalars['Boolean']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  replies: Array<DiscussionReply>;
  userRole?: Maybe<DiscussionUserRole>;
  userRoleDescription?: Maybe<Scalars['String']['output']>;
};

/**
 * PlanDiscussionChanges represents the possible changes you can make to a plan discussion when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanDiscussionChanges = {
  content?: InputMaybe<Scalars['String']['input']>;
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']['input']>;
};

/** PlanDiscussionCreateInput represents the necessary fields to create a plan discussion */
export type PlanDiscussionCreateInput = {
  content: Scalars['String']['input'];
  modelPlanID: Scalars['UUID']['input'];
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']['input']>;
};

/** PlanDocument represents a document on a plan */
export type PlanDocument = {
  __typename?: 'PlanDocument';
  bucket: Scalars['String']['output'];
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  deletedAt?: Maybe<Scalars['Time']['output']>;
  documentType: DocumentType;
  downloadUrl?: Maybe<Scalars['String']['output']>;
  fileKey: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  fileType: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** If isLink = true, then this is a URL to a linked document, not an uploaded document */
  isLink: Scalars['Boolean']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  numLinkedSolutions: Scalars['Int']['output'];
  optionalNotes?: Maybe<Scalars['String']['output']>;
  otherType?: Maybe<Scalars['String']['output']>;
  restricted: Scalars['Boolean']['output'];
  /** URL is the link that must be provided if this is a link instead of an uploaded document */
  url?: Maybe<Scalars['String']['output']>;
  virusClean: Scalars['Boolean']['output'];
  virusScanned: Scalars['Boolean']['output'];
};

/** PlanDocumentInput */
export type PlanDocumentInput = {
  documentType: DocumentType;
  fileData: Scalars['Upload']['input'];
  modelPlanID: Scalars['UUID']['input'];
  optionalNotes?: InputMaybe<Scalars['String']['input']>;
  otherTypeDescription?: InputMaybe<Scalars['String']['input']>;
  restricted: Scalars['Boolean']['input'];
};

/** PlanDocumentLinkInput */
export type PlanDocumentLinkInput = {
  documentType: DocumentType;
  modelPlanID: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
  optionalNotes?: InputMaybe<Scalars['String']['input']>;
  otherTypeDescription?: InputMaybe<Scalars['String']['input']>;
  restricted: Scalars['Boolean']['input'];
  url: Scalars['String']['input'];
};

export type PlanDocumentSolutionLink = {
  __typename?: 'PlanDocumentSolutionLink';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  documentID: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  solutionID: Scalars['UUID']['output'];
};

export type PlanFavorite = {
  __typename?: 'PlanFavorite';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  userAccount: UserAccount;
  userID: Scalars['UUID']['output'];
};

/** PlanGeneralCharacteristics represents a plan general characteristics object */
export type PlanGeneralCharacteristics = {
  __typename?: 'PlanGeneralCharacteristics';
  additionalServicesInvolved?: Maybe<Scalars['Boolean']['output']>;
  additionalServicesInvolvedDescription?: Maybe<Scalars['String']['output']>;
  additionalServicesInvolvedNote?: Maybe<Scalars['String']['output']>;
  agreementTypes: Array<AgreementType>;
  agreementTypesOther?: Maybe<Scalars['String']['output']>;
  alternativePaymentModelNote?: Maybe<Scalars['String']['output']>;
  alternativePaymentModelTypes: Array<AlternativePaymentModelType>;
  authorityAllowances: Array<AuthorityAllowance>;
  authorityAllowancesNote?: Maybe<Scalars['String']['output']>;
  authorityAllowancesOther?: Maybe<Scalars['String']['output']>;
  careCoordinationInvolved?: Maybe<Scalars['Boolean']['output']>;
  careCoordinationInvolvedDescription?: Maybe<Scalars['String']['output']>;
  careCoordinationInvolvedNote?: Maybe<Scalars['String']['output']>;
  collectPlanBids?: Maybe<Scalars['Boolean']['output']>;
  collectPlanBidsNote?: Maybe<Scalars['String']['output']>;
  communityPartnersInvolved?: Maybe<Scalars['Boolean']['output']>;
  communityPartnersInvolvedDescription?: Maybe<Scalars['String']['output']>;
  communityPartnersInvolvedNote?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  existingModel?: Maybe<Scalars['String']['output']>;
  geographiesTargeted?: Maybe<Scalars['Boolean']['output']>;
  geographiesTargetedAppliedTo: Array<GeographyApplication>;
  geographiesTargetedAppliedToOther?: Maybe<Scalars['String']['output']>;
  geographiesTargetedNote?: Maybe<Scalars['String']['output']>;
  geographiesTargetedTypes: Array<GeographyType>;
  geographiesTargetedTypesOther?: Maybe<Scalars['String']['output']>;
  hasComponentsOrTracks?: Maybe<Scalars['Boolean']['output']>;
  hasComponentsOrTracksDiffer?: Maybe<Scalars['String']['output']>;
  hasComponentsOrTracksNote?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isNewModel?: Maybe<Scalars['Boolean']['output']>;
  keyCharacteristics: Array<KeyCharacteristic>;
  keyCharacteristicsNote?: Maybe<Scalars['String']['output']>;
  keyCharacteristicsOther?: Maybe<Scalars['String']['output']>;
  managePartCDEnrollment?: Maybe<Scalars['Boolean']['output']>;
  managePartCDEnrollmentNote?: Maybe<Scalars['String']['output']>;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  multiplePatricipationAgreementsNeeded?: Maybe<Scalars['Boolean']['output']>;
  multiplePatricipationAgreementsNeededNote?: Maybe<Scalars['String']['output']>;
  participationOptions?: Maybe<Scalars['Boolean']['output']>;
  participationOptionsNote?: Maybe<Scalars['String']['output']>;
  planContractUpdated?: Maybe<Scalars['Boolean']['output']>;
  planContractUpdatedNote?: Maybe<Scalars['String']['output']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']['output']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']['output']>;
  readyForReviewBy?: Maybe<Scalars['UUID']['output']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']['output']>;
  resemblesExistingModel?: Maybe<Scalars['Boolean']['output']>;
  resemblesExistingModelHow?: Maybe<Scalars['String']['output']>;
  resemblesExistingModelNote?: Maybe<Scalars['String']['output']>;
  rulemakingRequired?: Maybe<Scalars['Boolean']['output']>;
  rulemakingRequiredDescription?: Maybe<Scalars['String']['output']>;
  rulemakingRequiredNote?: Maybe<Scalars['String']['output']>;
  status: TaskStatus;
  waiversRequired?: Maybe<Scalars['Boolean']['output']>;
  waiversRequiredNote?: Maybe<Scalars['String']['output']>;
  waiversRequiredTypes: Array<WaiverType>;
};

/**
 * PlanGeneralCharacteristicsChanges represents the possible changes you can make to a
 * general characteristics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanGeneralCharacteristicsChanges = {
  additionalServicesInvolved?: InputMaybe<Scalars['Boolean']['input']>;
  additionalServicesInvolvedDescription?: InputMaybe<Scalars['String']['input']>;
  additionalServicesInvolvedNote?: InputMaybe<Scalars['String']['input']>;
  agreementTypes?: InputMaybe<Array<AgreementType>>;
  agreementTypesOther?: InputMaybe<Scalars['String']['input']>;
  alternativePaymentModelNote?: InputMaybe<Scalars['String']['input']>;
  alternativePaymentModelTypes?: InputMaybe<Array<AlternativePaymentModelType>>;
  authorityAllowances?: InputMaybe<Array<AuthorityAllowance>>;
  authorityAllowancesNote?: InputMaybe<Scalars['String']['input']>;
  authorityAllowancesOther?: InputMaybe<Scalars['String']['input']>;
  careCoordinationInvolved?: InputMaybe<Scalars['Boolean']['input']>;
  careCoordinationInvolvedDescription?: InputMaybe<Scalars['String']['input']>;
  careCoordinationInvolvedNote?: InputMaybe<Scalars['String']['input']>;
  collectPlanBids?: InputMaybe<Scalars['Boolean']['input']>;
  collectPlanBidsNote?: InputMaybe<Scalars['String']['input']>;
  communityPartnersInvolved?: InputMaybe<Scalars['Boolean']['input']>;
  communityPartnersInvolvedDescription?: InputMaybe<Scalars['String']['input']>;
  communityPartnersInvolvedNote?: InputMaybe<Scalars['String']['input']>;
  existingModel?: InputMaybe<Scalars['String']['input']>;
  geographiesTargeted?: InputMaybe<Scalars['Boolean']['input']>;
  geographiesTargetedAppliedTo?: InputMaybe<Array<GeographyApplication>>;
  geographiesTargetedAppliedToOther?: InputMaybe<Scalars['String']['input']>;
  geographiesTargetedNote?: InputMaybe<Scalars['String']['input']>;
  geographiesTargetedTypes?: InputMaybe<Array<GeographyType>>;
  geographiesTargetedTypesOther?: InputMaybe<Scalars['String']['input']>;
  hasComponentsOrTracks?: InputMaybe<Scalars['Boolean']['input']>;
  hasComponentsOrTracksDiffer?: InputMaybe<Scalars['String']['input']>;
  hasComponentsOrTracksNote?: InputMaybe<Scalars['String']['input']>;
  isNewModel?: InputMaybe<Scalars['Boolean']['input']>;
  keyCharacteristics?: InputMaybe<Array<KeyCharacteristic>>;
  keyCharacteristicsNote?: InputMaybe<Scalars['String']['input']>;
  keyCharacteristicsOther?: InputMaybe<Scalars['String']['input']>;
  managePartCDEnrollment?: InputMaybe<Scalars['Boolean']['input']>;
  managePartCDEnrollmentNote?: InputMaybe<Scalars['String']['input']>;
  multiplePatricipationAgreementsNeeded?: InputMaybe<Scalars['Boolean']['input']>;
  multiplePatricipationAgreementsNeededNote?: InputMaybe<Scalars['String']['input']>;
  participationOptions?: InputMaybe<Scalars['Boolean']['input']>;
  participationOptionsNote?: InputMaybe<Scalars['String']['input']>;
  planContractUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  planContractUpdatedNote?: InputMaybe<Scalars['String']['input']>;
  resemblesExistingModel?: InputMaybe<Scalars['Boolean']['input']>;
  resemblesExistingModelHow?: InputMaybe<Scalars['String']['input']>;
  resemblesExistingModelNote?: InputMaybe<Scalars['String']['input']>;
  rulemakingRequired?: InputMaybe<Scalars['Boolean']['input']>;
  rulemakingRequiredDescription?: InputMaybe<Scalars['String']['input']>;
  rulemakingRequiredNote?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatusInput>;
  waiversRequired?: InputMaybe<Scalars['Boolean']['input']>;
  waiversRequiredNote?: InputMaybe<Scalars['String']['input']>;
  waiversRequiredTypes?: InputMaybe<Array<WaiverType>>;
};

/** PlanOpsEvalAndLearning represents the task list section that deals with information regarding the Ops Eval and Learning */
export type PlanOpsEvalAndLearning = {
  __typename?: 'PlanOpsEvalAndLearning';
  agencyOrStateHelp: Array<AgencyOrStateHelpType>;
  agencyOrStateHelpNote?: Maybe<Scalars['String']['output']>;
  agencyOrStateHelpOther?: Maybe<Scalars['String']['output']>;
  anticipatedChallenges?: Maybe<Scalars['String']['output']>;
  appToSendFilesToKnown?: Maybe<Scalars['Boolean']['output']>;
  appToSendFilesToNote?: Maybe<Scalars['String']['output']>;
  appToSendFilesToWhich?: Maybe<Scalars['String']['output']>;
  appealFeedback?: Maybe<Scalars['Boolean']['output']>;
  appealNote?: Maybe<Scalars['String']['output']>;
  appealOther?: Maybe<Scalars['Boolean']['output']>;
  appealPayments?: Maybe<Scalars['Boolean']['output']>;
  appealPerformance?: Maybe<Scalars['Boolean']['output']>;
  benchmarkForPerformance?: Maybe<BenchmarkForPerformanceType>;
  benchmarkForPerformanceNote?: Maybe<Scalars['String']['output']>;
  captureParticipantInfo?: Maybe<Scalars['Boolean']['output']>;
  captureParticipantInfoNote?: Maybe<Scalars['String']['output']>;
  ccmInvolvment: Array<CcmInvolvmentType>;
  ccmInvolvmentNote?: Maybe<Scalars['String']['output']>;
  ccmInvolvmentOther?: Maybe<Scalars['String']['output']>;
  computePerformanceScores?: Maybe<Scalars['Boolean']['output']>;
  computePerformanceScoresNote?: Maybe<Scalars['String']['output']>;
  contractorSupport: Array<ContractorSupportType>;
  contractorSupportHow?: Maybe<Scalars['String']['output']>;
  contractorSupportNote?: Maybe<Scalars['String']['output']>;
  contractorSupportOther?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  dataCollectionFrequency: Array<DataFrequencyType>;
  dataCollectionFrequencyNote?: Maybe<Scalars['String']['output']>;
  dataCollectionFrequencyOther?: Maybe<Scalars['String']['output']>;
  dataCollectionStarts?: Maybe<DataStartsType>;
  dataCollectionStartsOther?: Maybe<Scalars['String']['output']>;
  dataFlowDiagramsNeeded?: Maybe<Scalars['Boolean']['output']>;
  dataFullTimeOrIncremental?: Maybe<DataFullTimeOrIncrementalType>;
  dataMonitoringFileOther?: Maybe<Scalars['String']['output']>;
  dataMonitoringFileTypes: Array<MonitoringFileType>;
  dataMonitoringNote?: Maybe<Scalars['String']['output']>;
  dataNeededForMonitoring: Array<DataForMonitoringType>;
  dataNeededForMonitoringNote?: Maybe<Scalars['String']['output']>;
  dataNeededForMonitoringOther?: Maybe<Scalars['String']['output']>;
  dataResponseFileFrequency?: Maybe<Scalars['String']['output']>;
  dataResponseType?: Maybe<Scalars['String']['output']>;
  dataSharingFrequency: Array<DataFrequencyType>;
  dataSharingFrequencyOther?: Maybe<Scalars['String']['output']>;
  dataSharingStarts?: Maybe<DataStartsType>;
  dataSharingStartsNote?: Maybe<Scalars['String']['output']>;
  dataSharingStartsOther?: Maybe<Scalars['String']['output']>;
  dataToSendParticicipants: Array<DataToSendParticipantsType>;
  dataToSendParticicipantsNote?: Maybe<Scalars['String']['output']>;
  dataToSendParticicipantsOther?: Maybe<Scalars['String']['output']>;
  developNewQualityMeasures?: Maybe<Scalars['Boolean']['output']>;
  developNewQualityMeasuresNote?: Maybe<Scalars['String']['output']>;
  draftIcdDueDate?: Maybe<Scalars['Time']['output']>;
  eftSetUp?: Maybe<Scalars['Boolean']['output']>;
  evaluationApproachOther?: Maybe<Scalars['String']['output']>;
  evaluationApproaches: Array<EvaluationApproachType>;
  evalutaionApproachNote?: Maybe<Scalars['String']['output']>;
  fileNamingConventions?: Maybe<Scalars['String']['output']>;
  helpdeskUse?: Maybe<Scalars['Boolean']['output']>;
  helpdeskUseNote?: Maybe<Scalars['String']['output']>;
  icdNote?: Maybe<Scalars['String']['output']>;
  icdOwner?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  iddocSupport?: Maybe<Scalars['Boolean']['output']>;
  iddocSupportNote?: Maybe<Scalars['String']['output']>;
  modelLearningSystems: Array<ModelLearningSystemType>;
  modelLearningSystemsNote?: Maybe<Scalars['String']['output']>;
  modelLearningSystemsOther?: Maybe<Scalars['String']['output']>;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  produceBenefitEnhancementFiles?: Maybe<Scalars['Boolean']['output']>;
  qualityPerformanceImpactsPayment?: Maybe<Scalars['Boolean']['output']>;
  qualityPerformanceImpactsPaymentNote?: Maybe<Scalars['String']['output']>;
  qualityReportingStarts?: Maybe<DataStartsType>;
  qualityReportingStartsNote?: Maybe<Scalars['String']['output']>;
  qualityReportingStartsOther?: Maybe<Scalars['String']['output']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']['output']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']['output']>;
  readyForReviewBy?: Maybe<Scalars['UUID']['output']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']['output']>;
  riskAdjustFeedback?: Maybe<Scalars['Boolean']['output']>;
  riskAdjustNote?: Maybe<Scalars['String']['output']>;
  riskAdjustOther?: Maybe<Scalars['Boolean']['output']>;
  riskAdjustPayments?: Maybe<Scalars['Boolean']['output']>;
  riskAdjustPerformance?: Maybe<Scalars['Boolean']['output']>;
  sendFilesBetweenCcw?: Maybe<Scalars['Boolean']['output']>;
  sendFilesBetweenCcwNote?: Maybe<Scalars['String']['output']>;
  shareCclfData?: Maybe<Scalars['Boolean']['output']>;
  shareCclfDataNote?: Maybe<Scalars['String']['output']>;
  stakeholders: Array<StakeholdersType>;
  stakeholdersNote?: Maybe<Scalars['String']['output']>;
  stakeholdersOther?: Maybe<Scalars['String']['output']>;
  status: TaskStatus;
  stcNeeds?: Maybe<Scalars['String']['output']>;
  technicalContactsIdentified?: Maybe<Scalars['Boolean']['output']>;
  technicalContactsIdentifiedDetail?: Maybe<Scalars['String']['output']>;
  technicalContactsIdentifiedNote?: Maybe<Scalars['String']['output']>;
  testingNote?: Maybe<Scalars['String']['output']>;
  testingTimelines?: Maybe<Scalars['String']['output']>;
  uatNeeds?: Maybe<Scalars['String']['output']>;
  unsolicitedAdjustmentsIncluded?: Maybe<Scalars['Boolean']['output']>;
  useCcwForFileDistribiutionToParticipants?: Maybe<Scalars['Boolean']['output']>;
  useCcwForFileDistribiutionToParticipantsNote?: Maybe<Scalars['String']['output']>;
};

/**
 * PlanOpsEvalAndLearningChanges represents the possible changes you can make to a
 * ops, eval and learning object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanOpsEvalAndLearningChanges = {
  agencyOrStateHelp?: InputMaybe<Array<AgencyOrStateHelpType>>;
  agencyOrStateHelpNote?: InputMaybe<Scalars['String']['input']>;
  agencyOrStateHelpOther?: InputMaybe<Scalars['String']['input']>;
  anticipatedChallenges?: InputMaybe<Scalars['String']['input']>;
  appToSendFilesToKnown?: InputMaybe<Scalars['Boolean']['input']>;
  appToSendFilesToNote?: InputMaybe<Scalars['String']['input']>;
  appToSendFilesToWhich?: InputMaybe<Scalars['String']['input']>;
  appealFeedback?: InputMaybe<Scalars['Boolean']['input']>;
  appealNote?: InputMaybe<Scalars['String']['input']>;
  appealOther?: InputMaybe<Scalars['Boolean']['input']>;
  appealPayments?: InputMaybe<Scalars['Boolean']['input']>;
  appealPerformance?: InputMaybe<Scalars['Boolean']['input']>;
  benchmarkForPerformance?: InputMaybe<BenchmarkForPerformanceType>;
  benchmarkForPerformanceNote?: InputMaybe<Scalars['String']['input']>;
  captureParticipantInfo?: InputMaybe<Scalars['Boolean']['input']>;
  captureParticipantInfoNote?: InputMaybe<Scalars['String']['input']>;
  ccmInvolvment?: InputMaybe<Array<CcmInvolvmentType>>;
  ccmInvolvmentNote?: InputMaybe<Scalars['String']['input']>;
  ccmInvolvmentOther?: InputMaybe<Scalars['String']['input']>;
  computePerformanceScores?: InputMaybe<Scalars['Boolean']['input']>;
  computePerformanceScoresNote?: InputMaybe<Scalars['String']['input']>;
  contractorSupport?: InputMaybe<Array<ContractorSupportType>>;
  contractorSupportHow?: InputMaybe<Scalars['String']['input']>;
  contractorSupportNote?: InputMaybe<Scalars['String']['input']>;
  contractorSupportOther?: InputMaybe<Scalars['String']['input']>;
  dataCollectionFrequency?: InputMaybe<Array<DataFrequencyType>>;
  dataCollectionFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  dataCollectionFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  dataCollectionStarts?: InputMaybe<DataStartsType>;
  dataCollectionStartsOther?: InputMaybe<Scalars['String']['input']>;
  dataFlowDiagramsNeeded?: InputMaybe<Scalars['Boolean']['input']>;
  dataFullTimeOrIncremental?: InputMaybe<DataFullTimeOrIncrementalType>;
  dataMonitoringFileOther?: InputMaybe<Scalars['String']['input']>;
  dataMonitoringFileTypes?: InputMaybe<Array<MonitoringFileType>>;
  dataMonitoringNote?: InputMaybe<Scalars['String']['input']>;
  dataNeededForMonitoring?: InputMaybe<Array<DataForMonitoringType>>;
  dataNeededForMonitoringNote?: InputMaybe<Scalars['String']['input']>;
  dataNeededForMonitoringOther?: InputMaybe<Scalars['String']['input']>;
  dataResponseFileFrequency?: InputMaybe<Scalars['String']['input']>;
  dataResponseType?: InputMaybe<Scalars['String']['input']>;
  dataSharingFrequency?: InputMaybe<Array<DataFrequencyType>>;
  dataSharingFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  dataSharingStarts?: InputMaybe<DataStartsType>;
  dataSharingStartsNote?: InputMaybe<Scalars['String']['input']>;
  dataSharingStartsOther?: InputMaybe<Scalars['String']['input']>;
  dataToSendParticicipants?: InputMaybe<Array<DataToSendParticipantsType>>;
  dataToSendParticicipantsNote?: InputMaybe<Scalars['String']['input']>;
  dataToSendParticicipantsOther?: InputMaybe<Scalars['String']['input']>;
  developNewQualityMeasures?: InputMaybe<Scalars['Boolean']['input']>;
  developNewQualityMeasuresNote?: InputMaybe<Scalars['String']['input']>;
  draftIcdDueDate?: InputMaybe<Scalars['Time']['input']>;
  eftSetUp?: InputMaybe<Scalars['Boolean']['input']>;
  evaluationApproachOther?: InputMaybe<Scalars['String']['input']>;
  evaluationApproaches?: InputMaybe<Array<EvaluationApproachType>>;
  evalutaionApproachNote?: InputMaybe<Scalars['String']['input']>;
  fileNamingConventions?: InputMaybe<Scalars['String']['input']>;
  helpdeskUse?: InputMaybe<Scalars['Boolean']['input']>;
  helpdeskUseNote?: InputMaybe<Scalars['String']['input']>;
  icdNote?: InputMaybe<Scalars['String']['input']>;
  icdOwner?: InputMaybe<Scalars['String']['input']>;
  iddocSupport?: InputMaybe<Scalars['Boolean']['input']>;
  iddocSupportNote?: InputMaybe<Scalars['String']['input']>;
  modelLearningSystems?: InputMaybe<Array<ModelLearningSystemType>>;
  modelLearningSystemsNote?: InputMaybe<Scalars['String']['input']>;
  modelLearningSystemsOther?: InputMaybe<Scalars['String']['input']>;
  produceBenefitEnhancementFiles?: InputMaybe<Scalars['Boolean']['input']>;
  qualityPerformanceImpactsPayment?: InputMaybe<Scalars['Boolean']['input']>;
  qualityPerformanceImpactsPaymentNote?: InputMaybe<Scalars['String']['input']>;
  qualityReportingStarts?: InputMaybe<DataStartsType>;
  qualityReportingStartsNote?: InputMaybe<Scalars['String']['input']>;
  qualityReportingStartsOther?: InputMaybe<Scalars['String']['input']>;
  riskAdjustFeedback?: InputMaybe<Scalars['Boolean']['input']>;
  riskAdjustNote?: InputMaybe<Scalars['String']['input']>;
  riskAdjustOther?: InputMaybe<Scalars['Boolean']['input']>;
  riskAdjustPayments?: InputMaybe<Scalars['Boolean']['input']>;
  riskAdjustPerformance?: InputMaybe<Scalars['Boolean']['input']>;
  sendFilesBetweenCcw?: InputMaybe<Scalars['Boolean']['input']>;
  sendFilesBetweenCcwNote?: InputMaybe<Scalars['String']['input']>;
  shareCclfData?: InputMaybe<Scalars['Boolean']['input']>;
  shareCclfDataNote?: InputMaybe<Scalars['String']['input']>;
  stakeholders?: InputMaybe<Array<StakeholdersType>>;
  stakeholdersNote?: InputMaybe<Scalars['String']['input']>;
  stakeholdersOther?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatusInput>;
  stcNeeds?: InputMaybe<Scalars['String']['input']>;
  technicalContactsIdentified?: InputMaybe<Scalars['Boolean']['input']>;
  technicalContactsIdentifiedDetail?: InputMaybe<Scalars['String']['input']>;
  technicalContactsIdentifiedNote?: InputMaybe<Scalars['String']['input']>;
  testingNote?: InputMaybe<Scalars['String']['input']>;
  testingTimelines?: InputMaybe<Scalars['String']['input']>;
  uatNeeds?: InputMaybe<Scalars['String']['input']>;
  unsolicitedAdjustmentsIncluded?: InputMaybe<Scalars['Boolean']['input']>;
  useCcwForFileDistribiutionToParticipants?: InputMaybe<Scalars['Boolean']['input']>;
  useCcwForFileDistribiutionToParticipantsNote?: InputMaybe<Scalars['String']['input']>;
};

/** PlanParticipantsAndProviders is the task list section that deals with information regarding all Providers and Participants */
export type PlanParticipantsAndProviders = {
  __typename?: 'PlanParticipantsAndProviders';
  communicationMethod: Array<ParticipantCommunicationType>;
  communicationMethodOther?: Maybe<Scalars['String']['output']>;
  communicationNote?: Maybe<Scalars['String']['output']>;
  confidenceNote?: Maybe<Scalars['String']['output']>;
  coordinateWork?: Maybe<Scalars['Boolean']['output']>;
  coordinateWorkNote?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  estimateConfidence?: Maybe<ConfidenceType>;
  expectedNumberOfParticipants?: Maybe<Scalars['Int']['output']>;
  gainsharePayments?: Maybe<Scalars['Boolean']['output']>;
  gainsharePaymentsNote?: Maybe<Scalars['String']['output']>;
  gainsharePaymentsTrack?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  medicareProviderType?: Maybe<Scalars['String']['output']>;
  modelApplicationLevel?: Maybe<Scalars['String']['output']>;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  participantAssumeRisk?: Maybe<Scalars['Boolean']['output']>;
  participants: Array<ParticipantsType>;
  participantsCurrentlyInModels?: Maybe<Scalars['Boolean']['output']>;
  participantsCurrentlyInModelsNote?: Maybe<Scalars['String']['output']>;
  participantsIDSNote?: Maybe<Scalars['String']['output']>;
  participantsIds: Array<ParticipantsIdType>;
  participantsIdsOther?: Maybe<Scalars['String']['output']>;
  participantsNote?: Maybe<Scalars['String']['output']>;
  participantsOther?: Maybe<Scalars['String']['output']>;
  providerAddMethod: Array<ProviderAddType>;
  providerAddMethodNote?: Maybe<Scalars['String']['output']>;
  providerAddMethodOther?: Maybe<Scalars['String']['output']>;
  providerAdditionFrequency?: Maybe<FrequencyType>;
  providerAdditionFrequencyNote?: Maybe<Scalars['String']['output']>;
  providerAdditionFrequencyOther?: Maybe<Scalars['String']['output']>;
  providerLeaveMethod: Array<ProviderLeaveType>;
  providerLeaveMethodNote?: Maybe<Scalars['String']['output']>;
  providerLeaveMethodOther?: Maybe<Scalars['String']['output']>;
  providerOverlap?: Maybe<OverlapType>;
  providerOverlapHierarchy?: Maybe<Scalars['String']['output']>;
  providerOverlapNote?: Maybe<Scalars['String']['output']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']['output']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']['output']>;
  readyForReviewBy?: Maybe<Scalars['UUID']['output']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']['output']>;
  recruitmentMethod?: Maybe<RecruitmentType>;
  recruitmentNote?: Maybe<Scalars['String']['output']>;
  recruitmentOther?: Maybe<Scalars['String']['output']>;
  riskNote?: Maybe<Scalars['String']['output']>;
  riskOther?: Maybe<Scalars['String']['output']>;
  riskType?: Maybe<ParticipantRiskType>;
  selectionMethod: Array<ParticipantSelectionType>;
  selectionNote?: Maybe<Scalars['String']['output']>;
  selectionOther?: Maybe<Scalars['String']['output']>;
  statesEngagement?: Maybe<Scalars['String']['output']>;
  status: TaskStatus;
  willRiskChange?: Maybe<Scalars['Boolean']['output']>;
  willRiskChangeNote?: Maybe<Scalars['String']['output']>;
};

/**
 * PlanParticipantsAndProvidersChanges represents the possible changes you can make to a
 * providers and participants object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanParticipantsAndProvidersChanges = {
  communicationMethod?: InputMaybe<Array<ParticipantCommunicationType>>;
  communicationMethodOther?: InputMaybe<Scalars['String']['input']>;
  communicationNote?: InputMaybe<Scalars['String']['input']>;
  confidenceNote?: InputMaybe<Scalars['String']['input']>;
  coordinateWork?: InputMaybe<Scalars['Boolean']['input']>;
  coordinateWorkNote?: InputMaybe<Scalars['String']['input']>;
  estimateConfidence?: InputMaybe<ConfidenceType>;
  expectedNumberOfParticipants?: InputMaybe<Scalars['Int']['input']>;
  gainsharePayments?: InputMaybe<Scalars['Boolean']['input']>;
  gainsharePaymentsNote?: InputMaybe<Scalars['String']['input']>;
  gainsharePaymentsTrack?: InputMaybe<Scalars['Boolean']['input']>;
  medicareProviderType?: InputMaybe<Scalars['String']['input']>;
  modelApplicationLevel?: InputMaybe<Scalars['String']['input']>;
  participantAssumeRisk?: InputMaybe<Scalars['Boolean']['input']>;
  participants?: InputMaybe<Array<ParticipantsType>>;
  participantsCurrentlyInModels?: InputMaybe<Scalars['Boolean']['input']>;
  participantsCurrentlyInModelsNote?: InputMaybe<Scalars['String']['input']>;
  participantsIDSNote?: InputMaybe<Scalars['String']['input']>;
  participantsIds?: InputMaybe<Array<ParticipantsIdType>>;
  participantsIdsOther?: InputMaybe<Scalars['String']['input']>;
  participantsNote?: InputMaybe<Scalars['String']['input']>;
  participantsOther?: InputMaybe<Scalars['String']['input']>;
  providerAddMethod?: InputMaybe<Array<ProviderAddType>>;
  providerAddMethodNote?: InputMaybe<Scalars['String']['input']>;
  providerAddMethodOther?: InputMaybe<Scalars['String']['input']>;
  providerAdditionFrequency?: InputMaybe<FrequencyType>;
  providerAdditionFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  providerAdditionFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  providerLeaveMethod?: InputMaybe<Array<ProviderLeaveType>>;
  providerLeaveMethodNote?: InputMaybe<Scalars['String']['input']>;
  providerLeaveMethodOther?: InputMaybe<Scalars['String']['input']>;
  providerOverlap?: InputMaybe<OverlapType>;
  providerOverlapHierarchy?: InputMaybe<Scalars['String']['input']>;
  providerOverlapNote?: InputMaybe<Scalars['String']['input']>;
  recruitmentMethod?: InputMaybe<RecruitmentType>;
  recruitmentNote?: InputMaybe<Scalars['String']['input']>;
  recruitmentOther?: InputMaybe<Scalars['String']['input']>;
  riskNote?: InputMaybe<Scalars['String']['input']>;
  riskOther?: InputMaybe<Scalars['String']['input']>;
  riskType?: InputMaybe<ParticipantRiskType>;
  selectionMethod?: InputMaybe<Array<ParticipantSelectionType>>;
  selectionNote?: InputMaybe<Scalars['String']['input']>;
  selectionOther?: InputMaybe<Scalars['String']['input']>;
  statesEngagement?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatusInput>;
  willRiskChange?: InputMaybe<Scalars['Boolean']['input']>;
  willRiskChangeNote?: InputMaybe<Scalars['String']['input']>;
};

/** PlanPayments is the task list section that deals with information regarding Payments */
export type PlanPayments = {
  __typename?: 'PlanPayments';
  affectsMedicareSecondaryPayerClaims?: Maybe<Scalars['Boolean']['output']>;
  affectsMedicareSecondaryPayerClaimsHow?: Maybe<Scalars['String']['output']>;
  affectsMedicareSecondaryPayerClaimsNote?: Maybe<Scalars['String']['output']>;
  anticipateReconcilingPaymentsRetrospectively?: Maybe<Scalars['Boolean']['output']>;
  anticipateReconcilingPaymentsRetrospectivelyNote?: Maybe<Scalars['String']['output']>;
  anticipatedPaymentFrequency: Array<AnticipatedPaymentFrequencyType>;
  anticipatedPaymentFrequencyNote?: Maybe<Scalars['String']['output']>;
  anticipatedPaymentFrequencyOther?: Maybe<Scalars['String']['output']>;
  beneficiaryCostSharingLevelAndHandling?: Maybe<Scalars['String']['output']>;
  canParticipantsSelectBetweenPaymentMechanisms?: Maybe<Scalars['Boolean']['output']>;
  canParticipantsSelectBetweenPaymentMechanismsHow?: Maybe<Scalars['String']['output']>;
  canParticipantsSelectBetweenPaymentMechanismsNote?: Maybe<Scalars['String']['output']>;
  changesMedicarePhysicianFeeSchedule?: Maybe<Scalars['Boolean']['output']>;
  changesMedicarePhysicianFeeScheduleNote?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  creatingDependenciesBetweenServices?: Maybe<Scalars['Boolean']['output']>;
  creatingDependenciesBetweenServicesNote?: Maybe<Scalars['String']['output']>;
  expectedCalculationComplexityLevel?: Maybe<ComplexityCalculationLevelType>;
  expectedCalculationComplexityLevelNote?: Maybe<Scalars['String']['output']>;
  fundingSource: Array<FundingSource>;
  fundingSourceNote?: Maybe<Scalars['String']['output']>;
  fundingSourceOther?: Maybe<Scalars['String']['output']>;
  fundingSourceR: Array<FundingSource>;
  fundingSourceRNote?: Maybe<Scalars['String']['output']>;
  fundingSourceROther?: Maybe<Scalars['String']['output']>;
  fundingSourceRTrustFundType: Array<TrustFundType>;
  fundingSourceTrustFundType: Array<TrustFundType>;
  id: Scalars['UUID']['output'];
  isContractorAwareTestDataRequirements?: Maybe<Scalars['Boolean']['output']>;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  needsClaimsDataCollection?: Maybe<Scalars['Boolean']['output']>;
  needsClaimsDataCollectionNote?: Maybe<Scalars['String']['output']>;
  nonClaimsPaymentOther?: Maybe<Scalars['String']['output']>;
  nonClaimsPayments: Array<NonClaimsBasedPayType>;
  nonClaimsPaymentsNote?: Maybe<Scalars['String']['output']>;
  numberPaymentsPerPayCycle?: Maybe<Scalars['String']['output']>;
  numberPaymentsPerPayCycleNote?: Maybe<Scalars['String']['output']>;
  payClaims: Array<ClaimsBasedPayType>;
  payClaimsNote?: Maybe<Scalars['String']['output']>;
  payClaimsOther?: Maybe<Scalars['String']['output']>;
  payModelDifferentiation?: Maybe<Scalars['String']['output']>;
  payRecipients: Array<PayRecipient>;
  payRecipientsNote?: Maybe<Scalars['String']['output']>;
  payRecipientsOtherSpecification?: Maybe<Scalars['String']['output']>;
  payType: Array<PayType>;
  payTypeNote?: Maybe<Scalars['String']['output']>;
  paymentCalculationOwner?: Maybe<Scalars['String']['output']>;
  paymentStartDate?: Maybe<Scalars['Time']['output']>;
  paymentStartDateNote?: Maybe<Scalars['String']['output']>;
  planningToUseInnovationPaymentContractor?: Maybe<Scalars['Boolean']['output']>;
  planningToUseInnovationPaymentContractorNote?: Maybe<Scalars['String']['output']>;
  providingThirdPartyFile?: Maybe<Scalars['Boolean']['output']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']['output']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']['output']>;
  readyForReviewBy?: Maybe<Scalars['UUID']['output']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']['output']>;
  sharedSystemsInvolvedAdditionalClaimPayment?: Maybe<Scalars['Boolean']['output']>;
  sharedSystemsInvolvedAdditionalClaimPaymentNote?: Maybe<Scalars['String']['output']>;
  shouldAnyProviderExcludedFFSSystemsNote?: Maybe<Scalars['String']['output']>;
  shouldAnyProvidersExcludedFFSSystems?: Maybe<Scalars['Boolean']['output']>;
  status: TaskStatus;
  waiveBeneficiaryCostSharingForAnyServices?: Maybe<Scalars['Boolean']['output']>;
  waiveBeneficiaryCostSharingNote?: Maybe<Scalars['String']['output']>;
  waiveBeneficiaryCostSharingServiceSpecification?: Maybe<Scalars['String']['output']>;
  waiverOnlyAppliesPartOfPayment?: Maybe<Scalars['Boolean']['output']>;
  willRecoverPayments?: Maybe<Scalars['Boolean']['output']>;
  willRecoverPaymentsNote?: Maybe<Scalars['String']['output']>;
};

export type PlanPaymentsChanges = {
  affectsMedicareSecondaryPayerClaims?: InputMaybe<Scalars['Boolean']['input']>;
  affectsMedicareSecondaryPayerClaimsHow?: InputMaybe<Scalars['String']['input']>;
  affectsMedicareSecondaryPayerClaimsNote?: InputMaybe<Scalars['String']['input']>;
  anticipateReconcilingPaymentsRetrospectively?: InputMaybe<Scalars['Boolean']['input']>;
  anticipateReconcilingPaymentsRetrospectivelyNote?: InputMaybe<Scalars['String']['input']>;
  anticipatedPaymentFrequency?: InputMaybe<Array<AnticipatedPaymentFrequencyType>>;
  anticipatedPaymentFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  anticipatedPaymentFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  beneficiaryCostSharingLevelAndHandling?: InputMaybe<Scalars['String']['input']>;
  canParticipantsSelectBetweenPaymentMechanisms?: InputMaybe<Scalars['Boolean']['input']>;
  canParticipantsSelectBetweenPaymentMechanismsHow?: InputMaybe<Scalars['String']['input']>;
  canParticipantsSelectBetweenPaymentMechanismsNote?: InputMaybe<Scalars['String']['input']>;
  changesMedicarePhysicianFeeSchedule?: InputMaybe<Scalars['Boolean']['input']>;
  changesMedicarePhysicianFeeScheduleNote?: InputMaybe<Scalars['String']['input']>;
  creatingDependenciesBetweenServices?: InputMaybe<Scalars['Boolean']['input']>;
  creatingDependenciesBetweenServicesNote?: InputMaybe<Scalars['String']['input']>;
  expectedCalculationComplexityLevel?: InputMaybe<ComplexityCalculationLevelType>;
  expectedCalculationComplexityLevelNote?: InputMaybe<Scalars['String']['input']>;
  fundingSource?: InputMaybe<Array<FundingSource>>;
  fundingSourceNote?: InputMaybe<Scalars['String']['input']>;
  fundingSourceOther?: InputMaybe<Scalars['String']['input']>;
  fundingSourceR?: InputMaybe<Array<FundingSource>>;
  fundingSourceRNote?: InputMaybe<Scalars['String']['input']>;
  fundingSourceROther?: InputMaybe<Scalars['String']['input']>;
  fundingSourceRTrustFundType?: InputMaybe<Array<TrustFundType>>;
  fundingSourceTrustFundType?: InputMaybe<Array<TrustFundType>>;
  isContractorAwareTestDataRequirements?: InputMaybe<Scalars['Boolean']['input']>;
  needsClaimsDataCollection?: InputMaybe<Scalars['Boolean']['input']>;
  needsClaimsDataCollectionNote?: InputMaybe<Scalars['String']['input']>;
  nonClaimsPaymentOther?: InputMaybe<Scalars['String']['input']>;
  nonClaimsPayments?: InputMaybe<Array<NonClaimsBasedPayType>>;
  nonClaimsPaymentsNote?: InputMaybe<Scalars['String']['input']>;
  numberPaymentsPerPayCycle?: InputMaybe<Scalars['String']['input']>;
  numberPaymentsPerPayCycleNote?: InputMaybe<Scalars['String']['input']>;
  payClaims?: InputMaybe<Array<ClaimsBasedPayType>>;
  payClaimsNote?: InputMaybe<Scalars['String']['input']>;
  payClaimsOther?: InputMaybe<Scalars['String']['input']>;
  payModelDifferentiation?: InputMaybe<Scalars['String']['input']>;
  payRecipients?: InputMaybe<Array<PayRecipient>>;
  payRecipientsNote?: InputMaybe<Scalars['String']['input']>;
  payRecipientsOtherSpecification?: InputMaybe<Scalars['String']['input']>;
  payType?: InputMaybe<Array<PayType>>;
  payTypeNote?: InputMaybe<Scalars['String']['input']>;
  paymentCalculationOwner?: InputMaybe<Scalars['String']['input']>;
  paymentStartDate?: InputMaybe<Scalars['Time']['input']>;
  paymentStartDateNote?: InputMaybe<Scalars['String']['input']>;
  planningToUseInnovationPaymentContractor?: InputMaybe<Scalars['Boolean']['input']>;
  planningToUseInnovationPaymentContractorNote?: InputMaybe<Scalars['String']['input']>;
  providingThirdPartyFile?: InputMaybe<Scalars['Boolean']['input']>;
  sharedSystemsInvolvedAdditionalClaimPayment?: InputMaybe<Scalars['Boolean']['input']>;
  sharedSystemsInvolvedAdditionalClaimPaymentNote?: InputMaybe<Scalars['String']['input']>;
  shouldAnyProviderExcludedFFSSystemsNote?: InputMaybe<Scalars['String']['input']>;
  shouldAnyProvidersExcludedFFSSystems?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<TaskStatusInput>;
  waiveBeneficiaryCostSharingForAnyServices?: InputMaybe<Scalars['Boolean']['input']>;
  waiveBeneficiaryCostSharingNote?: InputMaybe<Scalars['String']['input']>;
  waiveBeneficiaryCostSharingServiceSpecification?: InputMaybe<Scalars['String']['input']>;
  waiverOnlyAppliesPartOfPayment?: InputMaybe<Scalars['Boolean']['input']>;
  willRecoverPayments?: InputMaybe<Scalars['Boolean']['input']>;
  willRecoverPaymentsNote?: InputMaybe<Scalars['String']['input']>;
};

export type PossibleOperationalNeed = {
  __typename?: 'PossibleOperationalNeed';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['Int']['output'];
  key: OperationalNeedKey;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  name: Scalars['String']['output'];
  possibleSolutions: Array<PossibleOperationalSolution>;
  section?: Maybe<TaskListSection>;
};

export type PossibleOperationalSolution = {
  __typename?: 'PossibleOperationalSolution';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['Int']['output'];
  key: OperationalSolutionKey;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  name: Scalars['String']['output'];
  pointsOfContact: Array<PossibleOperationalSolutionContact>;
  treatAsOther: Scalars['Boolean']['output'];
};

/** PossibleOperationalSolutionContact represents a contact for a possible operational solution */
export type PossibleOperationalSolutionContact = {
  __typename?: 'PossibleOperationalSolutionContact';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  email: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  isTeam: Scalars['Boolean']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  name: Scalars['String']['output'];
  possibleOperationalSolutionID: Scalars['Int']['output'];
  role?: Maybe<Scalars['String']['output']>;
};

export type PrepareForClearance = {
  __typename?: 'PrepareForClearance';
  latestClearanceDts?: Maybe<Scalars['Time']['output']>;
  status: PrepareForClearanceStatus;
};

export enum PrepareForClearanceStatus {
  CannotStart = 'CANNOT_START',
  InProgress = 'IN_PROGRESS',
  Ready = 'READY',
  ReadyForClearance = 'READY_FOR_CLEARANCE'
}

export enum ProviderAddType {
  Mandatorily = 'MANDATORILY',
  Na = 'NA',
  OnlineTools = 'ONLINE_TOOLS',
  Other = 'OTHER',
  Prospectively = 'PROSPECTIVELY',
  Retrospectively = 'RETROSPECTIVELY',
  Voluntarily = 'VOLUNTARILY'
}

export enum ProviderLeaveType {
  AfterACertainWithImplications = 'AFTER_A_CERTAIN_WITH_IMPLICATIONS',
  NotAllowedToLeave = 'NOT_ALLOWED_TO_LEAVE',
  NotApplicable = 'NOT_APPLICABLE',
  Other = 'OTHER',
  VariesByTypeOfProvider = 'VARIES_BY_TYPE_OF_PROVIDER',
  VoluntarilyWithoutImplications = 'VOLUNTARILY_WITHOUT_IMPLICATIONS'
}

/** Query definition for the schema */
export type Query = {
  __typename?: 'Query';
  auditChanges: Array<AuditChange>;
  crTdl: PlanCrTdl;
  currentUser: CurrentUser;
  existingModelCollection: Array<ExistingModel>;
  existingModelLink: ExistingModelLink;
  modelPlan: ModelPlan;
  modelPlanCollection: Array<ModelPlan>;
  mostRecentDiscussionRoleSelection?: Maybe<DiscussionRoleSelection>;
  ndaInfo: NdaInfo;
  operationalNeed: OperationalNeed;
  operationalSolution: OperationalSolution;
  operationalSolutions: Array<OperationalSolution>;
  planCollaboratorByID: PlanCollaborator;
  planDocument: PlanDocument;
  planPayments: PlanPayments;
  possibleOperationalNeeds: Array<PossibleOperationalNeed>;
  possibleOperationalSolutions: Array<PossibleOperationalSolution>;
  searchChangeTableDateHistogramConsolidatedAggregations: Array<DateHistogramAggregationBucket>;
  searchChanges: Array<ChangeTableRecord>;
  searchOktaUsers: Array<UserInfo>;
  taskListSectionLocks: Array<TaskListSectionLockStatus>;
  userAccount: UserAccount;
};


/** Query definition for the schema */
export type QueryAuditChangesArgs = {
  primaryKey: Scalars['UUID']['input'];
  tableName: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryCrTdlArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryExistingModelLinkArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryModelPlanArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryModelPlanCollectionArgs = {
  filter?: ModelPlanFilter;
};


/** Query definition for the schema */
export type QueryOperationalNeedArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryOperationalSolutionArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryOperationalSolutionsArgs = {
  includeNotNeeded?: Scalars['Boolean']['input'];
  operationalNeedID: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryPlanCollaboratorByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryPlanDocumentArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryPlanPaymentsArgs = {
  id: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableDateHistogramConsolidatedAggregationsArgs = {
  interval: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangesArgs = {
  filters?: InputMaybe<Array<SearchFilter>>;
  page?: InputMaybe<PageParams>;
  sortBy?: InputMaybe<ChangeHistorySortParams>;
};


/** Query definition for the schema */
export type QuerySearchOktaUsersArgs = {
  searchTerm: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QueryTaskListSectionLocksArgs = {
  modelPlanID: Scalars['UUID']['input'];
};


/** Query definition for the schema */
export type QueryUserAccountArgs = {
  username: Scalars['String']['input'];
};

export enum RecruitmentType {
  ApplicationCollectionTool = 'APPLICATION_COLLECTION_TOOL',
  Loi = 'LOI',
  Na = 'NA',
  Nofo = 'NOFO',
  Other = 'OTHER'
}

export type ReportAProblemInput = {
  allowContact?: InputMaybe<Scalars['Boolean']['input']>;
  isAnonymousSubmission: Scalars['Boolean']['input'];
  section?: InputMaybe<ReportAProblemSection>;
  sectionOther?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<ReportAProblemSeverity>;
  severityOther?: InputMaybe<Scalars['String']['input']>;
  whatDoing?: InputMaybe<Scalars['String']['input']>;
  whatWentWrong?: InputMaybe<Scalars['String']['input']>;
};

export enum ReportAProblemSection {
  HelpCenter = 'HELP_CENTER',
  ItSolutions = 'IT_SOLUTIONS',
  Other = 'OTHER',
  ReadView = 'READ_VIEW',
  TaskList = 'TASK_LIST'
}

export enum ReportAProblemSeverity {
  DelayedTask = 'DELAYED_TASK',
  Minor = 'MINOR',
  Other = 'OTHER',
  PreventedTask = 'PREVENTED_TASK'
}

/** A user role associated with a job code */
export enum Role {
  /** A MINT assessment team user */
  MintAssessment = 'MINT_ASSESSMENT',
  /** A MINT MAC user */
  MintMac = 'MINT_MAC',
  /** A basic MINT user */
  MintUser = 'MINT_USER'
}

export enum SatisfactionLevel {
  Dissatisfied = 'DISSATISFIED',
  Neutral = 'NEUTRAL',
  Satisfied = 'SATISFIED',
  VeryDissatisfied = 'VERY_DISSATISFIED',
  VerySatisfied = 'VERY_SATISFIED'
}

export type SearchFilter = {
  type: SearchFilterType;
  value: Scalars['Any']['input'];
};

export enum SearchFilterType {
  /**
   * Filter search results to include changes on or after the specified date.
   * Expected value: A string in RFC3339 format representing the date and time.
   * Example: "2006-01-02T15:04:05Z07:00"
   */
  ChangedAfter = 'CHANGED_AFTER',
  /**
   * Filter search results to include changes on or before the specified date.
   * Expected value: A string in RFC3339 format representing the date and time.
   * Example: "2006-01-02T15:04:05Z07:00"
   */
  ChangedBefore = 'CHANGED_BEFORE',
  /**
   * Filter search results to include changes made by the specified actor. This is a fuzzy search on the fields: common_name, username, given_name, and family_name of the actor.
   * Expected value: A string representing the name or username of the actor.
   * Example: "MINT"
   */
  ChangedByActor = 'CHANGED_BY_ACTOR',
  /**
   * Filter results with a free text search. This is a fuzzy search on the entire record.
   * Expected value: A string representing the free text search query.
   * Example: "Operational Need"
   */
  FreeText = 'FREE_TEXT',
  /**
   * Filter search results to include changes made to the specified model plan by ID.
   * Expected value: A string representing the ID of the model plan.
   * Example: "efda354c-11dd-458e-91cf-4f43ee47440b"
   */
  ModelPlanId = 'MODEL_PLAN_ID',
  /**
   * Filter search results to include changes made to the specified object.
   * Expected value: A string representing the section of the model plan. Use the SearchableTaskListSection enum for valid values.
   * Example: "BASICS"
   */
  ModelPlanSection = 'MODEL_PLAN_SECTION',
  /**
   * Filter search results to include model plans with the specified status.
   * Expected value: A string representing the status of the model plan.
   * Example: "ACTIVE"
   */
  ModelPlanStatus = 'MODEL_PLAN_STATUS',
  /**
   * Filter results by table id.
   * Expected value: An integer representing the table ID.
   * Example: 14
   */
  TableId = 'TABLE_ID',
  /**
   * Filter results by table name.
   * Expected value: A string representing the table name.
   * Example: "plan_basics"
   */
  TableName = 'TABLE_NAME'
}

export enum SearchableTaskListSection {
  Basics = 'BASICS',
  Beneficiaries = 'BENEFICIARIES',
  GeneralCharacteristics = 'GENERAL_CHARACTERISTICS',
  OperationsEvaluationAndLearning = 'OPERATIONS_EVALUATION_AND_LEARNING',
  ParticipantsAndProviders = 'PARTICIPANTS_AND_PROVIDERS',
  Payment = 'PAYMENT'
}

export enum SelectionMethodType {
  Historical = 'HISTORICAL',
  Na = 'NA',
  Other = 'OTHER',
  Prospective = 'PROSPECTIVE',
  ProviderSignUp = 'PROVIDER_SIGN_UP',
  Retrospective = 'RETROSPECTIVE',
  Voluntary = 'VOLUNTARY'
}

/** The inputs to the user feedback form */
export type SendFeedbackEmailInput = {
  allowContact?: InputMaybe<Scalars['Boolean']['input']>;
  cmsRole?: InputMaybe<Scalars['String']['input']>;
  howCanWeImprove?: InputMaybe<Scalars['String']['input']>;
  howSatisfied?: InputMaybe<SatisfactionLevel>;
  isAnonymousSubmission: Scalars['Boolean']['input'];
  mintUsedFor?: InputMaybe<Array<MintUses>>;
  mintUsedForOther?: InputMaybe<Scalars['String']['input']>;
  systemEasyToUse?: InputMaybe<EaseOfUse>;
  systemEasyToUseOther?: InputMaybe<Scalars['String']['input']>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum StakeholdersType {
  Beneficiaries = 'BENEFICIARIES',
  CommunityOrganizations = 'COMMUNITY_ORGANIZATIONS',
  Other = 'OTHER',
  Participants = 'PARTICIPANTS',
  ProfessionalOrganizations = 'PROFESSIONAL_ORGANIZATIONS',
  Providers = 'PROVIDERS',
  States = 'STATES'
}

export type Subscription = {
  __typename?: 'Subscription';
  onLockTaskListSectionContext: TaskListSectionLockStatusChanged;
  onTaskListSectionLocksChanged: TaskListSectionLockStatusChanged;
};


export type SubscriptionOnLockTaskListSectionContextArgs = {
  modelPlanID: Scalars['UUID']['input'];
};


export type SubscriptionOnTaskListSectionLocksChangedArgs = {
  modelPlanID: Scalars['UUID']['input'];
};

export enum TaskListSection {
  Basics = 'BASICS',
  Beneficiaries = 'BENEFICIARIES',
  GeneralCharacteristics = 'GENERAL_CHARACTERISTICS',
  OperationsEvaluationAndLearning = 'OPERATIONS_EVALUATION_AND_LEARNING',
  ParticipantsAndProviders = 'PARTICIPANTS_AND_PROVIDERS',
  Payment = 'PAYMENT',
  PrepareForClearance = 'PREPARE_FOR_CLEARANCE'
}

export type TaskListSectionLockStatus = {
  __typename?: 'TaskListSectionLockStatus';
  isAssessment: Scalars['Boolean']['output'];
  lockedByUserAccount: UserAccount;
  modelPlanID: Scalars['UUID']['output'];
  section: TaskListSection;
};

export type TaskListSectionLockStatusChanged = {
  __typename?: 'TaskListSectionLockStatusChanged';
  actionType: ActionType;
  changeType: ChangeType;
  lockStatus: TaskListSectionLockStatus;
};

export enum TaskStatus {
  InProgress = 'IN_PROGRESS',
  Ready = 'READY',
  ReadyForClearance = 'READY_FOR_CLEARANCE',
  ReadyForReview = 'READY_FOR_REVIEW'
}

export enum TaskStatusInput {
  InProgress = 'IN_PROGRESS',
  ReadyForClearance = 'READY_FOR_CLEARANCE',
  ReadyForReview = 'READY_FOR_REVIEW'
}

export enum TeamRole {
  Evaluation = 'EVALUATION',
  ItLead = 'IT_LEAD',
  Leadership = 'LEADERSHIP',
  Learning = 'LEARNING',
  ModelLead = 'MODEL_LEAD',
  ModelTeam = 'MODEL_TEAM',
  Oact = 'OACT',
  Payment = 'PAYMENT',
  Quality = 'QUALITY'
}

export enum TriStateAnswer {
  No = 'NO',
  Tbd = 'TBD',
  Yes = 'YES'
}

export enum TrustFundType {
  MedicarePartAHiTrustFund = 'MEDICARE_PART_A_HI_TRUST_FUND',
  MedicarePartBSmiTrustFund = 'MEDICARE_PART_B_SMI_TRUST_FUND'
}

export type UpdateOperationalSolutionSubtaskChangesInput = {
  name: Scalars['String']['input'];
  status: OperationalSolutionSubtaskStatus;
};

export type UpdateOperationalSolutionSubtaskInput = {
  changes: UpdateOperationalSolutionSubtaskChangesInput;
  id: Scalars['UUID']['input'];
};

export type UserAccount = {
  __typename?: 'UserAccount';
  commonName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  familyName: Scalars['String']['output'];
  givenName: Scalars['String']['output'];
  hasLoggedIn?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  isEUAID?: Maybe<Scalars['Boolean']['output']>;
  locale: Scalars['String']['output'];
  username: Scalars['String']['output'];
  zoneInfo: Scalars['String']['output'];
};

/** Represents a person response from the Okta API */
export type UserInfo = {
  __typename?: 'UserInfo';
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export enum WaiverType {
  FraudAbuse = 'FRAUD_ABUSE',
  Medicaid = 'MEDICAID',
  ProgramPayment = 'PROGRAM_PAYMENT'
}

export type GetBasicsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBasicsQuery = { __typename?: 'Query', modelPlan: { __typename?: 'ModelPlan', id: any, modelName: string, abbreviation?: string | null, nameHistory: Array<string>, basics: { __typename?: 'PlanBasics', id: any, demoCode?: string | null, amsModelID?: string | null, modelCategory?: ModelCategory | null, additionalModelCategories: Array<ModelCategory>, cmsCenters: Array<CmsCenter>, cmsOther?: string | null, cmmiGroups: Array<CmmiGroup> } } };

export type GetMilestonesQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetMilestonesQuery = { __typename?: 'Query', modelPlan: { __typename?: 'ModelPlan', id: any, modelName: string, basics: { __typename?: 'PlanBasics', id: any, completeICIP?: any | null, clearanceStarts?: any | null, clearanceEnds?: any | null, announced?: any | null, applicationsStart?: any | null, applicationsEnd?: any | null, performancePeriodStarts?: any | null, performancePeriodEnds?: any | null, highLevelNote?: string | null, wrapUpEnds?: any | null, phasedIn?: boolean | null, phasedInNote?: string | null, readyForReviewDts?: any | null, status: TaskStatus, readyForReviewByUserAccount?: { __typename?: 'UserAccount', id: any, commonName: string } | null } } };

export type GetOverviewQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOverviewQuery = { __typename?: 'Query', modelPlan: { __typename?: 'ModelPlan', id: any, modelName: string, basics: { __typename?: 'PlanBasics', id: any, modelType?: ModelType | null, problem?: string | null, goal?: string | null, testInterventions?: string | null, note?: string | null } } };

export type UpdateBasicsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanBasicsChanges;
}>;


export type UpdateBasicsMutation = { __typename?: 'Mutation', updatePlanBasics: { __typename?: 'PlanBasics', id: any } };

export type UpdateModelPlanAndBasicsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: ModelPlanChanges;
  basicsId: Scalars['UUID']['input'];
  basicsChanges: PlanBasicsChanges;
}>;


export type UpdateModelPlanAndBasicsMutation = { __typename?: 'Mutation', updateModelPlan: { __typename?: 'ModelPlan', id: any }, updatePlanBasics: { __typename?: 'PlanBasics', id: any } };

export type LinkNewPlanDocumentMutationVariables = Exact<{
  input: PlanDocumentLinkInput;
}>;


export type LinkNewPlanDocumentMutation = { __typename?: 'Mutation', linkNewPlanDocument: { __typename?: 'PlanDocument', id: any } };

export type CreatReportAProblemMutationVariables = Exact<{
  input: ReportAProblemInput;
}>;


export type CreatReportAProblemMutation = { __typename?: 'Mutation', reportAProblem: boolean };

export type CreatSendFeedbackMutationVariables = Exact<{
  input: SendFeedbackEmailInput;
}>;


export type CreatSendFeedbackMutation = { __typename?: 'Mutation', sendFeedbackEmail: boolean };

export type ReadyForReviewUserFragmentFragment = { __typename?: 'UserAccount', id: any, commonName: string };

export type GetFundingQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetFundingQuery = { __typename?: 'Query', modelPlan: { __typename?: 'ModelPlan', id: any, modelName: string, payments: { __typename?: 'PlanPayments', id: any, fundingSource: Array<FundingSource>, fundingSourceTrustFundType: Array<TrustFundType>, fundingSourceOther?: string | null, fundingSourceNote?: string | null, fundingSourceR: Array<FundingSource>, fundingSourceRTrustFundType: Array<TrustFundType>, fundingSourceROther?: string | null, fundingSourceRNote?: string | null, payRecipients: Array<PayRecipient>, payRecipientsOtherSpecification?: string | null, payRecipientsNote?: string | null, payType: Array<PayType>, payTypeNote?: string | null, payClaims: Array<ClaimsBasedPayType> }, operationalNeeds: Array<{ __typename?: 'OperationalNeed', modifiedDts?: any | null }> } };

export type UpdatePaymentsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanPaymentsChanges;
}>;


export type UpdatePaymentsMutation = { __typename?: 'Mutation', updatePlanPayments: { __typename?: 'PlanPayments', id: any } };

export type CreateShareModelPlanMutationVariables = Exact<{
  modelPlanID: Scalars['UUID']['input'];
  viewFilter?: InputMaybe<ModelViewFilter>;
  usernames: Array<Scalars['String']['input']> | Scalars['String']['input'];
  optionalMessage?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateShareModelPlanMutation = { __typename?: 'Mutation', shareModelPlan: boolean };

export type GetPossibleSolutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPossibleSolutionsQuery = { __typename?: 'Query', possibleOperationalSolutions: Array<{ __typename?: 'PossibleOperationalSolution', id: number, key: OperationalSolutionKey, pointsOfContact: Array<{ __typename?: 'PossibleOperationalSolutionContact', id: any, name: string, email: string, isTeam: boolean, role?: string | null }> }> };

export type GetNdaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNdaQuery = { __typename?: 'Query', ndaInfo: { __typename?: 'NDAInfo', agreed: boolean, agreedDts?: any | null } };

export const ReadyForReviewUserFragmentFragmentDoc = gql`
    fragment ReadyForReviewUserFragment on UserAccount {
  id
  commonName
}
    `;
export const GetBasicsDocument = gql`
    query GetBasics($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    abbreviation
    nameHistory(sort: DESC)
    basics {
      id
      demoCode
      amsModelID
      modelCategory
      additionalModelCategories
      cmsCenters
      cmsOther
      cmmiGroups
    }
  }
}
    `;

/**
 * __useGetBasicsQuery__
 *
 * To run a query within a React component, call `useGetBasicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBasicsQuery(baseOptions: Apollo.QueryHookOptions<GetBasicsQuery, GetBasicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBasicsQuery, GetBasicsQueryVariables>(GetBasicsDocument, options);
      }
export function useGetBasicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBasicsQuery, GetBasicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBasicsQuery, GetBasicsQueryVariables>(GetBasicsDocument, options);
        }
export function useGetBasicsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBasicsQuery, GetBasicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBasicsQuery, GetBasicsQueryVariables>(GetBasicsDocument, options);
        }
export type GetBasicsQueryHookResult = ReturnType<typeof useGetBasicsQuery>;
export type GetBasicsLazyQueryHookResult = ReturnType<typeof useGetBasicsLazyQuery>;
export type GetBasicsSuspenseQueryHookResult = ReturnType<typeof useGetBasicsSuspenseQuery>;
export type GetBasicsQueryResult = Apollo.QueryResult<GetBasicsQuery, GetBasicsQueryVariables>;
export const GetMilestonesDocument = gql`
    query GetMilestones($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    basics {
      id
      completeICIP
      clearanceStarts
      clearanceEnds
      announced
      applicationsStart
      applicationsEnd
      performancePeriodStarts
      performancePeriodEnds
      highLevelNote
      wrapUpEnds
      phasedIn
      phasedInNote
      readyForReviewByUserAccount {
        ...ReadyForReviewUserFragment
      }
      readyForReviewDts
      status
    }
  }
}
    ${ReadyForReviewUserFragmentFragmentDoc}`;

/**
 * __useGetMilestonesQuery__
 *
 * To run a query within a React component, call `useGetMilestonesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMilestonesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMilestonesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMilestonesQuery(baseOptions: Apollo.QueryHookOptions<GetMilestonesQuery, GetMilestonesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMilestonesQuery, GetMilestonesQueryVariables>(GetMilestonesDocument, options);
      }
export function useGetMilestonesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMilestonesQuery, GetMilestonesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMilestonesQuery, GetMilestonesQueryVariables>(GetMilestonesDocument, options);
        }
export function useGetMilestonesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMilestonesQuery, GetMilestonesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMilestonesQuery, GetMilestonesQueryVariables>(GetMilestonesDocument, options);
        }
export type GetMilestonesQueryHookResult = ReturnType<typeof useGetMilestonesQuery>;
export type GetMilestonesLazyQueryHookResult = ReturnType<typeof useGetMilestonesLazyQuery>;
export type GetMilestonesSuspenseQueryHookResult = ReturnType<typeof useGetMilestonesSuspenseQuery>;
export type GetMilestonesQueryResult = Apollo.QueryResult<GetMilestonesQuery, GetMilestonesQueryVariables>;
export const GetOverviewDocument = gql`
    query GetOverview($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    basics {
      id
      modelType
      problem
      goal
      testInterventions
      note
    }
  }
}
    `;

/**
 * __useGetOverviewQuery__
 *
 * To run a query within a React component, call `useGetOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOverviewQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOverviewQuery(baseOptions: Apollo.QueryHookOptions<GetOverviewQuery, GetOverviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOverviewQuery, GetOverviewQueryVariables>(GetOverviewDocument, options);
      }
export function useGetOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOverviewQuery, GetOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOverviewQuery, GetOverviewQueryVariables>(GetOverviewDocument, options);
        }
export function useGetOverviewSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOverviewQuery, GetOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOverviewQuery, GetOverviewQueryVariables>(GetOverviewDocument, options);
        }
export type GetOverviewQueryHookResult = ReturnType<typeof useGetOverviewQuery>;
export type GetOverviewLazyQueryHookResult = ReturnType<typeof useGetOverviewLazyQuery>;
export type GetOverviewSuspenseQueryHookResult = ReturnType<typeof useGetOverviewSuspenseQuery>;
export type GetOverviewQueryResult = Apollo.QueryResult<GetOverviewQuery, GetOverviewQueryVariables>;
export const UpdateBasicsDocument = gql`
    mutation UpdateBasics($id: UUID!, $changes: PlanBasicsChanges!) {
  updatePlanBasics(id: $id, changes: $changes) {
    id
  }
}
    `;
export type UpdateBasicsMutationFn = Apollo.MutationFunction<UpdateBasicsMutation, UpdateBasicsMutationVariables>;

/**
 * __useUpdateBasicsMutation__
 *
 * To run a mutation, you first call `useUpdateBasicsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBasicsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBasicsMutation, { data, loading, error }] = useUpdateBasicsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdateBasicsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBasicsMutation, UpdateBasicsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBasicsMutation, UpdateBasicsMutationVariables>(UpdateBasicsDocument, options);
      }
export type UpdateBasicsMutationHookResult = ReturnType<typeof useUpdateBasicsMutation>;
export type UpdateBasicsMutationResult = Apollo.MutationResult<UpdateBasicsMutation>;
export type UpdateBasicsMutationOptions = Apollo.BaseMutationOptions<UpdateBasicsMutation, UpdateBasicsMutationVariables>;
export const UpdateModelPlanAndBasicsDocument = gql`
    mutation UpdateModelPlanAndBasics($id: UUID!, $changes: ModelPlanChanges!, $basicsId: UUID!, $basicsChanges: PlanBasicsChanges!) {
  updateModelPlan(id: $id, changes: $changes) {
    id
  }
  updatePlanBasics(id: $basicsId, changes: $basicsChanges) {
    id
  }
}
    `;
export type UpdateModelPlanAndBasicsMutationFn = Apollo.MutationFunction<UpdateModelPlanAndBasicsMutation, UpdateModelPlanAndBasicsMutationVariables>;

/**
 * __useUpdateModelPlanAndBasicsMutation__
 *
 * To run a mutation, you first call `useUpdateModelPlanAndBasicsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateModelPlanAndBasicsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateModelPlanAndBasicsMutation, { data, loading, error }] = useUpdateModelPlanAndBasicsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *      basicsId: // value for 'basicsId'
 *      basicsChanges: // value for 'basicsChanges'
 *   },
 * });
 */
export function useUpdateModelPlanAndBasicsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateModelPlanAndBasicsMutation, UpdateModelPlanAndBasicsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateModelPlanAndBasicsMutation, UpdateModelPlanAndBasicsMutationVariables>(UpdateModelPlanAndBasicsDocument, options);
      }
export type UpdateModelPlanAndBasicsMutationHookResult = ReturnType<typeof useUpdateModelPlanAndBasicsMutation>;
export type UpdateModelPlanAndBasicsMutationResult = Apollo.MutationResult<UpdateModelPlanAndBasicsMutation>;
export type UpdateModelPlanAndBasicsMutationOptions = Apollo.BaseMutationOptions<UpdateModelPlanAndBasicsMutation, UpdateModelPlanAndBasicsMutationVariables>;
export const LinkNewPlanDocumentDocument = gql`
    mutation LinkNewPlanDocument($input: PlanDocumentLinkInput!) {
  linkNewPlanDocument(input: $input) {
    id
  }
}
    `;
export type LinkNewPlanDocumentMutationFn = Apollo.MutationFunction<LinkNewPlanDocumentMutation, LinkNewPlanDocumentMutationVariables>;

/**
 * __useLinkNewPlanDocumentMutation__
 *
 * To run a mutation, you first call `useLinkNewPlanDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkNewPlanDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkNewPlanDocumentMutation, { data, loading, error }] = useLinkNewPlanDocumentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkNewPlanDocumentMutation(baseOptions?: Apollo.MutationHookOptions<LinkNewPlanDocumentMutation, LinkNewPlanDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LinkNewPlanDocumentMutation, LinkNewPlanDocumentMutationVariables>(LinkNewPlanDocumentDocument, options);
      }
export type LinkNewPlanDocumentMutationHookResult = ReturnType<typeof useLinkNewPlanDocumentMutation>;
export type LinkNewPlanDocumentMutationResult = Apollo.MutationResult<LinkNewPlanDocumentMutation>;
export type LinkNewPlanDocumentMutationOptions = Apollo.BaseMutationOptions<LinkNewPlanDocumentMutation, LinkNewPlanDocumentMutationVariables>;
export const CreatReportAProblemDocument = gql`
    mutation CreatReportAProblem($input: ReportAProblemInput!) {
  reportAProblem(input: $input)
}
    `;
export type CreatReportAProblemMutationFn = Apollo.MutationFunction<CreatReportAProblemMutation, CreatReportAProblemMutationVariables>;

/**
 * __useCreatReportAProblemMutation__
 *
 * To run a mutation, you first call `useCreatReportAProblemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatReportAProblemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [creatReportAProblemMutation, { data, loading, error }] = useCreatReportAProblemMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatReportAProblemMutation(baseOptions?: Apollo.MutationHookOptions<CreatReportAProblemMutation, CreatReportAProblemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatReportAProblemMutation, CreatReportAProblemMutationVariables>(CreatReportAProblemDocument, options);
      }
export type CreatReportAProblemMutationHookResult = ReturnType<typeof useCreatReportAProblemMutation>;
export type CreatReportAProblemMutationResult = Apollo.MutationResult<CreatReportAProblemMutation>;
export type CreatReportAProblemMutationOptions = Apollo.BaseMutationOptions<CreatReportAProblemMutation, CreatReportAProblemMutationVariables>;
export const CreatSendFeedbackDocument = gql`
    mutation CreatSendFeedback($input: SendFeedbackEmailInput!) {
  sendFeedbackEmail(input: $input)
}
    `;
export type CreatSendFeedbackMutationFn = Apollo.MutationFunction<CreatSendFeedbackMutation, CreatSendFeedbackMutationVariables>;

/**
 * __useCreatSendFeedbackMutation__
 *
 * To run a mutation, you first call `useCreatSendFeedbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatSendFeedbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [creatSendFeedbackMutation, { data, loading, error }] = useCreatSendFeedbackMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatSendFeedbackMutation(baseOptions?: Apollo.MutationHookOptions<CreatSendFeedbackMutation, CreatSendFeedbackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatSendFeedbackMutation, CreatSendFeedbackMutationVariables>(CreatSendFeedbackDocument, options);
      }
export type CreatSendFeedbackMutationHookResult = ReturnType<typeof useCreatSendFeedbackMutation>;
export type CreatSendFeedbackMutationResult = Apollo.MutationResult<CreatSendFeedbackMutation>;
export type CreatSendFeedbackMutationOptions = Apollo.BaseMutationOptions<CreatSendFeedbackMutation, CreatSendFeedbackMutationVariables>;
export const GetFundingDocument = gql`
    query GetFunding($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      fundingSource
      fundingSourceTrustFundType
      fundingSourceOther
      fundingSourceNote
      fundingSourceR
      fundingSourceRTrustFundType
      fundingSourceROther
      fundingSourceRNote
      payRecipients
      payRecipientsOtherSpecification
      payRecipientsNote
      payType
      payTypeNote
      payClaims
    }
    operationalNeeds {
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetFundingQuery__
 *
 * To run a query within a React component, call `useGetFundingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFundingQuery(baseOptions: Apollo.QueryHookOptions<GetFundingQuery, GetFundingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundingQuery, GetFundingQueryVariables>(GetFundingDocument, options);
      }
export function useGetFundingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundingQuery, GetFundingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundingQuery, GetFundingQueryVariables>(GetFundingDocument, options);
        }
export function useGetFundingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFundingQuery, GetFundingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFundingQuery, GetFundingQueryVariables>(GetFundingDocument, options);
        }
export type GetFundingQueryHookResult = ReturnType<typeof useGetFundingQuery>;
export type GetFundingLazyQueryHookResult = ReturnType<typeof useGetFundingLazyQuery>;
export type GetFundingSuspenseQueryHookResult = ReturnType<typeof useGetFundingSuspenseQuery>;
export type GetFundingQueryResult = Apollo.QueryResult<GetFundingQuery, GetFundingQueryVariables>;
export const UpdatePaymentsDocument = gql`
    mutation UpdatePayments($id: UUID!, $changes: PlanPaymentsChanges!) {
  updatePlanPayments(id: $id, changes: $changes) {
    id
  }
}
    `;
export type UpdatePaymentsMutationFn = Apollo.MutationFunction<UpdatePaymentsMutation, UpdatePaymentsMutationVariables>;

/**
 * __useUpdatePaymentsMutation__
 *
 * To run a mutation, you first call `useUpdatePaymentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePaymentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePaymentsMutation, { data, loading, error }] = useUpdatePaymentsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdatePaymentsMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePaymentsMutation, UpdatePaymentsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePaymentsMutation, UpdatePaymentsMutationVariables>(UpdatePaymentsDocument, options);
      }
export type UpdatePaymentsMutationHookResult = ReturnType<typeof useUpdatePaymentsMutation>;
export type UpdatePaymentsMutationResult = Apollo.MutationResult<UpdatePaymentsMutation>;
export type UpdatePaymentsMutationOptions = Apollo.BaseMutationOptions<UpdatePaymentsMutation, UpdatePaymentsMutationVariables>;
export const CreateShareModelPlanDocument = gql`
    mutation CreateShareModelPlan($modelPlanID: UUID!, $viewFilter: ModelViewFilter, $usernames: [String!]!, $optionalMessage: String) {
  shareModelPlan(
    modelPlanID: $modelPlanID
    viewFilter: $viewFilter
    usernames: $usernames
    optionalMessage: $optionalMessage
  )
}
    `;
export type CreateShareModelPlanMutationFn = Apollo.MutationFunction<CreateShareModelPlanMutation, CreateShareModelPlanMutationVariables>;

/**
 * __useCreateShareModelPlanMutation__
 *
 * To run a mutation, you first call `useCreateShareModelPlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShareModelPlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShareModelPlanMutation, { data, loading, error }] = useCreateShareModelPlanMutation({
 *   variables: {
 *      modelPlanID: // value for 'modelPlanID'
 *      viewFilter: // value for 'viewFilter'
 *      usernames: // value for 'usernames'
 *      optionalMessage: // value for 'optionalMessage'
 *   },
 * });
 */
export function useCreateShareModelPlanMutation(baseOptions?: Apollo.MutationHookOptions<CreateShareModelPlanMutation, CreateShareModelPlanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShareModelPlanMutation, CreateShareModelPlanMutationVariables>(CreateShareModelPlanDocument, options);
      }
export type CreateShareModelPlanMutationHookResult = ReturnType<typeof useCreateShareModelPlanMutation>;
export type CreateShareModelPlanMutationResult = Apollo.MutationResult<CreateShareModelPlanMutation>;
export type CreateShareModelPlanMutationOptions = Apollo.BaseMutationOptions<CreateShareModelPlanMutation, CreateShareModelPlanMutationVariables>;
export const GetPossibleSolutionsDocument = gql`
    query GetPossibleSolutions {
  possibleOperationalSolutions {
    id
    key
    pointsOfContact {
      id
      name
      email
      isTeam
      role
    }
  }
}
    `;

/**
 * __useGetPossibleSolutionsQuery__
 *
 * To run a query within a React component, call `useGetPossibleSolutionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPossibleSolutionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPossibleSolutionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPossibleSolutionsQuery(baseOptions?: Apollo.QueryHookOptions<GetPossibleSolutionsQuery, GetPossibleSolutionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPossibleSolutionsQuery, GetPossibleSolutionsQueryVariables>(GetPossibleSolutionsDocument, options);
      }
export function useGetPossibleSolutionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPossibleSolutionsQuery, GetPossibleSolutionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPossibleSolutionsQuery, GetPossibleSolutionsQueryVariables>(GetPossibleSolutionsDocument, options);
        }
export function useGetPossibleSolutionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPossibleSolutionsQuery, GetPossibleSolutionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPossibleSolutionsQuery, GetPossibleSolutionsQueryVariables>(GetPossibleSolutionsDocument, options);
        }
export type GetPossibleSolutionsQueryHookResult = ReturnType<typeof useGetPossibleSolutionsQuery>;
export type GetPossibleSolutionsLazyQueryHookResult = ReturnType<typeof useGetPossibleSolutionsLazyQuery>;
export type GetPossibleSolutionsSuspenseQueryHookResult = ReturnType<typeof useGetPossibleSolutionsSuspenseQuery>;
export type GetPossibleSolutionsQueryResult = Apollo.QueryResult<GetPossibleSolutionsQuery, GetPossibleSolutionsQueryVariables>;
export const GetNdaDocument = gql`
    query GetNDA {
  ndaInfo {
    agreed
    agreedDts
  }
}
    `;

/**
 * __useGetNdaQuery__
 *
 * To run a query within a React component, call `useGetNdaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNdaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNdaQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNdaQuery(baseOptions?: Apollo.QueryHookOptions<GetNdaQuery, GetNdaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNdaQuery, GetNdaQueryVariables>(GetNdaDocument, options);
      }
export function useGetNdaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNdaQuery, GetNdaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNdaQuery, GetNdaQueryVariables>(GetNdaDocument, options);
        }
export function useGetNdaSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetNdaQuery, GetNdaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNdaQuery, GetNdaQueryVariables>(GetNdaDocument, options);
        }
export type GetNdaQueryHookResult = ReturnType<typeof useGetNdaQuery>;
export type GetNdaLazyQueryHookResult = ReturnType<typeof useGetNdaLazyQuery>;
export type GetNdaSuspenseQueryHookResult = ReturnType<typeof useGetNdaSuspenseQuery>;
export type GetNdaQueryResult = Apollo.QueryResult<GetNdaQuery, GetNdaQueryVariables>;