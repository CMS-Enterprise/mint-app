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
  /** Maps an arbitrary GraphQL value to a map[string]interface{} Go type. */
  Map: { input: any; output: any; }
  /** TaggedHTML represents an input type for HTML that could also include tags that reference another entity */
  TaggedHTML: { input: any; output: any; }
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

/** Activity represents an event that happened in the application that could result in a notification. */
export type Activity = {
  __typename: 'Activity';
  activityType: ActivityType;
  actorID: Scalars['UUID']['output'];
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  entityID: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  metaData: ActivityMetaData;
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
};

export type ActivityMetaBaseStruct = {
  __typename: 'ActivityMetaBaseStruct';
  type: ActivityType;
  version: Scalars['Int']['output'];
};

/** AcitivyMetaData is a type that represents all the data that can be captured in an Activity */
export type ActivityMetaData = ActivityMetaBaseStruct | NewPlanDiscussionActivityMeta;

/** ActivityType represents the possible activities that happen in application that might result in a notification */
export enum ActivityType {
  ADDED_AS_COLLABORATOR = 'ADDED_AS_COLLABORATOR',
  DAILY_DIGEST_COMPLETE = 'DAILY_DIGEST_COMPLETE',
  MODEL_PLAN_SHARED = 'MODEL_PLAN_SHARED',
  NEW_DISCUSSION_REPLY = 'NEW_DISCUSSION_REPLY',
  NEW_PLAN_DISCUSSION = 'NEW_PLAN_DISCUSSION',
  TAGGED_IN_DISCUSSION = 'TAGGED_IN_DISCUSSION',
  TAGGED_IN_DISCUSSION_REPLY = 'TAGGED_IN_DISCUSSION_REPLY'
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

export type AuditChange = {
  __typename: 'AuditChange';
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
  OTHER = 'OTHER',
  UNDERSERVED = 'UNDERSERVED'
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
  CENTER_FOR_MEDICAID_AND_CHIP_SERVICES = 'CENTER_FOR_MEDICAID_AND_CHIP_SERVICES',
  CENTER_FOR_MEDICARE = 'CENTER_FOR_MEDICARE',
  CENTER_FOR_PROGRAM_INTEGRITY = 'CENTER_FOR_PROGRAM_INTEGRITY',
  CMMI = 'CMMI',
  FEDERAL_COORDINATED_HEALTH_CARE_OFFICE = 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE'
}

export enum CcmInvolvmentType {
  NO = 'NO',
  OTHER = 'OTHER',
  YES_EVALUATION = 'YES_EVALUATION',
  YES__IMPLEMENTATION = 'YES__IMPLEMENTATION'
}

export enum ChangeType {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
  UPDATED = 'UPDATED'
}

export enum ClaimsBasedPayType {
  ADJUSTMENTS_TO_FFS_PAYMENTS = 'ADJUSTMENTS_TO_FFS_PAYMENTS',
  CARE_MANAGEMENT_HOME_VISITS = 'CARE_MANAGEMENT_HOME_VISITS',
  OTHER = 'OTHER',
  PAYMENTS_FOR_POST_DISCHARGE_HOME_VISITS = 'PAYMENTS_FOR_POST_DISCHARGE_HOME_VISITS',
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
  __typename: 'CurrentUser';
  account: UserAccount;
  launchDarkly: LaunchDarklySettings;
  notifications: UserNotifications;
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

/** DiscussionReply represents a discussion reply */
export type DiscussionReply = {
  __typename: 'DiscussionReply';
  content?: Maybe<TaggedContent>;
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

/** DiscussionReplyCreateInput represents the necessary fields to create a discussion reply */
export type DiscussionReplyCreateInput = {
  content: Scalars['TaggedHTML']['input'];
  discussionID: Scalars['UUID']['input'];
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']['input']>;
};

export type DiscussionRoleSelection = {
  __typename: 'DiscussionRoleSelection';
  userRole: DiscussionUserRole;
  userRoleDescription?: Maybe<Scalars['String']['output']>;
};

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

export enum EaseOfUse {
  AGREE = 'AGREE',
  DISAGREE = 'DISAGREE',
  UNSURE = 'UNSURE'
}

export enum EvaluationApproachType {
  COMPARISON_MATCH = 'COMPARISON_MATCH',
  CONTROL_INTERVENTION = 'CONTROL_INTERVENTION',
  INTERRUPTED_TIME = 'INTERRUPTED_TIME',
  NON_MEDICARE_DATA = 'NON_MEDICARE_DATA',
  OTHER = 'OTHER'
}

export enum ExisitingModelLinkFieldType {
  GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH = 'GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH',
  GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH = 'GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH'
}

/** ExistingModel represents a model that already exists outside of the scope of MINT */
export type ExistingModel = {
  __typename: 'ExistingModel';
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
  modelName: Scalars['String']['output'];
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
  __typename: 'ExistingModelLink';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  currentModelPlanID?: Maybe<Scalars['UUID']['output']>;
  existingModelID?: Maybe<Scalars['Int']['output']>;
  fieldName: ExisitingModelLinkFieldType;
  id?: Maybe<Scalars['UUID']['output']>;
  model: LinkedExistingModel;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
};

export type ExistingModelLinks = {
  __typename: 'ExistingModelLinks';
  fieldName: ExisitingModelLinkFieldType;
  links: Array<ExistingModelLink>;
  modelPlanID: Scalars['UUID']['output'];
  names: Array<Scalars['String']['output']>;
};

export enum FrequencyType {
  ANNUALLY = 'ANNUALLY',
  CONTINUALLY = 'CONTINUALLY',
  MONTHLY = 'MONTHLY',
  OTHER = 'OTHER',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUALLY = 'SEMIANNUALLY'
}

export enum FundingSource {
  MEDICARE_PART_A_HI_TRUST_FUND = 'MEDICARE_PART_A_HI_TRUST_FUND',
  MEDICARE_PART_B_SMI_TRUST_FUND = 'MEDICARE_PART_B_SMI_TRUST_FUND',
  OTHER = 'OTHER',
  PATIENT_PROTECTION_AFFORDABLE_CARE_ACT = 'PATIENT_PROTECTION_AFFORDABLE_CARE_ACT'
}

export enum GainshareArrangementEligibility {
  ALL_PROVIDERS = 'ALL_PROVIDERS',
  NO = 'NO',
  OTHER = 'OTHER',
  SOME_PROVIDERS = 'SOME_PROVIDERS'
}

export enum GeographyApplication {
  BENEFICIARIES = 'BENEFICIARIES',
  OTHER = 'OTHER',
  PARTICIPANTS = 'PARTICIPANTS',
  PROVIDERS = 'PROVIDERS'
}

export enum GeographyRegionType {
  CBSA = 'CBSA',
  HRR = 'HRR',
  MSA = 'MSA'
}

export enum GeographyType {
  OTHER = 'OTHER',
  REGION = 'REGION',
  STATE = 'STATE'
}

export enum KeyCharacteristic {
  EPISODE_BASED = 'EPISODE_BASED',
  MEDICAID_MODEL = 'MEDICAID_MODEL',
  MEDICARE_FFS_MODEL = 'MEDICARE_FFS_MODEL',
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
  __typename: 'LaunchDarklySettings';
  signedHash: Scalars['String']['output'];
  userKey: Scalars['String']['output'];
};

/** LinkedExistingModel is a union type that returns either an Existing Model, or a Model plan from the database */
export type LinkedExistingModel = ExistingModel | ModelPlan;

export enum MintUses {
  CONTRIBUTE_DISCUSSIONS = 'CONTRIBUTE_DISCUSSIONS',
  EDIT_MODEL = 'EDIT_MODEL',
  OTHER = 'OTHER',
  SHARE_MODEL = 'SHARE_MODEL',
  TRACK_SOLUTIONS = 'TRACK_SOLUTIONS',
  VIEW_HELP = 'VIEW_HELP',
  VIEW_MODEL = 'VIEW_MODEL'
}

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
  __typename: 'ModelPlan';
  abbreviation?: Maybe<Scalars['String']['output']>;
  archived: Scalars['Boolean']['output'];
  basics: PlanBasics;
  beneficiaries: PlanBeneficiaries;
  collaborators: Array<PlanCollaborator>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  crs: Array<PlanCr>;
  discussions: Array<PlanDiscussion>;
  documents: Array<PlanDocument>;
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
  tdls: Array<PlanTdl>;
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
  MANDATORY_NATIONAL = 'MANDATORY_NATIONAL',
  MANDATORY_REGIONAL_OR_STATE = 'MANDATORY_REGIONAL_OR_STATE',
  OTHER = 'OTHER',
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
  __typename: 'Mutation';
  addOrUpdateCustomOperationalNeed: OperationalNeed;
  addPlanFavorite: PlanFavorite;
  agreeToNDA: NdaInfo;
  createDiscussionReply: DiscussionReply;
  createModelPlan: ModelPlan;
  createOperationalSolution: OperationalSolution;
  createOperationalSolutionSubtasks?: Maybe<Array<OperationalSolutionSubtask>>;
  createPlanCR: PlanCr;
  createPlanCollaborator: PlanCollaborator;
  createPlanDiscussion: PlanDiscussion;
  createPlanDocumentSolutionLinks?: Maybe<Array<PlanDocumentSolutionLink>>;
  createPlanTDL: PlanTdl;
  deleteOperationalSolutionSubtask: Scalars['Int']['output'];
  deletePlanCR: PlanCr;
  deletePlanCollaborator: PlanCollaborator;
  deletePlanDocument: Scalars['Int']['output'];
  deletePlanFavorite: PlanFavorite;
  deletePlanTDL: PlanTdl;
  linkNewPlanDocument: PlanDocument;
  lockTaskListSection: Scalars['Boolean']['output'];
  /** Marks all notifications for the current user as read, and returns the updated notifications */
  markAllNotificationsAsRead: Array<UserNotification>;
  /** Marks a single notification as read. It requires that the notification be owned by the context of the user sending this request, or it will fail */
  markNotificationAsRead: UserNotification;
  removePlanDocumentSolutionLinks: Scalars['Boolean']['output'];
  reportAProblem: Scalars['Boolean']['output'];
  /** This mutation sends feedback about the MINT product to the MINT team */
  sendFeedbackEmail: Scalars['Boolean']['output'];
  shareModelPlan: Scalars['Boolean']['output'];
  unlockAllTaskListSections: Array<TaskListSectionLockStatus>;
  unlockTaskListSection: Scalars['Boolean']['output'];
  updateCustomOperationalNeedByID: OperationalNeed;
  /**
   * This will update linked existing models, and related model plans for given model plan and fieldName.
   * The fieldName allows it so you can create links for multiple sections of the model plan
   */
  updateExistingModelLinks: ExistingModelLinks;
  updateModelPlan: ModelPlan;
  updateOperationalSolution: OperationalSolution;
  updateOperationalSolutionSubtasks?: Maybe<Array<OperationalSolutionSubtask>>;
  updatePlanBasics: PlanBasics;
  updatePlanBeneficiaries: PlanBeneficiaries;
  updatePlanCR: PlanCr;
  updatePlanCollaborator: PlanCollaborator;
  updatePlanGeneralCharacteristics: PlanGeneralCharacteristics;
  updatePlanOpsEvalAndLearning: PlanOpsEvalAndLearning;
  updatePlanParticipantsAndProviders: PlanParticipantsAndProviders;
  updatePlanPayments: PlanPayments;
  updatePlanTDL: PlanTdl;
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
export type MutationCreatePlanCrArgs = {
  input: PlanCrCreateInput;
};


/** Mutations definition for the schema */
export type MutationCreatePlanCollaboratorArgs = {
  input: PlanCollaboratorCreateInput;
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
export type MutationCreatePlanTdlArgs = {
  input: PlanTdlCreateInput;
};


/** Mutations definition for the schema */
export type MutationDeleteOperationalSolutionSubtaskArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanCrArgs = {
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationDeletePlanCollaboratorArgs = {
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
export type MutationDeletePlanTdlArgs = {
  id: Scalars['UUID']['input'];
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
export type MutationMarkNotificationAsReadArgs = {
  notificationID: Scalars['UUID']['input'];
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
export type MutationUpdateExistingModelLinksArgs = {
  currentModelPlanIDs?: InputMaybe<Array<Scalars['UUID']['input']>>;
  existingModelIDs?: InputMaybe<Array<Scalars['Int']['input']>>;
  fieldName: ExisitingModelLinkFieldType;
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
export type MutationUpdatePlanCrArgs = {
  changes: PlanCrChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUpdatePlanCollaboratorArgs = {
  id: Scalars['UUID']['input'];
  newRoles: Array<TeamRole>;
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
export type MutationUpdatePlanTdlArgs = {
  changes: PlanTdlChanges;
  id: Scalars['UUID']['input'];
};


/** Mutations definition for the schema */
export type MutationUploadNewPlanDocumentArgs = {
  input: PlanDocumentInput;
};

/** NDAInfo represents whether a user has agreed to an NDA or not. If agreed to previously, there will be a datestamp visible */
export type NdaInfo = {
  __typename: 'NDAInfo';
  agreed: Scalars['Boolean']['output'];
  agreedDts?: Maybe<Scalars['Time']['output']>;
};

export type NewPlanDiscussionActivityMeta = {
  __typename: 'NewPlanDiscussionActivityMeta';
  discussionID: Scalars['UUID']['output'];
  type: ActivityType;
  version: Scalars['Int']['output'];
};

export enum NonClaimsBasedPayType {
  ADVANCED_PAYMENT = 'ADVANCED_PAYMENT',
  BUNDLED_EPISODE_OF_CARE = 'BUNDLED_EPISODE_OF_CARE',
  CAPITATION_POPULATION_BASED_FULL = 'CAPITATION_POPULATION_BASED_FULL',
  CAPITATION_POPULATION_BASED_PARTIAL = 'CAPITATION_POPULATION_BASED_PARTIAL',
  CARE_COORDINATION_MANAGEMENT_FEE = 'CARE_COORDINATION_MANAGEMENT_FEE',
  GLOBAL_BUDGET = 'GLOBAL_BUDGET',
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
  __typename: 'OperationalNeed';
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
  __typename: 'OperationalSolution';
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
  ISP = 'ISP',
  LDG = 'LDG',
  LOI = 'LOI',
  LV = 'LV',
  MARX = 'MARX',
  MDM = 'MDM',
  MIDS = 'MIDS',
  OTHER_NEW_PROCESS = 'OTHER_NEW_PROCESS',
  OUTLOOK_MAILBOX = 'OUTLOOK_MAILBOX',
  POST_PORTAL = 'POST_PORTAL',
  QV = 'QV',
  RFA = 'RFA',
  RMADA = 'RMADA',
  SHARED_SYSTEMS = 'SHARED_SYSTEMS'
}

export type OperationalSolutionSubtask = {
  __typename: 'OperationalSolutionSubtask';
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

export enum ParticipantCommunicationType {
  IT_TOOL = 'IT_TOOL',
  MASS_EMAIL = 'MASS_EMAIL',
  NO_COMMUNICATION = 'NO_COMMUNICATION',
  OTHER = 'OTHER'
}

export enum ParticipantRiskType {
  CAPITATION = 'CAPITATION',
  NOT_RISK_BASED = 'NOT_RISK_BASED',
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
  ACCOUNTABLE_CARE_ORGANIZATION = 'ACCOUNTABLE_CARE_ORGANIZATION',
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
  __typename: 'PlanBasics';
  additionalModelCategories: Array<ModelCategory>;
  amsModelID?: Maybe<Scalars['String']['output']>;
  announced?: Maybe<Scalars['Time']['output']>;
  applicationsEnd?: Maybe<Scalars['Time']['output']>;
  applicationsStart?: Maybe<Scalars['Time']['output']>;
  clearanceEnds?: Maybe<Scalars['Time']['output']>;
  clearanceStarts?: Maybe<Scalars['Time']['output']>;
  cmmiGroups: Array<CmmiGroup>;
  cmsCenters: Array<CmsCenter>;
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
  modelType: Array<ModelType>;
  modelTypeOther?: Maybe<Scalars['String']['output']>;
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
  completeICIP?: InputMaybe<Scalars['Time']['input']>;
  demoCode?: InputMaybe<Scalars['String']['input']>;
  goal?: InputMaybe<Scalars['String']['input']>;
  highLevelNote?: InputMaybe<Scalars['String']['input']>;
  modelCategory?: InputMaybe<ModelCategory>;
  modelType?: InputMaybe<Array<ModelType>>;
  modelTypeOther?: InputMaybe<Scalars['String']['input']>;
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
  __typename: 'PlanBeneficiaries';
  beneficiaries: Array<BeneficiariesType>;
  beneficiariesNote?: Maybe<Scalars['String']['output']>;
  beneficiariesOther?: Maybe<Scalars['String']['output']>;
  beneficiaryOverlap?: Maybe<OverlapType>;
  beneficiaryOverlapNote?: Maybe<Scalars['String']['output']>;
  beneficiaryRemovalFrequency: Array<FrequencyType>;
  beneficiaryRemovalFrequencyContinually?: Maybe<Scalars['String']['output']>;
  beneficiaryRemovalFrequencyNote?: Maybe<Scalars['String']['output']>;
  beneficiaryRemovalFrequencyOther?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionFrequency: Array<FrequencyType>;
  beneficiarySelectionFrequencyContinually?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionFrequencyNote?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionFrequencyOther?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionMethod: Array<SelectionMethodType>;
  beneficiarySelectionNote?: Maybe<Scalars['String']['output']>;
  beneficiarySelectionOther?: Maybe<Scalars['String']['output']>;
  confidenceNote?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  diseaseSpecificGroup?: Maybe<Scalars['String']['output']>;
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
  precedenceRules: Array<YesNoType>;
  precedenceRulesNo?: Maybe<Scalars['String']['output']>;
  precedenceRulesNote?: Maybe<Scalars['String']['output']>;
  precedenceRulesYes?: Maybe<Scalars['String']['output']>;
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
  beneficiaryRemovalFrequency?: InputMaybe<Array<FrequencyType>>;
  beneficiaryRemovalFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  beneficiaryRemovalFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  beneficiaryRemovalFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionFrequency?: InputMaybe<Array<FrequencyType>>;
  beneficiarySelectionFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionMethod?: InputMaybe<Array<SelectionMethodType>>;
  beneficiarySelectionNote?: InputMaybe<Scalars['String']['input']>;
  beneficiarySelectionOther?: InputMaybe<Scalars['String']['input']>;
  confidenceNote?: InputMaybe<Scalars['String']['input']>;
  diseaseSpecificGroup?: InputMaybe<Scalars['String']['input']>;
  estimateConfidence?: InputMaybe<ConfidenceType>;
  excludeCertainCharacteristics?: InputMaybe<TriStateAnswer>;
  excludeCertainCharacteristicsCriteria?: InputMaybe<Scalars['String']['input']>;
  excludeCertainCharacteristicsNote?: InputMaybe<Scalars['String']['input']>;
  numberPeopleImpacted?: InputMaybe<Scalars['Int']['input']>;
  precedenceRules?: InputMaybe<Array<YesNoType>>;
  precedenceRulesNo?: InputMaybe<Scalars['String']['input']>;
  precedenceRulesNote?: InputMaybe<Scalars['String']['input']>;
  precedenceRulesYes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TaskStatusInput>;
  treatDualElligibleDifferent?: InputMaybe<TriStateAnswer>;
  treatDualElligibleDifferentHow?: InputMaybe<Scalars['String']['input']>;
  treatDualElligibleDifferentNote?: InputMaybe<Scalars['String']['input']>;
};

export type PlanCr = {
  __typename: 'PlanCR';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  dateImplemented?: Maybe<Scalars['Time']['output']>;
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

export type PlanCrChanges = {
  dateImplemented?: InputMaybe<Scalars['Time']['input']>;
  dateInitiated?: InputMaybe<Scalars['Time']['input']>;
  idNumber?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PlanCrCreateInput = {
  dateImplemented: Scalars['Time']['input'];
  dateInitiated: Scalars['Time']['input'];
  idNumber: Scalars['String']['input'];
  modelPlanID: Scalars['UUID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

/** PlanCollaborator represents a collaborator on a plan */
export type PlanCollaborator = {
  __typename: 'PlanCollaborator';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  teamRoles: Array<TeamRole>;
  userAccount: UserAccount;
  userID: Scalars['UUID']['output'];
};

/** PlanCollaboratorCreateInput represents the data required to create a collaborator on a plan */
export type PlanCollaboratorCreateInput = {
  modelPlanID: Scalars['UUID']['input'];
  teamRoles: Array<TeamRole>;
  userName: Scalars['String']['input'];
};

/** PlanDiscussion represents plan discussion */
export type PlanDiscussion = {
  __typename: 'PlanDiscussion';
  content?: Maybe<TaggedContent>;
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

/** PlanDiscussionCreateInput represents the necessary fields to create a plan discussion */
export type PlanDiscussionCreateInput = {
  content: Scalars['TaggedHTML']['input'];
  modelPlanID: Scalars['UUID']['input'];
  userRole?: InputMaybe<DiscussionUserRole>;
  userRoleDescription?: InputMaybe<Scalars['String']['input']>;
};

/** PlanDocument represents a document on a plan */
export type PlanDocument = {
  __typename: 'PlanDocument';
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
  __typename: 'PlanDocumentSolutionLink';
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
  __typename: 'PlanFavorite';
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
  __typename: 'PlanGeneralCharacteristics';
  additionalServicesInvolved?: Maybe<Scalars['Boolean']['output']>;
  additionalServicesInvolvedDescription?: Maybe<Scalars['String']['output']>;
  additionalServicesInvolvedNote?: Maybe<Scalars['String']['output']>;
  agencyOrStateHelp: Array<AgencyOrStateHelpType>;
  agencyOrStateHelpNote?: Maybe<Scalars['String']['output']>;
  agencyOrStateHelpOther?: Maybe<Scalars['String']['output']>;
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
  currentModelPlan?: Maybe<ModelPlan>;
  currentModelPlanID?: Maybe<Scalars['UUID']['output']>;
  existingModel?: Maybe<Scalars['String']['output']>;
  existingModelID?: Maybe<Scalars['Int']['output']>;
  existingModelPlan?: Maybe<ExistingModel>;
  geographiesRegionTypes: Array<GeographyRegionType>;
  geographiesStatesAndTerritories: Array<StatesAndTerritories>;
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
  /** For answering if participation in other models is a precondition for participating in this model */
  participationInModelPrecondition?: Maybe<YesNoOtherType>;
  /** A note field for participationInModelPrecondition */
  participationInModelPreconditionNote?: Maybe<Scalars['String']['output']>;
  /** For denoting the name of the other existing model */
  participationInModelPreconditionOtherOption?: Maybe<Scalars['String']['output']>;
  /** For denoting if there is an other model that this model refers to. */
  participationInModelPreconditionOtherSelected?: Maybe<Scalars['Boolean']['output']>;
  /** For providing clarifying comments if Other is selected for participationInModelPrecondition */
  participationInModelPreconditionOtherSpecify?: Maybe<Scalars['String']['output']>;
  /** The collection of existing model links relevant to the participationInModelPrecondition question */
  participationInModelPreconditionWhich?: Maybe<ExistingModelLinks>;
  /** For providing clarifying comments if Yes or No is selected for participationInModelPrecondition */
  participationInModelPreconditionWhyHow?: Maybe<Scalars['String']['output']>;
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
  resemblesExistingModel?: Maybe<YesNoOtherType>;
  resemblesExistingModelHow?: Maybe<Scalars['String']['output']>;
  resemblesExistingModelNote?: Maybe<Scalars['String']['output']>;
  /** For denoting the name of the other existing model that this model resembles */
  resemblesExistingModelOtherOption?: Maybe<Scalars['String']['output']>;
  /** For denoting if there is an other model that this model resembles if it's true that it resembles existing models. */
  resemblesExistingModelOtherSelected?: Maybe<Scalars['Boolean']['output']>;
  /** For providing clarifying comments if Other is selected for resemblesExistingModel */
  resemblesExistingModelOtherSpecify?: Maybe<Scalars['String']['output']>;
  resemblesExistingModelWhich?: Maybe<ExistingModelLinks>;
  /** For providing clarifying comments if Yes or No is selected for resemblesExistingModel */
  resemblesExistingModelWhyHow?: Maybe<Scalars['String']['output']>;
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
  agencyOrStateHelp?: InputMaybe<Array<AgencyOrStateHelpType>>;
  agencyOrStateHelpNote?: InputMaybe<Scalars['String']['input']>;
  agencyOrStateHelpOther?: InputMaybe<Scalars['String']['input']>;
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
  currentModelPlanID?: InputMaybe<Scalars['UUID']['input']>;
  existingModelID?: InputMaybe<Scalars['Int']['input']>;
  geographiesRegionTypes?: InputMaybe<Array<GeographyRegionType>>;
  geographiesStatesAndTerritories?: InputMaybe<Array<StatesAndTerritories>>;
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
  /** For answering if participation in other models is a precondition for participating in this model */
  participationInModelPrecondition?: InputMaybe<YesNoOtherType>;
  /** A note field for participationInModelPrecondition */
  participationInModelPreconditionNote?: InputMaybe<Scalars['String']['input']>;
  /** For denoting the name of the other existing model */
  participationInModelPreconditionOtherOption?: InputMaybe<Scalars['String']['input']>;
  /** For denoting if there is an other model that this model refers to. */
  participationInModelPreconditionOtherSelected?: InputMaybe<Scalars['Boolean']['input']>;
  /** For providing clarifying comments if Other is selected for participationInModelPrecondition */
  participationInModelPreconditionOtherSpecify?: InputMaybe<Scalars['String']['input']>;
  /** For providing clarifying comments if Yes or No is selected for participationInModelPrecondition */
  participationInModelPreconditionWhyHow?: InputMaybe<Scalars['String']['input']>;
  participationOptions?: InputMaybe<Scalars['Boolean']['input']>;
  participationOptionsNote?: InputMaybe<Scalars['String']['input']>;
  planContractUpdated?: InputMaybe<Scalars['Boolean']['input']>;
  planContractUpdatedNote?: InputMaybe<Scalars['String']['input']>;
  resemblesExistingModel?: InputMaybe<YesNoOtherType>;
  resemblesExistingModelHow?: InputMaybe<Scalars['String']['input']>;
  resemblesExistingModelNote?: InputMaybe<Scalars['String']['input']>;
  /** For denoting the name of the other existing model that this model resembles */
  resemblesExistingModelOtherOption?: InputMaybe<Scalars['String']['input']>;
  /** For denoting if there is an other model that this model resembles if it's true that it resembles existing models. */
  resemblesExistingModelOtherSelected?: InputMaybe<Scalars['Boolean']['input']>;
  /** For providing clarifying comments if Other is selected for resemblesExistingModel */
  resemblesExistingModelOtherSpecify?: InputMaybe<Scalars['String']['input']>;
  /** For providing clarifying comments if Yes or No is selected for resemblesExistingModel */
  resemblesExistingModelWhyHow?: InputMaybe<Scalars['String']['input']>;
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
  __typename: 'PlanOpsEvalAndLearning';
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
  dataCollectionFrequency: Array<FrequencyType>;
  dataCollectionFrequencyContinually?: Maybe<Scalars['String']['output']>;
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
  dataSharingFrequency: Array<FrequencyType>;
  dataSharingFrequencyContinually?: Maybe<Scalars['String']['output']>;
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
  qualityPerformanceImpactsPayment?: Maybe<YesNoOtherType>;
  qualityPerformanceImpactsPaymentNote?: Maybe<Scalars['String']['output']>;
  qualityPerformanceImpactsPaymentOther?: Maybe<Scalars['String']['output']>;
  qualityReportingFrequency: Array<FrequencyType>;
  qualityReportingFrequencyContinually?: Maybe<Scalars['String']['output']>;
  qualityReportingFrequencyOther?: Maybe<Scalars['String']['output']>;
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
  dataCollectionFrequency?: InputMaybe<Array<FrequencyType>>;
  dataCollectionFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
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
  dataSharingFrequency?: InputMaybe<Array<FrequencyType>>;
  dataSharingFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
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
  qualityPerformanceImpactsPayment?: InputMaybe<YesNoOtherType>;
  qualityPerformanceImpactsPaymentNote?: InputMaybe<Scalars['String']['input']>;
  qualityPerformanceImpactsPaymentOther?: InputMaybe<Scalars['String']['input']>;
  qualityReportingFrequency?: InputMaybe<Array<FrequencyType>>;
  qualityReportingFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  qualityReportingFrequencyOther?: InputMaybe<Scalars['String']['input']>;
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
  __typename: 'PlanParticipantsAndProviders';
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
  gainsharePaymentsEligibility: Array<GainshareArrangementEligibility>;
  gainsharePaymentsEligibilityOther?: Maybe<Scalars['String']['output']>;
  gainsharePaymentsNote?: Maybe<Scalars['String']['output']>;
  gainsharePaymentsTrack?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['UUID']['output'];
  medicareProviderType?: Maybe<Scalars['String']['output']>;
  modelApplicationLevel?: Maybe<Scalars['String']['output']>;
  modelPlanID: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  participantAddedFrequency: Array<FrequencyType>;
  participantAddedFrequencyContinually?: Maybe<Scalars['String']['output']>;
  participantAddedFrequencyNote?: Maybe<Scalars['String']['output']>;
  participantAddedFrequencyOther?: Maybe<Scalars['String']['output']>;
  participantRemovedFrequency: Array<FrequencyType>;
  participantRemovedFrequencyContinually?: Maybe<Scalars['String']['output']>;
  participantRemovedFrequencyNote?: Maybe<Scalars['String']['output']>;
  participantRemovedFrequencyOther?: Maybe<Scalars['String']['output']>;
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
  providerAdditionFrequency: Array<FrequencyType>;
  providerAdditionFrequencyContinually?: Maybe<Scalars['String']['output']>;
  providerAdditionFrequencyNote?: Maybe<Scalars['String']['output']>;
  providerAdditionFrequencyOther?: Maybe<Scalars['String']['output']>;
  providerLeaveMethod: Array<ProviderLeaveType>;
  providerLeaveMethodNote?: Maybe<Scalars['String']['output']>;
  providerLeaveMethodOther?: Maybe<Scalars['String']['output']>;
  providerOverlap?: Maybe<OverlapType>;
  providerOverlapHierarchy?: Maybe<Scalars['String']['output']>;
  providerOverlapNote?: Maybe<Scalars['String']['output']>;
  providerRemovalFrequency: Array<FrequencyType>;
  providerRemovalFrequencyContinually?: Maybe<Scalars['String']['output']>;
  providerRemovalFrequencyNote?: Maybe<Scalars['String']['output']>;
  providerRemovalFrequencyOther?: Maybe<Scalars['String']['output']>;
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
  riskType: Array<ParticipantRiskType>;
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
  gainsharePaymentsEligibility?: InputMaybe<Array<GainshareArrangementEligibility>>;
  gainsharePaymentsEligibilityOther?: InputMaybe<Scalars['String']['input']>;
  gainsharePaymentsNote?: InputMaybe<Scalars['String']['input']>;
  gainsharePaymentsTrack?: InputMaybe<Scalars['Boolean']['input']>;
  medicareProviderType?: InputMaybe<Scalars['String']['input']>;
  modelApplicationLevel?: InputMaybe<Scalars['String']['input']>;
  participantAddedFrequency?: InputMaybe<Array<FrequencyType>>;
  participantAddedFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  participantAddedFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  participantAddedFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  participantRemovedFrequency?: InputMaybe<Array<FrequencyType>>;
  participantRemovedFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  participantRemovedFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  participantRemovedFrequencyOther?: InputMaybe<Scalars['String']['input']>;
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
  providerAdditionFrequency?: InputMaybe<Array<FrequencyType>>;
  providerAdditionFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  providerAdditionFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  providerAdditionFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  providerLeaveMethod?: InputMaybe<Array<ProviderLeaveType>>;
  providerLeaveMethodNote?: InputMaybe<Scalars['String']['input']>;
  providerLeaveMethodOther?: InputMaybe<Scalars['String']['input']>;
  providerOverlap?: InputMaybe<OverlapType>;
  providerOverlapHierarchy?: InputMaybe<Scalars['String']['input']>;
  providerOverlapNote?: InputMaybe<Scalars['String']['input']>;
  providerRemovalFrequency?: InputMaybe<Array<FrequencyType>>;
  providerRemovalFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  providerRemovalFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  providerRemovalFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  recruitmentMethod?: InputMaybe<RecruitmentType>;
  recruitmentNote?: InputMaybe<Scalars['String']['input']>;
  recruitmentOther?: InputMaybe<Scalars['String']['input']>;
  riskNote?: InputMaybe<Scalars['String']['input']>;
  riskOther?: InputMaybe<Scalars['String']['input']>;
  riskType?: InputMaybe<Array<ParticipantRiskType>>;
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
  __typename: 'PlanPayments';
  affectsMedicareSecondaryPayerClaims?: Maybe<Scalars['Boolean']['output']>;
  affectsMedicareSecondaryPayerClaimsHow?: Maybe<Scalars['String']['output']>;
  affectsMedicareSecondaryPayerClaimsNote?: Maybe<Scalars['String']['output']>;
  anticipateReconcilingPaymentsRetrospectively?: Maybe<Scalars['Boolean']['output']>;
  anticipateReconcilingPaymentsRetrospectivelyNote?: Maybe<Scalars['String']['output']>;
  anticipatedPaymentFrequency: Array<FrequencyType>;
  anticipatedPaymentFrequencyContinually?: Maybe<Scalars['String']['output']>;
  anticipatedPaymentFrequencyNote?: Maybe<Scalars['String']['output']>;
  anticipatedPaymentFrequencyOther?: Maybe<Scalars['String']['output']>;
  beneficiaryCostSharingLevelAndHandling?: Maybe<Scalars['String']['output']>;
  canParticipantsSelectBetweenPaymentMechanisms?: Maybe<Scalars['Boolean']['output']>;
  canParticipantsSelectBetweenPaymentMechanismsHow?: Maybe<Scalars['String']['output']>;
  canParticipantsSelectBetweenPaymentMechanismsNote?: Maybe<Scalars['String']['output']>;
  changesMedicarePhysicianFeeSchedule?: Maybe<Scalars['Boolean']['output']>;
  changesMedicarePhysicianFeeScheduleNote?: Maybe<Scalars['String']['output']>;
  claimsProcessingPrecedence?: Maybe<Scalars['Boolean']['output']>;
  claimsProcessingPrecedenceNote?: Maybe<Scalars['String']['output']>;
  claimsProcessingPrecedenceOther?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  creatingDependenciesBetweenServices?: Maybe<Scalars['Boolean']['output']>;
  creatingDependenciesBetweenServicesNote?: Maybe<Scalars['String']['output']>;
  expectedCalculationComplexityLevel?: Maybe<ComplexityCalculationLevelType>;
  expectedCalculationComplexityLevelNote?: Maybe<Scalars['String']['output']>;
  fundingSource: Array<FundingSource>;
  fundingSourceMedicareAInfo?: Maybe<Scalars['String']['output']>;
  fundingSourceMedicareBInfo?: Maybe<Scalars['String']['output']>;
  fundingSourceNote?: Maybe<Scalars['String']['output']>;
  fundingSourceOther?: Maybe<Scalars['String']['output']>;
  fundingSourceR: Array<FundingSource>;
  fundingSourceRMedicareAInfo?: Maybe<Scalars['String']['output']>;
  fundingSourceRMedicareBInfo?: Maybe<Scalars['String']['output']>;
  fundingSourceRNote?: Maybe<Scalars['String']['output']>;
  fundingSourceROther?: Maybe<Scalars['String']['output']>;
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
  paymentDemandRecoupmentFrequency: Array<FrequencyType>;
  paymentDemandRecoupmentFrequencyContinually?: Maybe<Scalars['String']['output']>;
  paymentDemandRecoupmentFrequencyNote?: Maybe<Scalars['String']['output']>;
  paymentDemandRecoupmentFrequencyOther?: Maybe<Scalars['String']['output']>;
  paymentReconciliationFrequency: Array<FrequencyType>;
  paymentReconciliationFrequencyContinually?: Maybe<Scalars['String']['output']>;
  paymentReconciliationFrequencyNote?: Maybe<Scalars['String']['output']>;
  paymentReconciliationFrequencyOther?: Maybe<Scalars['String']['output']>;
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
  anticipatedPaymentFrequency?: InputMaybe<Array<FrequencyType>>;
  anticipatedPaymentFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  anticipatedPaymentFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  anticipatedPaymentFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  beneficiaryCostSharingLevelAndHandling?: InputMaybe<Scalars['String']['input']>;
  canParticipantsSelectBetweenPaymentMechanisms?: InputMaybe<Scalars['Boolean']['input']>;
  canParticipantsSelectBetweenPaymentMechanismsHow?: InputMaybe<Scalars['String']['input']>;
  canParticipantsSelectBetweenPaymentMechanismsNote?: InputMaybe<Scalars['String']['input']>;
  changesMedicarePhysicianFeeSchedule?: InputMaybe<Scalars['Boolean']['input']>;
  changesMedicarePhysicianFeeScheduleNote?: InputMaybe<Scalars['String']['input']>;
  claimsProcessingPrecedence?: InputMaybe<Scalars['Boolean']['input']>;
  claimsProcessingPrecedenceNote?: InputMaybe<Scalars['String']['input']>;
  claimsProcessingPrecedenceOther?: InputMaybe<Scalars['String']['input']>;
  creatingDependenciesBetweenServices?: InputMaybe<Scalars['Boolean']['input']>;
  creatingDependenciesBetweenServicesNote?: InputMaybe<Scalars['String']['input']>;
  expectedCalculationComplexityLevel?: InputMaybe<ComplexityCalculationLevelType>;
  expectedCalculationComplexityLevelNote?: InputMaybe<Scalars['String']['input']>;
  fundingSource?: InputMaybe<Array<FundingSource>>;
  fundingSourceMedicareAInfo?: InputMaybe<Scalars['String']['input']>;
  fundingSourceMedicareBInfo?: InputMaybe<Scalars['String']['input']>;
  fundingSourceNote?: InputMaybe<Scalars['String']['input']>;
  fundingSourceOther?: InputMaybe<Scalars['String']['input']>;
  fundingSourceR?: InputMaybe<Array<FundingSource>>;
  fundingSourceRMedicareAInfo?: InputMaybe<Scalars['String']['input']>;
  fundingSourceRMedicareBInfo?: InputMaybe<Scalars['String']['input']>;
  fundingSourceRNote?: InputMaybe<Scalars['String']['input']>;
  fundingSourceROther?: InputMaybe<Scalars['String']['input']>;
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
  paymentDemandRecoupmentFrequency?: InputMaybe<Array<FrequencyType>>;
  paymentDemandRecoupmentFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  paymentDemandRecoupmentFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  paymentDemandRecoupmentFrequencyOther?: InputMaybe<Scalars['String']['input']>;
  paymentReconciliationFrequency?: InputMaybe<Array<FrequencyType>>;
  paymentReconciliationFrequencyContinually?: InputMaybe<Scalars['String']['input']>;
  paymentReconciliationFrequencyNote?: InputMaybe<Scalars['String']['input']>;
  paymentReconciliationFrequencyOther?: InputMaybe<Scalars['String']['input']>;
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

export type PlanTdl = {
  __typename: 'PlanTDL';
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

export type PlanTdlChanges = {
  dateInitiated?: InputMaybe<Scalars['Time']['input']>;
  idNumber?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PlanTdlCreateInput = {
  dateInitiated: Scalars['Time']['input'];
  idNumber: Scalars['String']['input'];
  modelPlanID: Scalars['UUID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type PossibleOperationalNeed = {
  __typename: 'PossibleOperationalNeed';
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
  __typename: 'PossibleOperationalSolution';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  filterView?: Maybe<ModelViewFilter>;
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
  __typename: 'PossibleOperationalSolutionContact';
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
  __typename: 'PrepareForClearance';
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
  __typename: 'Query';
  auditChanges: Array<AuditChange>;
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
  planCR: PlanCr;
  planCollaboratorByID: PlanCollaborator;
  planDocument: PlanDocument;
  planPayments: PlanPayments;
  planTDL: PlanTdl;
  possibleOperationalNeeds: Array<PossibleOperationalNeed>;
  possibleOperationalSolutions: Array<PossibleOperationalSolution>;
  searchOktaUsers: Array<UserInfo>;
  taskListSectionLocks: Array<TaskListSectionLockStatus>;
  userAccount: UserAccount;
  userNotificationPreferences: UserNotificationPreferences;
  userNotifications: UserNotifications;
};


/** Query definition for the schema */
export type QueryAuditChangesArgs = {
  primaryKey: Scalars['UUID']['input'];
  tableName: Scalars['String']['input'];
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
export type QueryPlanCrArgs = {
  id: Scalars['UUID']['input'];
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
export type QueryPlanTdlArgs = {
  id: Scalars['UUID']['input'];
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
  HELP_CENTER = 'HELP_CENTER',
  IT_SOLUTIONS = 'IT_SOLUTIONS',
  OTHER = 'OTHER',
  READ_VIEW = 'READ_VIEW',
  TASK_LIST = 'TASK_LIST'
}

export enum ReportAProblemSeverity {
  DELAYED_TASK = 'DELAYED_TASK',
  MINOR = 'MINOR',
  OTHER = 'OTHER',
  PREVENTED_TASK = 'PREVENTED_TASK'
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

export enum SatisfactionLevel {
  DISSATISFIED = 'DISSATISFIED',
  NEUTRAL = 'NEUTRAL',
  SATISFIED = 'SATISFIED',
  VERY_DISSATISFIED = 'VERY_DISSATISFIED',
  VERY_SATISFIED = 'VERY_SATISFIED'
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

export enum StatesAndTerritories {
  AK = 'AK',
  AL = 'AL',
  AR = 'AR',
  AS = 'AS',
  AZ = 'AZ',
  CA = 'CA',
  CO = 'CO',
  CT = 'CT',
  DC = 'DC',
  DE = 'DE',
  FL = 'FL',
  GA = 'GA',
  GU = 'GU',
  HI = 'HI',
  IA = 'IA',
  ID = 'ID',
  IL = 'IL',
  IN = 'IN',
  KS = 'KS',
  KY = 'KY',
  LA = 'LA',
  MA = 'MA',
  MD = 'MD',
  ME = 'ME',
  MI = 'MI',
  MN = 'MN',
  MO = 'MO',
  MP = 'MP',
  MS = 'MS',
  MT = 'MT',
  NC = 'NC',
  ND = 'ND',
  NE = 'NE',
  NH = 'NH',
  NJ = 'NJ',
  NM = 'NM',
  NV = 'NV',
  NY = 'NY',
  OH = 'OH',
  OK = 'OK',
  OR = 'OR',
  PA = 'PA',
  PR = 'PR',
  RI = 'RI',
  SC = 'SC',
  SD = 'SD',
  TN = 'TN',
  TX = 'TX',
  UM = 'UM',
  UT = 'UT',
  VA = 'VA',
  VI = 'VI',
  VT = 'VT',
  WA = 'WA',
  WI = 'WI',
  WV = 'WV',
  WY = 'WY'
}

export type Subscription = {
  __typename: 'Subscription';
  onLockTaskListSectionContext: TaskListSectionLockStatusChanged;
  onTaskListSectionLocksChanged: TaskListSectionLockStatusChanged;
};


export type SubscriptionOnLockTaskListSectionContextArgs = {
  modelPlanID: Scalars['UUID']['input'];
};


export type SubscriptionOnTaskListSectionLocksChangedArgs = {
  modelPlanID: Scalars['UUID']['input'];
};

/** Tag represents an entity tagged in the database */
export type Tag = {
  __typename: 'Tag';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  entity?: Maybe<TaggedEntity>;
  entityIntID?: Maybe<Scalars['Int']['output']>;
  entityUUID?: Maybe<Scalars['UUID']['output']>;
  id: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  tagType: TagType;
  taggedContentID: Scalars['UUID']['output'];
  taggedContentTable: Scalars['String']['output'];
  taggedField: Scalars['String']['output'];
};

export enum TagType {
  POSSIBLE_SOLUTION = 'POSSIBLE_SOLUTION',
  USER_ACCOUNT = 'USER_ACCOUNT'
}

/** TaggedContent represents content that has a tag in it. It is composed of the raw tag text, as well as the array of possible tags */
export type TaggedContent = {
  __typename: 'TaggedContent';
  /** RawContent is HTML. It is sanitized on the backend */
  rawContent: Scalars['String']['output'];
  tags: Array<Tag>;
};

/** TaggedEntity is the actual object represented by a tag in the data base. */
export type TaggedEntity = PossibleOperationalSolution | UserAccount;

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
  __typename: 'TaskListSectionLockStatus';
  isAssessment: Scalars['Boolean']['output'];
  lockedByUserAccount: UserAccount;
  modelPlanID: Scalars['UUID']['output'];
  section: TaskListSection;
};

export type TaskListSectionLockStatusChanged = {
  __typename: 'TaskListSectionLockStatusChanged';
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
  CM_FFS_COUNTERPART = 'CM_FFS_COUNTERPART',
  COR = 'COR',
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

export type UpdateOperationalSolutionSubtaskChangesInput = {
  name: Scalars['String']['input'];
  status: OperationalSolutionSubtaskStatus;
};

export type UpdateOperationalSolutionSubtaskInput = {
  changes: UpdateOperationalSolutionSubtaskChangesInput;
  id: Scalars['UUID']['input'];
};

export type UserAccount = {
  __typename: 'UserAccount';
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
  __typename: 'UserInfo';
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

/** UserNotification represents a notification about a specific Activity */
export type UserNotification = {
  __typename: 'UserNotification';
  activity: Activity;
  activityID: Scalars['UUID']['output'];
  content: UserNotificationContent;
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  id: Scalars['UUID']['output'];
  isRead: Scalars['Boolean']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  userID: Scalars['UUID']['output'];
};

/** User Notification Content represents the possible data associated with a User Notification */
export type UserNotificationContent = DiscussionReply | PlanDiscussion;

/** UserNotificationPreferences represents a users preferences about what type and where to receive a notification */
export type UserNotificationPreferences = {
  __typename: 'UserNotificationPreferences';
  createdBy: Scalars['UUID']['output'];
  createdByUserAccount: UserAccount;
  createdDts: Scalars['Time']['output'];
  dailyDigestEmail: Scalars['Boolean']['output'];
  dailyDigestInApp: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  modifiedBy?: Maybe<Scalars['UUID']['output']>;
  modifiedByUserAccount?: Maybe<UserAccount>;
  modifiedDts?: Maybe<Scalars['Time']['output']>;
  newDiscussionReplyEmail: Scalars['Boolean']['output'];
  newDiscussionReplyInApp: Scalars['Boolean']['output'];
  newPlanDiscussionEmail: Scalars['Boolean']['output'];
  newPlanDiscussionInApp: Scalars['Boolean']['output'];
  userID: Scalars['UUID']['output'];
};

/** This is a wrapper for all information for a user  */
export type UserNotifications = {
  __typename: 'UserNotifications';
  /** This includes all notifications */
  notifications: Array<UserNotification>;
  /** This returns the number of unread notifications */
  numUnreadNotifications: Scalars['Int']['output'];
  /** This renders only the unread notifications */
  unreadNotifications: Array<UserNotification>;
};

export enum WaiverType {
  FRAUD_ABUSE = 'FRAUD_ABUSE',
  MEDICAID = 'MEDICAID',
  PROGRAM_PAYMENT = 'PROGRAM_PAYMENT'
}

export enum YesNoOtherType {
  NO = 'NO',
  OTHER = 'OTHER',
  YES = 'YES'
}

export enum YesNoType {
  NO = 'NO',
  YES = 'YES'
}

export type GetAllBasicsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAllBasicsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, nameHistory: Array<string>, basics: { __typename: 'PlanBasics', id: UUID, demoCode?: string | null, amsModelID?: string | null, modelCategory?: ModelCategory | null, additionalModelCategories: Array<ModelCategory>, cmsCenters: Array<CmsCenter>, cmmiGroups: Array<CmmiGroup>, modelType: Array<ModelType>, modelTypeOther?: string | null, problem?: string | null, goal?: string | null, testInterventions?: string | null, note?: string | null, completeICIP?: Time | null, clearanceStarts?: Time | null, clearanceEnds?: Time | null, announced?: Time | null, applicationsStart?: Time | null, applicationsEnd?: Time | null, performancePeriodStarts?: Time | null, performancePeriodEnds?: Time | null, wrapUpEnds?: Time | null, highLevelNote?: string | null, phasedIn?: boolean | null, phasedInNote?: string | null, status: TaskStatus } } };

export type GetBasicsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBasicsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, abbreviation?: string | null, nameHistory: Array<string>, basics: { __typename: 'PlanBasics', id: UUID, demoCode?: string | null, amsModelID?: string | null, modelCategory?: ModelCategory | null, additionalModelCategories: Array<ModelCategory>, cmsCenters: Array<CmsCenter>, cmmiGroups: Array<CmmiGroup> } } };

export type GetMilestonesQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetMilestonesQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, basics: { __typename: 'PlanBasics', id: UUID, completeICIP?: Time | null, clearanceStarts?: Time | null, clearanceEnds?: Time | null, announced?: Time | null, applicationsStart?: Time | null, applicationsEnd?: Time | null, performancePeriodStarts?: Time | null, performancePeriodEnds?: Time | null, highLevelNote?: string | null, wrapUpEnds?: Time | null, phasedIn?: boolean | null, phasedInNote?: string | null, readyForReviewDts?: Time | null, status: TaskStatus, readyForReviewByUserAccount?: { __typename: 'UserAccount', id: UUID, commonName: string } | null } } };

export type GetOverviewQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOverviewQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, basics: { __typename: 'PlanBasics', id: UUID, modelType: Array<ModelType>, modelTypeOther?: string | null, problem?: string | null, goal?: string | null, testInterventions?: string | null, note?: string | null } } };

export type UpdateBasicsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanBasicsChanges;
}>;


export type UpdateBasicsMutation = { __typename: 'Mutation', updatePlanBasics: { __typename: 'PlanBasics', id: UUID } };

export type UpdateModelPlanAndBasicsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: ModelPlanChanges;
  basicsId: Scalars['UUID']['input'];
  basicsChanges: PlanBasicsChanges;
}>;


export type UpdateModelPlanAndBasicsMutation = { __typename: 'Mutation', updateModelPlan: { __typename: 'ModelPlan', id: UUID }, updatePlanBasics: { __typename: 'PlanBasics', id: UUID } };

export type GetAllBeneficiariesQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAllBeneficiariesQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, beneficiaries: { __typename: 'PlanBeneficiaries', id: UUID, modelPlanID: UUID, beneficiaries: Array<BeneficiariesType>, diseaseSpecificGroup?: string | null, beneficiariesOther?: string | null, beneficiariesNote?: string | null, treatDualElligibleDifferent?: TriStateAnswer | null, treatDualElligibleDifferentHow?: string | null, treatDualElligibleDifferentNote?: string | null, excludeCertainCharacteristics?: TriStateAnswer | null, excludeCertainCharacteristicsCriteria?: string | null, excludeCertainCharacteristicsNote?: string | null, numberPeopleImpacted?: number | null, estimateConfidence?: ConfidenceType | null, confidenceNote?: string | null, beneficiarySelectionMethod: Array<SelectionMethodType>, beneficiarySelectionOther?: string | null, beneficiarySelectionNote?: string | null, beneficiarySelectionFrequency: Array<FrequencyType>, beneficiarySelectionFrequencyContinually?: string | null, beneficiarySelectionFrequencyOther?: string | null, beneficiarySelectionFrequencyNote?: string | null, beneficiaryRemovalFrequency: Array<FrequencyType>, beneficiaryRemovalFrequencyContinually?: string | null, beneficiaryRemovalFrequencyNote?: string | null, beneficiaryRemovalFrequencyOther?: string | null, beneficiaryOverlap?: OverlapType | null, beneficiaryOverlapNote?: string | null, precedenceRules: Array<YesNoType>, precedenceRulesYes?: string | null, precedenceRulesNo?: string | null, precedenceRulesNote?: string | null, status: TaskStatus } } };

export type GetBeneficiaryIdentificationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBeneficiaryIdentificationQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, beneficiaries: { __typename: 'PlanBeneficiaries', id: UUID, beneficiaries: Array<BeneficiariesType>, diseaseSpecificGroup?: string | null, beneficiariesOther?: string | null, beneficiariesNote?: string | null, treatDualElligibleDifferent?: TriStateAnswer | null, treatDualElligibleDifferentHow?: string | null, treatDualElligibleDifferentNote?: string | null, excludeCertainCharacteristics?: TriStateAnswer | null, excludeCertainCharacteristicsCriteria?: string | null, excludeCertainCharacteristicsNote?: string | null } } };

export type GetFrequencyQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetFrequencyQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, beneficiaries: { __typename: 'PlanBeneficiaries', id: UUID, beneficiarySelectionFrequency: Array<FrequencyType>, beneficiarySelectionFrequencyContinually?: string | null, beneficiarySelectionFrequencyNote?: string | null, beneficiarySelectionFrequencyOther?: string | null, beneficiaryRemovalFrequency: Array<FrequencyType>, beneficiaryRemovalFrequencyContinually?: string | null, beneficiaryRemovalFrequencyNote?: string | null, beneficiaryRemovalFrequencyOther?: string | null, beneficiaryOverlap?: OverlapType | null, beneficiaryOverlapNote?: string | null, precedenceRules: Array<YesNoType>, precedenceRulesYes?: string | null, precedenceRulesNo?: string | null, precedenceRulesNote?: string | null, readyForReviewDts?: Time | null, status: TaskStatus, readyForReviewByUserAccount?: { __typename: 'UserAccount', id: UUID, commonName: string } | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetPeopleImpactedQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetPeopleImpactedQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, beneficiaries: { __typename: 'PlanBeneficiaries', id: UUID, numberPeopleImpacted?: number | null, estimateConfidence?: ConfidenceType | null, confidenceNote?: string | null, beneficiarySelectionNote?: string | null, beneficiarySelectionOther?: string | null, beneficiarySelectionMethod: Array<SelectionMethodType> } } };

export type UpdateModelPlanBeneficiariesMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanBeneficiariesChanges;
}>;


export type UpdateModelPlanBeneficiariesMutation = { __typename: 'Mutation', updatePlanBeneficiaries: { __typename: 'PlanBeneficiaries', id: UUID } };

export type CreateCrMutationVariables = Exact<{
  input: PlanCrCreateInput;
}>;


export type CreateCrMutation = { __typename: 'Mutation', createPlanCR: { __typename: 'PlanCR', id: UUID, modelPlanID: UUID, idNumber: string, dateInitiated: Time, dateImplemented?: Time | null, title: string, note?: string | null } };

export type CreateTdlMutationVariables = Exact<{
  input: PlanTdlCreateInput;
}>;


export type CreateTdlMutation = { __typename: 'Mutation', createPlanTDL: { __typename: 'PlanTDL', id: UUID, modelPlanID: UUID, idNumber: string, dateInitiated: Time, title: string, note?: string | null } };

export type DeleteCrMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteCrMutation = { __typename: 'Mutation', deletePlanCR: { __typename: 'PlanCR', id: UUID, modelPlanID: UUID, idNumber: string, dateInitiated: Time, title: string, note?: string | null } };

export type DeleteTdlMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteTdlMutation = { __typename: 'Mutation', deletePlanTDL: { __typename: 'PlanTDL', id: UUID, modelPlanID: UUID, idNumber: string, dateInitiated: Time, title: string, note?: string | null } };

export type GetCrQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCrQuery = { __typename: 'Query', planCR: { __typename: 'PlanCR', id: UUID, title: string, idNumber: string, dateInitiated: Time, dateImplemented?: Time | null, note?: string | null } };

export type GetCrtdLsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCrtdLsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, isCollaborator: boolean, crs: Array<{ __typename: 'PlanCR', id: UUID, modelPlanID: UUID, title: string, idNumber: string, dateInitiated: Time, dateImplemented?: Time | null, note?: string | null }>, tdls: Array<{ __typename: 'PlanTDL', id: UUID, modelPlanID: UUID, title: string, idNumber: string, dateInitiated: Time, note?: string | null }> } };

export type GetTdlQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTdlQuery = { __typename: 'Query', planTDL: { __typename: 'PlanTDL', id: UUID, title: string, idNumber: string, dateInitiated: Time, note?: string | null } };

export type UpdateCrMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanCrChanges;
}>;


export type UpdateCrMutation = { __typename: 'Mutation', updatePlanCR: { __typename: 'PlanCR', id: UUID, modelPlanID: UUID, idNumber: string, dateInitiated: Time, dateImplemented?: Time | null, title: string, note?: string | null } };

export type UpdateTdlMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanTdlChanges;
}>;


export type UpdateTdlMutation = { __typename: 'Mutation', updatePlanTDL: { __typename: 'PlanTDL', id: UUID, modelPlanID: UUID, idNumber: string, dateInitiated: Time, title: string, note?: string | null } };

export type CreateModelPlanDiscussionMutationVariables = Exact<{
  input: PlanDiscussionCreateInput;
}>;


export type CreateModelPlanDiscussionMutation = { __typename: 'Mutation', createPlanDiscussion: { __typename: 'PlanDiscussion', id: UUID, createdBy: UUID, createdDts: Time, content?: { __typename: 'TaggedContent', rawContent: string } | null } };

export type GetModelPlanDiscussionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetModelPlanDiscussionsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, isCollaborator: boolean, discussions: Array<{ __typename: 'PlanDiscussion', id: UUID, createdBy: UUID, createdDts: Time, userRole?: DiscussionUserRole | null, userRoleDescription?: string | null, isAssessment: boolean, content?: { __typename: 'TaggedContent', rawContent: string } | null, createdByUserAccount: { __typename: 'UserAccount', commonName: string }, replies: Array<{ __typename: 'DiscussionReply', id: UUID, discussionID: UUID, userRole?: DiscussionUserRole | null, userRoleDescription?: string | null, isAssessment: boolean, createdBy: UUID, createdDts: Time, content?: { __typename: 'TaggedContent', rawContent: string } | null, createdByUserAccount: { __typename: 'UserAccount', commonName: string } }> }> } };

export type GetMostRecentRoleSelectionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMostRecentRoleSelectionQuery = { __typename: 'Query', mostRecentDiscussionRoleSelection?: { __typename: 'DiscussionRoleSelection', userRole: DiscussionUserRole, userRoleDescription?: string | null } | null };

export type LinkNewPlanDocumentMutationVariables = Exact<{
  input: PlanDocumentLinkInput;
}>;


export type LinkNewPlanDocumentMutation = { __typename: 'Mutation', linkNewPlanDocument: { __typename: 'PlanDocument', id: UUID } };

export type CreatReportAProblemMutationVariables = Exact<{
  input: ReportAProblemInput;
}>;


export type CreatReportAProblemMutation = { __typename: 'Mutation', reportAProblem: boolean };

export type CreatSendFeedbackMutationVariables = Exact<{
  input: SendFeedbackEmailInput;
}>;


export type CreatSendFeedbackMutation = { __typename: 'Mutation', sendFeedbackEmail: boolean };

export type ReadyForReviewUserFragmentFragment = { __typename: 'UserAccount', id: UUID, commonName: string };

export type GetAllGeneralCharacteristicsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAllGeneralCharacteristicsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, generalCharacteristics: { __typename: 'PlanGeneralCharacteristics', id: UUID, isNewModel?: boolean | null, existingModel?: string | null, resemblesExistingModel?: YesNoOtherType | null, resemblesExistingModelWhyHow?: string | null, resemblesExistingModelHow?: string | null, resemblesExistingModelNote?: string | null, resemblesExistingModelOtherSpecify?: string | null, resemblesExistingModelOtherSelected?: boolean | null, resemblesExistingModelOtherOption?: string | null, participationInModelPrecondition?: YesNoOtherType | null, participationInModelPreconditionOtherSpecify?: string | null, participationInModelPreconditionOtherSelected?: boolean | null, participationInModelPreconditionOtherOption?: string | null, participationInModelPreconditionWhyHow?: string | null, participationInModelPreconditionNote?: string | null, hasComponentsOrTracks?: boolean | null, hasComponentsOrTracksDiffer?: string | null, hasComponentsOrTracksNote?: string | null, agencyOrStateHelp: Array<AgencyOrStateHelpType>, agencyOrStateHelpOther?: string | null, agencyOrStateHelpNote?: string | null, alternativePaymentModelTypes: Array<AlternativePaymentModelType>, alternativePaymentModelNote?: string | null, keyCharacteristics: Array<KeyCharacteristic>, keyCharacteristicsOther?: string | null, keyCharacteristicsNote?: string | null, collectPlanBids?: boolean | null, collectPlanBidsNote?: string | null, managePartCDEnrollment?: boolean | null, managePartCDEnrollmentNote?: string | null, planContractUpdated?: boolean | null, planContractUpdatedNote?: string | null, careCoordinationInvolved?: boolean | null, careCoordinationInvolvedDescription?: string | null, careCoordinationInvolvedNote?: string | null, additionalServicesInvolved?: boolean | null, additionalServicesInvolvedDescription?: string | null, additionalServicesInvolvedNote?: string | null, communityPartnersInvolved?: boolean | null, communityPartnersInvolvedDescription?: string | null, communityPartnersInvolvedNote?: string | null, geographiesTargeted?: boolean | null, geographiesTargetedTypes: Array<GeographyType>, geographiesStatesAndTerritories: Array<StatesAndTerritories>, geographiesRegionTypes: Array<GeographyRegionType>, geographiesTargetedTypesOther?: string | null, geographiesTargetedAppliedTo: Array<GeographyApplication>, geographiesTargetedAppliedToOther?: string | null, geographiesTargetedNote?: string | null, participationOptions?: boolean | null, participationOptionsNote?: string | null, agreementTypes: Array<AgreementType>, agreementTypesOther?: string | null, multiplePatricipationAgreementsNeeded?: boolean | null, multiplePatricipationAgreementsNeededNote?: string | null, rulemakingRequired?: boolean | null, rulemakingRequiredDescription?: string | null, rulemakingRequiredNote?: string | null, authorityAllowances: Array<AuthorityAllowance>, authorityAllowancesOther?: string | null, authorityAllowancesNote?: string | null, waiversRequired?: boolean | null, waiversRequiredTypes: Array<WaiverType>, waiversRequiredNote?: string | null, status: TaskStatus, resemblesExistingModelWhich?: { __typename: 'ExistingModelLinks', names: Array<string> } | null, participationInModelPreconditionWhich?: { __typename: 'ExistingModelLinks', names: Array<string> } | null } } };

export type GetAuthorityQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAuthorityQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, generalCharacteristics: { __typename: 'PlanGeneralCharacteristics', id: UUID, rulemakingRequired?: boolean | null, rulemakingRequiredDescription?: string | null, rulemakingRequiredNote?: string | null, authorityAllowances: Array<AuthorityAllowance>, authorityAllowancesOther?: string | null, authorityAllowancesNote?: string | null, waiversRequired?: boolean | null, waiversRequiredTypes: Array<WaiverType>, waiversRequiredNote?: string | null, readyForReviewDts?: Time | null, status: TaskStatus, readyForReviewByUserAccount?: { __typename: 'UserAccount', id: UUID, commonName: string } | null } } };

export type GetGeneralCharacteristicsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetGeneralCharacteristicsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, generalCharacteristics: { __typename: 'PlanGeneralCharacteristics', id: UUID, isNewModel?: boolean | null, currentModelPlanID?: UUID | null, existingModelID?: number | null, resemblesExistingModel?: YesNoOtherType | null, resemblesExistingModelWhyHow?: string | null, resemblesExistingModelHow?: string | null, resemblesExistingModelNote?: string | null, resemblesExistingModelOtherSpecify?: string | null, resemblesExistingModelOtherSelected?: boolean | null, resemblesExistingModelOtherOption?: string | null, participationInModelPrecondition?: YesNoOtherType | null, participationInModelPreconditionOtherSpecify?: string | null, participationInModelPreconditionOtherSelected?: boolean | null, participationInModelPreconditionOtherOption?: string | null, participationInModelPreconditionWhyHow?: string | null, participationInModelPreconditionNote?: string | null, hasComponentsOrTracks?: boolean | null, hasComponentsOrTracksDiffer?: string | null, hasComponentsOrTracksNote?: string | null, resemblesExistingModelWhich?: { __typename: 'ExistingModelLinks', links: Array<{ __typename: 'ExistingModelLink', id?: UUID | null, existingModelID?: number | null, currentModelPlanID?: UUID | null }> } | null, participationInModelPreconditionWhich?: { __typename: 'ExistingModelLinks', links: Array<{ __typename: 'ExistingModelLink', id?: UUID | null, existingModelID?: number | null, currentModelPlanID?: UUID | null }> } | null } } };

export type GetInvolvementsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetInvolvementsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, generalCharacteristics: { __typename: 'PlanGeneralCharacteristics', id: UUID, careCoordinationInvolved?: boolean | null, careCoordinationInvolvedDescription?: string | null, careCoordinationInvolvedNote?: string | null, additionalServicesInvolved?: boolean | null, additionalServicesInvolvedDescription?: string | null, additionalServicesInvolvedNote?: string | null, communityPartnersInvolved?: boolean | null, communityPartnersInvolvedDescription?: string | null, communityPartnersInvolvedNote?: string | null } } };

export type GetKeyCharacteristicsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetKeyCharacteristicsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, generalCharacteristics: { __typename: 'PlanGeneralCharacteristics', id: UUID, agencyOrStateHelp: Array<AgencyOrStateHelpType>, agencyOrStateHelpOther?: string | null, agencyOrStateHelpNote?: string | null, alternativePaymentModelTypes: Array<AlternativePaymentModelType>, alternativePaymentModelNote?: string | null, keyCharacteristics: Array<KeyCharacteristic>, keyCharacteristicsNote?: string | null, keyCharacteristicsOther?: string | null, collectPlanBids?: boolean | null, collectPlanBidsNote?: string | null, managePartCDEnrollment?: boolean | null, managePartCDEnrollmentNote?: string | null, planContractUpdated?: boolean | null, planContractUpdatedNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetTargetsAndOptionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetTargetsAndOptionsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, generalCharacteristics: { __typename: 'PlanGeneralCharacteristics', id: UUID, geographiesTargeted?: boolean | null, geographiesTargetedTypes: Array<GeographyType>, geographiesStatesAndTerritories: Array<StatesAndTerritories>, geographiesRegionTypes: Array<GeographyRegionType>, geographiesTargetedTypesOther?: string | null, geographiesTargetedAppliedTo: Array<GeographyApplication>, geographiesTargetedAppliedToOther?: string | null, geographiesTargetedNote?: string | null, participationOptions?: boolean | null, participationOptionsNote?: string | null, agreementTypes: Array<AgreementType>, agreementTypesOther?: string | null, multiplePatricipationAgreementsNeeded?: boolean | null, multiplePatricipationAgreementsNeededNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type UpdateExistingModelLinksMutationVariables = Exact<{
  modelPlanID: Scalars['UUID']['input'];
  fieldName: ExisitingModelLinkFieldType;
  existingModelIDs?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  currentModelPlanIDs?: InputMaybe<Array<Scalars['UUID']['input']> | Scalars['UUID']['input']>;
}>;


export type UpdateExistingModelLinksMutation = { __typename: 'Mutation', updateExistingModelLinks: { __typename: 'ExistingModelLinks', links: Array<{ __typename: 'ExistingModelLink', id?: UUID | null, existingModelID?: number | null, model: { __typename: 'ExistingModel', modelName: string, stage: string, numberOfParticipants?: string | null, keywords?: string | null } | { __typename: 'ModelPlan', modelName: string, abbreviation?: string | null } }> } };

export type UpdatePlanGeneralCharacteristicsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanGeneralCharacteristicsChanges;
}>;


export type UpdatePlanGeneralCharacteristicsMutation = { __typename: 'Mutation', updatePlanGeneralCharacteristics: { __typename: 'PlanGeneralCharacteristics', id: UUID } };

export type GetExistingModelPlansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExistingModelPlansQuery = { __typename: 'Query', existingModelCollection: Array<{ __typename: 'ExistingModel', id?: number | null, modelName: string }> };

export type GetModelPlansBaseQueryVariables = Exact<{
  filter: ModelPlanFilter;
}>;


export type GetModelPlansBaseQuery = { __typename: 'Query', modelPlanCollection: Array<{ __typename: 'ModelPlan', id: UUID, modelName: string }> };

export type GetNdaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNdaQuery = { __typename: 'Query', ndaInfo: { __typename: 'NDAInfo', agreed: boolean, agreedDts?: Time | null } };

export type GetAllOpsEvalAndLearningQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAllOpsEvalAndLearningQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, modelPlanID: UUID, stakeholders: Array<StakeholdersType>, stakeholdersOther?: string | null, stakeholdersNote?: string | null, helpdeskUse?: boolean | null, helpdeskUseNote?: string | null, contractorSupport: Array<ContractorSupportType>, contractorSupportOther?: string | null, contractorSupportHow?: string | null, contractorSupportNote?: string | null, iddocSupport?: boolean | null, iddocSupportNote?: string | null, technicalContactsIdentified?: boolean | null, technicalContactsIdentifiedDetail?: string | null, technicalContactsIdentifiedNote?: string | null, captureParticipantInfo?: boolean | null, captureParticipantInfoNote?: string | null, icdOwner?: string | null, draftIcdDueDate?: Time | null, icdNote?: string | null, uatNeeds?: string | null, stcNeeds?: string | null, testingTimelines?: string | null, testingNote?: string | null, dataMonitoringFileTypes: Array<MonitoringFileType>, dataMonitoringFileOther?: string | null, dataResponseType?: string | null, dataResponseFileFrequency?: string | null, dataFullTimeOrIncremental?: DataFullTimeOrIncrementalType | null, eftSetUp?: boolean | null, unsolicitedAdjustmentsIncluded?: boolean | null, dataFlowDiagramsNeeded?: boolean | null, produceBenefitEnhancementFiles?: boolean | null, fileNamingConventions?: string | null, dataMonitoringNote?: string | null, benchmarkForPerformance?: BenchmarkForPerformanceType | null, benchmarkForPerformanceNote?: string | null, computePerformanceScores?: boolean | null, computePerformanceScoresNote?: string | null, riskAdjustPerformance?: boolean | null, riskAdjustFeedback?: boolean | null, riskAdjustPayments?: boolean | null, riskAdjustOther?: boolean | null, riskAdjustNote?: string | null, appealPerformance?: boolean | null, appealFeedback?: boolean | null, appealPayments?: boolean | null, appealOther?: boolean | null, appealNote?: string | null, evaluationApproaches: Array<EvaluationApproachType>, evaluationApproachOther?: string | null, evalutaionApproachNote?: string | null, ccmInvolvment: Array<CcmInvolvmentType>, ccmInvolvmentOther?: string | null, ccmInvolvmentNote?: string | null, dataNeededForMonitoring: Array<DataForMonitoringType>, dataNeededForMonitoringOther?: string | null, dataNeededForMonitoringNote?: string | null, dataToSendParticicipants: Array<DataToSendParticipantsType>, dataToSendParticicipantsOther?: string | null, dataToSendParticicipantsNote?: string | null, shareCclfData?: boolean | null, shareCclfDataNote?: string | null, sendFilesBetweenCcw?: boolean | null, sendFilesBetweenCcwNote?: string | null, appToSendFilesToKnown?: boolean | null, appToSendFilesToWhich?: string | null, appToSendFilesToNote?: string | null, useCcwForFileDistribiutionToParticipants?: boolean | null, useCcwForFileDistribiutionToParticipantsNote?: string | null, developNewQualityMeasures?: boolean | null, developNewQualityMeasuresNote?: string | null, qualityPerformanceImpactsPayment?: YesNoOtherType | null, qualityPerformanceImpactsPaymentOther?: string | null, qualityPerformanceImpactsPaymentNote?: string | null, dataSharingStarts?: DataStartsType | null, dataSharingStartsOther?: string | null, dataSharingFrequency: Array<FrequencyType>, dataSharingFrequencyContinually?: string | null, dataSharingFrequencyOther?: string | null, dataSharingStartsNote?: string | null, dataCollectionStarts?: DataStartsType | null, dataCollectionStartsOther?: string | null, dataCollectionFrequency: Array<FrequencyType>, dataCollectionFrequencyContinually?: string | null, dataCollectionFrequencyOther?: string | null, dataCollectionFrequencyNote?: string | null, qualityReportingStarts?: DataStartsType | null, qualityReportingStartsOther?: string | null, qualityReportingStartsNote?: string | null, qualityReportingFrequency: Array<FrequencyType>, qualityReportingFrequencyContinually?: string | null, qualityReportingFrequencyOther?: string | null, modelLearningSystems: Array<ModelLearningSystemType>, modelLearningSystemsOther?: string | null, modelLearningSystemsNote?: string | null, anticipatedChallenges?: string | null, status: TaskStatus } } };

export type GetCcwAndQualityQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCcwAndQualityQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, sendFilesBetweenCcw?: boolean | null, sendFilesBetweenCcwNote?: string | null, appToSendFilesToKnown?: boolean | null, appToSendFilesToWhich?: string | null, appToSendFilesToNote?: string | null, useCcwForFileDistribiutionToParticipants?: boolean | null, useCcwForFileDistribiutionToParticipantsNote?: string | null, developNewQualityMeasures?: boolean | null, developNewQualityMeasuresNote?: string | null, qualityPerformanceImpactsPayment?: YesNoOtherType | null, qualityPerformanceImpactsPaymentOther?: string | null, qualityPerformanceImpactsPaymentNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetDataSharingQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetDataSharingQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, dataSharingStarts?: DataStartsType | null, dataSharingStartsOther?: string | null, dataSharingFrequency: Array<FrequencyType>, dataSharingFrequencyContinually?: string | null, dataSharingFrequencyOther?: string | null, dataSharingStartsNote?: string | null, dataCollectionStarts?: DataStartsType | null, dataCollectionStartsOther?: string | null, dataCollectionFrequency: Array<FrequencyType>, dataCollectionFrequencyContinually?: string | null, dataCollectionFrequencyOther?: string | null, dataCollectionFrequencyNote?: string | null, qualityReportingStarts?: DataStartsType | null, qualityReportingStartsOther?: string | null, qualityReportingStartsNote?: string | null, qualityReportingFrequency: Array<FrequencyType>, qualityReportingFrequencyContinually?: string | null, qualityReportingFrequencyOther?: string | null } } };

export type GetEvaluationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetEvaluationQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, evaluationApproaches: Array<EvaluationApproachType>, evaluationApproachOther?: string | null, evalutaionApproachNote?: string | null, ccmInvolvmentOther?: string | null, ccmInvolvmentNote?: string | null, dataNeededForMonitoringOther?: string | null, dataNeededForMonitoringNote?: string | null, dataToSendParticicipants: Array<DataToSendParticipantsType>, dataToSendParticicipantsOther?: string | null, dataToSendParticicipantsNote?: string | null, shareCclfData?: boolean | null, shareCclfDataNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetIddocQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetIddocQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, technicalContactsIdentified?: boolean | null, technicalContactsIdentifiedDetail?: string | null, technicalContactsIdentifiedNote?: string | null, captureParticipantInfo?: boolean | null, captureParticipantInfoNote?: string | null, icdOwner?: string | null, draftIcdDueDate?: Time | null, icdNote?: string | null } } };

export type GetIddocMonitoringQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetIddocMonitoringQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, dataFullTimeOrIncremental?: DataFullTimeOrIncrementalType | null, eftSetUp?: boolean | null, unsolicitedAdjustmentsIncluded?: boolean | null, dataFlowDiagramsNeeded?: boolean | null, produceBenefitEnhancementFiles?: boolean | null, fileNamingConventions?: string | null, dataMonitoringNote?: string | null } } };

export type GetIddocTestingQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetIddocTestingQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, uatNeeds?: string | null, stcNeeds?: string | null, testingTimelines?: string | null, testingNote?: string | null, dataMonitoringFileTypes: Array<MonitoringFileType>, dataMonitoringFileOther?: string | null, dataResponseType?: string | null, dataResponseFileFrequency?: string | null } } };

export type GetLearningQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetLearningQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, modelLearningSystems: Array<ModelLearningSystemType>, modelLearningSystemsOther?: string | null, modelLearningSystemsNote?: string | null, anticipatedChallenges?: string | null, readyForReviewDts?: Time | null, status: TaskStatus, readyForReviewByUserAccount?: { __typename: 'UserAccount', id: UUID, commonName: string } | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetOpsEvalAndLearningQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOpsEvalAndLearningQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, stakeholders: Array<StakeholdersType>, stakeholdersOther?: string | null, stakeholdersNote?: string | null, helpdeskUse?: boolean | null, helpdeskUseNote?: string | null, contractorSupport: Array<ContractorSupportType>, contractorSupportOther?: string | null, contractorSupportHow?: string | null, contractorSupportNote?: string | null, iddocSupport?: boolean | null, iddocSupportNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetPerformanceQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetPerformanceQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, opsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID, ccmInvolvment: Array<CcmInvolvmentType>, dataNeededForMonitoring: Array<DataForMonitoringType>, iddocSupport?: boolean | null, benchmarkForPerformance?: BenchmarkForPerformanceType | null, benchmarkForPerformanceNote?: string | null, computePerformanceScores?: boolean | null, computePerformanceScoresNote?: string | null, riskAdjustPerformance?: boolean | null, riskAdjustFeedback?: boolean | null, riskAdjustPayments?: boolean | null, riskAdjustOther?: boolean | null, riskAdjustNote?: string | null, appealPerformance?: boolean | null, appealFeedback?: boolean | null, appealPayments?: boolean | null, appealOther?: boolean | null, appealNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type UpdatePlanOpsEvalAndLearningMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanOpsEvalAndLearningChanges;
}>;


export type UpdatePlanOpsEvalAndLearningMutation = { __typename: 'Mutation', updatePlanOpsEvalAndLearning: { __typename: 'PlanOpsEvalAndLearning', id: UUID } };

export type GetAllParticipantsAndProvidersQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAllParticipantsAndProvidersQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, participantsAndProviders: { __typename: 'PlanParticipantsAndProviders', id: UUID, participants: Array<ParticipantsType>, medicareProviderType?: string | null, statesEngagement?: string | null, participantsOther?: string | null, participantsNote?: string | null, participantsCurrentlyInModels?: boolean | null, participantsCurrentlyInModelsNote?: string | null, modelApplicationLevel?: string | null, expectedNumberOfParticipants?: number | null, estimateConfidence?: ConfidenceType | null, confidenceNote?: string | null, recruitmentMethod?: RecruitmentType | null, recruitmentOther?: string | null, recruitmentNote?: string | null, selectionMethod: Array<ParticipantSelectionType>, selectionOther?: string | null, selectionNote?: string | null, participantAddedFrequency: Array<FrequencyType>, participantAddedFrequencyContinually?: string | null, participantAddedFrequencyOther?: string | null, participantAddedFrequencyNote?: string | null, participantRemovedFrequency: Array<FrequencyType>, participantRemovedFrequencyContinually?: string | null, participantRemovedFrequencyOther?: string | null, participantRemovedFrequencyNote?: string | null, communicationMethod: Array<ParticipantCommunicationType>, communicationMethodOther?: string | null, communicationNote?: string | null, riskType: Array<ParticipantRiskType>, riskOther?: string | null, riskNote?: string | null, willRiskChange?: boolean | null, willRiskChangeNote?: string | null, coordinateWork?: boolean | null, coordinateWorkNote?: string | null, gainsharePayments?: boolean | null, gainsharePaymentsTrack?: boolean | null, gainsharePaymentsNote?: string | null, gainsharePaymentsEligibility: Array<GainshareArrangementEligibility>, gainsharePaymentsEligibilityOther?: string | null, participantsIds: Array<ParticipantsIdType>, participantsIdsOther?: string | null, participantsIDSNote?: string | null, providerAdditionFrequency: Array<FrequencyType>, providerAdditionFrequencyContinually?: string | null, providerAdditionFrequencyOther?: string | null, providerAdditionFrequencyNote?: string | null, providerAddMethod: Array<ProviderAddType>, providerAddMethodOther?: string | null, providerAddMethodNote?: string | null, providerLeaveMethod: Array<ProviderLeaveType>, providerLeaveMethodOther?: string | null, providerLeaveMethodNote?: string | null, providerRemovalFrequency: Array<FrequencyType>, providerRemovalFrequencyContinually?: string | null, providerRemovalFrequencyOther?: string | null, providerRemovalFrequencyNote?: string | null, providerOverlap?: OverlapType | null, providerOverlapHierarchy?: string | null, providerOverlapNote?: string | null, status: TaskStatus } } };

export type GetCommunicationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCommunicationQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, participantsAndProviders: { __typename: 'PlanParticipantsAndProviders', id: UUID, participantAddedFrequency: Array<FrequencyType>, participantAddedFrequencyContinually?: string | null, participantAddedFrequencyOther?: string | null, participantAddedFrequencyNote?: string | null, participantRemovedFrequency: Array<FrequencyType>, participantRemovedFrequencyContinually?: string | null, participantRemovedFrequencyOther?: string | null, participantRemovedFrequencyNote?: string | null, communicationMethod: Array<ParticipantCommunicationType>, communicationMethodOther?: string | null, communicationNote?: string | null, riskType: Array<ParticipantRiskType>, riskOther?: string | null, riskNote?: string | null, willRiskChange?: boolean | null, willRiskChangeNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetCoordinationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCoordinationQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, participantsAndProviders: { __typename: 'PlanParticipantsAndProviders', id: UUID, coordinateWork?: boolean | null, coordinateWorkNote?: string | null, gainsharePayments?: boolean | null, gainsharePaymentsEligibility: Array<GainshareArrangementEligibility>, gainsharePaymentsEligibilityOther?: string | null, gainsharePaymentsTrack?: boolean | null, gainsharePaymentsNote?: string | null, participantsIds: Array<ParticipantsIdType>, participantsIdsOther?: string | null, participantsIDSNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetParticipantOptionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetParticipantOptionsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, participantsAndProviders: { __typename: 'PlanParticipantsAndProviders', id: UUID, expectedNumberOfParticipants?: number | null, estimateConfidence?: ConfidenceType | null, confidenceNote?: string | null, recruitmentMethod?: RecruitmentType | null, recruitmentOther?: string | null, recruitmentNote?: string | null, selectionMethod: Array<ParticipantSelectionType>, selectionOther?: string | null, selectionNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetParticipantsAndProvidersQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetParticipantsAndProvidersQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, participantsAndProviders: { __typename: 'PlanParticipantsAndProviders', id: UUID, participants: Array<ParticipantsType>, medicareProviderType?: string | null, statesEngagement?: string | null, participantsOther?: string | null, participantsNote?: string | null, participantsCurrentlyInModels?: boolean | null, participantsCurrentlyInModelsNote?: string | null, modelApplicationLevel?: string | null } } };

export type GetProviderOptionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetProviderOptionsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, participantsAndProviders: { __typename: 'PlanParticipantsAndProviders', id: UUID, providerAdditionFrequency: Array<FrequencyType>, providerAdditionFrequencyContinually?: string | null, providerAdditionFrequencyOther?: string | null, providerAdditionFrequencyNote?: string | null, providerAddMethod: Array<ProviderAddType>, providerAddMethodOther?: string | null, providerAddMethodNote?: string | null, providerLeaveMethod: Array<ProviderLeaveType>, providerLeaveMethodOther?: string | null, providerLeaveMethodNote?: string | null, providerRemovalFrequency: Array<FrequencyType>, providerRemovalFrequencyContinually?: string | null, providerRemovalFrequencyOther?: string | null, providerRemovalFrequencyNote?: string | null, providerOverlap?: OverlapType | null, providerOverlapHierarchy?: string | null, providerOverlapNote?: string | null, readyForReviewDts?: Time | null, status: TaskStatus, readyForReviewByUserAccount?: { __typename: 'UserAccount', id: UUID, commonName: string } | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type UpdatePlanParticipantsAndProvidersMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanParticipantsAndProvidersChanges;
}>;


export type UpdatePlanParticipantsAndProvidersMutation = { __typename: 'Mutation', updatePlanParticipantsAndProviders: { __typename: 'PlanParticipantsAndProviders', id: UUID } };

export type GetAllPaymentsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAllPaymentsQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, payments: { __typename: 'PlanPayments', fundingSource: Array<FundingSource>, fundingSourceMedicareAInfo?: string | null, fundingSourceMedicareBInfo?: string | null, fundingSourceOther?: string | null, fundingSourceNote?: string | null, fundingSourceR: Array<FundingSource>, fundingSourceRMedicareAInfo?: string | null, fundingSourceRMedicareBInfo?: string | null, fundingSourceROther?: string | null, fundingSourceRNote?: string | null, payRecipients: Array<PayRecipient>, payRecipientsOtherSpecification?: string | null, payRecipientsNote?: string | null, payType: Array<PayType>, payTypeNote?: string | null, payClaims: Array<ClaimsBasedPayType>, payClaimsOther?: string | null, payClaimsNote?: string | null, shouldAnyProvidersExcludedFFSSystems?: boolean | null, shouldAnyProviderExcludedFFSSystemsNote?: string | null, changesMedicarePhysicianFeeSchedule?: boolean | null, changesMedicarePhysicianFeeScheduleNote?: string | null, affectsMedicareSecondaryPayerClaims?: boolean | null, affectsMedicareSecondaryPayerClaimsHow?: string | null, affectsMedicareSecondaryPayerClaimsNote?: string | null, payModelDifferentiation?: string | null, creatingDependenciesBetweenServices?: boolean | null, creatingDependenciesBetweenServicesNote?: string | null, needsClaimsDataCollection?: boolean | null, needsClaimsDataCollectionNote?: string | null, providingThirdPartyFile?: boolean | null, isContractorAwareTestDataRequirements?: boolean | null, beneficiaryCostSharingLevelAndHandling?: string | null, waiveBeneficiaryCostSharingForAnyServices?: boolean | null, waiveBeneficiaryCostSharingServiceSpecification?: string | null, waiverOnlyAppliesPartOfPayment?: boolean | null, waiveBeneficiaryCostSharingNote?: string | null, nonClaimsPayments: Array<NonClaimsBasedPayType>, nonClaimsPaymentsNote?: string | null, nonClaimsPaymentOther?: string | null, paymentCalculationOwner?: string | null, numberPaymentsPerPayCycle?: string | null, numberPaymentsPerPayCycleNote?: string | null, sharedSystemsInvolvedAdditionalClaimPayment?: boolean | null, sharedSystemsInvolvedAdditionalClaimPaymentNote?: string | null, planningToUseInnovationPaymentContractor?: boolean | null, planningToUseInnovationPaymentContractorNote?: string | null, expectedCalculationComplexityLevel?: ComplexityCalculationLevelType | null, expectedCalculationComplexityLevelNote?: string | null, claimsProcessingPrecedence?: boolean | null, claimsProcessingPrecedenceOther?: string | null, claimsProcessingPrecedenceNote?: string | null, canParticipantsSelectBetweenPaymentMechanisms?: boolean | null, canParticipantsSelectBetweenPaymentMechanismsHow?: string | null, canParticipantsSelectBetweenPaymentMechanismsNote?: string | null, anticipatedPaymentFrequency: Array<FrequencyType>, anticipatedPaymentFrequencyContinually?: string | null, anticipatedPaymentFrequencyOther?: string | null, anticipatedPaymentFrequencyNote?: string | null, willRecoverPayments?: boolean | null, willRecoverPaymentsNote?: string | null, anticipateReconcilingPaymentsRetrospectively?: boolean | null, anticipateReconcilingPaymentsRetrospectivelyNote?: string | null, paymentReconciliationFrequency: Array<FrequencyType>, paymentReconciliationFrequencyContinually?: string | null, paymentReconciliationFrequencyOther?: string | null, paymentReconciliationFrequencyNote?: string | null, paymentDemandRecoupmentFrequency: Array<FrequencyType>, paymentDemandRecoupmentFrequencyContinually?: string | null, paymentDemandRecoupmentFrequencyOther?: string | null, paymentDemandRecoupmentFrequencyNote?: string | null, paymentStartDate?: Time | null, paymentStartDateNote?: string | null, status: TaskStatus } } };

export type GetAnticipateDependenciesQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAnticipateDependenciesQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, payments: { __typename: 'PlanPayments', id: UUID, payType: Array<PayType>, payClaims: Array<ClaimsBasedPayType>, creatingDependenciesBetweenServices?: boolean | null, creatingDependenciesBetweenServicesNote?: string | null, needsClaimsDataCollection?: boolean | null, needsClaimsDataCollectionNote?: string | null, providingThirdPartyFile?: boolean | null, isContractorAwareTestDataRequirements?: boolean | null } } };

export type GetBeneficiaryCostSharingQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBeneficiaryCostSharingQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, payments: { __typename: 'PlanPayments', id: UUID, payType: Array<PayType>, payClaims: Array<ClaimsBasedPayType>, beneficiaryCostSharingLevelAndHandling?: string | null, waiveBeneficiaryCostSharingForAnyServices?: boolean | null, waiveBeneficiaryCostSharingServiceSpecification?: string | null, waiverOnlyAppliesPartOfPayment?: boolean | null, waiveBeneficiaryCostSharingNote?: string | null } } };

export type GetClaimsBasedPaymentQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetClaimsBasedPaymentQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, payments: { __typename: 'PlanPayments', id: UUID, payType: Array<PayType>, payClaims: Array<ClaimsBasedPayType>, payClaimsNote?: string | null, payClaimsOther?: string | null, shouldAnyProvidersExcludedFFSSystems?: boolean | null, shouldAnyProviderExcludedFFSSystemsNote?: string | null, changesMedicarePhysicianFeeSchedule?: boolean | null, changesMedicarePhysicianFeeScheduleNote?: string | null, affectsMedicareSecondaryPayerClaims?: boolean | null, affectsMedicareSecondaryPayerClaimsHow?: string | null, affectsMedicareSecondaryPayerClaimsNote?: string | null, payModelDifferentiation?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetComplexityQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetComplexityQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, payments: { __typename: 'PlanPayments', id: UUID, payType: Array<PayType>, payClaims: Array<ClaimsBasedPayType>, expectedCalculationComplexityLevel?: ComplexityCalculationLevelType | null, expectedCalculationComplexityLevelNote?: string | null, claimsProcessingPrecedence?: boolean | null, claimsProcessingPrecedenceOther?: string | null, claimsProcessingPrecedenceNote?: string | null, canParticipantsSelectBetweenPaymentMechanisms?: boolean | null, canParticipantsSelectBetweenPaymentMechanismsHow?: string | null, canParticipantsSelectBetweenPaymentMechanismsNote?: string | null, anticipatedPaymentFrequency: Array<FrequencyType>, anticipatedPaymentFrequencyContinually?: string | null, anticipatedPaymentFrequencyOther?: string | null, anticipatedPaymentFrequencyNote?: string | null } } };

export type GetFundingQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetFundingQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, payments: { __typename: 'PlanPayments', id: UUID, fundingSource: Array<FundingSource>, fundingSourceMedicareAInfo?: string | null, fundingSourceMedicareBInfo?: string | null, fundingSourceOther?: string | null, fundingSourceNote?: string | null, fundingSourceR: Array<FundingSource>, fundingSourceRMedicareAInfo?: string | null, fundingSourceRMedicareBInfo?: string | null, fundingSourceROther?: string | null, fundingSourceRNote?: string | null, payRecipients: Array<PayRecipient>, payRecipientsOtherSpecification?: string | null, payRecipientsNote?: string | null, payType: Array<PayType>, payTypeNote?: string | null, payClaims: Array<ClaimsBasedPayType> }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetNonClaimsBasedPaymentQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetNonClaimsBasedPaymentQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, payments: { __typename: 'PlanPayments', id: UUID, payType: Array<PayType>, payClaims: Array<ClaimsBasedPayType>, nonClaimsPayments: Array<NonClaimsBasedPayType>, nonClaimsPaymentsNote?: string | null, nonClaimsPaymentOther?: string | null, paymentCalculationOwner?: string | null, numberPaymentsPerPayCycle?: string | null, numberPaymentsPerPayCycleNote?: string | null, sharedSystemsInvolvedAdditionalClaimPayment?: boolean | null, sharedSystemsInvolvedAdditionalClaimPaymentNote?: string | null, planningToUseInnovationPaymentContractor?: boolean | null, planningToUseInnovationPaymentContractorNote?: string | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type GetRecoverQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetRecoverQuery = { __typename: 'Query', modelPlan: { __typename: 'ModelPlan', id: UUID, modelName: string, payments: { __typename: 'PlanPayments', id: UUID, payType: Array<PayType>, payClaims: Array<ClaimsBasedPayType>, willRecoverPayments?: boolean | null, willRecoverPaymentsNote?: string | null, anticipateReconcilingPaymentsRetrospectively?: boolean | null, anticipateReconcilingPaymentsRetrospectivelyNote?: string | null, paymentReconciliationFrequency: Array<FrequencyType>, paymentReconciliationFrequencyContinually?: string | null, paymentReconciliationFrequencyOther?: string | null, paymentReconciliationFrequencyNote?: string | null, paymentDemandRecoupmentFrequency: Array<FrequencyType>, paymentDemandRecoupmentFrequencyContinually?: string | null, paymentDemandRecoupmentFrequencyOther?: string | null, paymentDemandRecoupmentFrequencyNote?: string | null, paymentStartDate?: Time | null, paymentStartDateNote?: string | null, readyForReviewDts?: Time | null, status: TaskStatus, readyForReviewByUserAccount?: { __typename: 'UserAccount', id: UUID, commonName: string } | null }, operationalNeeds: Array<{ __typename: 'OperationalNeed', id: UUID, modifiedDts?: Time | null }> } };

export type UpdatePaymentsMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  changes: PlanPaymentsChanges;
}>;


export type UpdatePaymentsMutation = { __typename: 'Mutation', updatePlanPayments: { __typename: 'PlanPayments', id: UUID } };

export type CreateShareModelPlanMutationVariables = Exact<{
  modelPlanID: Scalars['UUID']['input'];
  viewFilter?: InputMaybe<ModelViewFilter>;
  usernames: Array<Scalars['String']['input']> | Scalars['String']['input'];
  optionalMessage?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateShareModelPlanMutation = { __typename: 'Mutation', shareModelPlan: boolean };

export type GetPossibleSolutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPossibleSolutionsQuery = { __typename: 'Query', possibleOperationalSolutions: Array<{ __typename: 'PossibleOperationalSolution', id: number, key: OperationalSolutionKey, pointsOfContact: Array<{ __typename: 'PossibleOperationalSolutionContact', id: UUID, name: string, email: string, isTeam: boolean, role?: string | null }> }> };

export const ReadyForReviewUserFragmentFragmentDoc = gql`
    fragment ReadyForReviewUserFragment on UserAccount {
  id
  commonName
}
    `;
export const GetAllBasicsDocument = gql`
    query GetAllBasics($id: UUID!) {
  modelPlan(id: $id) {
    id
    nameHistory(sort: DESC)
    basics {
      id
      demoCode
      amsModelID
      modelCategory
      additionalModelCategories
      cmsCenters
      cmmiGroups
      modelType
      modelTypeOther
      problem
      goal
      testInterventions
      note
      completeICIP
      clearanceStarts
      clearanceEnds
      announced
      applicationsStart
      applicationsEnd
      performancePeriodStarts
      performancePeriodEnds
      wrapUpEnds
      highLevelNote
      phasedIn
      phasedInNote
      status
    }
  }
}
    `;

/**
 * __useGetAllBasicsQuery__
 *
 * To run a query within a React component, call `useGetAllBasicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBasicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBasicsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAllBasicsQuery(baseOptions: Apollo.QueryHookOptions<GetAllBasicsQuery, GetAllBasicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBasicsQuery, GetAllBasicsQueryVariables>(GetAllBasicsDocument, options);
      }
export function useGetAllBasicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBasicsQuery, GetAllBasicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBasicsQuery, GetAllBasicsQueryVariables>(GetAllBasicsDocument, options);
        }
export function useGetAllBasicsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllBasicsQuery, GetAllBasicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllBasicsQuery, GetAllBasicsQueryVariables>(GetAllBasicsDocument, options);
        }
export type GetAllBasicsQueryHookResult = ReturnType<typeof useGetAllBasicsQuery>;
export type GetAllBasicsLazyQueryHookResult = ReturnType<typeof useGetAllBasicsLazyQuery>;
export type GetAllBasicsSuspenseQueryHookResult = ReturnType<typeof useGetAllBasicsSuspenseQuery>;
export type GetAllBasicsQueryResult = Apollo.QueryResult<GetAllBasicsQuery, GetAllBasicsQueryVariables>;
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
      modelTypeOther
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
export const GetAllBeneficiariesDocument = gql`
    query GetAllBeneficiaries($id: UUID!) {
  modelPlan(id: $id) {
    id
    beneficiaries {
      id
      modelPlanID
      beneficiaries
      diseaseSpecificGroup
      beneficiariesOther
      beneficiariesNote
      treatDualElligibleDifferent
      treatDualElligibleDifferentHow
      treatDualElligibleDifferentNote
      excludeCertainCharacteristics
      excludeCertainCharacteristicsCriteria
      excludeCertainCharacteristicsNote
      numberPeopleImpacted
      estimateConfidence
      confidenceNote
      beneficiarySelectionMethod
      beneficiarySelectionOther
      beneficiarySelectionNote
      beneficiarySelectionFrequency
      beneficiarySelectionFrequencyContinually
      beneficiarySelectionFrequencyOther
      beneficiarySelectionFrequencyNote
      beneficiaryRemovalFrequency
      beneficiaryRemovalFrequencyContinually
      beneficiaryRemovalFrequencyNote
      beneficiaryRemovalFrequencyOther
      beneficiaryOverlap
      beneficiaryOverlapNote
      precedenceRules
      precedenceRulesYes
      precedenceRulesNo
      precedenceRulesNote
      status
    }
  }
}
    `;

/**
 * __useGetAllBeneficiariesQuery__
 *
 * To run a query within a React component, call `useGetAllBeneficiariesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBeneficiariesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBeneficiariesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAllBeneficiariesQuery(baseOptions: Apollo.QueryHookOptions<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>(GetAllBeneficiariesDocument, options);
      }
export function useGetAllBeneficiariesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>(GetAllBeneficiariesDocument, options);
        }
export function useGetAllBeneficiariesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>(GetAllBeneficiariesDocument, options);
        }
export type GetAllBeneficiariesQueryHookResult = ReturnType<typeof useGetAllBeneficiariesQuery>;
export type GetAllBeneficiariesLazyQueryHookResult = ReturnType<typeof useGetAllBeneficiariesLazyQuery>;
export type GetAllBeneficiariesSuspenseQueryHookResult = ReturnType<typeof useGetAllBeneficiariesSuspenseQuery>;
export type GetAllBeneficiariesQueryResult = Apollo.QueryResult<GetAllBeneficiariesQuery, GetAllBeneficiariesQueryVariables>;
export const GetBeneficiaryIdentificationDocument = gql`
    query GetBeneficiaryIdentification($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    beneficiaries {
      id
      beneficiaries
      diseaseSpecificGroup
      beneficiariesOther
      beneficiariesNote
      treatDualElligibleDifferent
      treatDualElligibleDifferentHow
      treatDualElligibleDifferentNote
      excludeCertainCharacteristics
      excludeCertainCharacteristicsCriteria
      excludeCertainCharacteristicsNote
    }
  }
}
    `;

/**
 * __useGetBeneficiaryIdentificationQuery__
 *
 * To run a query within a React component, call `useGetBeneficiaryIdentificationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeneficiaryIdentificationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeneficiaryIdentificationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBeneficiaryIdentificationQuery(baseOptions: Apollo.QueryHookOptions<GetBeneficiaryIdentificationQuery, GetBeneficiaryIdentificationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeneficiaryIdentificationQuery, GetBeneficiaryIdentificationQueryVariables>(GetBeneficiaryIdentificationDocument, options);
      }
export function useGetBeneficiaryIdentificationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeneficiaryIdentificationQuery, GetBeneficiaryIdentificationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeneficiaryIdentificationQuery, GetBeneficiaryIdentificationQueryVariables>(GetBeneficiaryIdentificationDocument, options);
        }
export function useGetBeneficiaryIdentificationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBeneficiaryIdentificationQuery, GetBeneficiaryIdentificationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBeneficiaryIdentificationQuery, GetBeneficiaryIdentificationQueryVariables>(GetBeneficiaryIdentificationDocument, options);
        }
export type GetBeneficiaryIdentificationQueryHookResult = ReturnType<typeof useGetBeneficiaryIdentificationQuery>;
export type GetBeneficiaryIdentificationLazyQueryHookResult = ReturnType<typeof useGetBeneficiaryIdentificationLazyQuery>;
export type GetBeneficiaryIdentificationSuspenseQueryHookResult = ReturnType<typeof useGetBeneficiaryIdentificationSuspenseQuery>;
export type GetBeneficiaryIdentificationQueryResult = Apollo.QueryResult<GetBeneficiaryIdentificationQuery, GetBeneficiaryIdentificationQueryVariables>;
export const GetFrequencyDocument = gql`
    query GetFrequency($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    beneficiaries {
      id
      beneficiarySelectionFrequency
      beneficiarySelectionFrequencyContinually
      beneficiarySelectionFrequencyNote
      beneficiarySelectionFrequencyOther
      beneficiaryRemovalFrequency
      beneficiaryRemovalFrequencyContinually
      beneficiaryRemovalFrequencyNote
      beneficiaryRemovalFrequencyOther
      beneficiaryOverlap
      beneficiaryOverlapNote
      precedenceRules
      precedenceRulesYes
      precedenceRulesNo
      precedenceRulesNote
      readyForReviewByUserAccount {
        id
        commonName
      }
      readyForReviewDts
      status
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetFrequencyQuery__
 *
 * To run a query within a React component, call `useGetFrequencyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFrequencyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFrequencyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFrequencyQuery(baseOptions: Apollo.QueryHookOptions<GetFrequencyQuery, GetFrequencyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFrequencyQuery, GetFrequencyQueryVariables>(GetFrequencyDocument, options);
      }
export function useGetFrequencyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFrequencyQuery, GetFrequencyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFrequencyQuery, GetFrequencyQueryVariables>(GetFrequencyDocument, options);
        }
export function useGetFrequencySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFrequencyQuery, GetFrequencyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFrequencyQuery, GetFrequencyQueryVariables>(GetFrequencyDocument, options);
        }
export type GetFrequencyQueryHookResult = ReturnType<typeof useGetFrequencyQuery>;
export type GetFrequencyLazyQueryHookResult = ReturnType<typeof useGetFrequencyLazyQuery>;
export type GetFrequencySuspenseQueryHookResult = ReturnType<typeof useGetFrequencySuspenseQuery>;
export type GetFrequencyQueryResult = Apollo.QueryResult<GetFrequencyQuery, GetFrequencyQueryVariables>;
export const GetPeopleImpactedDocument = gql`
    query GetPeopleImpacted($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    beneficiaries {
      id
      numberPeopleImpacted
      estimateConfidence
      confidenceNote
      beneficiarySelectionNote
      beneficiarySelectionOther
      beneficiarySelectionMethod
    }
  }
}
    `;

/**
 * __useGetPeopleImpactedQuery__
 *
 * To run a query within a React component, call `useGetPeopleImpactedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeopleImpactedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeopleImpactedQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPeopleImpactedQuery(baseOptions: Apollo.QueryHookOptions<GetPeopleImpactedQuery, GetPeopleImpactedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPeopleImpactedQuery, GetPeopleImpactedQueryVariables>(GetPeopleImpactedDocument, options);
      }
export function useGetPeopleImpactedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPeopleImpactedQuery, GetPeopleImpactedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPeopleImpactedQuery, GetPeopleImpactedQueryVariables>(GetPeopleImpactedDocument, options);
        }
export function useGetPeopleImpactedSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPeopleImpactedQuery, GetPeopleImpactedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPeopleImpactedQuery, GetPeopleImpactedQueryVariables>(GetPeopleImpactedDocument, options);
        }
export type GetPeopleImpactedQueryHookResult = ReturnType<typeof useGetPeopleImpactedQuery>;
export type GetPeopleImpactedLazyQueryHookResult = ReturnType<typeof useGetPeopleImpactedLazyQuery>;
export type GetPeopleImpactedSuspenseQueryHookResult = ReturnType<typeof useGetPeopleImpactedSuspenseQuery>;
export type GetPeopleImpactedQueryResult = Apollo.QueryResult<GetPeopleImpactedQuery, GetPeopleImpactedQueryVariables>;
export const UpdateModelPlanBeneficiariesDocument = gql`
    mutation UpdateModelPlanBeneficiaries($id: UUID!, $changes: PlanBeneficiariesChanges!) {
  updatePlanBeneficiaries(id: $id, changes: $changes) {
    id
  }
}
    `;
export type UpdateModelPlanBeneficiariesMutationFn = Apollo.MutationFunction<UpdateModelPlanBeneficiariesMutation, UpdateModelPlanBeneficiariesMutationVariables>;

/**
 * __useUpdateModelPlanBeneficiariesMutation__
 *
 * To run a mutation, you first call `useUpdateModelPlanBeneficiariesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateModelPlanBeneficiariesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateModelPlanBeneficiariesMutation, { data, loading, error }] = useUpdateModelPlanBeneficiariesMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdateModelPlanBeneficiariesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateModelPlanBeneficiariesMutation, UpdateModelPlanBeneficiariesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateModelPlanBeneficiariesMutation, UpdateModelPlanBeneficiariesMutationVariables>(UpdateModelPlanBeneficiariesDocument, options);
      }
export type UpdateModelPlanBeneficiariesMutationHookResult = ReturnType<typeof useUpdateModelPlanBeneficiariesMutation>;
export type UpdateModelPlanBeneficiariesMutationResult = Apollo.MutationResult<UpdateModelPlanBeneficiariesMutation>;
export type UpdateModelPlanBeneficiariesMutationOptions = Apollo.BaseMutationOptions<UpdateModelPlanBeneficiariesMutation, UpdateModelPlanBeneficiariesMutationVariables>;
export const CreateCrDocument = gql`
    mutation CreateCR($input: PlanCRCreateInput!) {
  createPlanCR(input: $input) {
    id
    modelPlanID
    idNumber
    dateInitiated
    dateImplemented
    title
    note
  }
}
    `;
export type CreateCrMutationFn = Apollo.MutationFunction<CreateCrMutation, CreateCrMutationVariables>;

/**
 * __useCreateCrMutation__
 *
 * To run a mutation, you first call `useCreateCrMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCrMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCrMutation, { data, loading, error }] = useCreateCrMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCrMutation(baseOptions?: Apollo.MutationHookOptions<CreateCrMutation, CreateCrMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCrMutation, CreateCrMutationVariables>(CreateCrDocument, options);
      }
export type CreateCrMutationHookResult = ReturnType<typeof useCreateCrMutation>;
export type CreateCrMutationResult = Apollo.MutationResult<CreateCrMutation>;
export type CreateCrMutationOptions = Apollo.BaseMutationOptions<CreateCrMutation, CreateCrMutationVariables>;
export const CreateTdlDocument = gql`
    mutation CreateTDL($input: PlanTDLCreateInput!) {
  createPlanTDL(input: $input) {
    id
    modelPlanID
    idNumber
    dateInitiated
    title
    note
  }
}
    `;
export type CreateTdlMutationFn = Apollo.MutationFunction<CreateTdlMutation, CreateTdlMutationVariables>;

/**
 * __useCreateTdlMutation__
 *
 * To run a mutation, you first call `useCreateTdlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTdlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTdlMutation, { data, loading, error }] = useCreateTdlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTdlMutation(baseOptions?: Apollo.MutationHookOptions<CreateTdlMutation, CreateTdlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTdlMutation, CreateTdlMutationVariables>(CreateTdlDocument, options);
      }
export type CreateTdlMutationHookResult = ReturnType<typeof useCreateTdlMutation>;
export type CreateTdlMutationResult = Apollo.MutationResult<CreateTdlMutation>;
export type CreateTdlMutationOptions = Apollo.BaseMutationOptions<CreateTdlMutation, CreateTdlMutationVariables>;
export const DeleteCrDocument = gql`
    mutation DeleteCR($id: UUID!) {
  deletePlanCR(id: $id) {
    id
    modelPlanID
    idNumber
    dateInitiated
    title
    note
  }
}
    `;
export type DeleteCrMutationFn = Apollo.MutationFunction<DeleteCrMutation, DeleteCrMutationVariables>;

/**
 * __useDeleteCrMutation__
 *
 * To run a mutation, you first call `useDeleteCrMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCrMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCrMutation, { data, loading, error }] = useDeleteCrMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCrMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCrMutation, DeleteCrMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCrMutation, DeleteCrMutationVariables>(DeleteCrDocument, options);
      }
export type DeleteCrMutationHookResult = ReturnType<typeof useDeleteCrMutation>;
export type DeleteCrMutationResult = Apollo.MutationResult<DeleteCrMutation>;
export type DeleteCrMutationOptions = Apollo.BaseMutationOptions<DeleteCrMutation, DeleteCrMutationVariables>;
export const DeleteTdlDocument = gql`
    mutation DeleteTDL($id: UUID!) {
  deletePlanTDL(id: $id) {
    id
    modelPlanID
    idNumber
    dateInitiated
    title
    note
  }
}
    `;
export type DeleteTdlMutationFn = Apollo.MutationFunction<DeleteTdlMutation, DeleteTdlMutationVariables>;

/**
 * __useDeleteTdlMutation__
 *
 * To run a mutation, you first call `useDeleteTdlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTdlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTdlMutation, { data, loading, error }] = useDeleteTdlMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTdlMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTdlMutation, DeleteTdlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTdlMutation, DeleteTdlMutationVariables>(DeleteTdlDocument, options);
      }
export type DeleteTdlMutationHookResult = ReturnType<typeof useDeleteTdlMutation>;
export type DeleteTdlMutationResult = Apollo.MutationResult<DeleteTdlMutation>;
export type DeleteTdlMutationOptions = Apollo.BaseMutationOptions<DeleteTdlMutation, DeleteTdlMutationVariables>;
export const GetCrDocument = gql`
    query GetCR($id: UUID!) {
  planCR(id: $id) {
    id
    title
    idNumber
    dateInitiated
    dateImplemented
    note
  }
}
    `;

/**
 * __useGetCrQuery__
 *
 * To run a query within a React component, call `useGetCrQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCrQuery(baseOptions: Apollo.QueryHookOptions<GetCrQuery, GetCrQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrQuery, GetCrQueryVariables>(GetCrDocument, options);
      }
export function useGetCrLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrQuery, GetCrQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrQuery, GetCrQueryVariables>(GetCrDocument, options);
        }
export function useGetCrSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrQuery, GetCrQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrQuery, GetCrQueryVariables>(GetCrDocument, options);
        }
export type GetCrQueryHookResult = ReturnType<typeof useGetCrQuery>;
export type GetCrLazyQueryHookResult = ReturnType<typeof useGetCrLazyQuery>;
export type GetCrSuspenseQueryHookResult = ReturnType<typeof useGetCrSuspenseQuery>;
export type GetCrQueryResult = Apollo.QueryResult<GetCrQuery, GetCrQueryVariables>;
export const GetCrtdLsDocument = gql`
    query GetCRTDLs($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    isCollaborator
    crs {
      id
      modelPlanID
      title
      idNumber
      dateInitiated
      dateImplemented
      note
    }
    tdls {
      id
      modelPlanID
      title
      idNumber
      dateInitiated
      note
    }
  }
}
    `;

/**
 * __useGetCrtdLsQuery__
 *
 * To run a query within a React component, call `useGetCrtdLsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrtdLsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrtdLsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCrtdLsQuery(baseOptions: Apollo.QueryHookOptions<GetCrtdLsQuery, GetCrtdLsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCrtdLsQuery, GetCrtdLsQueryVariables>(GetCrtdLsDocument, options);
      }
export function useGetCrtdLsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCrtdLsQuery, GetCrtdLsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCrtdLsQuery, GetCrtdLsQueryVariables>(GetCrtdLsDocument, options);
        }
export function useGetCrtdLsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCrtdLsQuery, GetCrtdLsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCrtdLsQuery, GetCrtdLsQueryVariables>(GetCrtdLsDocument, options);
        }
export type GetCrtdLsQueryHookResult = ReturnType<typeof useGetCrtdLsQuery>;
export type GetCrtdLsLazyQueryHookResult = ReturnType<typeof useGetCrtdLsLazyQuery>;
export type GetCrtdLsSuspenseQueryHookResult = ReturnType<typeof useGetCrtdLsSuspenseQuery>;
export type GetCrtdLsQueryResult = Apollo.QueryResult<GetCrtdLsQuery, GetCrtdLsQueryVariables>;
export const GetTdlDocument = gql`
    query GetTDL($id: UUID!) {
  planTDL(id: $id) {
    id
    title
    idNumber
    dateInitiated
    note
  }
}
    `;

/**
 * __useGetTdlQuery__
 *
 * To run a query within a React component, call `useGetTdlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTdlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTdlQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTdlQuery(baseOptions: Apollo.QueryHookOptions<GetTdlQuery, GetTdlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTdlQuery, GetTdlQueryVariables>(GetTdlDocument, options);
      }
export function useGetTdlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTdlQuery, GetTdlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTdlQuery, GetTdlQueryVariables>(GetTdlDocument, options);
        }
export function useGetTdlSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTdlQuery, GetTdlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTdlQuery, GetTdlQueryVariables>(GetTdlDocument, options);
        }
export type GetTdlQueryHookResult = ReturnType<typeof useGetTdlQuery>;
export type GetTdlLazyQueryHookResult = ReturnType<typeof useGetTdlLazyQuery>;
export type GetTdlSuspenseQueryHookResult = ReturnType<typeof useGetTdlSuspenseQuery>;
export type GetTdlQueryResult = Apollo.QueryResult<GetTdlQuery, GetTdlQueryVariables>;
export const UpdateCrDocument = gql`
    mutation UpdateCR($id: UUID!, $changes: PlanCRChanges!) {
  updatePlanCR(id: $id, changes: $changes) {
    id
    modelPlanID
    idNumber
    dateInitiated
    dateImplemented
    title
    note
  }
}
    `;
export type UpdateCrMutationFn = Apollo.MutationFunction<UpdateCrMutation, UpdateCrMutationVariables>;

/**
 * __useUpdateCrMutation__
 *
 * To run a mutation, you first call `useUpdateCrMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCrMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCrMutation, { data, loading, error }] = useUpdateCrMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdateCrMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCrMutation, UpdateCrMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCrMutation, UpdateCrMutationVariables>(UpdateCrDocument, options);
      }
export type UpdateCrMutationHookResult = ReturnType<typeof useUpdateCrMutation>;
export type UpdateCrMutationResult = Apollo.MutationResult<UpdateCrMutation>;
export type UpdateCrMutationOptions = Apollo.BaseMutationOptions<UpdateCrMutation, UpdateCrMutationVariables>;
export const UpdateTdlDocument = gql`
    mutation UpdateTDL($id: UUID!, $changes: PlanTDLChanges!) {
  updatePlanTDL(id: $id, changes: $changes) {
    id
    modelPlanID
    idNumber
    dateInitiated
    title
    note
  }
}
    `;
export type UpdateTdlMutationFn = Apollo.MutationFunction<UpdateTdlMutation, UpdateTdlMutationVariables>;

/**
 * __useUpdateTdlMutation__
 *
 * To run a mutation, you first call `useUpdateTdlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTdlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTdlMutation, { data, loading, error }] = useUpdateTdlMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdateTdlMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTdlMutation, UpdateTdlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTdlMutation, UpdateTdlMutationVariables>(UpdateTdlDocument, options);
      }
export type UpdateTdlMutationHookResult = ReturnType<typeof useUpdateTdlMutation>;
export type UpdateTdlMutationResult = Apollo.MutationResult<UpdateTdlMutation>;
export type UpdateTdlMutationOptions = Apollo.BaseMutationOptions<UpdateTdlMutation, UpdateTdlMutationVariables>;
export const CreateModelPlanDiscussionDocument = gql`
    mutation CreateModelPlanDiscussion($input: PlanDiscussionCreateInput!) {
  createPlanDiscussion(input: $input) {
    id
    content {
      rawContent
    }
    createdBy
    createdDts
  }
}
    `;
export type CreateModelPlanDiscussionMutationFn = Apollo.MutationFunction<CreateModelPlanDiscussionMutation, CreateModelPlanDiscussionMutationVariables>;

/**
 * __useCreateModelPlanDiscussionMutation__
 *
 * To run a mutation, you first call `useCreateModelPlanDiscussionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateModelPlanDiscussionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createModelPlanDiscussionMutation, { data, loading, error }] = useCreateModelPlanDiscussionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateModelPlanDiscussionMutation(baseOptions?: Apollo.MutationHookOptions<CreateModelPlanDiscussionMutation, CreateModelPlanDiscussionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateModelPlanDiscussionMutation, CreateModelPlanDiscussionMutationVariables>(CreateModelPlanDiscussionDocument, options);
      }
export type CreateModelPlanDiscussionMutationHookResult = ReturnType<typeof useCreateModelPlanDiscussionMutation>;
export type CreateModelPlanDiscussionMutationResult = Apollo.MutationResult<CreateModelPlanDiscussionMutation>;
export type CreateModelPlanDiscussionMutationOptions = Apollo.BaseMutationOptions<CreateModelPlanDiscussionMutation, CreateModelPlanDiscussionMutationVariables>;
export const GetModelPlanDiscussionsDocument = gql`
    query GetModelPlanDiscussions($id: UUID!) {
  modelPlan(id: $id) {
    id
    isCollaborator
    discussions {
      id
      content {
        rawContent
      }
      createdBy
      createdDts
      userRole
      userRoleDescription
      isAssessment
      createdByUserAccount {
        commonName
      }
      replies {
        id
        discussionID
        content {
          rawContent
        }
        userRole
        userRoleDescription
        isAssessment
        createdBy
        createdDts
        createdByUserAccount {
          commonName
        }
      }
    }
  }
}
    `;

/**
 * __useGetModelPlanDiscussionsQuery__
 *
 * To run a query within a React component, call `useGetModelPlanDiscussionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelPlanDiscussionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelPlanDiscussionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetModelPlanDiscussionsQuery(baseOptions: Apollo.QueryHookOptions<GetModelPlanDiscussionsQuery, GetModelPlanDiscussionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModelPlanDiscussionsQuery, GetModelPlanDiscussionsQueryVariables>(GetModelPlanDiscussionsDocument, options);
      }
export function useGetModelPlanDiscussionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModelPlanDiscussionsQuery, GetModelPlanDiscussionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModelPlanDiscussionsQuery, GetModelPlanDiscussionsQueryVariables>(GetModelPlanDiscussionsDocument, options);
        }
export function useGetModelPlanDiscussionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetModelPlanDiscussionsQuery, GetModelPlanDiscussionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModelPlanDiscussionsQuery, GetModelPlanDiscussionsQueryVariables>(GetModelPlanDiscussionsDocument, options);
        }
export type GetModelPlanDiscussionsQueryHookResult = ReturnType<typeof useGetModelPlanDiscussionsQuery>;
export type GetModelPlanDiscussionsLazyQueryHookResult = ReturnType<typeof useGetModelPlanDiscussionsLazyQuery>;
export type GetModelPlanDiscussionsSuspenseQueryHookResult = ReturnType<typeof useGetModelPlanDiscussionsSuspenseQuery>;
export type GetModelPlanDiscussionsQueryResult = Apollo.QueryResult<GetModelPlanDiscussionsQuery, GetModelPlanDiscussionsQueryVariables>;
export const GetMostRecentRoleSelectionDocument = gql`
    query GetMostRecentRoleSelection {
  mostRecentDiscussionRoleSelection {
    userRole
    userRoleDescription
  }
}
    `;

/**
 * __useGetMostRecentRoleSelectionQuery__
 *
 * To run a query within a React component, call `useGetMostRecentRoleSelectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostRecentRoleSelectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostRecentRoleSelectionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMostRecentRoleSelectionQuery(baseOptions?: Apollo.QueryHookOptions<GetMostRecentRoleSelectionQuery, GetMostRecentRoleSelectionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMostRecentRoleSelectionQuery, GetMostRecentRoleSelectionQueryVariables>(GetMostRecentRoleSelectionDocument, options);
      }
export function useGetMostRecentRoleSelectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMostRecentRoleSelectionQuery, GetMostRecentRoleSelectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMostRecentRoleSelectionQuery, GetMostRecentRoleSelectionQueryVariables>(GetMostRecentRoleSelectionDocument, options);
        }
export function useGetMostRecentRoleSelectionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMostRecentRoleSelectionQuery, GetMostRecentRoleSelectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMostRecentRoleSelectionQuery, GetMostRecentRoleSelectionQueryVariables>(GetMostRecentRoleSelectionDocument, options);
        }
export type GetMostRecentRoleSelectionQueryHookResult = ReturnType<typeof useGetMostRecentRoleSelectionQuery>;
export type GetMostRecentRoleSelectionLazyQueryHookResult = ReturnType<typeof useGetMostRecentRoleSelectionLazyQuery>;
export type GetMostRecentRoleSelectionSuspenseQueryHookResult = ReturnType<typeof useGetMostRecentRoleSelectionSuspenseQuery>;
export type GetMostRecentRoleSelectionQueryResult = Apollo.QueryResult<GetMostRecentRoleSelectionQuery, GetMostRecentRoleSelectionQueryVariables>;
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
export const GetAllGeneralCharacteristicsDocument = gql`
    query GetAllGeneralCharacteristics($id: UUID!) {
  modelPlan(id: $id) {
    id
    generalCharacteristics {
      id
      isNewModel
      existingModel
      resemblesExistingModel
      resemblesExistingModelWhyHow
      resemblesExistingModelHow
      resemblesExistingModelNote
      resemblesExistingModelWhich {
        names
      }
      resemblesExistingModelOtherSpecify
      resemblesExistingModelOtherSelected
      resemblesExistingModelOtherOption
      participationInModelPrecondition
      participationInModelPreconditionWhich {
        names
      }
      participationInModelPreconditionOtherSpecify
      participationInModelPreconditionOtherSelected
      participationInModelPreconditionOtherOption
      participationInModelPreconditionWhyHow
      participationInModelPreconditionNote
      hasComponentsOrTracks
      hasComponentsOrTracksDiffer
      hasComponentsOrTracksNote
      agencyOrStateHelp
      agencyOrStateHelpOther
      agencyOrStateHelpNote
      alternativePaymentModelTypes
      alternativePaymentModelNote
      keyCharacteristics
      keyCharacteristicsOther
      keyCharacteristicsNote
      collectPlanBids
      collectPlanBidsNote
      managePartCDEnrollment
      managePartCDEnrollmentNote
      planContractUpdated
      planContractUpdatedNote
      careCoordinationInvolved
      careCoordinationInvolvedDescription
      careCoordinationInvolvedNote
      additionalServicesInvolved
      additionalServicesInvolvedDescription
      additionalServicesInvolvedNote
      communityPartnersInvolved
      communityPartnersInvolvedDescription
      communityPartnersInvolvedNote
      geographiesTargeted
      geographiesTargetedTypes
      geographiesStatesAndTerritories
      geographiesRegionTypes
      geographiesTargetedTypesOther
      geographiesTargetedAppliedTo
      geographiesTargetedAppliedToOther
      geographiesTargetedNote
      participationOptions
      participationOptionsNote
      agreementTypes
      agreementTypesOther
      multiplePatricipationAgreementsNeeded
      multiplePatricipationAgreementsNeededNote
      rulemakingRequired
      rulemakingRequiredDescription
      rulemakingRequiredNote
      authorityAllowances
      authorityAllowancesOther
      authorityAllowancesNote
      waiversRequired
      waiversRequiredTypes
      waiversRequiredNote
      status
    }
  }
}
    `;

/**
 * __useGetAllGeneralCharacteristicsQuery__
 *
 * To run a query within a React component, call `useGetAllGeneralCharacteristicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGeneralCharacteristicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGeneralCharacteristicsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAllGeneralCharacteristicsQuery(baseOptions: Apollo.QueryHookOptions<GetAllGeneralCharacteristicsQuery, GetAllGeneralCharacteristicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGeneralCharacteristicsQuery, GetAllGeneralCharacteristicsQueryVariables>(GetAllGeneralCharacteristicsDocument, options);
      }
export function useGetAllGeneralCharacteristicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGeneralCharacteristicsQuery, GetAllGeneralCharacteristicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGeneralCharacteristicsQuery, GetAllGeneralCharacteristicsQueryVariables>(GetAllGeneralCharacteristicsDocument, options);
        }
export function useGetAllGeneralCharacteristicsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllGeneralCharacteristicsQuery, GetAllGeneralCharacteristicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllGeneralCharacteristicsQuery, GetAllGeneralCharacteristicsQueryVariables>(GetAllGeneralCharacteristicsDocument, options);
        }
export type GetAllGeneralCharacteristicsQueryHookResult = ReturnType<typeof useGetAllGeneralCharacteristicsQuery>;
export type GetAllGeneralCharacteristicsLazyQueryHookResult = ReturnType<typeof useGetAllGeneralCharacteristicsLazyQuery>;
export type GetAllGeneralCharacteristicsSuspenseQueryHookResult = ReturnType<typeof useGetAllGeneralCharacteristicsSuspenseQuery>;
export type GetAllGeneralCharacteristicsQueryResult = Apollo.QueryResult<GetAllGeneralCharacteristicsQuery, GetAllGeneralCharacteristicsQueryVariables>;
export const GetAuthorityDocument = gql`
    query GetAuthority($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    generalCharacteristics {
      id
      rulemakingRequired
      rulemakingRequiredDescription
      rulemakingRequiredNote
      authorityAllowances
      authorityAllowancesOther
      authorityAllowancesNote
      waiversRequired
      waiversRequiredTypes
      waiversRequiredNote
      readyForReviewByUserAccount {
        id
        commonName
      }
      readyForReviewDts
      status
    }
  }
}
    `;

/**
 * __useGetAuthorityQuery__
 *
 * To run a query within a React component, call `useGetAuthorityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthorityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthorityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAuthorityQuery(baseOptions: Apollo.QueryHookOptions<GetAuthorityQuery, GetAuthorityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAuthorityQuery, GetAuthorityQueryVariables>(GetAuthorityDocument, options);
      }
export function useGetAuthorityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAuthorityQuery, GetAuthorityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAuthorityQuery, GetAuthorityQueryVariables>(GetAuthorityDocument, options);
        }
export function useGetAuthoritySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAuthorityQuery, GetAuthorityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAuthorityQuery, GetAuthorityQueryVariables>(GetAuthorityDocument, options);
        }
export type GetAuthorityQueryHookResult = ReturnType<typeof useGetAuthorityQuery>;
export type GetAuthorityLazyQueryHookResult = ReturnType<typeof useGetAuthorityLazyQuery>;
export type GetAuthoritySuspenseQueryHookResult = ReturnType<typeof useGetAuthoritySuspenseQuery>;
export type GetAuthorityQueryResult = Apollo.QueryResult<GetAuthorityQuery, GetAuthorityQueryVariables>;
export const GetGeneralCharacteristicsDocument = gql`
    query GetGeneralCharacteristics($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    generalCharacteristics {
      id
      isNewModel
      currentModelPlanID
      existingModelID
      resemblesExistingModel
      resemblesExistingModelWhyHow
      resemblesExistingModelHow
      resemblesExistingModelNote
      resemblesExistingModelWhich {
        links {
          id
          existingModelID
          currentModelPlanID
        }
      }
      resemblesExistingModelOtherSpecify
      resemblesExistingModelOtherSelected
      resemblesExistingModelOtherOption
      participationInModelPrecondition
      participationInModelPreconditionWhich {
        links {
          id
          existingModelID
          currentModelPlanID
        }
      }
      participationInModelPreconditionOtherSpecify
      participationInModelPreconditionOtherSelected
      participationInModelPreconditionOtherOption
      participationInModelPreconditionWhyHow
      participationInModelPreconditionNote
      hasComponentsOrTracks
      hasComponentsOrTracksDiffer
      hasComponentsOrTracksNote
    }
  }
}
    `;

/**
 * __useGetGeneralCharacteristicsQuery__
 *
 * To run a query within a React component, call `useGetGeneralCharacteristicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGeneralCharacteristicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGeneralCharacteristicsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGeneralCharacteristicsQuery(baseOptions: Apollo.QueryHookOptions<GetGeneralCharacteristicsQuery, GetGeneralCharacteristicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGeneralCharacteristicsQuery, GetGeneralCharacteristicsQueryVariables>(GetGeneralCharacteristicsDocument, options);
      }
export function useGetGeneralCharacteristicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGeneralCharacteristicsQuery, GetGeneralCharacteristicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGeneralCharacteristicsQuery, GetGeneralCharacteristicsQueryVariables>(GetGeneralCharacteristicsDocument, options);
        }
export function useGetGeneralCharacteristicsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGeneralCharacteristicsQuery, GetGeneralCharacteristicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGeneralCharacteristicsQuery, GetGeneralCharacteristicsQueryVariables>(GetGeneralCharacteristicsDocument, options);
        }
export type GetGeneralCharacteristicsQueryHookResult = ReturnType<typeof useGetGeneralCharacteristicsQuery>;
export type GetGeneralCharacteristicsLazyQueryHookResult = ReturnType<typeof useGetGeneralCharacteristicsLazyQuery>;
export type GetGeneralCharacteristicsSuspenseQueryHookResult = ReturnType<typeof useGetGeneralCharacteristicsSuspenseQuery>;
export type GetGeneralCharacteristicsQueryResult = Apollo.QueryResult<GetGeneralCharacteristicsQuery, GetGeneralCharacteristicsQueryVariables>;
export const GetInvolvementsDocument = gql`
    query GetInvolvements($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    generalCharacteristics {
      id
      careCoordinationInvolved
      careCoordinationInvolvedDescription
      careCoordinationInvolvedNote
      additionalServicesInvolved
      additionalServicesInvolvedDescription
      additionalServicesInvolvedNote
      communityPartnersInvolved
      communityPartnersInvolvedDescription
      communityPartnersInvolvedNote
    }
  }
}
    `;

/**
 * __useGetInvolvementsQuery__
 *
 * To run a query within a React component, call `useGetInvolvementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvolvementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvolvementsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInvolvementsQuery(baseOptions: Apollo.QueryHookOptions<GetInvolvementsQuery, GetInvolvementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvolvementsQuery, GetInvolvementsQueryVariables>(GetInvolvementsDocument, options);
      }
export function useGetInvolvementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvolvementsQuery, GetInvolvementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvolvementsQuery, GetInvolvementsQueryVariables>(GetInvolvementsDocument, options);
        }
export function useGetInvolvementsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetInvolvementsQuery, GetInvolvementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvolvementsQuery, GetInvolvementsQueryVariables>(GetInvolvementsDocument, options);
        }
export type GetInvolvementsQueryHookResult = ReturnType<typeof useGetInvolvementsQuery>;
export type GetInvolvementsLazyQueryHookResult = ReturnType<typeof useGetInvolvementsLazyQuery>;
export type GetInvolvementsSuspenseQueryHookResult = ReturnType<typeof useGetInvolvementsSuspenseQuery>;
export type GetInvolvementsQueryResult = Apollo.QueryResult<GetInvolvementsQuery, GetInvolvementsQueryVariables>;
export const GetKeyCharacteristicsDocument = gql`
    query GetKeyCharacteristics($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    generalCharacteristics {
      id
      agencyOrStateHelp
      agencyOrStateHelpOther
      agencyOrStateHelpNote
      alternativePaymentModelTypes
      alternativePaymentModelNote
      keyCharacteristics
      keyCharacteristicsNote
      keyCharacteristicsOther
      collectPlanBids
      collectPlanBidsNote
      managePartCDEnrollment
      managePartCDEnrollmentNote
      planContractUpdated
      planContractUpdatedNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetKeyCharacteristicsQuery__
 *
 * To run a query within a React component, call `useGetKeyCharacteristicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetKeyCharacteristicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetKeyCharacteristicsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetKeyCharacteristicsQuery(baseOptions: Apollo.QueryHookOptions<GetKeyCharacteristicsQuery, GetKeyCharacteristicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetKeyCharacteristicsQuery, GetKeyCharacteristicsQueryVariables>(GetKeyCharacteristicsDocument, options);
      }
export function useGetKeyCharacteristicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetKeyCharacteristicsQuery, GetKeyCharacteristicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetKeyCharacteristicsQuery, GetKeyCharacteristicsQueryVariables>(GetKeyCharacteristicsDocument, options);
        }
export function useGetKeyCharacteristicsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetKeyCharacteristicsQuery, GetKeyCharacteristicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetKeyCharacteristicsQuery, GetKeyCharacteristicsQueryVariables>(GetKeyCharacteristicsDocument, options);
        }
export type GetKeyCharacteristicsQueryHookResult = ReturnType<typeof useGetKeyCharacteristicsQuery>;
export type GetKeyCharacteristicsLazyQueryHookResult = ReturnType<typeof useGetKeyCharacteristicsLazyQuery>;
export type GetKeyCharacteristicsSuspenseQueryHookResult = ReturnType<typeof useGetKeyCharacteristicsSuspenseQuery>;
export type GetKeyCharacteristicsQueryResult = Apollo.QueryResult<GetKeyCharacteristicsQuery, GetKeyCharacteristicsQueryVariables>;
export const GetTargetsAndOptionsDocument = gql`
    query GetTargetsAndOptions($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    generalCharacteristics {
      id
      geographiesTargeted
      geographiesTargetedTypes
      geographiesStatesAndTerritories
      geographiesRegionTypes
      geographiesTargetedTypesOther
      geographiesTargetedAppliedTo
      geographiesTargetedAppliedToOther
      geographiesTargetedNote
      participationOptions
      participationOptionsNote
      agreementTypes
      agreementTypesOther
      multiplePatricipationAgreementsNeeded
      multiplePatricipationAgreementsNeededNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetTargetsAndOptionsQuery__
 *
 * To run a query within a React component, call `useGetTargetsAndOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTargetsAndOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTargetsAndOptionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTargetsAndOptionsQuery(baseOptions: Apollo.QueryHookOptions<GetTargetsAndOptionsQuery, GetTargetsAndOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTargetsAndOptionsQuery, GetTargetsAndOptionsQueryVariables>(GetTargetsAndOptionsDocument, options);
      }
export function useGetTargetsAndOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTargetsAndOptionsQuery, GetTargetsAndOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTargetsAndOptionsQuery, GetTargetsAndOptionsQueryVariables>(GetTargetsAndOptionsDocument, options);
        }
export function useGetTargetsAndOptionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTargetsAndOptionsQuery, GetTargetsAndOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTargetsAndOptionsQuery, GetTargetsAndOptionsQueryVariables>(GetTargetsAndOptionsDocument, options);
        }
export type GetTargetsAndOptionsQueryHookResult = ReturnType<typeof useGetTargetsAndOptionsQuery>;
export type GetTargetsAndOptionsLazyQueryHookResult = ReturnType<typeof useGetTargetsAndOptionsLazyQuery>;
export type GetTargetsAndOptionsSuspenseQueryHookResult = ReturnType<typeof useGetTargetsAndOptionsSuspenseQuery>;
export type GetTargetsAndOptionsQueryResult = Apollo.QueryResult<GetTargetsAndOptionsQuery, GetTargetsAndOptionsQueryVariables>;
export const UpdateExistingModelLinksDocument = gql`
    mutation UpdateExistingModelLinks($modelPlanID: UUID!, $fieldName: ExisitingModelLinkFieldType!, $existingModelIDs: [Int!], $currentModelPlanIDs: [UUID!]) {
  updateExistingModelLinks(
    modelPlanID: $modelPlanID
    fieldName: $fieldName
    existingModelIDs: $existingModelIDs
    currentModelPlanIDs: $currentModelPlanIDs
  ) {
    links {
      id
      existingModelID
      model {
        ... on ExistingModel {
          modelName
          stage
          numberOfParticipants
          keywords
        }
        ... on ModelPlan {
          modelName
          abbreviation
        }
      }
    }
  }
}
    `;
export type UpdateExistingModelLinksMutationFn = Apollo.MutationFunction<UpdateExistingModelLinksMutation, UpdateExistingModelLinksMutationVariables>;

/**
 * __useUpdateExistingModelLinksMutation__
 *
 * To run a mutation, you first call `useUpdateExistingModelLinksMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExistingModelLinksMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExistingModelLinksMutation, { data, loading, error }] = useUpdateExistingModelLinksMutation({
 *   variables: {
 *      modelPlanID: // value for 'modelPlanID'
 *      fieldName: // value for 'fieldName'
 *      existingModelIDs: // value for 'existingModelIDs'
 *      currentModelPlanIDs: // value for 'currentModelPlanIDs'
 *   },
 * });
 */
export function useUpdateExistingModelLinksMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExistingModelLinksMutation, UpdateExistingModelLinksMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExistingModelLinksMutation, UpdateExistingModelLinksMutationVariables>(UpdateExistingModelLinksDocument, options);
      }
export type UpdateExistingModelLinksMutationHookResult = ReturnType<typeof useUpdateExistingModelLinksMutation>;
export type UpdateExistingModelLinksMutationResult = Apollo.MutationResult<UpdateExistingModelLinksMutation>;
export type UpdateExistingModelLinksMutationOptions = Apollo.BaseMutationOptions<UpdateExistingModelLinksMutation, UpdateExistingModelLinksMutationVariables>;
export const UpdatePlanGeneralCharacteristicsDocument = gql`
    mutation UpdatePlanGeneralCharacteristics($id: UUID!, $changes: PlanGeneralCharacteristicsChanges!) {
  updatePlanGeneralCharacteristics(id: $id, changes: $changes) {
    id
  }
}
    `;
export type UpdatePlanGeneralCharacteristicsMutationFn = Apollo.MutationFunction<UpdatePlanGeneralCharacteristicsMutation, UpdatePlanGeneralCharacteristicsMutationVariables>;

/**
 * __useUpdatePlanGeneralCharacteristicsMutation__
 *
 * To run a mutation, you first call `useUpdatePlanGeneralCharacteristicsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlanGeneralCharacteristicsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlanGeneralCharacteristicsMutation, { data, loading, error }] = useUpdatePlanGeneralCharacteristicsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdatePlanGeneralCharacteristicsMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlanGeneralCharacteristicsMutation, UpdatePlanGeneralCharacteristicsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePlanGeneralCharacteristicsMutation, UpdatePlanGeneralCharacteristicsMutationVariables>(UpdatePlanGeneralCharacteristicsDocument, options);
      }
export type UpdatePlanGeneralCharacteristicsMutationHookResult = ReturnType<typeof useUpdatePlanGeneralCharacteristicsMutation>;
export type UpdatePlanGeneralCharacteristicsMutationResult = Apollo.MutationResult<UpdatePlanGeneralCharacteristicsMutation>;
export type UpdatePlanGeneralCharacteristicsMutationOptions = Apollo.BaseMutationOptions<UpdatePlanGeneralCharacteristicsMutation, UpdatePlanGeneralCharacteristicsMutationVariables>;
export const GetExistingModelPlansDocument = gql`
    query GetExistingModelPlans {
  existingModelCollection {
    id
    modelName
  }
}
    `;

/**
 * __useGetExistingModelPlansQuery__
 *
 * To run a query within a React component, call `useGetExistingModelPlansQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExistingModelPlansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExistingModelPlansQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExistingModelPlansQuery(baseOptions?: Apollo.QueryHookOptions<GetExistingModelPlansQuery, GetExistingModelPlansQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExistingModelPlansQuery, GetExistingModelPlansQueryVariables>(GetExistingModelPlansDocument, options);
      }
export function useGetExistingModelPlansLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExistingModelPlansQuery, GetExistingModelPlansQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExistingModelPlansQuery, GetExistingModelPlansQueryVariables>(GetExistingModelPlansDocument, options);
        }
export function useGetExistingModelPlansSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExistingModelPlansQuery, GetExistingModelPlansQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExistingModelPlansQuery, GetExistingModelPlansQueryVariables>(GetExistingModelPlansDocument, options);
        }
export type GetExistingModelPlansQueryHookResult = ReturnType<typeof useGetExistingModelPlansQuery>;
export type GetExistingModelPlansLazyQueryHookResult = ReturnType<typeof useGetExistingModelPlansLazyQuery>;
export type GetExistingModelPlansSuspenseQueryHookResult = ReturnType<typeof useGetExistingModelPlansSuspenseQuery>;
export type GetExistingModelPlansQueryResult = Apollo.QueryResult<GetExistingModelPlansQuery, GetExistingModelPlansQueryVariables>;
export const GetModelPlansBaseDocument = gql`
    query GetModelPlansBase($filter: ModelPlanFilter!) {
  modelPlanCollection(filter: $filter) {
    id
    modelName
  }
}
    `;

/**
 * __useGetModelPlansBaseQuery__
 *
 * To run a query within a React component, call `useGetModelPlansBaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModelPlansBaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModelPlansBaseQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetModelPlansBaseQuery(baseOptions: Apollo.QueryHookOptions<GetModelPlansBaseQuery, GetModelPlansBaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModelPlansBaseQuery, GetModelPlansBaseQueryVariables>(GetModelPlansBaseDocument, options);
      }
export function useGetModelPlansBaseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModelPlansBaseQuery, GetModelPlansBaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModelPlansBaseQuery, GetModelPlansBaseQueryVariables>(GetModelPlansBaseDocument, options);
        }
export function useGetModelPlansBaseSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetModelPlansBaseQuery, GetModelPlansBaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModelPlansBaseQuery, GetModelPlansBaseQueryVariables>(GetModelPlansBaseDocument, options);
        }
export type GetModelPlansBaseQueryHookResult = ReturnType<typeof useGetModelPlansBaseQuery>;
export type GetModelPlansBaseLazyQueryHookResult = ReturnType<typeof useGetModelPlansBaseLazyQuery>;
export type GetModelPlansBaseSuspenseQueryHookResult = ReturnType<typeof useGetModelPlansBaseSuspenseQuery>;
export type GetModelPlansBaseQueryResult = Apollo.QueryResult<GetModelPlansBaseQuery, GetModelPlansBaseQueryVariables>;
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
export const GetAllOpsEvalAndLearningDocument = gql`
    query GetAllOpsEvalAndLearning($id: UUID!) {
  modelPlan(id: $id) {
    id
    opsEvalAndLearning {
      id
      modelPlanID
      stakeholders
      stakeholdersOther
      stakeholdersNote
      helpdeskUse
      helpdeskUseNote
      contractorSupport
      contractorSupportOther
      contractorSupportHow
      contractorSupportNote
      iddocSupport
      iddocSupportNote
      technicalContactsIdentified
      technicalContactsIdentifiedDetail
      technicalContactsIdentifiedNote
      captureParticipantInfo
      captureParticipantInfoNote
      icdOwner
      draftIcdDueDate
      icdNote
      uatNeeds
      stcNeeds
      testingTimelines
      testingNote
      dataMonitoringFileTypes
      dataMonitoringFileOther
      dataResponseType
      dataResponseFileFrequency
      dataFullTimeOrIncremental
      eftSetUp
      unsolicitedAdjustmentsIncluded
      dataFlowDiagramsNeeded
      produceBenefitEnhancementFiles
      fileNamingConventions
      dataMonitoringNote
      benchmarkForPerformance
      benchmarkForPerformanceNote
      computePerformanceScores
      computePerformanceScoresNote
      riskAdjustPerformance
      riskAdjustFeedback
      riskAdjustPayments
      riskAdjustOther
      riskAdjustNote
      appealPerformance
      appealFeedback
      appealPayments
      appealOther
      appealNote
      evaluationApproaches
      evaluationApproachOther
      evalutaionApproachNote
      ccmInvolvment
      ccmInvolvmentOther
      ccmInvolvmentNote
      dataNeededForMonitoring
      dataNeededForMonitoringOther
      dataNeededForMonitoringNote
      dataToSendParticicipants
      dataToSendParticicipantsOther
      dataToSendParticicipantsNote
      shareCclfData
      shareCclfDataNote
      sendFilesBetweenCcw
      sendFilesBetweenCcwNote
      appToSendFilesToKnown
      appToSendFilesToWhich
      appToSendFilesToNote
      useCcwForFileDistribiutionToParticipants
      useCcwForFileDistribiutionToParticipantsNote
      developNewQualityMeasures
      developNewQualityMeasuresNote
      qualityPerformanceImpactsPayment
      qualityPerformanceImpactsPaymentOther
      qualityPerformanceImpactsPaymentNote
      dataSharingStarts
      dataSharingStartsOther
      dataSharingFrequency
      dataSharingFrequencyContinually
      dataSharingFrequencyOther
      dataSharingStartsNote
      dataCollectionStarts
      dataCollectionStartsOther
      dataCollectionFrequency
      dataCollectionFrequencyContinually
      dataCollectionFrequencyOther
      dataCollectionFrequencyNote
      qualityReportingStarts
      qualityReportingStartsOther
      qualityReportingStartsNote
      qualityReportingFrequency
      qualityReportingFrequencyContinually
      qualityReportingFrequencyOther
      modelLearningSystems
      modelLearningSystemsOther
      modelLearningSystemsNote
      anticipatedChallenges
      status
    }
  }
}
    `;

/**
 * __useGetAllOpsEvalAndLearningQuery__
 *
 * To run a query within a React component, call `useGetAllOpsEvalAndLearningQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllOpsEvalAndLearningQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllOpsEvalAndLearningQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAllOpsEvalAndLearningQuery(baseOptions: Apollo.QueryHookOptions<GetAllOpsEvalAndLearningQuery, GetAllOpsEvalAndLearningQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllOpsEvalAndLearningQuery, GetAllOpsEvalAndLearningQueryVariables>(GetAllOpsEvalAndLearningDocument, options);
      }
export function useGetAllOpsEvalAndLearningLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllOpsEvalAndLearningQuery, GetAllOpsEvalAndLearningQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllOpsEvalAndLearningQuery, GetAllOpsEvalAndLearningQueryVariables>(GetAllOpsEvalAndLearningDocument, options);
        }
export function useGetAllOpsEvalAndLearningSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllOpsEvalAndLearningQuery, GetAllOpsEvalAndLearningQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllOpsEvalAndLearningQuery, GetAllOpsEvalAndLearningQueryVariables>(GetAllOpsEvalAndLearningDocument, options);
        }
export type GetAllOpsEvalAndLearningQueryHookResult = ReturnType<typeof useGetAllOpsEvalAndLearningQuery>;
export type GetAllOpsEvalAndLearningLazyQueryHookResult = ReturnType<typeof useGetAllOpsEvalAndLearningLazyQuery>;
export type GetAllOpsEvalAndLearningSuspenseQueryHookResult = ReturnType<typeof useGetAllOpsEvalAndLearningSuspenseQuery>;
export type GetAllOpsEvalAndLearningQueryResult = Apollo.QueryResult<GetAllOpsEvalAndLearningQuery, GetAllOpsEvalAndLearningQueryVariables>;
export const GetCcwAndQualityDocument = gql`
    query GetCCWAndQuality($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      sendFilesBetweenCcw
      sendFilesBetweenCcwNote
      appToSendFilesToKnown
      appToSendFilesToWhich
      appToSendFilesToNote
      useCcwForFileDistribiutionToParticipants
      useCcwForFileDistribiutionToParticipantsNote
      developNewQualityMeasures
      developNewQualityMeasuresNote
      qualityPerformanceImpactsPayment
      qualityPerformanceImpactsPaymentOther
      qualityPerformanceImpactsPaymentNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetCcwAndQualityQuery__
 *
 * To run a query within a React component, call `useGetCcwAndQualityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCcwAndQualityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCcwAndQualityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCcwAndQualityQuery(baseOptions: Apollo.QueryHookOptions<GetCcwAndQualityQuery, GetCcwAndQualityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCcwAndQualityQuery, GetCcwAndQualityQueryVariables>(GetCcwAndQualityDocument, options);
      }
export function useGetCcwAndQualityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCcwAndQualityQuery, GetCcwAndQualityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCcwAndQualityQuery, GetCcwAndQualityQueryVariables>(GetCcwAndQualityDocument, options);
        }
export function useGetCcwAndQualitySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCcwAndQualityQuery, GetCcwAndQualityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCcwAndQualityQuery, GetCcwAndQualityQueryVariables>(GetCcwAndQualityDocument, options);
        }
export type GetCcwAndQualityQueryHookResult = ReturnType<typeof useGetCcwAndQualityQuery>;
export type GetCcwAndQualityLazyQueryHookResult = ReturnType<typeof useGetCcwAndQualityLazyQuery>;
export type GetCcwAndQualitySuspenseQueryHookResult = ReturnType<typeof useGetCcwAndQualitySuspenseQuery>;
export type GetCcwAndQualityQueryResult = Apollo.QueryResult<GetCcwAndQualityQuery, GetCcwAndQualityQueryVariables>;
export const GetDataSharingDocument = gql`
    query GetDataSharing($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      dataSharingStarts
      dataSharingStartsOther
      dataSharingFrequency
      dataSharingFrequencyContinually
      dataSharingFrequencyOther
      dataSharingStartsNote
      dataCollectionStarts
      dataCollectionStartsOther
      dataCollectionFrequency
      dataCollectionFrequencyContinually
      dataCollectionFrequencyOther
      dataCollectionFrequencyNote
      qualityReportingStarts
      qualityReportingStartsOther
      qualityReportingStartsNote
      qualityReportingFrequency
      qualityReportingFrequencyContinually
      qualityReportingFrequencyOther
    }
  }
}
    `;

/**
 * __useGetDataSharingQuery__
 *
 * To run a query within a React component, call `useGetDataSharingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataSharingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataSharingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDataSharingQuery(baseOptions: Apollo.QueryHookOptions<GetDataSharingQuery, GetDataSharingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDataSharingQuery, GetDataSharingQueryVariables>(GetDataSharingDocument, options);
      }
export function useGetDataSharingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataSharingQuery, GetDataSharingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDataSharingQuery, GetDataSharingQueryVariables>(GetDataSharingDocument, options);
        }
export function useGetDataSharingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDataSharingQuery, GetDataSharingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDataSharingQuery, GetDataSharingQueryVariables>(GetDataSharingDocument, options);
        }
export type GetDataSharingQueryHookResult = ReturnType<typeof useGetDataSharingQuery>;
export type GetDataSharingLazyQueryHookResult = ReturnType<typeof useGetDataSharingLazyQuery>;
export type GetDataSharingSuspenseQueryHookResult = ReturnType<typeof useGetDataSharingSuspenseQuery>;
export type GetDataSharingQueryResult = Apollo.QueryResult<GetDataSharingQuery, GetDataSharingQueryVariables>;
export const GetEvaluationDocument = gql`
    query GetEvaluation($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      evaluationApproaches
      evaluationApproachOther
      evalutaionApproachNote
      ccmInvolvment
      ccmInvolvmentOther
      ccmInvolvmentNote
      dataNeededForMonitoring
      dataNeededForMonitoringOther
      dataNeededForMonitoringNote
      dataToSendParticicipants
      dataToSendParticicipantsOther
      dataToSendParticicipantsNote
      shareCclfData
      shareCclfDataNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetEvaluationQuery__
 *
 * To run a query within a React component, call `useGetEvaluationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEvaluationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEvaluationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEvaluationQuery(baseOptions: Apollo.QueryHookOptions<GetEvaluationQuery, GetEvaluationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEvaluationQuery, GetEvaluationQueryVariables>(GetEvaluationDocument, options);
      }
export function useGetEvaluationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEvaluationQuery, GetEvaluationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEvaluationQuery, GetEvaluationQueryVariables>(GetEvaluationDocument, options);
        }
export function useGetEvaluationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEvaluationQuery, GetEvaluationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEvaluationQuery, GetEvaluationQueryVariables>(GetEvaluationDocument, options);
        }
export type GetEvaluationQueryHookResult = ReturnType<typeof useGetEvaluationQuery>;
export type GetEvaluationLazyQueryHookResult = ReturnType<typeof useGetEvaluationLazyQuery>;
export type GetEvaluationSuspenseQueryHookResult = ReturnType<typeof useGetEvaluationSuspenseQuery>;
export type GetEvaluationQueryResult = Apollo.QueryResult<GetEvaluationQuery, GetEvaluationQueryVariables>;
export const GetIddocDocument = gql`
    query GetIDDOC($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      technicalContactsIdentified
      technicalContactsIdentifiedDetail
      technicalContactsIdentifiedNote
      captureParticipantInfo
      captureParticipantInfoNote
      icdOwner
      draftIcdDueDate
      icdNote
    }
  }
}
    `;

/**
 * __useGetIddocQuery__
 *
 * To run a query within a React component, call `useGetIddocQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIddocQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIddocQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetIddocQuery(baseOptions: Apollo.QueryHookOptions<GetIddocQuery, GetIddocQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIddocQuery, GetIddocQueryVariables>(GetIddocDocument, options);
      }
export function useGetIddocLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIddocQuery, GetIddocQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIddocQuery, GetIddocQueryVariables>(GetIddocDocument, options);
        }
export function useGetIddocSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetIddocQuery, GetIddocQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIddocQuery, GetIddocQueryVariables>(GetIddocDocument, options);
        }
export type GetIddocQueryHookResult = ReturnType<typeof useGetIddocQuery>;
export type GetIddocLazyQueryHookResult = ReturnType<typeof useGetIddocLazyQuery>;
export type GetIddocSuspenseQueryHookResult = ReturnType<typeof useGetIddocSuspenseQuery>;
export type GetIddocQueryResult = Apollo.QueryResult<GetIddocQuery, GetIddocQueryVariables>;
export const GetIddocMonitoringDocument = gql`
    query GetIDDOCMonitoring($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      dataFullTimeOrIncremental
      eftSetUp
      unsolicitedAdjustmentsIncluded
      dataFlowDiagramsNeeded
      produceBenefitEnhancementFiles
      fileNamingConventions
      dataMonitoringNote
    }
  }
}
    `;

/**
 * __useGetIddocMonitoringQuery__
 *
 * To run a query within a React component, call `useGetIddocMonitoringQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIddocMonitoringQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIddocMonitoringQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetIddocMonitoringQuery(baseOptions: Apollo.QueryHookOptions<GetIddocMonitoringQuery, GetIddocMonitoringQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIddocMonitoringQuery, GetIddocMonitoringQueryVariables>(GetIddocMonitoringDocument, options);
      }
export function useGetIddocMonitoringLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIddocMonitoringQuery, GetIddocMonitoringQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIddocMonitoringQuery, GetIddocMonitoringQueryVariables>(GetIddocMonitoringDocument, options);
        }
export function useGetIddocMonitoringSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetIddocMonitoringQuery, GetIddocMonitoringQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIddocMonitoringQuery, GetIddocMonitoringQueryVariables>(GetIddocMonitoringDocument, options);
        }
export type GetIddocMonitoringQueryHookResult = ReturnType<typeof useGetIddocMonitoringQuery>;
export type GetIddocMonitoringLazyQueryHookResult = ReturnType<typeof useGetIddocMonitoringLazyQuery>;
export type GetIddocMonitoringSuspenseQueryHookResult = ReturnType<typeof useGetIddocMonitoringSuspenseQuery>;
export type GetIddocMonitoringQueryResult = Apollo.QueryResult<GetIddocMonitoringQuery, GetIddocMonitoringQueryVariables>;
export const GetIddocTestingDocument = gql`
    query GetIDDOCTesting($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      uatNeeds
      stcNeeds
      testingTimelines
      testingNote
      dataMonitoringFileTypes
      dataMonitoringFileOther
      dataResponseType
      dataResponseFileFrequency
    }
  }
}
    `;

/**
 * __useGetIddocTestingQuery__
 *
 * To run a query within a React component, call `useGetIddocTestingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIddocTestingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIddocTestingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetIddocTestingQuery(baseOptions: Apollo.QueryHookOptions<GetIddocTestingQuery, GetIddocTestingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIddocTestingQuery, GetIddocTestingQueryVariables>(GetIddocTestingDocument, options);
      }
export function useGetIddocTestingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIddocTestingQuery, GetIddocTestingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIddocTestingQuery, GetIddocTestingQueryVariables>(GetIddocTestingDocument, options);
        }
export function useGetIddocTestingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetIddocTestingQuery, GetIddocTestingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIddocTestingQuery, GetIddocTestingQueryVariables>(GetIddocTestingDocument, options);
        }
export type GetIddocTestingQueryHookResult = ReturnType<typeof useGetIddocTestingQuery>;
export type GetIddocTestingLazyQueryHookResult = ReturnType<typeof useGetIddocTestingLazyQuery>;
export type GetIddocTestingSuspenseQueryHookResult = ReturnType<typeof useGetIddocTestingSuspenseQuery>;
export type GetIddocTestingQueryResult = Apollo.QueryResult<GetIddocTestingQuery, GetIddocTestingQueryVariables>;
export const GetLearningDocument = gql`
    query GetLearning($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      modelLearningSystems
      modelLearningSystemsOther
      modelLearningSystemsNote
      anticipatedChallenges
      readyForReviewByUserAccount {
        id
        commonName
      }
      readyForReviewDts
      status
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetLearningQuery__
 *
 * To run a query within a React component, call `useGetLearningQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLearningQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLearningQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLearningQuery(baseOptions: Apollo.QueryHookOptions<GetLearningQuery, GetLearningQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLearningQuery, GetLearningQueryVariables>(GetLearningDocument, options);
      }
export function useGetLearningLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLearningQuery, GetLearningQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLearningQuery, GetLearningQueryVariables>(GetLearningDocument, options);
        }
export function useGetLearningSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLearningQuery, GetLearningQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLearningQuery, GetLearningQueryVariables>(GetLearningDocument, options);
        }
export type GetLearningQueryHookResult = ReturnType<typeof useGetLearningQuery>;
export type GetLearningLazyQueryHookResult = ReturnType<typeof useGetLearningLazyQuery>;
export type GetLearningSuspenseQueryHookResult = ReturnType<typeof useGetLearningSuspenseQuery>;
export type GetLearningQueryResult = Apollo.QueryResult<GetLearningQuery, GetLearningQueryVariables>;
export const GetOpsEvalAndLearningDocument = gql`
    query GetOpsEvalAndLearning($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      stakeholders
      stakeholdersOther
      stakeholdersNote
      helpdeskUse
      helpdeskUseNote
      contractorSupport
      contractorSupportOther
      contractorSupportHow
      contractorSupportNote
      iddocSupport
      iddocSupportNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetOpsEvalAndLearningQuery__
 *
 * To run a query within a React component, call `useGetOpsEvalAndLearningQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpsEvalAndLearningQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpsEvalAndLearningQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOpsEvalAndLearningQuery(baseOptions: Apollo.QueryHookOptions<GetOpsEvalAndLearningQuery, GetOpsEvalAndLearningQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOpsEvalAndLearningQuery, GetOpsEvalAndLearningQueryVariables>(GetOpsEvalAndLearningDocument, options);
      }
export function useGetOpsEvalAndLearningLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOpsEvalAndLearningQuery, GetOpsEvalAndLearningQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOpsEvalAndLearningQuery, GetOpsEvalAndLearningQueryVariables>(GetOpsEvalAndLearningDocument, options);
        }
export function useGetOpsEvalAndLearningSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetOpsEvalAndLearningQuery, GetOpsEvalAndLearningQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOpsEvalAndLearningQuery, GetOpsEvalAndLearningQueryVariables>(GetOpsEvalAndLearningDocument, options);
        }
export type GetOpsEvalAndLearningQueryHookResult = ReturnType<typeof useGetOpsEvalAndLearningQuery>;
export type GetOpsEvalAndLearningLazyQueryHookResult = ReturnType<typeof useGetOpsEvalAndLearningLazyQuery>;
export type GetOpsEvalAndLearningSuspenseQueryHookResult = ReturnType<typeof useGetOpsEvalAndLearningSuspenseQuery>;
export type GetOpsEvalAndLearningQueryResult = Apollo.QueryResult<GetOpsEvalAndLearningQuery, GetOpsEvalAndLearningQueryVariables>;
export const GetPerformanceDocument = gql`
    query GetPerformance($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    opsEvalAndLearning {
      id
      ccmInvolvment
      dataNeededForMonitoring
      iddocSupport
      benchmarkForPerformance
      benchmarkForPerformanceNote
      computePerformanceScores
      computePerformanceScoresNote
      riskAdjustPerformance
      riskAdjustFeedback
      riskAdjustPayments
      riskAdjustOther
      riskAdjustNote
      appealPerformance
      appealFeedback
      appealPayments
      appealOther
      appealNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetPerformanceQuery__
 *
 * To run a query within a React component, call `useGetPerformanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPerformanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPerformanceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPerformanceQuery(baseOptions: Apollo.QueryHookOptions<GetPerformanceQuery, GetPerformanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPerformanceQuery, GetPerformanceQueryVariables>(GetPerformanceDocument, options);
      }
export function useGetPerformanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPerformanceQuery, GetPerformanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPerformanceQuery, GetPerformanceQueryVariables>(GetPerformanceDocument, options);
        }
export function useGetPerformanceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPerformanceQuery, GetPerformanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPerformanceQuery, GetPerformanceQueryVariables>(GetPerformanceDocument, options);
        }
export type GetPerformanceQueryHookResult = ReturnType<typeof useGetPerformanceQuery>;
export type GetPerformanceLazyQueryHookResult = ReturnType<typeof useGetPerformanceLazyQuery>;
export type GetPerformanceSuspenseQueryHookResult = ReturnType<typeof useGetPerformanceSuspenseQuery>;
export type GetPerformanceQueryResult = Apollo.QueryResult<GetPerformanceQuery, GetPerformanceQueryVariables>;
export const UpdatePlanOpsEvalAndLearningDocument = gql`
    mutation UpdatePlanOpsEvalAndLearning($id: UUID!, $changes: PlanOpsEvalAndLearningChanges!) {
  updatePlanOpsEvalAndLearning(id: $id, changes: $changes) {
    id
  }
}
    `;
export type UpdatePlanOpsEvalAndLearningMutationFn = Apollo.MutationFunction<UpdatePlanOpsEvalAndLearningMutation, UpdatePlanOpsEvalAndLearningMutationVariables>;

/**
 * __useUpdatePlanOpsEvalAndLearningMutation__
 *
 * To run a mutation, you first call `useUpdatePlanOpsEvalAndLearningMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlanOpsEvalAndLearningMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlanOpsEvalAndLearningMutation, { data, loading, error }] = useUpdatePlanOpsEvalAndLearningMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdatePlanOpsEvalAndLearningMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlanOpsEvalAndLearningMutation, UpdatePlanOpsEvalAndLearningMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePlanOpsEvalAndLearningMutation, UpdatePlanOpsEvalAndLearningMutationVariables>(UpdatePlanOpsEvalAndLearningDocument, options);
      }
export type UpdatePlanOpsEvalAndLearningMutationHookResult = ReturnType<typeof useUpdatePlanOpsEvalAndLearningMutation>;
export type UpdatePlanOpsEvalAndLearningMutationResult = Apollo.MutationResult<UpdatePlanOpsEvalAndLearningMutation>;
export type UpdatePlanOpsEvalAndLearningMutationOptions = Apollo.BaseMutationOptions<UpdatePlanOpsEvalAndLearningMutation, UpdatePlanOpsEvalAndLearningMutationVariables>;
export const GetAllParticipantsAndProvidersDocument = gql`
    query GetAllParticipantsAndProviders($id: UUID!) {
  modelPlan(id: $id) {
    id
    participantsAndProviders {
      id
      participants
      medicareProviderType
      statesEngagement
      participantsOther
      participantsNote
      participantsCurrentlyInModels
      participantsCurrentlyInModelsNote
      modelApplicationLevel
      expectedNumberOfParticipants
      estimateConfidence
      confidenceNote
      recruitmentMethod
      recruitmentOther
      recruitmentNote
      selectionMethod
      selectionOther
      selectionNote
      participantAddedFrequency
      participantAddedFrequencyContinually
      participantAddedFrequencyOther
      participantAddedFrequencyNote
      participantRemovedFrequency
      participantRemovedFrequencyContinually
      participantRemovedFrequencyOther
      participantRemovedFrequencyNote
      communicationMethod
      communicationMethodOther
      communicationNote
      riskType
      riskOther
      riskNote
      willRiskChange
      willRiskChangeNote
      coordinateWork
      coordinateWorkNote
      gainsharePayments
      gainsharePaymentsTrack
      gainsharePaymentsNote
      gainsharePaymentsEligibility
      gainsharePaymentsEligibilityOther
      participantsIds
      participantsIdsOther
      participantsIDSNote
      providerAdditionFrequency
      providerAdditionFrequencyContinually
      providerAdditionFrequencyOther
      providerAdditionFrequencyNote
      providerAddMethod
      providerAddMethodOther
      providerAddMethodNote
      providerLeaveMethod
      providerLeaveMethodOther
      providerLeaveMethodNote
      providerRemovalFrequency
      providerRemovalFrequencyContinually
      providerRemovalFrequencyOther
      providerRemovalFrequencyNote
      providerOverlap
      providerOverlapHierarchy
      providerOverlapNote
      status
    }
  }
}
    `;

/**
 * __useGetAllParticipantsAndProvidersQuery__
 *
 * To run a query within a React component, call `useGetAllParticipantsAndProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllParticipantsAndProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllParticipantsAndProvidersQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAllParticipantsAndProvidersQuery(baseOptions: Apollo.QueryHookOptions<GetAllParticipantsAndProvidersQuery, GetAllParticipantsAndProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllParticipantsAndProvidersQuery, GetAllParticipantsAndProvidersQueryVariables>(GetAllParticipantsAndProvidersDocument, options);
      }
export function useGetAllParticipantsAndProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllParticipantsAndProvidersQuery, GetAllParticipantsAndProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllParticipantsAndProvidersQuery, GetAllParticipantsAndProvidersQueryVariables>(GetAllParticipantsAndProvidersDocument, options);
        }
export function useGetAllParticipantsAndProvidersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllParticipantsAndProvidersQuery, GetAllParticipantsAndProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllParticipantsAndProvidersQuery, GetAllParticipantsAndProvidersQueryVariables>(GetAllParticipantsAndProvidersDocument, options);
        }
export type GetAllParticipantsAndProvidersQueryHookResult = ReturnType<typeof useGetAllParticipantsAndProvidersQuery>;
export type GetAllParticipantsAndProvidersLazyQueryHookResult = ReturnType<typeof useGetAllParticipantsAndProvidersLazyQuery>;
export type GetAllParticipantsAndProvidersSuspenseQueryHookResult = ReturnType<typeof useGetAllParticipantsAndProvidersSuspenseQuery>;
export type GetAllParticipantsAndProvidersQueryResult = Apollo.QueryResult<GetAllParticipantsAndProvidersQuery, GetAllParticipantsAndProvidersQueryVariables>;
export const GetCommunicationDocument = gql`
    query GetCommunication($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    participantsAndProviders {
      id
      participantAddedFrequency
      participantAddedFrequencyContinually
      participantAddedFrequencyOther
      participantAddedFrequencyNote
      participantRemovedFrequency
      participantRemovedFrequencyContinually
      participantRemovedFrequencyOther
      participantRemovedFrequencyNote
      communicationMethod
      communicationMethodOther
      communicationNote
      riskType
      riskOther
      riskNote
      willRiskChange
      willRiskChangeNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetCommunicationQuery__
 *
 * To run a query within a React component, call `useGetCommunicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommunicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommunicationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCommunicationQuery(baseOptions: Apollo.QueryHookOptions<GetCommunicationQuery, GetCommunicationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCommunicationQuery, GetCommunicationQueryVariables>(GetCommunicationDocument, options);
      }
export function useGetCommunicationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommunicationQuery, GetCommunicationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCommunicationQuery, GetCommunicationQueryVariables>(GetCommunicationDocument, options);
        }
export function useGetCommunicationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCommunicationQuery, GetCommunicationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCommunicationQuery, GetCommunicationQueryVariables>(GetCommunicationDocument, options);
        }
export type GetCommunicationQueryHookResult = ReturnType<typeof useGetCommunicationQuery>;
export type GetCommunicationLazyQueryHookResult = ReturnType<typeof useGetCommunicationLazyQuery>;
export type GetCommunicationSuspenseQueryHookResult = ReturnType<typeof useGetCommunicationSuspenseQuery>;
export type GetCommunicationQueryResult = Apollo.QueryResult<GetCommunicationQuery, GetCommunicationQueryVariables>;
export const GetCoordinationDocument = gql`
    query GetCoordination($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    participantsAndProviders {
      id
      coordinateWork
      coordinateWorkNote
      gainsharePayments
      gainsharePaymentsEligibility
      gainsharePaymentsEligibilityOther
      gainsharePaymentsTrack
      gainsharePaymentsNote
      participantsIds
      participantsIdsOther
      participantsIDSNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetCoordinationQuery__
 *
 * To run a query within a React component, call `useGetCoordinationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCoordinationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCoordinationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCoordinationQuery(baseOptions: Apollo.QueryHookOptions<GetCoordinationQuery, GetCoordinationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCoordinationQuery, GetCoordinationQueryVariables>(GetCoordinationDocument, options);
      }
export function useGetCoordinationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCoordinationQuery, GetCoordinationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCoordinationQuery, GetCoordinationQueryVariables>(GetCoordinationDocument, options);
        }
export function useGetCoordinationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCoordinationQuery, GetCoordinationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCoordinationQuery, GetCoordinationQueryVariables>(GetCoordinationDocument, options);
        }
export type GetCoordinationQueryHookResult = ReturnType<typeof useGetCoordinationQuery>;
export type GetCoordinationLazyQueryHookResult = ReturnType<typeof useGetCoordinationLazyQuery>;
export type GetCoordinationSuspenseQueryHookResult = ReturnType<typeof useGetCoordinationSuspenseQuery>;
export type GetCoordinationQueryResult = Apollo.QueryResult<GetCoordinationQuery, GetCoordinationQueryVariables>;
export const GetParticipantOptionsDocument = gql`
    query GetParticipantOptions($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    participantsAndProviders {
      id
      expectedNumberOfParticipants
      estimateConfidence
      confidenceNote
      recruitmentMethod
      recruitmentOther
      recruitmentNote
      selectionMethod
      selectionOther
      selectionNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetParticipantOptionsQuery__
 *
 * To run a query within a React component, call `useGetParticipantOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantOptionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetParticipantOptionsQuery(baseOptions: Apollo.QueryHookOptions<GetParticipantOptionsQuery, GetParticipantOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetParticipantOptionsQuery, GetParticipantOptionsQueryVariables>(GetParticipantOptionsDocument, options);
      }
export function useGetParticipantOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetParticipantOptionsQuery, GetParticipantOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetParticipantOptionsQuery, GetParticipantOptionsQueryVariables>(GetParticipantOptionsDocument, options);
        }
export function useGetParticipantOptionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetParticipantOptionsQuery, GetParticipantOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetParticipantOptionsQuery, GetParticipantOptionsQueryVariables>(GetParticipantOptionsDocument, options);
        }
export type GetParticipantOptionsQueryHookResult = ReturnType<typeof useGetParticipantOptionsQuery>;
export type GetParticipantOptionsLazyQueryHookResult = ReturnType<typeof useGetParticipantOptionsLazyQuery>;
export type GetParticipantOptionsSuspenseQueryHookResult = ReturnType<typeof useGetParticipantOptionsSuspenseQuery>;
export type GetParticipantOptionsQueryResult = Apollo.QueryResult<GetParticipantOptionsQuery, GetParticipantOptionsQueryVariables>;
export const GetParticipantsAndProvidersDocument = gql`
    query GetParticipantsAndProviders($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    participantsAndProviders {
      id
      participants
      medicareProviderType
      statesEngagement
      participantsOther
      participantsNote
      participantsCurrentlyInModels
      participantsCurrentlyInModelsNote
      modelApplicationLevel
    }
  }
}
    `;

/**
 * __useGetParticipantsAndProvidersQuery__
 *
 * To run a query within a React component, call `useGetParticipantsAndProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantsAndProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantsAndProvidersQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetParticipantsAndProvidersQuery(baseOptions: Apollo.QueryHookOptions<GetParticipantsAndProvidersQuery, GetParticipantsAndProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetParticipantsAndProvidersQuery, GetParticipantsAndProvidersQueryVariables>(GetParticipantsAndProvidersDocument, options);
      }
export function useGetParticipantsAndProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetParticipantsAndProvidersQuery, GetParticipantsAndProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetParticipantsAndProvidersQuery, GetParticipantsAndProvidersQueryVariables>(GetParticipantsAndProvidersDocument, options);
        }
export function useGetParticipantsAndProvidersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetParticipantsAndProvidersQuery, GetParticipantsAndProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetParticipantsAndProvidersQuery, GetParticipantsAndProvidersQueryVariables>(GetParticipantsAndProvidersDocument, options);
        }
export type GetParticipantsAndProvidersQueryHookResult = ReturnType<typeof useGetParticipantsAndProvidersQuery>;
export type GetParticipantsAndProvidersLazyQueryHookResult = ReturnType<typeof useGetParticipantsAndProvidersLazyQuery>;
export type GetParticipantsAndProvidersSuspenseQueryHookResult = ReturnType<typeof useGetParticipantsAndProvidersSuspenseQuery>;
export type GetParticipantsAndProvidersQueryResult = Apollo.QueryResult<GetParticipantsAndProvidersQuery, GetParticipantsAndProvidersQueryVariables>;
export const GetProviderOptionsDocument = gql`
    query GetProviderOptions($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    participantsAndProviders {
      id
      providerAdditionFrequency
      providerAdditionFrequencyContinually
      providerAdditionFrequencyOther
      providerAdditionFrequencyNote
      providerAddMethod
      providerAddMethodOther
      providerAddMethodNote
      providerLeaveMethod
      providerLeaveMethodOther
      providerLeaveMethodNote
      providerRemovalFrequency
      providerRemovalFrequencyContinually
      providerRemovalFrequencyOther
      providerRemovalFrequencyNote
      providerOverlap
      providerOverlapHierarchy
      providerOverlapNote
      readyForReviewByUserAccount {
        id
        commonName
      }
      readyForReviewDts
      status
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetProviderOptionsQuery__
 *
 * To run a query within a React component, call `useGetProviderOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProviderOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProviderOptionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProviderOptionsQuery(baseOptions: Apollo.QueryHookOptions<GetProviderOptionsQuery, GetProviderOptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProviderOptionsQuery, GetProviderOptionsQueryVariables>(GetProviderOptionsDocument, options);
      }
export function useGetProviderOptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProviderOptionsQuery, GetProviderOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProviderOptionsQuery, GetProviderOptionsQueryVariables>(GetProviderOptionsDocument, options);
        }
export function useGetProviderOptionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProviderOptionsQuery, GetProviderOptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProviderOptionsQuery, GetProviderOptionsQueryVariables>(GetProviderOptionsDocument, options);
        }
export type GetProviderOptionsQueryHookResult = ReturnType<typeof useGetProviderOptionsQuery>;
export type GetProviderOptionsLazyQueryHookResult = ReturnType<typeof useGetProviderOptionsLazyQuery>;
export type GetProviderOptionsSuspenseQueryHookResult = ReturnType<typeof useGetProviderOptionsSuspenseQuery>;
export type GetProviderOptionsQueryResult = Apollo.QueryResult<GetProviderOptionsQuery, GetProviderOptionsQueryVariables>;
export const UpdatePlanParticipantsAndProvidersDocument = gql`
    mutation UpdatePlanParticipantsAndProviders($id: UUID!, $changes: PlanParticipantsAndProvidersChanges!) {
  updatePlanParticipantsAndProviders(id: $id, changes: $changes) {
    id
  }
}
    `;
export type UpdatePlanParticipantsAndProvidersMutationFn = Apollo.MutationFunction<UpdatePlanParticipantsAndProvidersMutation, UpdatePlanParticipantsAndProvidersMutationVariables>;

/**
 * __useUpdatePlanParticipantsAndProvidersMutation__
 *
 * To run a mutation, you first call `useUpdatePlanParticipantsAndProvidersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlanParticipantsAndProvidersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlanParticipantsAndProvidersMutation, { data, loading, error }] = useUpdatePlanParticipantsAndProvidersMutation({
 *   variables: {
 *      id: // value for 'id'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useUpdatePlanParticipantsAndProvidersMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlanParticipantsAndProvidersMutation, UpdatePlanParticipantsAndProvidersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePlanParticipantsAndProvidersMutation, UpdatePlanParticipantsAndProvidersMutationVariables>(UpdatePlanParticipantsAndProvidersDocument, options);
      }
export type UpdatePlanParticipantsAndProvidersMutationHookResult = ReturnType<typeof useUpdatePlanParticipantsAndProvidersMutation>;
export type UpdatePlanParticipantsAndProvidersMutationResult = Apollo.MutationResult<UpdatePlanParticipantsAndProvidersMutation>;
export type UpdatePlanParticipantsAndProvidersMutationOptions = Apollo.BaseMutationOptions<UpdatePlanParticipantsAndProvidersMutation, UpdatePlanParticipantsAndProvidersMutationVariables>;
export const GetAllPaymentsDocument = gql`
    query GetAllPayments($id: UUID!) {
  modelPlan(id: $id) {
    id
    payments {
      fundingSource
      fundingSourceMedicareAInfo
      fundingSourceMedicareBInfo
      fundingSourceOther
      fundingSourceNote
      fundingSourceR
      fundingSourceRMedicareAInfo
      fundingSourceRMedicareBInfo
      fundingSourceROther
      fundingSourceRNote
      payRecipients
      payRecipientsOtherSpecification
      payRecipientsNote
      payType
      payTypeNote
      payClaims
      payClaimsOther
      payClaimsNote
      shouldAnyProvidersExcludedFFSSystems
      shouldAnyProviderExcludedFFSSystemsNote
      changesMedicarePhysicianFeeSchedule
      changesMedicarePhysicianFeeScheduleNote
      affectsMedicareSecondaryPayerClaims
      affectsMedicareSecondaryPayerClaimsHow
      affectsMedicareSecondaryPayerClaimsNote
      payModelDifferentiation
      creatingDependenciesBetweenServices
      creatingDependenciesBetweenServicesNote
      needsClaimsDataCollection
      needsClaimsDataCollectionNote
      providingThirdPartyFile
      isContractorAwareTestDataRequirements
      beneficiaryCostSharingLevelAndHandling
      waiveBeneficiaryCostSharingForAnyServices
      waiveBeneficiaryCostSharingServiceSpecification
      waiverOnlyAppliesPartOfPayment
      waiveBeneficiaryCostSharingNote
      nonClaimsPayments
      nonClaimsPaymentsNote
      nonClaimsPaymentOther
      paymentCalculationOwner
      numberPaymentsPerPayCycle
      numberPaymentsPerPayCycleNote
      sharedSystemsInvolvedAdditionalClaimPayment
      sharedSystemsInvolvedAdditionalClaimPaymentNote
      planningToUseInnovationPaymentContractor
      planningToUseInnovationPaymentContractorNote
      expectedCalculationComplexityLevel
      expectedCalculationComplexityLevelNote
      claimsProcessingPrecedence
      claimsProcessingPrecedenceOther
      claimsProcessingPrecedenceNote
      canParticipantsSelectBetweenPaymentMechanisms
      canParticipantsSelectBetweenPaymentMechanismsHow
      canParticipantsSelectBetweenPaymentMechanismsNote
      anticipatedPaymentFrequency
      anticipatedPaymentFrequencyContinually
      anticipatedPaymentFrequencyOther
      anticipatedPaymentFrequencyNote
      willRecoverPayments
      willRecoverPaymentsNote
      anticipateReconcilingPaymentsRetrospectively
      anticipateReconcilingPaymentsRetrospectivelyNote
      paymentReconciliationFrequency
      paymentReconciliationFrequencyContinually
      paymentReconciliationFrequencyOther
      paymentReconciliationFrequencyNote
      paymentDemandRecoupmentFrequency
      paymentDemandRecoupmentFrequencyContinually
      paymentDemandRecoupmentFrequencyOther
      paymentDemandRecoupmentFrequencyNote
      paymentStartDate
      paymentStartDateNote
      status
    }
  }
}
    `;

/**
 * __useGetAllPaymentsQuery__
 *
 * To run a query within a React component, call `useGetAllPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPaymentsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAllPaymentsQuery(baseOptions: Apollo.QueryHookOptions<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>(GetAllPaymentsDocument, options);
      }
export function useGetAllPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>(GetAllPaymentsDocument, options);
        }
export function useGetAllPaymentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>(GetAllPaymentsDocument, options);
        }
export type GetAllPaymentsQueryHookResult = ReturnType<typeof useGetAllPaymentsQuery>;
export type GetAllPaymentsLazyQueryHookResult = ReturnType<typeof useGetAllPaymentsLazyQuery>;
export type GetAllPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetAllPaymentsSuspenseQuery>;
export type GetAllPaymentsQueryResult = Apollo.QueryResult<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>;
export const GetAnticipateDependenciesDocument = gql`
    query GetAnticipateDependencies($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      payType
      payClaims
      creatingDependenciesBetweenServices
      creatingDependenciesBetweenServicesNote
      needsClaimsDataCollection
      needsClaimsDataCollectionNote
      providingThirdPartyFile
      isContractorAwareTestDataRequirements
    }
  }
}
    `;

/**
 * __useGetAnticipateDependenciesQuery__
 *
 * To run a query within a React component, call `useGetAnticipateDependenciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnticipateDependenciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnticipateDependenciesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAnticipateDependenciesQuery(baseOptions: Apollo.QueryHookOptions<GetAnticipateDependenciesQuery, GetAnticipateDependenciesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAnticipateDependenciesQuery, GetAnticipateDependenciesQueryVariables>(GetAnticipateDependenciesDocument, options);
      }
export function useGetAnticipateDependenciesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnticipateDependenciesQuery, GetAnticipateDependenciesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAnticipateDependenciesQuery, GetAnticipateDependenciesQueryVariables>(GetAnticipateDependenciesDocument, options);
        }
export function useGetAnticipateDependenciesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAnticipateDependenciesQuery, GetAnticipateDependenciesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAnticipateDependenciesQuery, GetAnticipateDependenciesQueryVariables>(GetAnticipateDependenciesDocument, options);
        }
export type GetAnticipateDependenciesQueryHookResult = ReturnType<typeof useGetAnticipateDependenciesQuery>;
export type GetAnticipateDependenciesLazyQueryHookResult = ReturnType<typeof useGetAnticipateDependenciesLazyQuery>;
export type GetAnticipateDependenciesSuspenseQueryHookResult = ReturnType<typeof useGetAnticipateDependenciesSuspenseQuery>;
export type GetAnticipateDependenciesQueryResult = Apollo.QueryResult<GetAnticipateDependenciesQuery, GetAnticipateDependenciesQueryVariables>;
export const GetBeneficiaryCostSharingDocument = gql`
    query GetBeneficiaryCostSharing($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      payType
      payClaims
      beneficiaryCostSharingLevelAndHandling
      waiveBeneficiaryCostSharingForAnyServices
      waiveBeneficiaryCostSharingServiceSpecification
      waiverOnlyAppliesPartOfPayment
      waiveBeneficiaryCostSharingNote
    }
  }
}
    `;

/**
 * __useGetBeneficiaryCostSharingQuery__
 *
 * To run a query within a React component, call `useGetBeneficiaryCostSharingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeneficiaryCostSharingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeneficiaryCostSharingQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBeneficiaryCostSharingQuery(baseOptions: Apollo.QueryHookOptions<GetBeneficiaryCostSharingQuery, GetBeneficiaryCostSharingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBeneficiaryCostSharingQuery, GetBeneficiaryCostSharingQueryVariables>(GetBeneficiaryCostSharingDocument, options);
      }
export function useGetBeneficiaryCostSharingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBeneficiaryCostSharingQuery, GetBeneficiaryCostSharingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBeneficiaryCostSharingQuery, GetBeneficiaryCostSharingQueryVariables>(GetBeneficiaryCostSharingDocument, options);
        }
export function useGetBeneficiaryCostSharingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBeneficiaryCostSharingQuery, GetBeneficiaryCostSharingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBeneficiaryCostSharingQuery, GetBeneficiaryCostSharingQueryVariables>(GetBeneficiaryCostSharingDocument, options);
        }
export type GetBeneficiaryCostSharingQueryHookResult = ReturnType<typeof useGetBeneficiaryCostSharingQuery>;
export type GetBeneficiaryCostSharingLazyQueryHookResult = ReturnType<typeof useGetBeneficiaryCostSharingLazyQuery>;
export type GetBeneficiaryCostSharingSuspenseQueryHookResult = ReturnType<typeof useGetBeneficiaryCostSharingSuspenseQuery>;
export type GetBeneficiaryCostSharingQueryResult = Apollo.QueryResult<GetBeneficiaryCostSharingQuery, GetBeneficiaryCostSharingQueryVariables>;
export const GetClaimsBasedPaymentDocument = gql`
    query GetClaimsBasedPayment($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      payType
      payClaims
      payClaimsNote
      payClaimsOther
      shouldAnyProvidersExcludedFFSSystems
      shouldAnyProviderExcludedFFSSystemsNote
      changesMedicarePhysicianFeeSchedule
      changesMedicarePhysicianFeeScheduleNote
      affectsMedicareSecondaryPayerClaims
      affectsMedicareSecondaryPayerClaimsHow
      affectsMedicareSecondaryPayerClaimsNote
      payModelDifferentiation
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetClaimsBasedPaymentQuery__
 *
 * To run a query within a React component, call `useGetClaimsBasedPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimsBasedPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimsBasedPaymentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetClaimsBasedPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetClaimsBasedPaymentQuery, GetClaimsBasedPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClaimsBasedPaymentQuery, GetClaimsBasedPaymentQueryVariables>(GetClaimsBasedPaymentDocument, options);
      }
export function useGetClaimsBasedPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClaimsBasedPaymentQuery, GetClaimsBasedPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClaimsBasedPaymentQuery, GetClaimsBasedPaymentQueryVariables>(GetClaimsBasedPaymentDocument, options);
        }
export function useGetClaimsBasedPaymentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetClaimsBasedPaymentQuery, GetClaimsBasedPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetClaimsBasedPaymentQuery, GetClaimsBasedPaymentQueryVariables>(GetClaimsBasedPaymentDocument, options);
        }
export type GetClaimsBasedPaymentQueryHookResult = ReturnType<typeof useGetClaimsBasedPaymentQuery>;
export type GetClaimsBasedPaymentLazyQueryHookResult = ReturnType<typeof useGetClaimsBasedPaymentLazyQuery>;
export type GetClaimsBasedPaymentSuspenseQueryHookResult = ReturnType<typeof useGetClaimsBasedPaymentSuspenseQuery>;
export type GetClaimsBasedPaymentQueryResult = Apollo.QueryResult<GetClaimsBasedPaymentQuery, GetClaimsBasedPaymentQueryVariables>;
export const GetComplexityDocument = gql`
    query GetComplexity($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      payType
      payClaims
      expectedCalculationComplexityLevel
      expectedCalculationComplexityLevelNote
      claimsProcessingPrecedence
      claimsProcessingPrecedenceOther
      claimsProcessingPrecedenceNote
      canParticipantsSelectBetweenPaymentMechanisms
      canParticipantsSelectBetweenPaymentMechanismsHow
      canParticipantsSelectBetweenPaymentMechanismsNote
      anticipatedPaymentFrequency
      anticipatedPaymentFrequencyContinually
      anticipatedPaymentFrequencyOther
      anticipatedPaymentFrequencyNote
    }
  }
}
    `;

/**
 * __useGetComplexityQuery__
 *
 * To run a query within a React component, call `useGetComplexityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetComplexityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetComplexityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetComplexityQuery(baseOptions: Apollo.QueryHookOptions<GetComplexityQuery, GetComplexityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetComplexityQuery, GetComplexityQueryVariables>(GetComplexityDocument, options);
      }
export function useGetComplexityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetComplexityQuery, GetComplexityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetComplexityQuery, GetComplexityQueryVariables>(GetComplexityDocument, options);
        }
export function useGetComplexitySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetComplexityQuery, GetComplexityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetComplexityQuery, GetComplexityQueryVariables>(GetComplexityDocument, options);
        }
export type GetComplexityQueryHookResult = ReturnType<typeof useGetComplexityQuery>;
export type GetComplexityLazyQueryHookResult = ReturnType<typeof useGetComplexityLazyQuery>;
export type GetComplexitySuspenseQueryHookResult = ReturnType<typeof useGetComplexitySuspenseQuery>;
export type GetComplexityQueryResult = Apollo.QueryResult<GetComplexityQuery, GetComplexityQueryVariables>;
export const GetFundingDocument = gql`
    query GetFunding($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      fundingSource
      fundingSourceMedicareAInfo
      fundingSourceMedicareBInfo
      fundingSourceOther
      fundingSourceNote
      fundingSourceR
      fundingSourceRMedicareAInfo
      fundingSourceRMedicareBInfo
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
      id
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
export const GetNonClaimsBasedPaymentDocument = gql`
    query GetNonClaimsBasedPayment($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      payType
      payClaims
      nonClaimsPayments
      nonClaimsPaymentsNote
      nonClaimsPaymentOther
      paymentCalculationOwner
      numberPaymentsPerPayCycle
      numberPaymentsPerPayCycleNote
      sharedSystemsInvolvedAdditionalClaimPayment
      sharedSystemsInvolvedAdditionalClaimPaymentNote
      planningToUseInnovationPaymentContractor
      planningToUseInnovationPaymentContractorNote
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetNonClaimsBasedPaymentQuery__
 *
 * To run a query within a React component, call `useGetNonClaimsBasedPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNonClaimsBasedPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNonClaimsBasedPaymentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetNonClaimsBasedPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetNonClaimsBasedPaymentQuery, GetNonClaimsBasedPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNonClaimsBasedPaymentQuery, GetNonClaimsBasedPaymentQueryVariables>(GetNonClaimsBasedPaymentDocument, options);
      }
export function useGetNonClaimsBasedPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNonClaimsBasedPaymentQuery, GetNonClaimsBasedPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNonClaimsBasedPaymentQuery, GetNonClaimsBasedPaymentQueryVariables>(GetNonClaimsBasedPaymentDocument, options);
        }
export function useGetNonClaimsBasedPaymentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetNonClaimsBasedPaymentQuery, GetNonClaimsBasedPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNonClaimsBasedPaymentQuery, GetNonClaimsBasedPaymentQueryVariables>(GetNonClaimsBasedPaymentDocument, options);
        }
export type GetNonClaimsBasedPaymentQueryHookResult = ReturnType<typeof useGetNonClaimsBasedPaymentQuery>;
export type GetNonClaimsBasedPaymentLazyQueryHookResult = ReturnType<typeof useGetNonClaimsBasedPaymentLazyQuery>;
export type GetNonClaimsBasedPaymentSuspenseQueryHookResult = ReturnType<typeof useGetNonClaimsBasedPaymentSuspenseQuery>;
export type GetNonClaimsBasedPaymentQueryResult = Apollo.QueryResult<GetNonClaimsBasedPaymentQuery, GetNonClaimsBasedPaymentQueryVariables>;
export const GetRecoverDocument = gql`
    query GetRecover($id: UUID!) {
  modelPlan(id: $id) {
    id
    modelName
    payments {
      id
      payType
      payClaims
      willRecoverPayments
      willRecoverPaymentsNote
      anticipateReconcilingPaymentsRetrospectively
      anticipateReconcilingPaymentsRetrospectivelyNote
      paymentReconciliationFrequency
      paymentReconciliationFrequencyContinually
      paymentReconciliationFrequencyOther
      paymentReconciliationFrequencyNote
      paymentDemandRecoupmentFrequency
      paymentDemandRecoupmentFrequencyContinually
      paymentDemandRecoupmentFrequencyOther
      paymentDemandRecoupmentFrequencyNote
      paymentStartDate
      paymentStartDateNote
      readyForReviewByUserAccount {
        id
        commonName
      }
      readyForReviewDts
      status
    }
    operationalNeeds {
      id
      modifiedDts
    }
  }
}
    `;

/**
 * __useGetRecoverQuery__
 *
 * To run a query within a React component, call `useGetRecoverQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecoverQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecoverQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRecoverQuery(baseOptions: Apollo.QueryHookOptions<GetRecoverQuery, GetRecoverQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecoverQuery, GetRecoverQueryVariables>(GetRecoverDocument, options);
      }
export function useGetRecoverLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecoverQuery, GetRecoverQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecoverQuery, GetRecoverQueryVariables>(GetRecoverDocument, options);
        }
export function useGetRecoverSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetRecoverQuery, GetRecoverQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecoverQuery, GetRecoverQueryVariables>(GetRecoverDocument, options);
        }
export type GetRecoverQueryHookResult = ReturnType<typeof useGetRecoverQuery>;
export type GetRecoverLazyQueryHookResult = ReturnType<typeof useGetRecoverLazyQuery>;
export type GetRecoverSuspenseQueryHookResult = ReturnType<typeof useGetRecoverSuspenseQuery>;
export type GetRecoverQueryResult = Apollo.QueryResult<GetRecoverQuery, GetRecoverQueryVariables>;
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