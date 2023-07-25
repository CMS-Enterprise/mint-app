/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Any represents any GraphQL value. */
  Any: any;
  /** Date values are represented as strings using GoLang's "DateOnly" format, for example 2006-01-02 */
  Date: Time;
  /** Maps an arbitrary GraphQL value to a map[string]interface{} Go type. */
  Map: any;
  /** Time values are represented as strings using RFC3339 format, for example 2019-10-12T07:20:50G.52Z */
  Time: any;
  /** UUIDs are represented using 36 ASCII characters, for example B0511859-ADE6-4A67-8969-16EC280C0E1A */
  UUID: any;
  /**
   * https://gqlgen.com/reference/file-upload/
   * Represents a multipart file upload
   */
  Upload: any;
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
  action: Scalars['String'];
  fields: Scalars['Map'];
  foreignKey?: Maybe<Scalars['UUID']>;
  id: Scalars['Int'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  primaryKey: Scalars['UUID'];
  tableName: Scalars['String'];
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
  action: Scalars['String'];
  fields: ChangedFields;
  foreignKey?: Maybe<Scalars['UUID']>;
  /**
   * Returns the table name in the format of the type returned in GraphQL
   * Example:  a table name of model_plan returns as ModelPlan
   */
  gqlTableName: GqlTableName;
  guid: Scalars['ID'];
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  primaryKey: Scalars['UUID'];
  tableID: Scalars['Int'];
  tableName: Scalars['String'];
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
  name: Scalars['String'];
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
  docCount: Scalars['Int'];
  key: Scalars['String'];
  maxModifiedDts: Scalars['Time'];
  minModifiedDts: Scalars['Time'];
};

/** DiscussionReply represents a discussion reply */
export type DiscussionReply = {
  __typename?: 'DiscussionReply';
  content?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  discussionID: Scalars['UUID'];
  id: Scalars['UUID'];
  isAssessment: Scalars['Boolean'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  resolution?: Maybe<Scalars['Boolean']>;
  userRole?: Maybe<DiscussionUserRole>;
  userRoleDescription?: Maybe<Scalars['String']>;
};

/**
 * DiscussionReplyChanges represents the possible changes you can make to a discussion reply when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type DiscussionReplyChanges = {
  content?: InputMaybe<Scalars['String']>;
  resolution?: InputMaybe<Scalars['Boolean']>;
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']>;
};

/** DiscussionReplyCreateInput represents the necessary fields to create a discussion reply */
export type DiscussionReplyCreateInput = {
  content: Scalars['String'];
  discussionID: Scalars['UUID'];
  resolution?: Scalars['Boolean'];
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']>;
};

export type DiscussionRoleSelection = {
  __typename?: 'DiscussionRoleSelection';
  userRole: DiscussionUserRole;
  userRoleDescription?: Maybe<Scalars['String']>;
};

export enum DiscussionStatus {
  Answered = 'ANSWERED',
  Unanswered = 'UNANSWERED',
  WaitingForResponse = 'WAITING_FOR_RESPONSE'
}

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
  authority?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  dateBegan?: Maybe<Scalars['Time']>;
  dateEnded?: Maybe<Scalars['Time']>;
  description?: Maybe<Scalars['String']>;
  displayModelSummary?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Int']>;
  keywords?: Maybe<Scalars['String']>;
  modelName?: Maybe<Scalars['String']>;
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  numberOfBeneficiariesImpacted?: Maybe<Scalars['Int']>;
  numberOfParticipants?: Maybe<Scalars['String']>;
  numberOfPhysiciansImpacted?: Maybe<Scalars['Int']>;
  stage: Scalars['String'];
  states?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type ExistingModelLink = {
  __typename?: 'ExistingModelLink';
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  currentModelPlan?: Maybe<ModelPlan>;
  currentModelPlanID?: Maybe<Scalars['UUID']>;
  existingModel?: Maybe<ExistingModel>;
  existingModelID?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['UUID']>;
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
};

export type Field = {
  __typename?: 'Field';
  name: Scalars['String'];
  nameCamelCase: Scalars['String'];
  value: FieldValue;
};

export type FieldValue = {
  __typename?: 'FieldValue';
  new?: Maybe<Scalars['Any']>;
  old?: Maybe<Scalars['Any']>;
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
  signedHash: Scalars['String'];
  userKey: Scalars['String'];
};

export enum ModelCategory {
  AccountableCare = 'ACCOUNTABLE_CARE',
  Demonstration = 'DEMONSTRATION',
  EpisodeBasedPaymentInitiatives = 'EPISODE_BASED_PAYMENT_INITIATIVES',
  InitAccelDevAndTest = 'INIT_ACCEL_DEV_AND_TEST',
  InitMedicaidChipPop = 'INIT_MEDICAID_CHIP_POP',
  InitSpeedAdoptBestPractice = 'INIT_SPEED_ADOPT_BEST_PRACTICE',
  InitMedicareMedicaidEnrollees = 'INIT__MEDICARE_MEDICAID_ENROLLEES',
  PrimaryCareTransformation = 'PRIMARY_CARE_TRANSFORMATION',
  Unknown = 'UNKNOWN'
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
  abbreviation?: Maybe<Scalars['String']>;
  archived: Scalars['Boolean'];
  basics: PlanBasics;
  beneficiaries: PlanBeneficiaries;
  collaborators: Array<PlanCollaborator>;
  crTdls: Array<PlanCrTdl>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  discussions: Array<PlanDiscussion>;
  documents: Array<PlanDocument>;
  existingModelLinks: Array<ExistingModelLink>;
  generalCharacteristics: PlanGeneralCharacteristics;
  id: Scalars['UUID'];
  isCollaborator: Scalars['Boolean'];
  isFavorite: Scalars['Boolean'];
  modelName: Scalars['String'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  nameHistory: Array<Scalars['String']>;
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
  abbreviation?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  modelName?: InputMaybe<Scalars['String']>;
  someNumbers?: InputMaybe<Array<Scalars['Int']>>;
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
  deleteOperationalSolutionSubtask: Scalars['Int'];
  deletePlanCollaborator: PlanCollaborator;
  deletePlanCrTdl: PlanCrTdl;
  deletePlanDiscussion: PlanDiscussion;
  deletePlanDocument: Scalars['Int'];
  deletePlanFavorite: PlanFavorite;
  lockTaskListSection: Scalars['Boolean'];
  oneWeekFromNow: Scalars['Date'];
  removePlanDocumentSolutionLinks: Scalars['Boolean'];
  unlockAllTaskListSections: Array<TaskListSectionLockStatus>;
  unlockTaskListSection: Scalars['Boolean'];
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
  customNeedType: Scalars['String'];
  modelPlanID: Scalars['UUID'];
  needed: Scalars['Boolean'];
};


/** Mutations definition for the schema */
export type MutationAddPlanFavoriteArgs = {
  modelPlanID: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationAgreeToNdaArgs = {
  agree?: Scalars['Boolean'];
};


/** Mutations definition for the schema */
export type MutationCreateDiscussionReplyArgs = {
  input: DiscussionReplyCreateInput;
};


/** Mutations definition for the schema */
export type MutationCreateModelPlanArgs = {
  modelName: Scalars['String'];
};


/** Mutations definition for the schema */
export type MutationCreateOperationalSolutionArgs = {
  changes: OperationalSolutionChanges;
  operationalNeedID: Scalars['UUID'];
  solutionType?: InputMaybe<OperationalSolutionKey>;
};


/** Mutations definition for the schema */
export type MutationCreateOperationalSolutionSubtasksArgs = {
  inputs: Array<CreateOperationalSolutionSubtaskInput>;
  solutionID: Scalars['UUID'];
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
  documentIDs: Array<Scalars['UUID']>;
  solutionID: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationDeleteDiscussionReplyArgs = {
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationDeleteOperationalSolutionSubtaskArgs = {
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanCollaboratorArgs = {
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanCrTdlArgs = {
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanDiscussionArgs = {
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanDocumentArgs = {
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanFavoriteArgs = {
  modelPlanID: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationLockTaskListSectionArgs = {
  modelPlanID: Scalars['UUID'];
  section: TaskListSection;
};


/** Mutations definition for the schema */
export type MutationOneWeekFromNowArgs = {
  date: Scalars['Date'];
};


/** Mutations definition for the schema */
export type MutationRemovePlanDocumentSolutionLinksArgs = {
  documentIDs: Array<Scalars['UUID']>;
  solutionID: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUnlockAllTaskListSectionsArgs = {
  modelPlanID: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUnlockTaskListSectionArgs = {
  modelPlanID: Scalars['UUID'];
  section: TaskListSection;
};


/** Mutations definition for the schema */
export type MutationUpdateCustomOperationalNeedByIdArgs = {
  customNeedType?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  needed: Scalars['Boolean'];
};


/** Mutations definition for the schema */
export type MutationUpdateDiscussionReplyArgs = {
  changes: DiscussionReplyChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdateExistingModelLinksArgs = {
  currentModelPlanIDs?: InputMaybe<Array<Scalars['UUID']>>;
  existingModelIDs?: InputMaybe<Array<Scalars['Int']>>;
  modelPlanID: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdateModelPlanArgs = {
  changes: ModelPlanChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdateOperationalSolutionArgs = {
  changes: OperationalSolutionChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdateOperationalSolutionSubtasksArgs = {
  inputs: Array<UpdateOperationalSolutionSubtaskInput>;
};


/** Mutations definition for the schema */
export type MutationUpdatePlanBasicsArgs = {
  changes: PlanBasicsChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanBeneficiariesArgs = {
  changes: PlanBeneficiariesChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanCollaboratorArgs = {
  id: Scalars['UUID'];
  newRole: TeamRole;
};


/** Mutations definition for the schema */
export type MutationUpdatePlanCrTdlArgs = {
  changes: PlanCrTdlChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanDiscussionArgs = {
  changes: PlanDiscussionChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanGeneralCharacteristicsArgs = {
  changes: PlanGeneralCharacteristicsChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanOpsEvalAndLearningArgs = {
  changes: PlanOpsEvalAndLearningChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanParticipantsAndProvidersArgs = {
  changes: PlanParticipantsAndProvidersChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanPaymentsArgs = {
  changes: PlanPaymentsChanges;
  id: Scalars['UUID'];
};


/** Mutations definition for the schema */
export type MutationUploadNewPlanDocumentArgs = {
  input: PlanDocumentInput;
};

/** NDAInfo represents whether a user has agreed to an NDA or not. If agreed to previously, there will be a datestamp visible */
export type NdaInfo = {
  __typename?: 'NDAInfo';
  agreed: Scalars['Boolean'];
  agreedDts?: Maybe<Scalars['Time']>;
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
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  id: Scalars['UUID'];
  key?: Maybe<OperationalNeedKey>;
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  name?: Maybe<Scalars['String']>;
  nameOther?: Maybe<Scalars['String']>;
  needed?: Maybe<Scalars['Boolean']>;
  section?: Maybe<TaskListSection>;
  solutions: Array<OperationalSolution>;
};


export type OperationalNeedSolutionsArgs = {
  includeNotNeeded?: Scalars['Boolean'];
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
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  documents: Array<PlanDocument>;
  id: Scalars['UUID'];
  isCommonSolution: Scalars['Boolean'];
  isOther: Scalars['Boolean'];
  key?: Maybe<OperationalSolutionKey>;
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  mustFinishDts?: Maybe<Scalars['Time']>;
  mustStartDts?: Maybe<Scalars['Time']>;
  name?: Maybe<Scalars['String']>;
  nameOther?: Maybe<Scalars['String']>;
  needed?: Maybe<Scalars['Boolean']>;
  operationalNeedID: Scalars['UUID'];
  operationalSolutionSubtasks: Array<OperationalSolutionSubtask>;
  otherHeader?: Maybe<Scalars['String']>;
  pocEmail?: Maybe<Scalars['String']>;
  pocName?: Maybe<Scalars['String']>;
  solutionType?: Maybe<Scalars['Int']>;
  status: OpSolutionStatus;
};

export type OperationalSolutionChanges = {
  mustFinishDts?: InputMaybe<Scalars['Time']>;
  mustStartDts?: InputMaybe<Scalars['Time']>;
  nameOther?: InputMaybe<Scalars['String']>;
  needed?: InputMaybe<Scalars['Boolean']>;
  otherHeader?: InputMaybe<Scalars['String']>;
  pocEmail?: InputMaybe<Scalars['String']>;
  pocName?: InputMaybe<Scalars['String']>;
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
  Ldg = 'LDG',
  Loi = 'LOI',
  Lv = 'LV',
  Marx = 'MARX',
  Mdm = 'MDM',
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
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  id: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  name: Scalars['String'];
  solutionID: Scalars['UUID'];
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
  limit: Scalars['Int'];
  offset: Scalars['Int'];
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
  amsModelID?: Maybe<Scalars['String']>;
  announced?: Maybe<Scalars['Time']>;
  applicationsEnd?: Maybe<Scalars['Time']>;
  applicationsStart?: Maybe<Scalars['Time']>;
  clearanceEnds?: Maybe<Scalars['Time']>;
  clearanceStarts?: Maybe<Scalars['Time']>;
  cmmiGroups: Array<CmmiGroup>;
  cmsCenters: Array<CmsCenter>;
  cmsOther?: Maybe<Scalars['String']>;
  completeICIP?: Maybe<Scalars['Time']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  demoCode?: Maybe<Scalars['String']>;
  goal?: Maybe<Scalars['String']>;
  highLevelNote?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  modelCategory?: Maybe<ModelCategory>;
  modelPlanID: Scalars['UUID'];
  modelType?: Maybe<ModelType>;
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  note?: Maybe<Scalars['String']>;
  performancePeriodEnds?: Maybe<Scalars['Time']>;
  performancePeriodStarts?: Maybe<Scalars['Time']>;
  phasedIn?: Maybe<Scalars['Boolean']>;
  phasedInNote?: Maybe<Scalars['String']>;
  problem?: Maybe<Scalars['String']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']>;
  readyForReviewBy?: Maybe<Scalars['UUID']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']>;
  status: TaskStatus;
  testInterventions?: Maybe<Scalars['String']>;
  wrapUpEnds?: Maybe<Scalars['Time']>;
};

/**
 * PlanBasicsChanges represents the possible changes you can make to a Plan Basics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanBasicsChanges = {
  amsModelID?: InputMaybe<Scalars['String']>;
  announced?: InputMaybe<Scalars['Time']>;
  applicationsEnd?: InputMaybe<Scalars['Time']>;
  applicationsStart?: InputMaybe<Scalars['Time']>;
  clearanceEnds?: InputMaybe<Scalars['Time']>;
  clearanceStarts?: InputMaybe<Scalars['Time']>;
  cmmiGroups?: InputMaybe<Array<CmmiGroup>>;
  cmsCenters?: InputMaybe<Array<CmsCenter>>;
  cmsOther?: InputMaybe<Scalars['String']>;
  completeICIP?: InputMaybe<Scalars['Time']>;
  demoCode?: InputMaybe<Scalars['String']>;
  goal?: InputMaybe<Scalars['String']>;
  highLevelNote?: InputMaybe<Scalars['String']>;
  modelCategory?: InputMaybe<ModelCategory>;
  modelType?: InputMaybe<ModelType>;
  note?: InputMaybe<Scalars['String']>;
  performancePeriodEnds?: InputMaybe<Scalars['Time']>;
  performancePeriodStarts?: InputMaybe<Scalars['Time']>;
  phasedIn?: InputMaybe<Scalars['Boolean']>;
  phasedInNote?: InputMaybe<Scalars['String']>;
  problem?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TaskStatusInput>;
  testInterventions?: InputMaybe<Scalars['String']>;
  wrapUpEnds?: InputMaybe<Scalars['Time']>;
};

/** Plan Beneficiaries represents the the beneficiaries section of the task list */
export type PlanBeneficiaries = {
  __typename?: 'PlanBeneficiaries';
  beneficiaries: Array<BeneficiariesType>;
  beneficiariesNote?: Maybe<Scalars['String']>;
  beneficiariesOther?: Maybe<Scalars['String']>;
  beneficiaryOverlap?: Maybe<OverlapType>;
  beneficiaryOverlapNote?: Maybe<Scalars['String']>;
  beneficiarySelectionFrequency?: Maybe<FrequencyType>;
  beneficiarySelectionFrequencyNote?: Maybe<Scalars['String']>;
  beneficiarySelectionFrequencyOther?: Maybe<Scalars['String']>;
  beneficiarySelectionMethod: Array<SelectionMethodType>;
  beneficiarySelectionNote?: Maybe<Scalars['String']>;
  beneficiarySelectionOther?: Maybe<Scalars['String']>;
  confidenceNote?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  estimateConfidence?: Maybe<ConfidenceType>;
  excludeCertainCharacteristics?: Maybe<TriStateAnswer>;
  excludeCertainCharacteristicsCriteria?: Maybe<Scalars['String']>;
  excludeCertainCharacteristicsNote?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  numberPeopleImpacted?: Maybe<Scalars['Int']>;
  precedenceRules?: Maybe<Scalars['String']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']>;
  readyForReviewBy?: Maybe<Scalars['UUID']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']>;
  status: TaskStatus;
  treatDualElligibleDifferent?: Maybe<TriStateAnswer>;
  treatDualElligibleDifferentHow?: Maybe<Scalars['String']>;
  treatDualElligibleDifferentNote?: Maybe<Scalars['String']>;
};

export type PlanBeneficiariesChanges = {
  beneficiaries?: InputMaybe<Array<BeneficiariesType>>;
  beneficiariesNote?: InputMaybe<Scalars['String']>;
  beneficiariesOther?: InputMaybe<Scalars['String']>;
  beneficiaryOverlap?: InputMaybe<OverlapType>;
  beneficiaryOverlapNote?: InputMaybe<Scalars['String']>;
  beneficiarySelectionFrequency?: InputMaybe<FrequencyType>;
  beneficiarySelectionFrequencyNote?: InputMaybe<Scalars['String']>;
  beneficiarySelectionFrequencyOther?: InputMaybe<Scalars['String']>;
  beneficiarySelectionMethod?: InputMaybe<Array<SelectionMethodType>>;
  beneficiarySelectionNote?: InputMaybe<Scalars['String']>;
  beneficiarySelectionOther?: InputMaybe<Scalars['String']>;
  confidenceNote?: InputMaybe<Scalars['String']>;
  estimateConfidence?: InputMaybe<ConfidenceType>;
  excludeCertainCharacteristics?: InputMaybe<TriStateAnswer>;
  excludeCertainCharacteristicsCriteria?: InputMaybe<Scalars['String']>;
  excludeCertainCharacteristicsNote?: InputMaybe<Scalars['String']>;
  numberPeopleImpacted?: InputMaybe<Scalars['Int']>;
  precedenceRules?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TaskStatusInput>;
  treatDualElligibleDifferent?: InputMaybe<TriStateAnswer>;
  treatDualElligibleDifferentHow?: InputMaybe<Scalars['String']>;
  treatDualElligibleDifferentNote?: InputMaybe<Scalars['String']>;
};

/** PlanCollaborator represents a collaborator on a plan */
export type PlanCollaborator = {
  __typename?: 'PlanCollaborator';
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  id: Scalars['UUID'];
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  teamRole: TeamRole;
  userAccount: UserAccount;
  userID: Scalars['UUID'];
};

/** PlanCollaboratorCreateInput represents the data required to create a collaborator on a plan */
export type PlanCollaboratorCreateInput = {
  modelPlanID: Scalars['UUID'];
  teamRole: TeamRole;
  userName: Scalars['String'];
};

export type PlanCrTdl = {
  __typename?: 'PlanCrTdl';
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  dateInitiated: Scalars['Time'];
  id: Scalars['UUID'];
  idNumber: Scalars['String'];
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  note?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type PlanCrTdlChanges = {
  dateInitiated?: InputMaybe<Scalars['Time']>;
  idNumber?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type PlanCrTdlCreateInput = {
  dateInitiated: Scalars['Time'];
  idNumber: Scalars['String'];
  modelPlanID: Scalars['UUID'];
  note?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

/** PlanDiscussion represents plan discussion */
export type PlanDiscussion = {
  __typename?: 'PlanDiscussion';
  content?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  id: Scalars['UUID'];
  isAssessment: Scalars['Boolean'];
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  replies: Array<DiscussionReply>;
  status: DiscussionStatus;
  userRole?: Maybe<DiscussionUserRole>;
  userRoleDescription?: Maybe<Scalars['String']>;
};

/**
 * PlanDiscussionChanges represents the possible changes you can make to a plan discussion when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanDiscussionChanges = {
  content?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<DiscussionStatus>;
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']>;
};

/** PlanDiscussionCreateInput represents the necessary fields to create a plan discussion */
export type PlanDiscussionCreateInput = {
  content: Scalars['String'];
  modelPlanID: Scalars['UUID'];
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']>;
};

/** PlanDocument represents a document on a plan */
export type PlanDocument = {
  __typename?: 'PlanDocument';
  bucket: Scalars['String'];
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  deletedAt?: Maybe<Scalars['Time']>;
  documentType: DocumentType;
  downloadUrl?: Maybe<Scalars['String']>;
  fileKey: Scalars['String'];
  fileName: Scalars['String'];
  fileSize: Scalars['Int'];
  fileType: Scalars['String'];
  id: Scalars['UUID'];
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  numLinkedSolutions: Scalars['Int'];
  optionalNotes?: Maybe<Scalars['String']>;
  otherType?: Maybe<Scalars['String']>;
  restricted: Scalars['Boolean'];
  virusClean: Scalars['Boolean'];
  virusScanned: Scalars['Boolean'];
};

/** PlanDocumentInput */
export type PlanDocumentInput = {
  documentType: DocumentType;
  fileData: Scalars['Upload'];
  modelPlanID: Scalars['UUID'];
  optionalNotes?: InputMaybe<Scalars['String']>;
  otherTypeDescription?: InputMaybe<Scalars['String']>;
  restricted: Scalars['Boolean'];
};

export type PlanDocumentSolutionLink = {
  __typename?: 'PlanDocumentSolutionLink';
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  documentID: Scalars['UUID'];
  id: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  solutionID: Scalars['UUID'];
};

export type PlanFavorite = {
  __typename?: 'PlanFavorite';
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  id: Scalars['UUID'];
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  userAccount: UserAccount;
  userID: Scalars['UUID'];
};

/** PlanGeneralCharacteristics represents a plan general characteristics object */
export type PlanGeneralCharacteristics = {
  __typename?: 'PlanGeneralCharacteristics';
  additionalServicesInvolved?: Maybe<Scalars['Boolean']>;
  additionalServicesInvolvedDescription?: Maybe<Scalars['String']>;
  additionalServicesInvolvedNote?: Maybe<Scalars['String']>;
  agreementTypes: Array<AgreementType>;
  agreementTypesOther?: Maybe<Scalars['String']>;
  alternativePaymentModelNote?: Maybe<Scalars['String']>;
  alternativePaymentModelTypes: Array<AlternativePaymentModelType>;
  authorityAllowances: Array<AuthorityAllowance>;
  authorityAllowancesNote?: Maybe<Scalars['String']>;
  authorityAllowancesOther?: Maybe<Scalars['String']>;
  careCoordinationInvolved?: Maybe<Scalars['Boolean']>;
  careCoordinationInvolvedDescription?: Maybe<Scalars['String']>;
  careCoordinationInvolvedNote?: Maybe<Scalars['String']>;
  collectPlanBids?: Maybe<Scalars['Boolean']>;
  collectPlanBidsNote?: Maybe<Scalars['String']>;
  communityPartnersInvolved?: Maybe<Scalars['Boolean']>;
  communityPartnersInvolvedDescription?: Maybe<Scalars['String']>;
  communityPartnersInvolvedNote?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  existingModel?: Maybe<Scalars['String']>;
  geographiesTargeted?: Maybe<Scalars['Boolean']>;
  geographiesTargetedAppliedTo: Array<GeographyApplication>;
  geographiesTargetedAppliedToOther?: Maybe<Scalars['String']>;
  geographiesTargetedNote?: Maybe<Scalars['String']>;
  geographiesTargetedTypes: Array<GeographyType>;
  geographiesTargetedTypesOther?: Maybe<Scalars['String']>;
  hasComponentsOrTracks?: Maybe<Scalars['Boolean']>;
  hasComponentsOrTracksDiffer?: Maybe<Scalars['String']>;
  hasComponentsOrTracksNote?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  isNewModel?: Maybe<Scalars['Boolean']>;
  keyCharacteristics: Array<KeyCharacteristic>;
  keyCharacteristicsNote?: Maybe<Scalars['String']>;
  keyCharacteristicsOther?: Maybe<Scalars['String']>;
  managePartCDEnrollment?: Maybe<Scalars['Boolean']>;
  managePartCDEnrollmentNote?: Maybe<Scalars['String']>;
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  multiplePatricipationAgreementsNeeded?: Maybe<Scalars['Boolean']>;
  multiplePatricipationAgreementsNeededNote?: Maybe<Scalars['String']>;
  participationOptions?: Maybe<Scalars['Boolean']>;
  participationOptionsNote?: Maybe<Scalars['String']>;
  planContractUpdated?: Maybe<Scalars['Boolean']>;
  planContractUpdatedNote?: Maybe<Scalars['String']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']>;
  readyForReviewBy?: Maybe<Scalars['UUID']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']>;
  resemblesExistingModel?: Maybe<Scalars['Boolean']>;
  resemblesExistingModelHow?: Maybe<Scalars['String']>;
  resemblesExistingModelNote?: Maybe<Scalars['String']>;
  rulemakingRequired?: Maybe<Scalars['Boolean']>;
  rulemakingRequiredDescription?: Maybe<Scalars['String']>;
  rulemakingRequiredNote?: Maybe<Scalars['String']>;
  status: TaskStatus;
  waiversRequired?: Maybe<Scalars['Boolean']>;
  waiversRequiredNote?: Maybe<Scalars['String']>;
  waiversRequiredTypes: Array<WaiverType>;
};

/**
 * PlanGeneralCharacteristicsChanges represents the possible changes you can make to a
 * general characteristics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanGeneralCharacteristicsChanges = {
  additionalServicesInvolved?: InputMaybe<Scalars['Boolean']>;
  additionalServicesInvolvedDescription?: InputMaybe<Scalars['String']>;
  additionalServicesInvolvedNote?: InputMaybe<Scalars['String']>;
  agreementTypes?: InputMaybe<Array<AgreementType>>;
  agreementTypesOther?: InputMaybe<Scalars['String']>;
  alternativePaymentModelNote?: InputMaybe<Scalars['String']>;
  alternativePaymentModelTypes?: InputMaybe<Array<AlternativePaymentModelType>>;
  authorityAllowances?: InputMaybe<Array<AuthorityAllowance>>;
  authorityAllowancesNote?: InputMaybe<Scalars['String']>;
  authorityAllowancesOther?: InputMaybe<Scalars['String']>;
  careCoordinationInvolved?: InputMaybe<Scalars['Boolean']>;
  careCoordinationInvolvedDescription?: InputMaybe<Scalars['String']>;
  careCoordinationInvolvedNote?: InputMaybe<Scalars['String']>;
  collectPlanBids?: InputMaybe<Scalars['Boolean']>;
  collectPlanBidsNote?: InputMaybe<Scalars['String']>;
  communityPartnersInvolved?: InputMaybe<Scalars['Boolean']>;
  communityPartnersInvolvedDescription?: InputMaybe<Scalars['String']>;
  communityPartnersInvolvedNote?: InputMaybe<Scalars['String']>;
  existingModel?: InputMaybe<Scalars['String']>;
  geographiesTargeted?: InputMaybe<Scalars['Boolean']>;
  geographiesTargetedAppliedTo?: InputMaybe<Array<GeographyApplication>>;
  geographiesTargetedAppliedToOther?: InputMaybe<Scalars['String']>;
  geographiesTargetedNote?: InputMaybe<Scalars['String']>;
  geographiesTargetedTypes?: InputMaybe<Array<GeographyType>>;
  geographiesTargetedTypesOther?: InputMaybe<Scalars['String']>;
  hasComponentsOrTracks?: InputMaybe<Scalars['Boolean']>;
  hasComponentsOrTracksDiffer?: InputMaybe<Scalars['String']>;
  hasComponentsOrTracksNote?: InputMaybe<Scalars['String']>;
  isNewModel?: InputMaybe<Scalars['Boolean']>;
  keyCharacteristics?: InputMaybe<Array<KeyCharacteristic>>;
  keyCharacteristicsNote?: InputMaybe<Scalars['String']>;
  keyCharacteristicsOther?: InputMaybe<Scalars['String']>;
  managePartCDEnrollment?: InputMaybe<Scalars['Boolean']>;
  managePartCDEnrollmentNote?: InputMaybe<Scalars['String']>;
  multiplePatricipationAgreementsNeeded?: InputMaybe<Scalars['Boolean']>;
  multiplePatricipationAgreementsNeededNote?: InputMaybe<Scalars['String']>;
  participationOptions?: InputMaybe<Scalars['Boolean']>;
  participationOptionsNote?: InputMaybe<Scalars['String']>;
  planContractUpdated?: InputMaybe<Scalars['Boolean']>;
  planContractUpdatedNote?: InputMaybe<Scalars['String']>;
  resemblesExistingModel?: InputMaybe<Scalars['Boolean']>;
  resemblesExistingModelHow?: InputMaybe<Scalars['String']>;
  resemblesExistingModelNote?: InputMaybe<Scalars['String']>;
  rulemakingRequired?: InputMaybe<Scalars['Boolean']>;
  rulemakingRequiredDescription?: InputMaybe<Scalars['String']>;
  rulemakingRequiredNote?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TaskStatusInput>;
  waiversRequired?: InputMaybe<Scalars['Boolean']>;
  waiversRequiredNote?: InputMaybe<Scalars['String']>;
  waiversRequiredTypes?: InputMaybe<Array<WaiverType>>;
};

/** PlanOpsEvalAndLearning represents the task list section that deals with information regarding the Ops Eval and Learning */
export type PlanOpsEvalAndLearning = {
  __typename?: 'PlanOpsEvalAndLearning';
  agencyOrStateHelp: Array<AgencyOrStateHelpType>;
  agencyOrStateHelpNote?: Maybe<Scalars['String']>;
  agencyOrStateHelpOther?: Maybe<Scalars['String']>;
  anticipatedChallenges?: Maybe<Scalars['String']>;
  appToSendFilesToKnown?: Maybe<Scalars['Boolean']>;
  appToSendFilesToNote?: Maybe<Scalars['String']>;
  appToSendFilesToWhich?: Maybe<Scalars['String']>;
  appealFeedback?: Maybe<Scalars['Boolean']>;
  appealNote?: Maybe<Scalars['String']>;
  appealOther?: Maybe<Scalars['Boolean']>;
  appealPayments?: Maybe<Scalars['Boolean']>;
  appealPerformance?: Maybe<Scalars['Boolean']>;
  benchmarkForPerformance?: Maybe<BenchmarkForPerformanceType>;
  benchmarkForPerformanceNote?: Maybe<Scalars['String']>;
  captureParticipantInfo?: Maybe<Scalars['Boolean']>;
  captureParticipantInfoNote?: Maybe<Scalars['String']>;
  ccmInvolvment: Array<CcmInvolvmentType>;
  ccmInvolvmentNote?: Maybe<Scalars['String']>;
  ccmInvolvmentOther?: Maybe<Scalars['String']>;
  computePerformanceScores?: Maybe<Scalars['Boolean']>;
  computePerformanceScoresNote?: Maybe<Scalars['String']>;
  contractorSupport: Array<ContractorSupportType>;
  contractorSupportHow?: Maybe<Scalars['String']>;
  contractorSupportNote?: Maybe<Scalars['String']>;
  contractorSupportOther?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  dataCollectionFrequency: Array<DataFrequencyType>;
  dataCollectionFrequencyNote?: Maybe<Scalars['String']>;
  dataCollectionFrequencyOther?: Maybe<Scalars['String']>;
  dataCollectionStarts?: Maybe<DataStartsType>;
  dataCollectionStartsOther?: Maybe<Scalars['String']>;
  dataFlowDiagramsNeeded?: Maybe<Scalars['Boolean']>;
  dataFullTimeOrIncremental?: Maybe<DataFullTimeOrIncrementalType>;
  dataMonitoringFileOther?: Maybe<Scalars['String']>;
  dataMonitoringFileTypes: Array<MonitoringFileType>;
  dataMonitoringNote?: Maybe<Scalars['String']>;
  dataNeededForMonitoring: Array<DataForMonitoringType>;
  dataNeededForMonitoringNote?: Maybe<Scalars['String']>;
  dataNeededForMonitoringOther?: Maybe<Scalars['String']>;
  dataResponseFileFrequency?: Maybe<Scalars['String']>;
  dataResponseType?: Maybe<Scalars['String']>;
  dataSharingFrequency: Array<DataFrequencyType>;
  dataSharingFrequencyOther?: Maybe<Scalars['String']>;
  dataSharingStarts?: Maybe<DataStartsType>;
  dataSharingStartsNote?: Maybe<Scalars['String']>;
  dataSharingStartsOther?: Maybe<Scalars['String']>;
  dataToSendParticicipants: Array<DataToSendParticipantsType>;
  dataToSendParticicipantsNote?: Maybe<Scalars['String']>;
  dataToSendParticicipantsOther?: Maybe<Scalars['String']>;
  developNewQualityMeasures?: Maybe<Scalars['Boolean']>;
  developNewQualityMeasuresNote?: Maybe<Scalars['String']>;
  draftIcdDueDate?: Maybe<Scalars['Time']>;
  eftSetUp?: Maybe<Scalars['Boolean']>;
  evaluationApproachOther?: Maybe<Scalars['String']>;
  evaluationApproaches: Array<EvaluationApproachType>;
  evalutaionApproachNote?: Maybe<Scalars['String']>;
  fileNamingConventions?: Maybe<Scalars['String']>;
  helpdeskUse?: Maybe<Scalars['Boolean']>;
  helpdeskUseNote?: Maybe<Scalars['String']>;
  icdNote?: Maybe<Scalars['String']>;
  icdOwner?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  iddocSupport?: Maybe<Scalars['Boolean']>;
  iddocSupportNote?: Maybe<Scalars['String']>;
  modelLearningSystems: Array<ModelLearningSystemType>;
  modelLearningSystemsNote?: Maybe<Scalars['String']>;
  modelLearningSystemsOther?: Maybe<Scalars['String']>;
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  produceBenefitEnhancementFiles?: Maybe<Scalars['Boolean']>;
  qualityPerformanceImpactsPayment?: Maybe<Scalars['Boolean']>;
  qualityPerformanceImpactsPaymentNote?: Maybe<Scalars['String']>;
  qualityReportingStarts?: Maybe<DataStartsType>;
  qualityReportingStartsNote?: Maybe<Scalars['String']>;
  qualityReportingStartsOther?: Maybe<Scalars['String']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']>;
  readyForReviewBy?: Maybe<Scalars['UUID']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']>;
  riskAdjustFeedback?: Maybe<Scalars['Boolean']>;
  riskAdjustNote?: Maybe<Scalars['String']>;
  riskAdjustOther?: Maybe<Scalars['Boolean']>;
  riskAdjustPayments?: Maybe<Scalars['Boolean']>;
  riskAdjustPerformance?: Maybe<Scalars['Boolean']>;
  sendFilesBetweenCcw?: Maybe<Scalars['Boolean']>;
  sendFilesBetweenCcwNote?: Maybe<Scalars['String']>;
  shareCclfData?: Maybe<Scalars['Boolean']>;
  shareCclfDataNote?: Maybe<Scalars['String']>;
  stakeholders: Array<StakeholdersType>;
  stakeholdersNote?: Maybe<Scalars['String']>;
  stakeholdersOther?: Maybe<Scalars['String']>;
  status: TaskStatus;
  stcNeeds?: Maybe<Scalars['String']>;
  technicalContactsIdentified?: Maybe<Scalars['Boolean']>;
  technicalContactsIdentifiedDetail?: Maybe<Scalars['String']>;
  technicalContactsIdentifiedNote?: Maybe<Scalars['String']>;
  testingNote?: Maybe<Scalars['String']>;
  testingTimelines?: Maybe<Scalars['String']>;
  uatNeeds?: Maybe<Scalars['String']>;
  unsolicitedAdjustmentsIncluded?: Maybe<Scalars['Boolean']>;
  useCcwForFileDistribiutionToParticipants?: Maybe<Scalars['Boolean']>;
  useCcwForFileDistribiutionToParticipantsNote?: Maybe<Scalars['String']>;
};

/**
 * PlanOpsEvalAndLearningChanges represents the possible changes you can make to a
 * ops, eval and learning object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanOpsEvalAndLearningChanges = {
  agencyOrStateHelp?: InputMaybe<Array<AgencyOrStateHelpType>>;
  agencyOrStateHelpNote?: InputMaybe<Scalars['String']>;
  agencyOrStateHelpOther?: InputMaybe<Scalars['String']>;
  anticipatedChallenges?: InputMaybe<Scalars['String']>;
  appToSendFilesToKnown?: InputMaybe<Scalars['Boolean']>;
  appToSendFilesToNote?: InputMaybe<Scalars['String']>;
  appToSendFilesToWhich?: InputMaybe<Scalars['String']>;
  appealFeedback?: InputMaybe<Scalars['Boolean']>;
  appealNote?: InputMaybe<Scalars['String']>;
  appealOther?: InputMaybe<Scalars['Boolean']>;
  appealPayments?: InputMaybe<Scalars['Boolean']>;
  appealPerformance?: InputMaybe<Scalars['Boolean']>;
  benchmarkForPerformance?: InputMaybe<BenchmarkForPerformanceType>;
  benchmarkForPerformanceNote?: InputMaybe<Scalars['String']>;
  captureParticipantInfo?: InputMaybe<Scalars['Boolean']>;
  captureParticipantInfoNote?: InputMaybe<Scalars['String']>;
  ccmInvolvment?: InputMaybe<Array<CcmInvolvmentType>>;
  ccmInvolvmentNote?: InputMaybe<Scalars['String']>;
  ccmInvolvmentOther?: InputMaybe<Scalars['String']>;
  computePerformanceScores?: InputMaybe<Scalars['Boolean']>;
  computePerformanceScoresNote?: InputMaybe<Scalars['String']>;
  contractorSupport?: InputMaybe<Array<ContractorSupportType>>;
  contractorSupportHow?: InputMaybe<Scalars['String']>;
  contractorSupportNote?: InputMaybe<Scalars['String']>;
  contractorSupportOther?: InputMaybe<Scalars['String']>;
  dataCollectionFrequency?: InputMaybe<Array<DataFrequencyType>>;
  dataCollectionFrequencyNote?: InputMaybe<Scalars['String']>;
  dataCollectionFrequencyOther?: InputMaybe<Scalars['String']>;
  dataCollectionStarts?: InputMaybe<DataStartsType>;
  dataCollectionStartsOther?: InputMaybe<Scalars['String']>;
  dataFlowDiagramsNeeded?: InputMaybe<Scalars['Boolean']>;
  dataFullTimeOrIncremental?: InputMaybe<DataFullTimeOrIncrementalType>;
  dataMonitoringFileOther?: InputMaybe<Scalars['String']>;
  dataMonitoringFileTypes?: InputMaybe<Array<MonitoringFileType>>;
  dataMonitoringNote?: InputMaybe<Scalars['String']>;
  dataNeededForMonitoring?: InputMaybe<Array<DataForMonitoringType>>;
  dataNeededForMonitoringNote?: InputMaybe<Scalars['String']>;
  dataNeededForMonitoringOther?: InputMaybe<Scalars['String']>;
  dataResponseFileFrequency?: InputMaybe<Scalars['String']>;
  dataResponseType?: InputMaybe<Scalars['String']>;
  dataSharingFrequency?: InputMaybe<Array<DataFrequencyType>>;
  dataSharingFrequencyOther?: InputMaybe<Scalars['String']>;
  dataSharingStarts?: InputMaybe<DataStartsType>;
  dataSharingStartsNote?: InputMaybe<Scalars['String']>;
  dataSharingStartsOther?: InputMaybe<Scalars['String']>;
  dataToSendParticicipants?: InputMaybe<Array<DataToSendParticipantsType>>;
  dataToSendParticicipantsNote?: InputMaybe<Scalars['String']>;
  dataToSendParticicipantsOther?: InputMaybe<Scalars['String']>;
  developNewQualityMeasures?: InputMaybe<Scalars['Boolean']>;
  developNewQualityMeasuresNote?: InputMaybe<Scalars['String']>;
  draftIcdDueDate?: InputMaybe<Scalars['Time']>;
  eftSetUp?: InputMaybe<Scalars['Boolean']>;
  evaluationApproachOther?: InputMaybe<Scalars['String']>;
  evaluationApproaches?: InputMaybe<Array<EvaluationApproachType>>;
  evalutaionApproachNote?: InputMaybe<Scalars['String']>;
  fileNamingConventions?: InputMaybe<Scalars['String']>;
  helpdeskUse?: InputMaybe<Scalars['Boolean']>;
  helpdeskUseNote?: InputMaybe<Scalars['String']>;
  icdNote?: InputMaybe<Scalars['String']>;
  icdOwner?: InputMaybe<Scalars['String']>;
  iddocSupport?: InputMaybe<Scalars['Boolean']>;
  iddocSupportNote?: InputMaybe<Scalars['String']>;
  modelLearningSystems?: InputMaybe<Array<ModelLearningSystemType>>;
  modelLearningSystemsNote?: InputMaybe<Scalars['String']>;
  modelLearningSystemsOther?: InputMaybe<Scalars['String']>;
  produceBenefitEnhancementFiles?: InputMaybe<Scalars['Boolean']>;
  qualityPerformanceImpactsPayment?: InputMaybe<Scalars['Boolean']>;
  qualityPerformanceImpactsPaymentNote?: InputMaybe<Scalars['String']>;
  qualityReportingStarts?: InputMaybe<DataStartsType>;
  qualityReportingStartsNote?: InputMaybe<Scalars['String']>;
  qualityReportingStartsOther?: InputMaybe<Scalars['String']>;
  riskAdjustFeedback?: InputMaybe<Scalars['Boolean']>;
  riskAdjustNote?: InputMaybe<Scalars['String']>;
  riskAdjustOther?: InputMaybe<Scalars['Boolean']>;
  riskAdjustPayments?: InputMaybe<Scalars['Boolean']>;
  riskAdjustPerformance?: InputMaybe<Scalars['Boolean']>;
  sendFilesBetweenCcw?: InputMaybe<Scalars['Boolean']>;
  sendFilesBetweenCcwNote?: InputMaybe<Scalars['String']>;
  shareCclfData?: InputMaybe<Scalars['Boolean']>;
  shareCclfDataNote?: InputMaybe<Scalars['String']>;
  stakeholders?: InputMaybe<Array<StakeholdersType>>;
  stakeholdersNote?: InputMaybe<Scalars['String']>;
  stakeholdersOther?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TaskStatusInput>;
  stcNeeds?: InputMaybe<Scalars['String']>;
  technicalContactsIdentified?: InputMaybe<Scalars['Boolean']>;
  technicalContactsIdentifiedDetail?: InputMaybe<Scalars['String']>;
  technicalContactsIdentifiedNote?: InputMaybe<Scalars['String']>;
  testingNote?: InputMaybe<Scalars['String']>;
  testingTimelines?: InputMaybe<Scalars['String']>;
  uatNeeds?: InputMaybe<Scalars['String']>;
  unsolicitedAdjustmentsIncluded?: InputMaybe<Scalars['Boolean']>;
  useCcwForFileDistribiutionToParticipants?: InputMaybe<Scalars['Boolean']>;
  useCcwForFileDistribiutionToParticipantsNote?: InputMaybe<Scalars['String']>;
};

/** PlanParticipantsAndProviders is the task list section that deals with information regarding all Providers and Participants */
export type PlanParticipantsAndProviders = {
  __typename?: 'PlanParticipantsAndProviders';
  communicationMethod: Array<ParticipantCommunicationType>;
  communicationMethodOther?: Maybe<Scalars['String']>;
  communicationNote?: Maybe<Scalars['String']>;
  confidenceNote?: Maybe<Scalars['String']>;
  coordinateWork?: Maybe<Scalars['Boolean']>;
  coordinateWorkNote?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  estimateConfidence?: Maybe<ConfidenceType>;
  expectedNumberOfParticipants?: Maybe<Scalars['Int']>;
  gainsharePayments?: Maybe<Scalars['Boolean']>;
  gainsharePaymentsNote?: Maybe<Scalars['String']>;
  gainsharePaymentsTrack?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  medicareProviderType?: Maybe<Scalars['String']>;
  modelApplicationLevel?: Maybe<Scalars['String']>;
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  participantAssumeRisk?: Maybe<Scalars['Boolean']>;
  participants: Array<ParticipantsType>;
  participantsCurrentlyInModels?: Maybe<Scalars['Boolean']>;
  participantsCurrentlyInModelsNote?: Maybe<Scalars['String']>;
  participantsIDSNote?: Maybe<Scalars['String']>;
  participantsIds: Array<ParticipantsIdType>;
  participantsIdsOther?: Maybe<Scalars['String']>;
  participantsNote?: Maybe<Scalars['String']>;
  participantsOther?: Maybe<Scalars['String']>;
  providerAddMethod: Array<ProviderAddType>;
  providerAddMethodNote?: Maybe<Scalars['String']>;
  providerAddMethodOther?: Maybe<Scalars['String']>;
  providerAdditionFrequency?: Maybe<FrequencyType>;
  providerAdditionFrequencyNote?: Maybe<Scalars['String']>;
  providerAdditionFrequencyOther?: Maybe<Scalars['String']>;
  providerLeaveMethod: Array<ProviderLeaveType>;
  providerLeaveMethodNote?: Maybe<Scalars['String']>;
  providerLeaveMethodOther?: Maybe<Scalars['String']>;
  providerOverlap?: Maybe<OverlapType>;
  providerOverlapHierarchy?: Maybe<Scalars['String']>;
  providerOverlapNote?: Maybe<Scalars['String']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']>;
  readyForReviewBy?: Maybe<Scalars['UUID']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']>;
  recruitmentMethod?: Maybe<RecruitmentType>;
  recruitmentNote?: Maybe<Scalars['String']>;
  recruitmentOther?: Maybe<Scalars['String']>;
  riskNote?: Maybe<Scalars['String']>;
  riskOther?: Maybe<Scalars['String']>;
  riskType?: Maybe<ParticipantRiskType>;
  selectionMethod: Array<ParticipantSelectionType>;
  selectionNote?: Maybe<Scalars['String']>;
  selectionOther?: Maybe<Scalars['String']>;
  statesEngagement?: Maybe<Scalars['String']>;
  status: TaskStatus;
  willRiskChange?: Maybe<Scalars['Boolean']>;
  willRiskChangeNote?: Maybe<Scalars['String']>;
};

/**
 * PlanParticipantsAndProvidersChanges represents the possible changes you can make to a
 * providers and participants object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https://gqlgen.com/reference/changesets/
 */
export type PlanParticipantsAndProvidersChanges = {
  communicationMethod?: InputMaybe<Array<ParticipantCommunicationType>>;
  communicationMethodOther?: InputMaybe<Scalars['String']>;
  communicationNote?: InputMaybe<Scalars['String']>;
  confidenceNote?: InputMaybe<Scalars['String']>;
  coordinateWork?: InputMaybe<Scalars['Boolean']>;
  coordinateWorkNote?: InputMaybe<Scalars['String']>;
  estimateConfidence?: InputMaybe<ConfidenceType>;
  expectedNumberOfParticipants?: InputMaybe<Scalars['Int']>;
  gainsharePayments?: InputMaybe<Scalars['Boolean']>;
  gainsharePaymentsNote?: InputMaybe<Scalars['String']>;
  gainsharePaymentsTrack?: InputMaybe<Scalars['Boolean']>;
  medicareProviderType?: InputMaybe<Scalars['String']>;
  modelApplicationLevel?: InputMaybe<Scalars['String']>;
  participantAssumeRisk?: InputMaybe<Scalars['Boolean']>;
  participants?: InputMaybe<Array<ParticipantsType>>;
  participantsCurrentlyInModels?: InputMaybe<Scalars['Boolean']>;
  participantsCurrentlyInModelsNote?: InputMaybe<Scalars['String']>;
  participantsIDSNote?: InputMaybe<Scalars['String']>;
  participantsIds?: InputMaybe<Array<ParticipantsIdType>>;
  participantsIdsOther?: InputMaybe<Scalars['String']>;
  participantsNote?: InputMaybe<Scalars['String']>;
  participantsOther?: InputMaybe<Scalars['String']>;
  providerAddMethod?: InputMaybe<Array<ProviderAddType>>;
  providerAddMethodNote?: InputMaybe<Scalars['String']>;
  providerAddMethodOther?: InputMaybe<Scalars['String']>;
  providerAdditionFrequency?: InputMaybe<FrequencyType>;
  providerAdditionFrequencyNote?: InputMaybe<Scalars['String']>;
  providerAdditionFrequencyOther?: InputMaybe<Scalars['String']>;
  providerLeaveMethod?: InputMaybe<Array<ProviderLeaveType>>;
  providerLeaveMethodNote?: InputMaybe<Scalars['String']>;
  providerLeaveMethodOther?: InputMaybe<Scalars['String']>;
  providerOverlap?: InputMaybe<OverlapType>;
  providerOverlapHierarchy?: InputMaybe<Scalars['String']>;
  providerOverlapNote?: InputMaybe<Scalars['String']>;
  recruitmentMethod?: InputMaybe<RecruitmentType>;
  recruitmentNote?: InputMaybe<Scalars['String']>;
  recruitmentOther?: InputMaybe<Scalars['String']>;
  riskNote?: InputMaybe<Scalars['String']>;
  riskOther?: InputMaybe<Scalars['String']>;
  riskType?: InputMaybe<ParticipantRiskType>;
  selectionMethod?: InputMaybe<Array<ParticipantSelectionType>>;
  selectionNote?: InputMaybe<Scalars['String']>;
  selectionOther?: InputMaybe<Scalars['String']>;
  statesEngagement?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TaskStatusInput>;
  willRiskChange?: InputMaybe<Scalars['Boolean']>;
  willRiskChangeNote?: InputMaybe<Scalars['String']>;
};

/** PlanPayments is the task list section that deals with information regarding Payments */
export type PlanPayments = {
  __typename?: 'PlanPayments';
  affectsMedicareSecondaryPayerClaims?: Maybe<Scalars['Boolean']>;
  affectsMedicareSecondaryPayerClaimsHow?: Maybe<Scalars['String']>;
  affectsMedicareSecondaryPayerClaimsNote?: Maybe<Scalars['String']>;
  anticipateReconcilingPaymentsRetrospectively?: Maybe<Scalars['Boolean']>;
  anticipateReconcilingPaymentsRetrospectivelyNote?: Maybe<Scalars['String']>;
  anticipatedPaymentFrequency: Array<AnticipatedPaymentFrequencyType>;
  anticipatedPaymentFrequencyNote?: Maybe<Scalars['String']>;
  anticipatedPaymentFrequencyOther?: Maybe<Scalars['String']>;
  beneficiaryCostSharingLevelAndHandling?: Maybe<Scalars['String']>;
  canParticipantsSelectBetweenPaymentMechanisms?: Maybe<Scalars['Boolean']>;
  canParticipantsSelectBetweenPaymentMechanismsHow?: Maybe<Scalars['String']>;
  canParticipantsSelectBetweenPaymentMechanismsNote?: Maybe<Scalars['String']>;
  changesMedicarePhysicianFeeSchedule?: Maybe<Scalars['Boolean']>;
  changesMedicarePhysicianFeeScheduleNote?: Maybe<Scalars['String']>;
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  creatingDependenciesBetweenServices?: Maybe<Scalars['Boolean']>;
  creatingDependenciesBetweenServicesNote?: Maybe<Scalars['String']>;
  expectedCalculationComplexityLevel?: Maybe<ComplexityCalculationLevelType>;
  expectedCalculationComplexityLevelNote?: Maybe<Scalars['String']>;
  fundingSource: Array<FundingSource>;
  fundingSourceNote?: Maybe<Scalars['String']>;
  fundingSourceOther?: Maybe<Scalars['String']>;
  fundingSourceR: Array<FundingSource>;
  fundingSourceRNote?: Maybe<Scalars['String']>;
  fundingSourceROther?: Maybe<Scalars['String']>;
  fundingSourceRTrustFund?: Maybe<Scalars['String']>;
  fundingSourceTrustFund?: Maybe<Scalars['String']>;
  fundingStructure?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  isContractorAwareTestDataRequirements?: Maybe<Scalars['Boolean']>;
  modelPlanID: Scalars['UUID'];
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  needsClaimsDataCollection?: Maybe<Scalars['Boolean']>;
  needsClaimsDataCollectionNote?: Maybe<Scalars['String']>;
  nonClaimsPaymentOther?: Maybe<Scalars['String']>;
  nonClaimsPayments: Array<NonClaimsBasedPayType>;
  nonClaimsPaymentsNote?: Maybe<Scalars['String']>;
  numberPaymentsPerPayCycle?: Maybe<Scalars['String']>;
  numberPaymentsPerPayCycleNote?: Maybe<Scalars['String']>;
  payClaims: Array<ClaimsBasedPayType>;
  payClaimsNote?: Maybe<Scalars['String']>;
  payClaimsOther?: Maybe<Scalars['String']>;
  payModelDifferentiation?: Maybe<Scalars['String']>;
  payRecipients: Array<PayRecipient>;
  payRecipientsNote?: Maybe<Scalars['String']>;
  payRecipientsOtherSpecification?: Maybe<Scalars['String']>;
  payType: Array<PayType>;
  payTypeNote?: Maybe<Scalars['String']>;
  paymentCalculationOwner?: Maybe<Scalars['String']>;
  paymentStartDate?: Maybe<Scalars['Time']>;
  paymentStartDateNote?: Maybe<Scalars['String']>;
  planningToUseInnovationPaymentContractor?: Maybe<Scalars['Boolean']>;
  planningToUseInnovationPaymentContractorNote?: Maybe<Scalars['String']>;
  providingThirdPartyFile?: Maybe<Scalars['Boolean']>;
  readyForClearanceBy?: Maybe<Scalars['UUID']>;
  readyForClearanceByUserAccount?: Maybe<UserAccount>;
  readyForClearanceDts?: Maybe<Scalars['Time']>;
  readyForReviewBy?: Maybe<Scalars['UUID']>;
  readyForReviewByUserAccount?: Maybe<UserAccount>;
  readyForReviewDts?: Maybe<Scalars['Time']>;
  sharedSystemsInvolvedAdditionalClaimPayment?: Maybe<Scalars['Boolean']>;
  sharedSystemsInvolvedAdditionalClaimPaymentNote?: Maybe<Scalars['String']>;
  shouldAnyProviderExcludedFFSSystemsNote?: Maybe<Scalars['String']>;
  shouldAnyProvidersExcludedFFSSystems?: Maybe<Scalars['Boolean']>;
  status: TaskStatus;
  waiveBeneficiaryCostSharingForAnyServices?: Maybe<Scalars['Boolean']>;
  waiveBeneficiaryCostSharingNote?: Maybe<Scalars['String']>;
  waiveBeneficiaryCostSharingServiceSpecification?: Maybe<Scalars['String']>;
  waiverOnlyAppliesPartOfPayment?: Maybe<Scalars['Boolean']>;
  willRecoverPayments?: Maybe<Scalars['Boolean']>;
  willRecoverPaymentsNote?: Maybe<Scalars['String']>;
};

export type PlanPaymentsChanges = {
  affectsMedicareSecondaryPayerClaims?: InputMaybe<Scalars['Boolean']>;
  affectsMedicareSecondaryPayerClaimsHow?: InputMaybe<Scalars['String']>;
  affectsMedicareSecondaryPayerClaimsNote?: InputMaybe<Scalars['String']>;
  anticipateReconcilingPaymentsRetrospectively?: InputMaybe<Scalars['Boolean']>;
  anticipateReconcilingPaymentsRetrospectivelyNote?: InputMaybe<Scalars['String']>;
  anticipatedPaymentFrequency?: InputMaybe<Array<AnticipatedPaymentFrequencyType>>;
  anticipatedPaymentFrequencyNote?: InputMaybe<Scalars['String']>;
  anticipatedPaymentFrequencyOther?: InputMaybe<Scalars['String']>;
  beneficiaryCostSharingLevelAndHandling?: InputMaybe<Scalars['String']>;
  canParticipantsSelectBetweenPaymentMechanisms?: InputMaybe<Scalars['Boolean']>;
  canParticipantsSelectBetweenPaymentMechanismsHow?: InputMaybe<Scalars['String']>;
  canParticipantsSelectBetweenPaymentMechanismsNote?: InputMaybe<Scalars['String']>;
  changesMedicarePhysicianFeeSchedule?: InputMaybe<Scalars['Boolean']>;
  changesMedicarePhysicianFeeScheduleNote?: InputMaybe<Scalars['String']>;
  creatingDependenciesBetweenServices?: InputMaybe<Scalars['Boolean']>;
  creatingDependenciesBetweenServicesNote?: InputMaybe<Scalars['String']>;
  expectedCalculationComplexityLevel?: InputMaybe<ComplexityCalculationLevelType>;
  expectedCalculationComplexityLevelNote?: InputMaybe<Scalars['String']>;
  fundingSource?: InputMaybe<Array<FundingSource>>;
  fundingSourceNote?: InputMaybe<Scalars['String']>;
  fundingSourceOther?: InputMaybe<Scalars['String']>;
  fundingSourceR?: InputMaybe<Array<FundingSource>>;
  fundingSourceRNote?: InputMaybe<Scalars['String']>;
  fundingSourceROther?: InputMaybe<Scalars['String']>;
  fundingSourceRTrustFund?: InputMaybe<Scalars['String']>;
  fundingSourceTrustFund?: InputMaybe<Scalars['String']>;
  fundingStructure?: InputMaybe<Scalars['String']>;
  isContractorAwareTestDataRequirements?: InputMaybe<Scalars['Boolean']>;
  needsClaimsDataCollection?: InputMaybe<Scalars['Boolean']>;
  needsClaimsDataCollectionNote?: InputMaybe<Scalars['String']>;
  nonClaimsPaymentOther?: InputMaybe<Scalars['String']>;
  nonClaimsPayments?: InputMaybe<Array<NonClaimsBasedPayType>>;
  nonClaimsPaymentsNote?: InputMaybe<Scalars['String']>;
  numberPaymentsPerPayCycle?: InputMaybe<Scalars['String']>;
  numberPaymentsPerPayCycleNote?: InputMaybe<Scalars['String']>;
  payClaims?: InputMaybe<Array<ClaimsBasedPayType>>;
  payClaimsNote?: InputMaybe<Scalars['String']>;
  payClaimsOther?: InputMaybe<Scalars['String']>;
  payModelDifferentiation?: InputMaybe<Scalars['String']>;
  payRecipients?: InputMaybe<Array<PayRecipient>>;
  payRecipientsNote?: InputMaybe<Scalars['String']>;
  payRecipientsOtherSpecification?: InputMaybe<Scalars['String']>;
  payType?: InputMaybe<Array<PayType>>;
  payTypeNote?: InputMaybe<Scalars['String']>;
  paymentCalculationOwner?: InputMaybe<Scalars['String']>;
  paymentStartDate?: InputMaybe<Scalars['Time']>;
  paymentStartDateNote?: InputMaybe<Scalars['String']>;
  planningToUseInnovationPaymentContractor?: InputMaybe<Scalars['Boolean']>;
  planningToUseInnovationPaymentContractorNote?: InputMaybe<Scalars['String']>;
  providingThirdPartyFile?: InputMaybe<Scalars['Boolean']>;
  sharedSystemsInvolvedAdditionalClaimPayment?: InputMaybe<Scalars['Boolean']>;
  sharedSystemsInvolvedAdditionalClaimPaymentNote?: InputMaybe<Scalars['String']>;
  shouldAnyProviderExcludedFFSSystemsNote?: InputMaybe<Scalars['String']>;
  shouldAnyProvidersExcludedFFSSystems?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<TaskStatusInput>;
  waiveBeneficiaryCostSharingForAnyServices?: InputMaybe<Scalars['Boolean']>;
  waiveBeneficiaryCostSharingNote?: InputMaybe<Scalars['String']>;
  waiveBeneficiaryCostSharingServiceSpecification?: InputMaybe<Scalars['String']>;
  waiverOnlyAppliesPartOfPayment?: InputMaybe<Scalars['Boolean']>;
  willRecoverPayments?: InputMaybe<Scalars['Boolean']>;
  willRecoverPaymentsNote?: InputMaybe<Scalars['String']>;
};

export type PossibleOperationalNeed = {
  __typename?: 'PossibleOperationalNeed';
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  id: Scalars['Int'];
  key: OperationalNeedKey;
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  name: Scalars['String'];
  possibleSolutions: Array<PossibleOperationalSolution>;
  section?: Maybe<TaskListSection>;
};

export type PossibleOperationalSolution = {
  __typename?: 'PossibleOperationalSolution';
  createdBy: Scalars['UUID'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time'];
  id: Scalars['Int'];
  key: OperationalSolutionKey;
  modifiedBy?: Maybe<Scalars['UUID']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']>;
  name: Scalars['String'];
  treatAsOther: Scalars['Boolean'];
};

export type PrepareForClearance = {
  __typename?: 'PrepareForClearance';
  latestClearanceDts?: Maybe<Scalars['Time']>;
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
  searchChangeTable: Array<ChangeTableRecord>;
  searchChangeTableByActor: Array<ChangeTableRecord>;
  searchChangeTableByDateRange: Array<ChangeTableRecord>;
  searchChangeTableByModelPlanID: Array<ChangeTableRecord>;
  searchChangeTableByModelStatus: Array<ChangeTableRecord>;
  searchChangeTableDateHistogramConsolidatedAggregations: Array<DateHistogramAggregationBucket>;
  searchChangeTableWithFreeText: Array<ChangeTableRecord>;
  searchChanges: Array<ChangeTableRecord>;
  searchModelPlanChangesByDateRange: Array<ChangeTableRecord>;
  searchOktaUsers: Array<UserInfo>;
  taskListSectionLocks: Array<TaskListSectionLockStatus>;
  userAccount: UserAccount;
  whatDateIsIt: Scalars['Date'];
};


/** Query definition for the schema */
export type QueryAuditChangesArgs = {
  primaryKey: Scalars['UUID'];
  tableName: Scalars['String'];
};


/** Query definition for the schema */
export type QueryCrTdlArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryExistingModelLinkArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryModelPlanArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryModelPlanCollectionArgs = {
  filter?: ModelPlanFilter;
};


/** Query definition for the schema */
export type QueryOperationalNeedArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryOperationalSolutionArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryOperationalSolutionsArgs = {
  includeNotNeeded?: Scalars['Boolean'];
  operationalNeedID: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryPlanCollaboratorByIdArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryPlanDocumentArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryPlanPaymentsArgs = {
  id: Scalars['UUID'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  request: SearchRequest;
};


/** Query definition for the schema */
export type QuerySearchChangeTableByActorArgs = {
  actor: Scalars['String'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableByDateRangeArgs = {
  endDate: Scalars['Time'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  startDate: Scalars['Time'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableByModelPlanIdArgs = {
  limit: Scalars['Int'];
  modelPlanID: Scalars['UUID'];
  offset: Scalars['Int'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableByModelStatusArgs = {
  limit: Scalars['Int'];
  modelStatus: ModelStatus;
  offset: Scalars['Int'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableDateHistogramConsolidatedAggregationsArgs = {
  interval: Scalars['String'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableWithFreeTextArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  searchText: Scalars['String'];
};


/** Query definition for the schema */
export type QuerySearchChangesArgs = {
  filters?: InputMaybe<Array<SearchFilter>>;
  page?: InputMaybe<PageParams>;
  sortBy?: InputMaybe<ChangeHistorySortParams>;
};


/** Query definition for the schema */
export type QuerySearchModelPlanChangesByDateRangeArgs = {
  endDate: Scalars['Time'];
  limit: Scalars['Int'];
  modelPlanID: Scalars['UUID'];
  offset: Scalars['Int'];
  startDate: Scalars['Time'];
};


/** Query definition for the schema */
export type QuerySearchOktaUsersArgs = {
  searchTerm: Scalars['String'];
};


/** Query definition for the schema */
export type QueryTaskListSectionLocksArgs = {
  modelPlanID: Scalars['UUID'];
};


/** Query definition for the schema */
export type QueryUserAccountArgs = {
  username: Scalars['String'];
};

export enum RecruitmentType {
  ApplicationCollectionTool = 'APPLICATION_COLLECTION_TOOL',
  Loi = 'LOI',
  Na = 'NA',
  Nofo = 'NOFO',
  Other = 'OTHER'
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

export type SearchFilter = {
  type: SearchFilterType;
  value: Scalars['Any'];
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

export type SearchRequest = {
  query: Scalars['Map'];
};

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
  modelPlanID: Scalars['UUID'];
};


export type SubscriptionOnTaskListSectionLocksChangedArgs = {
  modelPlanID: Scalars['UUID'];
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
  isAssessment: Scalars['Boolean'];
  lockedByUserAccount: UserAccount;
  modelPlanID: Scalars['UUID'];
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

export type UpdateOperationalSolutionSubtaskChangesInput = {
  name: Scalars['String'];
  status: OperationalSolutionSubtaskStatus;
};

export type UpdateOperationalSolutionSubtaskInput = {
  changes: UpdateOperationalSolutionSubtaskChangesInput;
  id: Scalars['UUID'];
};

export type UserAccount = {
  __typename?: 'UserAccount';
  commonName: Scalars['String'];
  email: Scalars['String'];
  familyName: Scalars['String'];
  givenName: Scalars['String'];
  hasLoggedIn?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  isEUAID?: Maybe<Scalars['Boolean']>;
  locale: Scalars['String'];
  username: Scalars['String'];
  zoneInfo: Scalars['String'];
};

/** Represents a person response from the Okta API */
export type UserInfo = {
  __typename?: 'UserInfo';
  displayName: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  username: Scalars['String'];
};

export enum WaiverType {
  FraudAbuse = 'FRAUD_ABUSE',
  Medicaid = 'MEDICAID',
  ProgramPayment = 'PROGRAM_PAYMENT'
}

export type GetDateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDateQuery = { __typename?: 'Query', whatDateIsIt: Time };

export type GetNdaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNdaQuery = { __typename?: 'Query', ndaInfo: { __typename?: 'NDAInfo', agreed: boolean, agreedDts?: any | null } };

export type GetWeekFromNowMutationVariables = Exact<{
  date: Scalars['Date'];
}>;


export type GetWeekFromNowMutation = { __typename?: 'Mutation', oneWeekFromNow: Time };


export const GetDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whatDateIsIt"}}]}}]} as unknown as DocumentNode<GetDateQuery, GetDateQueryVariables>;
export const GetNdaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNDA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ndaInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agreed"}},{"kind":"Field","name":{"kind":"Name","value":"agreedDts"}}]}}]}}]} as unknown as DocumentNode<GetNdaQuery, GetNdaQueryVariables>;
export const GetWeekFromNowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GetWeekFromNow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneWeekFromNow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}]}}]} as unknown as DocumentNode<GetWeekFromNowMutation, GetWeekFromNowMutationVariables>;
