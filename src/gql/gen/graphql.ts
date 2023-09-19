/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  Time: { input: Time; output: Time; }
  /** UUIDs are represented using 36 ASCII characters, for example B0511859-ADE6-4A67-8969-16EC280C0E1A */
  UUID: { input: UUID; output: UUID; }
  /**
   * https://gqlgen.com/reference/file-upload/
   * Represents a multipart file upload
   */
  Upload: { input: Upload; output: Upload; }
};

export enum ActionType {
  /** An administrative action */
  ADMIN = 'ADMIN',
  /** A normal flow action */
  NORMAL = 'NORMAL'
}

export enum AgencyOrStateHelpType {
  NO = 'NO',
  OTHER = 'OTHER',
  YES_AGENCY_IAA = 'YES_AGENCY_IAA',
  YES_AGENCY_IDEAS = 'YES_AGENCY_IDEAS',
  YES_STATE = 'YES_STATE'
}

export enum AgreementType {
  COOPERATIVE = 'COOPERATIVE',
  OTHER = 'OTHER',
  PARTICIPATION = 'PARTICIPATION'
}

export enum AlternativePaymentModelType {
  ADVANCED = 'ADVANCED',
  MIPS = 'MIPS',
  NOT_APM = 'NOT_APM',
  REGULAR = 'REGULAR'
}

export enum AnticipatedPaymentFrequencyType {
  ANNUALLY = 'ANNUALLY',
  BIANNUALLY = 'BIANNUALLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  OTHER = 'OTHER',
  QUARTERLY = 'QUARTERLY',
  SEMIMONTHLY = 'SEMIMONTHLY',
  WEEKLY = 'WEEKLY'
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
  ACA = 'ACA',
  CONGRESSIONALLY_MANDATED = 'CONGRESSIONALLY_MANDATED',
  OTHER = 'OTHER',
  SSA_PART_B = 'SSA_PART_B'
}

export enum BenchmarkForPerformanceType {
  NO = 'NO',
  YES_NO_RECONCILE = 'YES_NO_RECONCILE',
  YES_RECONCILE = 'YES_RECONCILE'
}

export enum BeneficiariesType {
  DISEASE_SPECIFIC = 'DISEASE_SPECIFIC',
  DUALLY_ELIGIBLE = 'DUALLY_ELIGIBLE',
  MEDICAID = 'MEDICAID',
  MEDICARE_ADVANTAGE = 'MEDICARE_ADVANTAGE',
  MEDICARE_FFS = 'MEDICARE_FFS',
  MEDICARE_PART_D = 'MEDICARE_PART_D',
  NA = 'NA',
  OTHER = 'OTHER'
}

export enum CmmiGroup {
  PATIENT_CARE_MODELS_GROUP = 'PATIENT_CARE_MODELS_GROUP',
  POLICY_AND_PROGRAMS_GROUP = 'POLICY_AND_PROGRAMS_GROUP',
  SEAMLESS_CARE_MODELS_GROUP = 'SEAMLESS_CARE_MODELS_GROUP',
  STATE_AND_POPULATION_HEALTH_GROUP = 'STATE_AND_POPULATION_HEALTH_GROUP',
  TBD = 'TBD'
}

export enum CmsCenter {
  CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY = 'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY',
  CENTER_FOR_MEDICARE = 'CENTER_FOR_MEDICARE',
  CENTER_FOR_PROGRAM_INTEGRITY = 'CENTER_FOR_PROGRAM_INTEGRITY',
  CMMI = 'CMMI',
  FEDERAL_COORDINATED_HEALTH_CARE_OFFICE = 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE',
  OTHER = 'OTHER'
}

export enum CcmInvolvmentType {
  NO = 'NO',
  OTHER = 'OTHER',
  YES_EVALUATION = 'YES_EVALUATION',
  YES__IMPLEMENTATION = 'YES__IMPLEMENTATION'
}

export enum ChangeHistorySortKey {
  /** Sort by the user who made the change */
  ACTOR = 'ACTOR',
  /** Sort by the date the change was made */
  CHANGE_DATE = 'CHANGE_DATE',
  /** Sort by the model plan ID that was changed */
  MODEL_PLAN_ID = 'MODEL_PLAN_ID',
  /** Sort by the table ID that was changed */
  TABLE_ID = 'TABLE_ID',
  /** Sort by the table name that was changed */
  TABLE_NAME = 'TABLE_NAME'
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
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
  UPDATED = 'UPDATED'
}

export type ChangedFields = {
  __typename?: 'ChangedFields';
  changes: Array<Field>;
};

export enum ClaimsBasedPayType {
  ADJUSTMENTS_TO_FFS_PAYMENTS = 'ADJUSTMENTS_TO_FFS_PAYMENTS',
  CARE_MANAGEMENT_HOME_VISITS = 'CARE_MANAGEMENT_HOME_VISITS',
  OTHER = 'OTHER',
  REDUCTIONS_TO_BENEFICIARY_COST_SHARING = 'REDUCTIONS_TO_BENEFICIARY_COST_SHARING',
  SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE = 'SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE',
  SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS = 'SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS',
  TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE = 'TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE'
}

export enum ComplexityCalculationLevelType {
  HIGH = 'HIGH',
  LOW = 'LOW',
  MIDDLE = 'MIDDLE'
}

export enum ConfidenceType {
  COMPLETELY = 'COMPLETELY',
  FAIRLY = 'FAIRLY',
  NOT_AT_ALL = 'NOT_AT_ALL',
  SLIGHTLY = 'SLIGHTLY'
}

export enum ContractorSupportType {
  MULTIPLE = 'MULTIPLE',
  NONE = 'NONE',
  ONE = 'ONE',
  OTHER = 'OTHER'
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
  CLINICAL_DATA = 'CLINICAL_DATA',
  ENCOUNTER_DATA = 'ENCOUNTER_DATA',
  MEDICAID_CLAIMS = 'MEDICAID_CLAIMS',
  MEDICARE_CLAIMS = 'MEDICARE_CLAIMS',
  NON_CLINICAL_DATA = 'NON_CLINICAL_DATA',
  NON_MEDICAL_DATA = 'NON_MEDICAL_DATA',
  NOT_PLANNING_TO_COLLECT_DATA = 'NOT_PLANNING_TO_COLLECT_DATA',
  NO_PAY_CLAIMS = 'NO_PAY_CLAIMS',
  OTHER = 'OTHER',
  QUALITY_CLAIMS_BASED_MEASURES = 'QUALITY_CLAIMS_BASED_MEASURES',
  QUALITY_REPORTED_MEASURES = 'QUALITY_REPORTED_MEASURES',
  SITE_VISITS = 'SITE_VISITS'
}

export enum DataFrequencyType {
  ANNUALLY = 'ANNUALLY',
  BIANNUALLY = 'BIANNUALLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  NOT_PLANNING_TO_DO_THIS = 'NOT_PLANNING_TO_DO_THIS',
  OTHER = 'OTHER',
  QUARTERLY = 'QUARTERLY',
  SEMI_MONTHLY = 'SEMI_MONTHLY',
  WEEKLY = 'WEEKLY'
}

export enum DataFullTimeOrIncrementalType {
  FULL_TIME = 'FULL_TIME',
  INCREMENTAL = 'INCREMENTAL'
}

export enum DataStartsType {
  AT_SOME_OTHER_POINT_IN_TIME = 'AT_SOME_OTHER_POINT_IN_TIME',
  DURING_APPLICATION_PERIOD = 'DURING_APPLICATION_PERIOD',
  EARLY_IN_THE_FIRST_PERFORMANCE_YEAR = 'EARLY_IN_THE_FIRST_PERFORMANCE_YEAR',
  IN_THE_SUBSEQUENT_PERFORMANCE_YEAR = 'IN_THE_SUBSEQUENT_PERFORMANCE_YEAR',
  LATER_IN_THE_FIRST_PERFORMANCE_YEAR = 'LATER_IN_THE_FIRST_PERFORMANCE_YEAR',
  NOT_PLANNING_TO_DO_THIS = 'NOT_PLANNING_TO_DO_THIS',
  OTHER = 'OTHER',
  SHORTLY_BEFORE_THE_START_DATE = 'SHORTLY_BEFORE_THE_START_DATE'
}

export enum DataToSendParticipantsType {
  BASELINE_HISTORICAL_DATA = 'BASELINE_HISTORICAL_DATA',
  BENEFICIARY_LEVEL_DATA = 'BENEFICIARY_LEVEL_DATA',
  CLAIMS_LEVEL_DATA = 'CLAIMS_LEVEL_DATA',
  NOT_PLANNING_TO_SEND_DATA = 'NOT_PLANNING_TO_SEND_DATA',
  OTHER_MIPS_DATA = 'OTHER_MIPS_DATA',
  PARTICIPANT_LEVEL_DATA = 'PARTICIPANT_LEVEL_DATA',
  PROVIDER_LEVEL_DATA = 'PROVIDER_LEVEL_DATA'
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

export enum DiscussionStatus {
  ANSWERED = 'ANSWERED',
  UNANSWERED = 'UNANSWERED',
  WAITING_FOR_RESPONSE = 'WAITING_FOR_RESPONSE'
}

export enum DiscussionUserRole {
  CMS_SYSTEM_SERVICE_TEAM = 'CMS_SYSTEM_SERVICE_TEAM',
  IT_ARCHITECT = 'IT_ARCHITECT',
  LEADERSHIP = 'LEADERSHIP',
  MEDICARE_ADMINISTRATIVE_CONTRACTOR = 'MEDICARE_ADMINISTRATIVE_CONTRACTOR',
  MINT_TEAM = 'MINT_TEAM',
  MODEL_IT_LEAD = 'MODEL_IT_LEAD',
  MODEL_TEAM = 'MODEL_TEAM',
  NONE_OF_THE_ABOVE = 'NONE_OF_THE_ABOVE',
  SHARED_SYSTEM_MAINTAINER = 'SHARED_SYSTEM_MAINTAINER'
}

export enum DocumentType {
  CONCEPT_PAPER = 'CONCEPT_PAPER',
  DESIGN_PARAMETERS_MEMO = 'DESIGN_PARAMETERS_MEMO',
  ICIP_DRAFT = 'ICIP_DRAFT',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION = 'OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION',
  OTHER = 'OTHER',
  POLICY_PAPER = 'POLICY_PAPER'
}

export enum EvaluationApproachType {
  COMPARISON_MATCH = 'COMPARISON_MATCH',
  CONTROL_INTERVENTION = 'CONTROL_INTERVENTION',
  INTERRUPTED_TIME = 'INTERRUPTED_TIME',
  NON_MEDICARE_DATA = 'NON_MEDICARE_DATA',
  OTHER = 'OTHER'
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
  ANNUALLY = 'ANNUALLY',
  BIANNUALLY = 'BIANNUALLY',
  MONTHLY = 'MONTHLY',
  OTHER = 'OTHER',
  QUARTERLY = 'QUARTERLY',
  ROLLING = 'ROLLING'
}

export enum FundingSource {
  OTHER = 'OTHER',
  PATIENT_PROTECTION_AFFORDABLE_CARE_ACT = 'PATIENT_PROTECTION_AFFORDABLE_CARE_ACT',
  TRUST_FUND = 'TRUST_FUND'
}

export enum GqlTableName {
  ANALYZEDAUDIT = 'analyzedAudit',
  DISCUSSIONREPLY = 'discussionReply',
  EXISTINGMODEL = 'existingModel',
  EXISTINGMODELLINK = 'existingModelLink',
  MODELPLAN = 'modelPlan',
  NDAAGREEMENT = 'ndaAgreement',
  OPERATIONALNEED = 'operationalNeed',
  OPERATIONALSOLUTION = 'operationalSolution',
  OPERATIONALSOLUTIONSUBTASK = 'operationalSolutionSubtask',
  PLANBASICS = 'planBasics',
  PLANBENEFICIARIES = 'planBeneficiaries',
  PLANCOLLABORATOR = 'planCollaborator',
  PLANCRTDL = 'planCrTdl',
  PLANDISCUSSION = 'planDiscussion',
  PLANDOCUMENT = 'planDocument',
  PLANDOCUMENTSOLUTIONLINK = 'planDocumentSolutionLink',
  PLANGENERALCHARACTERISTICS = 'planGeneralCharacteristics',
  PLANOPSEVALANDLEARNING = 'planOpsEvalAndLearning',
  PLANPARTICIPANTSANDPROVIDERS = 'planParticipantsAndProviders',
  PLANPAYMENTS = 'planPayments',
  POSSIBLEOPERATIONALNEED = 'possibleOperationalNeed',
  POSSIBLEOPERATIONALSOLUTION = 'possibleOperationalSolution',
  USERACCOUNT = 'userAccount'
}

export enum GeographyApplication {
  BENEFICIARIES = 'BENEFICIARIES',
  OTHER = 'OTHER',
  PARTICIPANTS = 'PARTICIPANTS',
  PROVIDERS = 'PROVIDERS'
}

export enum GeographyType {
  OTHER = 'OTHER',
  REGION = 'REGION',
  STATE = 'STATE'
}

export enum KeyCharacteristic {
  EPISODE_BASED = 'EPISODE_BASED',
  OTHER = 'OTHER',
  PART_C = 'PART_C',
  PART_D = 'PART_D',
  PAYMENT = 'PAYMENT',
  POPULATION_BASED = 'POPULATION_BASED',
  PREVENTATIVE = 'PREVENTATIVE',
  SERVICE_DELIVERY = 'SERVICE_DELIVERY',
  SHARED_SAVINGS = 'SHARED_SAVINGS'
}

/** The current user's Launch Darkly key */
export type LaunchDarklySettings = {
  __typename?: 'LaunchDarklySettings';
  signedHash: Scalars['String']['output'];
  userKey: Scalars['String']['output'];
};

export enum ModelCategory {
  ACCOUNTABLE_CARE = 'ACCOUNTABLE_CARE',
  DISEASE_SPECIFIC_AND_EPISODIC = 'DISEASE_SPECIFIC_AND_EPISODIC',
  HEALTH_PLAN = 'HEALTH_PLAN',
  PRESCRIPTION_DRUG = 'PRESCRIPTION_DRUG',
  STATE_BASED = 'STATE_BASED',
  STATUTORY = 'STATUTORY',
  TO_BE_DETERMINED = 'TO_BE_DETERMINED'
}

export enum ModelLearningSystemType {
  EDUCATE_BENEFICIARIES = 'EDUCATE_BENEFICIARIES',
  IT_PLATFORM_CONNECT = 'IT_PLATFORM_CONNECT',
  LEARNING_CONTRACTOR = 'LEARNING_CONTRACTOR',
  NO_LEARNING_SYSTEM = 'NO_LEARNING_SYSTEM',
  OTHER = 'OTHER',
  PARTICIPANT_COLLABORATION = 'PARTICIPANT_COLLABORATION'
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
  COLLAB_ONLY = 'COLLAB_ONLY',
  INCLUDE_ALL = 'INCLUDE_ALL',
  WITH_CR_TDLS = 'WITH_CR_TDLS'
}

export enum ModelStatus {
  ACTIVE = 'ACTIVE',
  ANNOUNCED = 'ANNOUNCED',
  CANCELED = 'CANCELED',
  CLEARED = 'CLEARED',
  CMS_CLEARANCE = 'CMS_CLEARANCE',
  ENDED = 'ENDED',
  HHS_CLEARANCE = 'HHS_CLEARANCE',
  ICIP_COMPLETE = 'ICIP_COMPLETE',
  INTERNAL_CMMI_CLEARANCE = 'INTERNAL_CMMI_CLEARANCE',
  OMB_ASRF_CLEARANCE = 'OMB_ASRF_CLEARANCE',
  PAUSED = 'PAUSED',
  PLAN_COMPLETE = 'PLAN_COMPLETE',
  PLAN_DRAFT = 'PLAN_DRAFT'
}

export enum ModelType {
  MANDATORY = 'MANDATORY',
  TBD = 'TBD',
  VOLUNTARY = 'VOLUNTARY'
}

export enum ModelViewFilter {
  CBOSC = 'CBOSC',
  CCW = 'CCW',
  CMMI = 'CMMI',
  DFSDM = 'DFSDM',
  IDDOC = 'IDDOC',
  IPC = 'IPC',
  MDM = 'MDM',
  OACT = 'OACT',
  PBG = 'PBG'
}

export enum MonitoringFileType {
  BENEFICIARY = 'BENEFICIARY',
  OTHER = 'OTHER',
  PART_A = 'PART_A',
  PART_B = 'PART_B',
  PROVIDER = 'PROVIDER'
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
  lockTaskListSection: Scalars['Boolean']['output'];
  removePlanDocumentSolutionLinks: Scalars['Boolean']['output'];
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
export type MutationShareModelPlanArgs = {
  modelPlanID: Scalars['UUID']['input'];
  optionalMessage?: InputMaybe<Scalars['String']['input']>;
  receiverEmails: Array<Scalars['String']['input']>;
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
  ADVANCED_PAYMENT = 'ADVANCED_PAYMENT',
  BUNDLED_EPISODE_OF_CARE = 'BUNDLED_EPISODE_OF_CARE',
  CAPITATION_POPULATION_BASED_FULL = 'CAPITATION_POPULATION_BASED_FULL',
  CAPITATION_POPULATION_BASED_PARTIAL = 'CAPITATION_POPULATION_BASED_PARTIAL',
  CARE_COORDINATION_MANAGEMENT_FEE = 'CARE_COORDINATION_MANAGEMENT_FEE',
  GLOBAL_BUDGET = 'GLOBAL_BUDGET',
  GRANTS = 'GRANTS',
  INCENTIVE_PAYMENT = 'INCENTIVE_PAYMENT',
  MAPD_SHARED_SAVINGS = 'MAPD_SHARED_SAVINGS',
  OTHER = 'OTHER',
  SHARED_SAVINGS = 'SHARED_SAVINGS'
}

export enum OpSolutionStatus {
  AT_RISK = 'AT_RISK',
  BACKLOG = 'BACKLOG',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  ONBOARDING = 'ONBOARDING'
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
  ACQUIRE_AN_EVAL_CONT = 'ACQUIRE_AN_EVAL_CONT',
  ACQUIRE_A_LEARN_CONT = 'ACQUIRE_A_LEARN_CONT',
  ADJUST_FFS_CLAIMS = 'ADJUST_FFS_CLAIMS',
  APP_SUPPORT_CON = 'APP_SUPPORT_CON',
  CLAIMS_BASED_MEASURES = 'CLAIMS_BASED_MEASURES',
  COMM_W_PART = 'COMM_W_PART',
  COMPUTE_SHARED_SAVINGS_PAYMENT = 'COMPUTE_SHARED_SAVINGS_PAYMENT',
  DATA_TO_MONITOR = 'DATA_TO_MONITOR',
  DATA_TO_SUPPORT_EVAL = 'DATA_TO_SUPPORT_EVAL',
  EDUCATE_BENEF = 'EDUCATE_BENEF',
  ESTABLISH_BENCH = 'ESTABLISH_BENCH',
  HELPDESK_SUPPORT = 'HELPDESK_SUPPORT',
  IDDOC_SUPPORT = 'IDDOC_SUPPORT',
  IT_PLATFORM_FOR_LEARNING = 'IT_PLATFORM_FOR_LEARNING',
  MAKE_NON_CLAIMS_BASED_PAYMENTS = 'MAKE_NON_CLAIMS_BASED_PAYMENTS',
  MANAGE_BEN_OVERLAP = 'MANAGE_BEN_OVERLAP',
  MANAGE_CD = 'MANAGE_CD',
  MANAGE_FFS_EXCL_PAYMENTS = 'MANAGE_FFS_EXCL_PAYMENTS',
  MANAGE_PROV_OVERLAP = 'MANAGE_PROV_OVERLAP',
  PART_TO_PART_COLLAB = 'PART_TO_PART_COLLAB',
  PROCESS_PART_APPEALS = 'PROCESS_PART_APPEALS',
  QUALITY_PERFORMANCE_SCORES = 'QUALITY_PERFORMANCE_SCORES',
  RECOVER_PAYMENTS = 'RECOVER_PAYMENTS',
  RECRUIT_PARTICIPANTS = 'RECRUIT_PARTICIPANTS',
  REV_COL_BIDS = 'REV_COL_BIDS',
  REV_SCORE_APP = 'REV_SCORE_APP',
  SEND_REPDATA_TO_PART = 'SEND_REPDATA_TO_PART',
  SIGN_PARTICIPATION_AGREEMENTS = 'SIGN_PARTICIPATION_AGREEMENTS',
  UPDATE_CONTRACT = 'UPDATE_CONTRACT',
  UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR = 'UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR',
  VET_PROVIDERS_FOR_PROGRAM_INTEGRITY = 'VET_PROVIDERS_FOR_PROGRAM_INTEGRITY'
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
  ACO_OS = 'ACO_OS',
  APPS = 'APPS',
  ARS = 'ARS',
  BCDA = 'BCDA',
  CBOSC = 'CBOSC',
  CCW = 'CCW',
  CDX = 'CDX',
  CMS_BOX = 'CMS_BOX',
  CMS_QUALTRICS = 'CMS_QUALTRICS',
  CONNECT = 'CONNECT',
  CONTRACTOR = 'CONTRACTOR',
  CPI_VETTING = 'CPI_VETTING',
  CROSS_MODEL_CONTRACT = 'CROSS_MODEL_CONTRACT',
  EDFR = 'EDFR',
  EFT = 'EFT',
  EXISTING_CMS_DATA_AND_PROCESS = 'EXISTING_CMS_DATA_AND_PROCESS',
  GOVDELIVERY = 'GOVDELIVERY',
  GS = 'GS',
  HDR = 'HDR',
  HIGLAS = 'HIGLAS',
  HPMS = 'HPMS',
  IDR = 'IDR',
  INNOVATION = 'INNOVATION',
  INTERNAL_STAFF = 'INTERNAL_STAFF',
  IPC = 'IPC',
  LDG = 'LDG',
  LOI = 'LOI',
  LV = 'LV',
  MARX = 'MARX',
  MDM = 'MDM',
  OTHER_NEW_PROCESS = 'OTHER_NEW_PROCESS',
  OUTLOOK_MAILBOX = 'OUTLOOK_MAILBOX',
  POST_PORTAL = 'POST_PORTAL',
  QV = 'QV',
  RFA = 'RFA',
  RMADA = 'RMADA',
  SHARED_SYSTEMS = 'SHARED_SYSTEMS'
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
  DONE = 'DONE',
  IN_PROGRESS = 'IN_PROGRESS',
  TODO = 'TODO'
}

export enum OverlapType {
  NO = 'NO',
  YES_NEED_POLICIES = 'YES_NEED_POLICIES',
  YES_NO_ISSUES = 'YES_NO_ISSUES'
}

export type PageParams = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export enum ParticipantCommunicationType {
  IT_TOOL = 'IT_TOOL',
  MASS_EMAIL = 'MASS_EMAIL',
  NO_COMMUNICATION = 'NO_COMMUNICATION',
  OTHER = 'OTHER'
}

export enum ParticipantRiskType {
  CAPITATION = 'CAPITATION',
  ONE_SIDED = 'ONE_SIDED',
  OTHER = 'OTHER',
  TWO_SIDED = 'TWO_SIDED'
}

export enum ParticipantSelectionType {
  APPLICATION_REVIEW_AND_SCORING_TOOL = 'APPLICATION_REVIEW_AND_SCORING_TOOL',
  APPLICATION_SUPPORT_CONTRACTOR = 'APPLICATION_SUPPORT_CONTRACTOR',
  BASIC_CRITERIA = 'BASIC_CRITERIA',
  CMS_COMPONENT_OR_PROCESS = 'CMS_COMPONENT_OR_PROCESS',
  MODEL_TEAM_REVIEW_APPLICATIONS = 'MODEL_TEAM_REVIEW_APPLICATIONS',
  NO_SELECTING_PARTICIPANTS = 'NO_SELECTING_PARTICIPANTS',
  OTHER = 'OTHER',
  SUPPORT_FROM_CMMI = 'SUPPORT_FROM_CMMI'
}

export enum ParticipantsIdType {
  CCNS = 'CCNS',
  NO_IDENTIFIERS = 'NO_IDENTIFIERS',
  NPIS = 'NPIS',
  OTHER = 'OTHER',
  TINS = 'TINS'
}

export enum ParticipantsType {
  COMMERCIAL_PAYERS = 'COMMERCIAL_PAYERS',
  COMMUNITY_BASED_ORGANIZATIONS = 'COMMUNITY_BASED_ORGANIZATIONS',
  CONVENER = 'CONVENER',
  ENTITIES = 'ENTITIES',
  MEDICAID_MANAGED_CARE_ORGANIZATIONS = 'MEDICAID_MANAGED_CARE_ORGANIZATIONS',
  MEDICAID_PROVIDERS = 'MEDICAID_PROVIDERS',
  MEDICARE_ADVANTAGE_PLANS = 'MEDICARE_ADVANTAGE_PLANS',
  MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS = 'MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS',
  MEDICARE_PROVIDERS = 'MEDICARE_PROVIDERS',
  NON_PROFIT_ORGANIZATIONS = 'NON_PROFIT_ORGANIZATIONS',
  OTHER = 'OTHER',
  STANDALONE_PART_D_PLANS = 'STANDALONE_PART_D_PLANS',
  STATES = 'STATES',
  STATE_MEDICAID_AGENCIES = 'STATE_MEDICAID_AGENCIES'
}

export enum PayRecipient {
  BENEFICIARIES = 'BENEFICIARIES',
  OTHER = 'OTHER',
  PARTICIPANTS = 'PARTICIPANTS',
  PROVIDERS = 'PROVIDERS',
  STATES = 'STATES'
}

export enum PayType {
  CLAIMS_BASED_PAYMENTS = 'CLAIMS_BASED_PAYMENTS',
  GRANTS = 'GRANTS',
  NON_CLAIMS_BASED_PAYMENTS = 'NON_CLAIMS_BASED_PAYMENTS'
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
  status: DiscussionStatus;
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
  status?: InputMaybe<DiscussionStatus>;
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
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  numLinkedSolutions: Scalars['Int']['output'];
  optionalNotes?: Maybe<Scalars['String']['output']>;
  otherType?: Maybe<Scalars['String']['output']>;
  restricted: Scalars['Boolean']['output'];
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
  treatAsOther: Scalars['Boolean']['output'];
};

export type PrepareForClearance = {
  __typename?: 'PrepareForClearance';
  latestClearanceDts?: Maybe<Scalars['Time']['output']>;
  status: PrepareForClearanceStatus;
};

export enum PrepareForClearanceStatus {
  CANNOT_START = 'CANNOT_START',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  READY_FOR_CLEARANCE = 'READY_FOR_CLEARANCE'
}

export enum ProviderAddType {
  MANDATORILY = 'MANDATORILY',
  NA = 'NA',
  ONLINE_TOOLS = 'ONLINE_TOOLS',
  OTHER = 'OTHER',
  PROSPECTIVELY = 'PROSPECTIVELY',
  RETROSPECTIVELY = 'RETROSPECTIVELY',
  VOLUNTARILY = 'VOLUNTARILY'
}

export enum ProviderLeaveType {
  AFTER_A_CERTAIN_WITH_IMPLICATIONS = 'AFTER_A_CERTAIN_WITH_IMPLICATIONS',
  NOT_ALLOWED_TO_LEAVE = 'NOT_ALLOWED_TO_LEAVE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  OTHER = 'OTHER',
  VARIES_BY_TYPE_OF_PROVIDER = 'VARIES_BY_TYPE_OF_PROVIDER',
  VOLUNTARILY_WITHOUT_IMPLICATIONS = 'VOLUNTARILY_WITHOUT_IMPLICATIONS'
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
export type QuerySearchChangeTableArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  request: SearchRequest;
};


/** Query definition for the schema */
export type QuerySearchChangeTableByActorArgs = {
  actor: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableByDateRangeArgs = {
  endDate: Scalars['Time']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  startDate: Scalars['Time']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableByModelPlanIdArgs = {
  limit: Scalars['Int']['input'];
  modelPlanID: Scalars['UUID']['input'];
  offset: Scalars['Int']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableByModelStatusArgs = {
  limit: Scalars['Int']['input'];
  modelStatus: ModelStatus;
  offset: Scalars['Int']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableDateHistogramConsolidatedAggregationsArgs = {
  interval: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangeTableWithFreeTextArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  searchText: Scalars['String']['input'];
};


/** Query definition for the schema */
export type QuerySearchChangesArgs = {
  filters?: InputMaybe<Array<SearchFilter>>;
  page?: InputMaybe<PageParams>;
  sortBy?: InputMaybe<ChangeHistorySortParams>;
};


/** Query definition for the schema */
export type QuerySearchModelPlanChangesByDateRangeArgs = {
  endDate: Scalars['Time']['input'];
  limit: Scalars['Int']['input'];
  modelPlanID: Scalars['UUID']['input'];
  offset: Scalars['Int']['input'];
  startDate: Scalars['Time']['input'];
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
  APPLICATION_COLLECTION_TOOL = 'APPLICATION_COLLECTION_TOOL',
  LOI = 'LOI',
  NA = 'NA',
  NOFO = 'NOFO',
  OTHER = 'OTHER'
}

/** A user role associated with a job code */
export enum Role {
  /** A MINT assessment team user */
  MINT_ASSESSMENT = 'MINT_ASSESSMENT',
  /** A MINT MAC user */
  MINT_MAC = 'MINT_MAC',
  /** A basic MINT user */
  MINT_USER = 'MINT_USER'
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
  CHANGED_AFTER = 'CHANGED_AFTER',
  /**
   * Filter search results to include changes on or before the specified date.
   * Expected value: A string in RFC3339 format representing the date and time.
   * Example: "2006-01-02T15:04:05Z07:00"
   */
  CHANGED_BEFORE = 'CHANGED_BEFORE',
  /**
   * Filter search results to include changes made by the specified actor. This is a fuzzy search on the fields: common_name, username, given_name, and family_name of the actor.
   * Expected value: A string representing the name or username of the actor.
   * Example: "MINT"
   */
  CHANGED_BY_ACTOR = 'CHANGED_BY_ACTOR',
  /**
   * Filter results with a free text search. This is a fuzzy search on the entire record.
   * Expected value: A string representing the free text search query.
   * Example: "Operational Need"
   */
  FREE_TEXT = 'FREE_TEXT',
  /**
   * Filter search results to include changes made to the specified model plan by ID.
   * Expected value: A string representing the ID of the model plan.
   * Example: "efda354c-11dd-458e-91cf-4f43ee47440b"
   */
  MODEL_PLAN_ID = 'MODEL_PLAN_ID',
  /**
   * Filter search results to include changes made to the specified object.
   * Expected value: A string representing the section of the model plan. Use the SearchableTaskListSection enum for valid values.
   * Example: "BASICS"
   */
  MODEL_PLAN_SECTION = 'MODEL_PLAN_SECTION',
  /**
   * Filter search results to include model plans with the specified status.
   * Expected value: A string representing the status of the model plan.
   * Example: "ACTIVE"
   */
  MODEL_PLAN_STATUS = 'MODEL_PLAN_STATUS',
  /**
   * Filter results by table id.
   * Expected value: An integer representing the table ID.
   * Example: 14
   */
  TABLE_ID = 'TABLE_ID',
  /**
   * Filter results by table name.
   * Expected value: A string representing the table name.
   * Example: "plan_basics"
   */
  TABLE_NAME = 'TABLE_NAME'
}

export type SearchRequest = {
  query: Scalars['Map']['input'];
};

export enum SearchableTaskListSection {
  BASICS = 'BASICS',
  BENEFICIARIES = 'BENEFICIARIES',
  GENERAL_CHARACTERISTICS = 'GENERAL_CHARACTERISTICS',
  OPERATIONS_EVALUATION_AND_LEARNING = 'OPERATIONS_EVALUATION_AND_LEARNING',
  PARTICIPANTS_AND_PROVIDERS = 'PARTICIPANTS_AND_PROVIDERS',
  PAYMENT = 'PAYMENT'
}

export enum SelectionMethodType {
  HISTORICAL = 'HISTORICAL',
  NA = 'NA',
  OTHER = 'OTHER',
  PROSPECTIVE = 'PROSPECTIVE',
  PROVIDER_SIGN_UP = 'PROVIDER_SIGN_UP',
  RETROSPECTIVE = 'RETROSPECTIVE',
  VOLUNTARY = 'VOLUNTARY'
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum StakeholdersType {
  BENEFICIARIES = 'BENEFICIARIES',
  COMMUNITY_ORGANIZATIONS = 'COMMUNITY_ORGANIZATIONS',
  OTHER = 'OTHER',
  PARTICIPANTS = 'PARTICIPANTS',
  PROFESSIONAL_ORGANIZATIONS = 'PROFESSIONAL_ORGANIZATIONS',
  PROVIDERS = 'PROVIDERS',
  STATES = 'STATES'
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
  BASICS = 'BASICS',
  BENEFICIARIES = 'BENEFICIARIES',
  GENERAL_CHARACTERISTICS = 'GENERAL_CHARACTERISTICS',
  OPERATIONS_EVALUATION_AND_LEARNING = 'OPERATIONS_EVALUATION_AND_LEARNING',
  PARTICIPANTS_AND_PROVIDERS = 'PARTICIPANTS_AND_PROVIDERS',
  PAYMENT = 'PAYMENT',
  PREPARE_FOR_CLEARANCE = 'PREPARE_FOR_CLEARANCE'
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
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  READY_FOR_CLEARANCE = 'READY_FOR_CLEARANCE',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW'
}

export enum TaskStatusInput {
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_CLEARANCE = 'READY_FOR_CLEARANCE',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW'
}

export enum TeamRole {
  EVALUATION = 'EVALUATION',
  IT_LEAD = 'IT_LEAD',
  LEADERSHIP = 'LEADERSHIP',
  LEARNING = 'LEARNING',
  MODEL_LEAD = 'MODEL_LEAD',
  MODEL_TEAM = 'MODEL_TEAM',
  OACT = 'OACT',
  PAYMENT = 'PAYMENT',
  QUALITY = 'QUALITY'
}

export enum TriStateAnswer {
  NO = 'NO',
  TBD = 'TBD',
  YES = 'YES'
}

export enum TrustFundType {
  MEDICARE_PART_A_HI_TRUST_FUND = 'MEDICARE_PART_A_HI_TRUST_FUND',
  MEDICARE_PART_B_SMI_TRUST_FUND = 'MEDICARE_PART_B_SMI_TRUST_FUND'
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
  FRAUD_ABUSE = 'FRAUD_ABUSE',
  MEDICAID = 'MEDICAID',
  PROGRAM_PAYMENT = 'PROGRAM_PAYMENT'
}

export type GetFundingQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetFundingQuery = { __typename?: 'Query', modelPlan: { __typename?: 'ModelPlan', id: UUID, modelName: string, payments: { __typename?: 'PlanPayments', id: UUID, fundingSource: Array<FundingSource>, fundingSourceTrustFundType: Array<TrustFundType>, fundingSourceOther?: string | null, fundingSourceNote?: string | null, fundingSourceR: Array<FundingSource>, fundingSourceRTrustFundType: Array<TrustFundType>, fundingSourceROther?: string | null, fundingSourceRNote?: string | null, payRecipients: Array<PayRecipient>, payRecipientsOtherSpecification?: string | null, payRecipientsNote?: string | null, payType: Array<PayType>, payTypeNote?: string | null, payClaims: Array<ClaimsBasedPayType> }, operationalNeeds: Array<{ __typename?: 'OperationalNeed', modifiedDts?: Time | null }> } };

export type UpdatePaymentsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanPaymentsChanges;
}>;


export type UpdatePaymentsMutation = { __typename?: 'Mutation', updatePlanPayments: { __typename?: 'PlanPayments', id: UUID } };

export type CreateShareModelPlanMutationVariables = Exact<{
  modelPlanID: Scalars['UUID']['input'];
  viewFilter?: InputMaybe<ModelViewFilter>;
  receiverEmails: Array<Scalars['String']['input']> | Scalars['String']['input'];
  optionalMessage?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateShareModelPlanMutation = { __typename?: 'Mutation', shareModelPlan: boolean };

export type GetNdaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNdaQuery = { __typename?: 'Query', ndaInfo: { __typename?: 'NDAInfo', agreed: boolean, agreedDts?: Time | null } };


export const GetFundingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFunding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modelPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSource"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSourceTrustFundType"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSourceOther"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSourceNote"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSourceR"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSourceRTrustFundType"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSourceROther"}},{"kind":"Field","name":{"kind":"Name","value":"fundingSourceRNote"}},{"kind":"Field","name":{"kind":"Name","value":"payRecipients"}},{"kind":"Field","name":{"kind":"Name","value":"payRecipientsOtherSpecification"}},{"kind":"Field","name":{"kind":"Name","value":"payRecipientsNote"}},{"kind":"Field","name":{"kind":"Name","value":"payType"}},{"kind":"Field","name":{"kind":"Name","value":"payTypeNote"}},{"kind":"Field","name":{"kind":"Name","value":"payClaims"}}]}},{"kind":"Field","name":{"kind":"Name","value":"operationalNeeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifiedDts"}}]}}]}}]}}]} as unknown as DocumentNode<GetFundingQuery, GetFundingQueryVariables>;
export const UpdatePaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changes"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlanPaymentsChanges"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlanPayments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"changes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdatePaymentsMutation, UpdatePaymentsMutationVariables>;
export const CreateShareModelPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShareModelPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelPlanID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ModelViewFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiverEmails"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionalMessage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shareModelPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"modelPlanID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelPlanID"}}},{"kind":"Argument","name":{"kind":"Name","value":"viewFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"viewFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"receiverEmails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiverEmails"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionalMessage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionalMessage"}}}]}]}}]} as unknown as DocumentNode<CreateShareModelPlanMutation, CreateShareModelPlanMutationVariables>;
export const GetNdaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNDA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ndaInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agreed"}},{"kind":"Field","name":{"kind":"Name","value":"agreedDts"}}]}}]}}]} as unknown as DocumentNode<GetNdaQuery, GetNdaQueryVariables>;