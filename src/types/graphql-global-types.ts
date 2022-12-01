/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ActionType {
  ADMIN = "ADMIN",
  NORMAL = "NORMAL",
}

export enum AgencyOrStateHelpType {
  NO = "NO",
  OTHER = "OTHER",
  YES_AGENCY_IAA = "YES_AGENCY_IAA",
  YES_AGENCY_IDEAS = "YES_AGENCY_IDEAS",
  YES_STATE = "YES_STATE",
}

export enum AgreementType {
  COOPERATIVE = "COOPERATIVE",
  OTHER = "OTHER",
  PARTICIPATION = "PARTICIPATION",
}

export enum AlternativePaymentModelType {
  ADVANCED = "ADVANCED",
  MIPS = "MIPS",
  NOT_APM = "NOT_APM",
  REGULAR = "REGULAR",
}

export enum AnticipatedPaymentFrequencyType {
  ANNUALLY = "ANNUALLY",
  BIANNUALLY = "BIANNUALLY",
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
  OTHER = "OTHER",
  QUARTERLY = "QUARTERLY",
  SEMIMONTHLY = "SEMIMONTHLY",
  WEEKLY = "WEEKLY",
}

export enum AuthorityAllowance {
  ACA = "ACA",
  CONGRESSIONALLY_MANDATED = "CONGRESSIONALLY_MANDATED",
  OTHER = "OTHER",
  SSA_PART_B = "SSA_PART_B",
}

export enum BManageBeneficiaryOverlapType {
  MDM = "MDM",
  NA = "NA",
  OTHER = "OTHER",
}

export enum BenchmarkForPerformanceType {
  NO = "NO",
  YES_NO_RECONCILE = "YES_NO_RECONCILE",
  YES_RECONCILE = "YES_RECONCILE",
}

export enum BeneficiariesType {
  DISEASE_SPECIFIC = "DISEASE_SPECIFIC",
  DUALLY_ELIGIBLE = "DUALLY_ELIGIBLE",
  MEDICAID = "MEDICAID",
  MEDICARE_ADVANTAGE = "MEDICARE_ADVANTAGE",
  MEDICARE_FFS = "MEDICARE_FFS",
  MEDICARE_PART_D = "MEDICARE_PART_D",
  NA = "NA",
  OTHER = "OTHER",
}

export enum CMMIGroup {
  PATIENT_CARE_MODELS_GROUP = "PATIENT_CARE_MODELS_GROUP",
  POLICY_AND_PROGRAMS_GROUP = "POLICY_AND_PROGRAMS_GROUP",
  PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP = "PREVENTIVE_AND_POPULATION_HEALTH_CARE_MODELS_GROUP",
  SEAMLESS_CARE_MODELS_GROUP = "SEAMLESS_CARE_MODELS_GROUP",
  STATE_INNOVATIONS_GROUP = "STATE_INNOVATIONS_GROUP",
}

export enum CMSCenter {
  CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY = "CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY",
  CENTER_FOR_MEDICARE = "CENTER_FOR_MEDICARE",
  CENTER_FOR_PROGRAM_INTEGRITY = "CENTER_FOR_PROGRAM_INTEGRITY",
  CMMI = "CMMI",
  FEDERAL_COORDINATED_HEALTH_CARE_OFFICE = "FEDERAL_COORDINATED_HEALTH_CARE_OFFICE",
  OTHER = "OTHER",
}

export enum CcmInvolvmentType {
  NO = "NO",
  OTHER = "OTHER",
  YES_EVALUATION = "YES_EVALUATION",
  YES__IMPLEMENTATION = "YES__IMPLEMENTATION",
}

export enum ChangeType {
  ADDED = "ADDED",
  REMOVED = "REMOVED",
  UPDATED = "UPDATED",
}

export enum ClaimsBasedPayType {
  ADJUSTMENTS_TO_FFS_PAYMENTS = "ADJUSTMENTS_TO_FFS_PAYMENTS",
  CARE_MANAGEMENT_HOME_VISITS = "CARE_MANAGEMENT_HOME_VISITS",
  OTHER = "OTHER",
  REDUCTIONS_TO_BENEFICIARY_COST_SHARING = "REDUCTIONS_TO_BENEFICIARY_COST_SHARING",
  SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE = "SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE",
  SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS = "SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS",
  TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE = "TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE",
}

export enum ComplexityCalculationLevelType {
  HIGH = "HIGH",
  LOW = "LOW",
  MIDDLE = "MIDDLE",
}

export enum ConfidenceType {
  COMPLETELY = "COMPLETELY",
  FAIRLY = "FAIRLY",
  NOT_AT_ALL = "NOT_AT_ALL",
  SLIGHTLY = "SLIGHTLY",
}

export enum ContractorSupportType {
  MULTIPLE = "MULTIPLE",
  NONE = "NONE",
  ONE = "ONE",
  OTHER = "OTHER",
}

export enum DataForMonitoringType {
  CLINICAL_DATA = "CLINICAL_DATA",
  ENCOUNTER_DATA = "ENCOUNTER_DATA",
  MEDICAID_CLAIMS = "MEDICAID_CLAIMS",
  MEDICARE_CLAIMS = "MEDICARE_CLAIMS",
  NON_CLINICAL_DATA = "NON_CLINICAL_DATA",
  NON_MEDICAL_DATA = "NON_MEDICAL_DATA",
  NOT_PLANNING_TO_COLLECT_DATA = "NOT_PLANNING_TO_COLLECT_DATA",
  NO_PAY_CLAIMS = "NO_PAY_CLAIMS",
  OTHER = "OTHER",
  QUALITY_CLAIMS_BASED_MEASURES = "QUALITY_CLAIMS_BASED_MEASURES",
  QUALITY_REPORTED_MEASURES = "QUALITY_REPORTED_MEASURES",
  SITE_VISITS = "SITE_VISITS",
}

export enum DataFrequencyType {
  ANNUALLY = "ANNUALLY",
  BIANNUALLY = "BIANNUALLY",
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
  NOT_PLANNING_TO_DO_THIS = "NOT_PLANNING_TO_DO_THIS",
  OTHER = "OTHER",
  QUARTERLY = "QUARTERLY",
  SEMI_MONTHLY = "SEMI_MONTHLY",
  WEEKLY = "WEEKLY",
}

export enum DataFullTimeOrIncrementalType {
  FULL_TIME = "FULL_TIME",
  INCREMENTAL = "INCREMENTAL",
}

export enum DataStartsType {
  AT_SOME_OTHER_POINT_IN_TIME = "AT_SOME_OTHER_POINT_IN_TIME",
  DURING_APPLICATION_PERIOD = "DURING_APPLICATION_PERIOD",
  EARLY_IN_THE_FIRST_PERFORMANCE_YEAR = "EARLY_IN_THE_FIRST_PERFORMANCE_YEAR",
  IN_THE_SUBSEQUENT_PERFORMANCE_YEAR = "IN_THE_SUBSEQUENT_PERFORMANCE_YEAR",
  LATER_IN_THE_FIRST_PERFORMANCE_YEAR = "LATER_IN_THE_FIRST_PERFORMANCE_YEAR",
  NOT_PLANNING_TO_DO_THIS = "NOT_PLANNING_TO_DO_THIS",
  OTHER = "OTHER",
  SHORTLY_BEFORE_THE_START_DATE = "SHORTLY_BEFORE_THE_START_DATE",
}

export enum DataToSendParticipantsType {
  BASELINE_HISTORICAL_DATA = "BASELINE_HISTORICAL_DATA",
  BENEFICIARY_LEVEL_DATA = "BENEFICIARY_LEVEL_DATA",
  CLAIMS_LEVEL_DATA = "CLAIMS_LEVEL_DATA",
  NOT_PLANNING_TO_SEND_DATA = "NOT_PLANNING_TO_SEND_DATA",
  OTHER_MIPS_DATA = "OTHER_MIPS_DATA",
  PARTICIPANT_LEVEL_DATA = "PARTICIPANT_LEVEL_DATA",
  PROVIDER_LEVEL_DATA = "PROVIDER_LEVEL_DATA",
}

export enum DiscussionStatus {
  ANSWERED = "ANSWERED",
  UNANSWERED = "UNANSWERED",
  WAITING_FOR_RESPONSE = "WAITING_FOR_RESPONSE",
}

export enum DocumentType {
  CONCEPT_PAPER = "CONCEPT_PAPER",
  ICIP_DRAFT = "ICIP_DRAFT",
  MARKET_RESEARCH = "MARKET_RESEARCH",
  OTHER = "OTHER",
  POLICY_PAPER = "POLICY_PAPER",
}

export enum EvaluationApproachType {
  COMPARISON_MATCH = "COMPARISON_MATCH",
  CONTROL_INTERVENTION = "CONTROL_INTERVENTION",
  INTERRUPTED_TIME = "INTERRUPTED_TIME",
  NON_MEDICARE_DATA = "NON_MEDICARE_DATA",
  OTHER = "OTHER",
}

export enum FrequencyType {
  ANNUALLY = "ANNUALLY",
  BIANNUALLY = "BIANNUALLY",
  MONTHLY = "MONTHLY",
  OTHER = "OTHER",
  QUARTERLY = "QUARTERLY",
  ROLLING = "ROLLING",
}

export enum FundingSource {
  OTHER = "OTHER",
  PATIENT_PROTECTION_AFFORDABLE_CARE_ACT = "PATIENT_PROTECTION_AFFORDABLE_CARE_ACT",
  TRUST_FUND = "TRUST_FUND",
}

export enum GcCollectBidsType {
  HPMS = "HPMS",
  OTHER = "OTHER",
}

export enum GcPartCDType {
  MARX = "MARX",
  OTHER = "OTHER",
}

export enum GcUpdateContractType {
  HPMS = "HPMS",
  OTHER = "OTHER",
}

export enum GeographyApplication {
  BENEFICIARIES = "BENEFICIARIES",
  OTHER = "OTHER",
  PARTICIPANTS = "PARTICIPANTS",
  PROVIDERS = "PROVIDERS",
}

export enum GeographyType {
  OTHER = "OTHER",
  REGION = "REGION",
  STATE = "STATE",
}

export enum KeyCharacteristic {
  EPISODE_BASED = "EPISODE_BASED",
  OTHER = "OTHER",
  PART_C = "PART_C",
  PART_D = "PART_D",
  PAYMENT = "PAYMENT",
  POPULATION_BASED = "POPULATION_BASED",
  PREVENTATIVE = "PREVENTATIVE",
  SERVICE_DELIVERY = "SERVICE_DELIVERY",
  SHARED_SAVINGS = "SHARED_SAVINGS",
}

export enum ModelCategory {
  ACCOUNTABLE_CARE = "ACCOUNTABLE_CARE",
  DEMONSTRATION = "DEMONSTRATION",
  EPISODE_BASED_PAYMENT_INITIATIVES = "EPISODE_BASED_PAYMENT_INITIATIVES",
  INIT_ACCEL_DEV_AND_TEST = "INIT_ACCEL_DEV_AND_TEST",
  INIT_MEDICAID_CHIP_POP = "INIT_MEDICAID_CHIP_POP",
  INIT_SPEED_ADOPT_BEST_PRACTICE = "INIT_SPEED_ADOPT_BEST_PRACTICE",
  INIT__MEDICARE_MEDICAID_ENROLLEES = "INIT__MEDICARE_MEDICAID_ENROLLEES",
  PRIMARY_CARE_TRANSFORMATION = "PRIMARY_CARE_TRANSFORMATION",
  UNKNOWN = "UNKNOWN",
}

export enum ModelLearningSystemType {
  EDUCATE_BENEFICIARIES = "EDUCATE_BENEFICIARIES",
  IT_PLATFORM_CONNECT = "IT_PLATFORM_CONNECT",
  LEARNING_CONTRACTOR = "LEARNING_CONTRACTOR",
  NO_LEARNING_SYSTEM = "NO_LEARNING_SYSTEM",
  OTHER = "OTHER",
  PARTICIPANT_COLLABORATION = "PARTICIPANT_COLLABORATION",
}

export enum ModelStatus {
  ANNOUNCED = "ANNOUNCED",
  CLEARED = "CLEARED",
  CMS_CLEARANCE = "CMS_CLEARANCE",
  HHS_CLEARANCE = "HHS_CLEARANCE",
  ICIP_COMPLETE = "ICIP_COMPLETE",
  INTERNAL_CMMI_CLEARANCE = "INTERNAL_CMMI_CLEARANCE",
  OMB_ASRF_CLEARANCE = "OMB_ASRF_CLEARANCE",
  PLAN_COMPLETE = "PLAN_COMPLETE",
  PLAN_DRAFT = "PLAN_DRAFT",
}

export enum ModelType {
  MANDATORY = "MANDATORY",
  TBD = "TBD",
  VOLUNTARY = "VOLUNTARY",
}

export enum MonitoringFileType {
  BENEFICIARY = "BENEFICIARY",
  OTHER = "OTHER",
  PART_A = "PART_A",
  PART_B = "PART_B",
  PROVIDER = "PROVIDER",
}

export enum NonClaimsBasedPayType {
  ADVANCED_PAYMENT = "ADVANCED_PAYMENT",
  BUNDLED_EPISODE_OF_CARE = "BUNDLED_EPISODE_OF_CARE",
  CAPITATION_POPULATION_BASED_FULL = "CAPITATION_POPULATION_BASED_FULL",
  CAPITATION_POPULATION_BASED_PARTIAL = "CAPITATION_POPULATION_BASED_PARTIAL",
  CARE_COORDINATION_MANAGEMENT_FEE = "CARE_COORDINATION_MANAGEMENT_FEE",
  GLOBAL_BUDGET = "GLOBAL_BUDGET",
  GRANTS = "GRANTS",
  INCENTIVE_PAYMENT = "INCENTIVE_PAYMENT",
  MAPD_SHARED_SAVINGS = "MAPD_SHARED_SAVINGS",
  OTHER = "OTHER",
  SHARED_SAVINGS = "SHARED_SAVINGS",
}

export enum OelClaimsBasedMeasuresType {
  CCW = "CCW",
  IDR = "IDR",
  OTHER = "OTHER",
}

export enum OelCollectDataType {
  CCW = "CCW",
  CONTRACTOR = "CONTRACTOR",
  IDOS = "IDOS",
  IDR = "IDR",
  ISP = "ISP",
  OTHER = "OTHER",
}

export enum OelEducateBeneficiariesType {
  OC = "OC",
  OTHER = "OTHER",
}

export enum OelEvaluationContractorType {
  OTHER = "OTHER",
  RMDA = "RMDA",
}

export enum OelHelpdeskSupportType {
  CBOSC = "CBOSC",
  CONTRACTOR = "CONTRACTOR",
  OTHER = "OTHER",
}

export enum OelLearningContractorType {
  CROSS_MODEL_CONTRACT = "CROSS_MODEL_CONTRACT",
  OTHER = "OTHER",
  RMADA = "RMADA",
}

export enum OelManageAcoType {
  ACO_OS = "ACO_OS",
  ACO_UI = "ACO_UI",
  INNOVATION = "INNOVATION",
  OTHER = "OTHER",
}

export enum OelObtainDataType {
  CCW = "CCW",
  IDOS = "IDOS",
  ISP = "ISP",
  OTHER = "OTHER",
}

export enum OelParticipantCollaborationType {
  CONNECT = "CONNECT",
  OTHER = "OTHER",
}

export enum OelPerformanceBenchmarkType {
  CCW = "CCW",
  IDR = "IDR",
  OTHER = "OTHER",
}

export enum OelProcessAppealsType {
  MEDICARE_APPEAL_SYSTEM = "MEDICARE_APPEAL_SYSTEM",
  OTHER = "OTHER",
}

export enum OelQualityScoresType {
  EXISTING_DATA_AND_PROCESS = "EXISTING_DATA_AND_PROCESS",
  NEW_DATA_AND_CMMI_PROCESS = "NEW_DATA_AND_CMMI_PROCESS",
  NONE = "NONE",
  OTHER = "OTHER",
}

export enum OelSendReportsType {
  IDOS = "IDOS",
  INTERNAL_STAFF = "INTERNAL_STAFF",
  OTHER = "OTHER",
  RMADA = "RMADA",
}

export enum OpSolutionStatus {
  AT_RISK = "AT_RISK",
  BACKLOG = "BACKLOG",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
  ONBOARDING = "ONBOARDING",
}

export enum OperationalNeedKey {
  ACQUIRE_AN_EVAL_CONT = "ACQUIRE_AN_EVAL_CONT",
  ACQUIRE_A_LEARN_CONT = "ACQUIRE_A_LEARN_CONT",
  ADJUST_FFS_CLAIMS = "ADJUST_FFS_CLAIMS",
  ADVERTISE_MODEL = "ADVERTISE_MODEL",
  APP_SUPPORT_CON = "APP_SUPPORT_CON",
  CLAIMS_BASED_MEASURES = "CLAIMS_BASED_MEASURES",
  COL_REV_SCORE_APP = "COL_REV_SCORE_APP",
  COMM_W_PART = "COMM_W_PART",
  COMPUTE_SHARED_SAVINGS_PAYMENT = "COMPUTE_SHARED_SAVINGS_PAYMENT",
  DATA_TO_MONITOR = "DATA_TO_MONITOR",
  DATA_TO_SUPPORT_EVAL = "DATA_TO_SUPPORT_EVAL",
  EDUCATE_BENEF = "EDUCATE_BENEF",
  ESTABLISH_BENCH = "ESTABLISH_BENCH",
  HELPDESK_SUPPORT = "HELPDESK_SUPPORT",
  IDDOC_SUPPORT = "IDDOC_SUPPORT",
  MAKE_NON_CLAIMS_BASED_PAYMENTS = "MAKE_NON_CLAIMS_BASED_PAYMENTS",
  MANAGE_BEN_OVERLAP = "MANAGE_BEN_OVERLAP",
  MANAGE_CD = "MANAGE_CD",
  MANAGE_FFS_EXCL_PAYMENTS = "MANAGE_FFS_EXCL_PAYMENTS",
  MANAGE_PROV_OVERLAP = "MANAGE_PROV_OVERLAP",
  PART_TO_PART_COLLAB = "PART_TO_PART_COLLAB",
  PROCESS_PART_APPEALS = "PROCESS_PART_APPEALS",
  QUALITY_PERFORMANCE_SCORES = "QUALITY_PERFORMANCE_SCORES",
  RECOVER_PAYMENTS = "RECOVER_PAYMENTS",
  REV_COL_BIDS = "REV_COL_BIDS",
  SEND_REPDATA_TO_PART = "SEND_REPDATA_TO_PART",
  UPDATE_CONTRACT = "UPDATE_CONTRACT",
}

export enum OperationalSolutionKey {
  ACO_OS = "ACO_OS",
  ACO_UI = "ACO_UI",
  ANOTHER_CONTRACTOR = "ANOTHER_CONTRACTOR",
  APPS = "APPS",
  ARS = "ARS",
  CBOSC = "CBOSC",
  CCW = "CCW",
  CONNECT = "CONNECT",
  CROSS_MODEL_CONTRACT = "CROSS_MODEL_CONTRACT",
  EXISTING_CMS_DATA_AND_PROCESS = "EXISTING_CMS_DATA_AND_PROCESS",
  FFS_COMPETENCY_CENTER = "FFS_COMPETENCY_CENTER",
  GOVDELIVERY = "GOVDELIVERY",
  GRANT_SOLUTIONS = "GRANT_SOLUTIONS",
  HIGLAS = "HIGLAS",
  HPMS = "HPMS",
  IDOS = "IDOS",
  IDR = "IDR",
  INNOVATION = "INNOVATION",
  INTERNAL_STAFF = "INTERNAL_STAFF",
  IPC = "IPC",
  ISP = "ISP",
  MAC = "MAC",
  MARX = "MARX",
  MDM = "MDM",
  MEDICARE_APPEAL_SYSTEM = "MEDICARE_APPEAL_SYSTEM",
  NEW_CMMI_PROCESS = "NEW_CMMI_PROCESS",
  OC = "OC",
  OTHER_NEW_PROCESS = "OTHER_NEW_PROCESS",
  OUTLOOK_MAILBOX = "OUTLOOK_MAILBOX",
  RFA = "RFA",
  RMADA = "RMADA",
  RMADA_CONTRACTOR = "RMADA_CONTRACTOR",
  SALESFORCE = "SALESFORCE",
  SALESFORCE_PORTAL = "SALESFORCE_PORTAL",
  SHARED_SYSTEMS = "SHARED_SYSTEMS",
  THROUGH_A_CONTRACTOR = "THROUGH_A_CONTRACTOR",
}

export enum OverlapType {
  NO = "NO",
  YES_NEED_POLICIES = "YES_NEED_POLICIES",
  YES_NO_ISSUES = "YES_NO_ISSUES",
}

export enum PInformFfsType {
  FFS_COMPETENCY_CENTER = "FFS_COMPETENCY_CENTER",
  OTHER = "OTHER",
}

export enum PMakeClaimsPaymentsType {
  HIGLAS = "HIGLAS",
  OTHER = "OTHER",
  SHARED_SYSTEMS = "SHARED_SYSTEMS",
}

export enum PNonClaimsBasedPaymentsType {
  APPS = "APPS",
  HIGLAS = "HIGLAS",
  IPC = "IPC",
  MAC = "MAC",
  OTHER = "OTHER",
}

export enum PRecoverPaymentsType {
  APPS = "APPS",
  IPC = "IPC",
  MAC = "MAC",
  OTHER = "OTHER",
}

export enum PSharedSavingsPlanType {
  OTHER = "OTHER",
  RMADA = "RMADA",
}

export enum ParticipantCommunicationType {
  IT_TOOL = "IT_TOOL",
  MASS_EMAIL = "MASS_EMAIL",
  NO_COMMUNICATION = "NO_COMMUNICATION",
  OTHER = "OTHER",
}

export enum ParticipantRiskType {
  CAPITATION = "CAPITATION",
  ONE_SIDED = "ONE_SIDED",
  OTHER = "OTHER",
  TWO_SIDED = "TWO_SIDED",
}

export enum ParticipantSelectionType {
  APPLICATION_REVIEW_AND_SCORING_TOOL = "APPLICATION_REVIEW_AND_SCORING_TOOL",
  APPLICATION_SUPPORT_CONTRACTOR = "APPLICATION_SUPPORT_CONTRACTOR",
  BASIC_CRITERIA = "BASIC_CRITERIA",
  CMS_COMPONENT_OR_PROCESS = "CMS_COMPONENT_OR_PROCESS",
  MODEL_TEAM_REVIEW_APPLICATIONS = "MODEL_TEAM_REVIEW_APPLICATIONS",
  NO_SELECTING_PARTICIPANTS = "NO_SELECTING_PARTICIPANTS",
  OTHER = "OTHER",
  SUPPORT_FROM_CMMI = "SUPPORT_FROM_CMMI",
}

export enum ParticipantsIDType {
  CCNS = "CCNS",
  NO_IDENTIFIERS = "NO_IDENTIFIERS",
  NPIS = "NPIS",
  OTHER = "OTHER",
  TINS = "TINS",
}

export enum ParticipantsType {
  COMMERCIAL_PAYERS = "COMMERCIAL_PAYERS",
  COMMUNITY_BASED_ORGANIZATIONS = "COMMUNITY_BASED_ORGANIZATIONS",
  CONVENER = "CONVENER",
  ENTITIES = "ENTITIES",
  MEDICAID_MANAGED_CARE_ORGANIZATIONS = "MEDICAID_MANAGED_CARE_ORGANIZATIONS",
  MEDICAID_PROVIDERS = "MEDICAID_PROVIDERS",
  MEDICARE_ADVANTAGE_PLANS = "MEDICARE_ADVANTAGE_PLANS",
  MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS = "MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS",
  MEDICARE_PROVIDERS = "MEDICARE_PROVIDERS",
  NON_PROFIT_ORGANIZATIONS = "NON_PROFIT_ORGANIZATIONS",
  OTHER = "OTHER",
  STANDALONE_PART_D_PLANS = "STANDALONE_PART_D_PLANS",
  STATES = "STATES",
  STATE_MEDICAID_AGENCIES = "STATE_MEDICAID_AGENCIES",
}

export enum PayRecipient {
  BENEFICIARIES = "BENEFICIARIES",
  OTHER = "OTHER",
  PARTICIPANTS = "PARTICIPANTS",
  PROVIDERS = "PROVIDERS",
  STATES = "STATES",
}

export enum PayType {
  CLAIMS_BASED_PAYMENTS = "CLAIMS_BASED_PAYMENTS",
  GRANTS = "GRANTS",
  NON_CLAIMS_BASED_PAYMENTS = "NON_CLAIMS_BASED_PAYMENTS",
}

export enum PpAppSupportContractorType {
  OTHER = "OTHER",
  RMDA = "RMDA",
}

export enum PpCollectScoreReviewType {
  ARS = "ARS",
  GRANT_SOLUTIONS = "GRANT_SOLUTIONS",
  OTHER = "OTHER",
  RFA = "RFA",
}

export enum PpCommunicateWithParticipantType {
  GOV_DELIVERY = "GOV_DELIVERY",
  OTHER = "OTHER",
  OUTLOOK_MAILBOX = "OUTLOOK_MAILBOX",
  SALESFORCE_PORTAL = "SALESFORCE_PORTAL",
}

export enum PpManageProviderOverlapType {
  MDM = "MDM",
  NA = "NA",
  OTHER = "OTHER",
}

export enum PpToAdvertiseType {
  GRANT_SOLUTIONS = "GRANT_SOLUTIONS",
  OTHER = "OTHER",
  SALESFORCE = "SALESFORCE",
}

export enum PrepareForClearanceStatus {
  CANNOT_START = "CANNOT_START",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  READY_FOR_CLEARANCE = "READY_FOR_CLEARANCE",
}

export enum ProviderAddType {
  MANDATORILY = "MANDATORILY",
  NA = "NA",
  ONLINE_TOOLS = "ONLINE_TOOLS",
  OTHER = "OTHER",
  PROSPECTIVELY = "PROSPECTIVELY",
  RETROSPECTIVELY = "RETROSPECTIVELY",
  VOLUNTARILY = "VOLUNTARILY",
}

export enum ProviderLeaveType {
  AFTER_A_CERTAIN_WITH_IMPLICATIONS = "AFTER_A_CERTAIN_WITH_IMPLICATIONS",
  NOT_ALLOWED_TO_LEAVE = "NOT_ALLOWED_TO_LEAVE",
  NOT_APPLICABLE = "NOT_APPLICABLE",
  OTHER = "OTHER",
  VARIES_BY_TYPE_OF_PROVIDER = "VARIES_BY_TYPE_OF_PROVIDER",
  VOLUNTARILY_WITHOUT_IMPLICATIONS = "VOLUNTARILY_WITHOUT_IMPLICATIONS",
}

export enum RecruitmentType {
  LOI = "LOI",
  NA = "NA",
  NOFO = "NOFO",
  OTHER = "OTHER",
  RFA = "RFA",
}

export enum SelectionMethodType {
  HISTORICAL = "HISTORICAL",
  NA = "NA",
  OTHER = "OTHER",
  PROSPECTIVE = "PROSPECTIVE",
  PROVIDER_SIGN_UP = "PROVIDER_SIGN_UP",
  RETROSPECTIVE = "RETROSPECTIVE",
  VOLUNTARY = "VOLUNTARY",
}

export enum StakeholdersType {
  BENEFICIARIES = "BENEFICIARIES",
  COMMUNITY_ORGANIZATIONS = "COMMUNITY_ORGANIZATIONS",
  OTHER = "OTHER",
  PARTICIPANTS = "PARTICIPANTS",
  PROFESSIONAL_ORGANIZATIONS = "PROFESSIONAL_ORGANIZATIONS",
  PROVIDERS = "PROVIDERS",
  STATES = "STATES",
}

export enum TaskListSection {
  BASICS = "BASICS",
  BENEFICIARIES = "BENEFICIARIES",
  GENERAL_CHARACTERISTICS = "GENERAL_CHARACTERISTICS",
  IT_TOOLS = "IT_TOOLS",
  OPERATIONS_EVALUATION_AND_LEARNING = "OPERATIONS_EVALUATION_AND_LEARNING",
  PARTICIPANTS_AND_PROVIDERS = "PARTICIPANTS_AND_PROVIDERS",
  PAYMENT = "PAYMENT",
  PREPARE_FOR_CLEARANCE = "PREPARE_FOR_CLEARANCE",
}

export enum TaskStatus {
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  READY_FOR_CLEARANCE = "READY_FOR_CLEARANCE",
  READY_FOR_REVIEW = "READY_FOR_REVIEW",
}

export enum TaskStatusInput {
  IN_PROGRESS = "IN_PROGRESS",
  READY_FOR_CLEARANCE = "READY_FOR_CLEARANCE",
  READY_FOR_REVIEW = "READY_FOR_REVIEW",
}

export enum TeamRole {
  EVALUATION = "EVALUATION",
  IT_LEAD = "IT_LEAD",
  LEADERSHIP = "LEADERSHIP",
  LEARNING = "LEARNING",
  MODEL_LEAD = "MODEL_LEAD",
  MODEL_TEAM = "MODEL_TEAM",
}

export enum TriStateAnswer {
  NO = "NO",
  TBD = "TBD",
  YES = "YES",
}

export enum WaiverType {
  FRAUD_ABUSE = "FRAUD_ABUSE",
  MEDICAID = "MEDICAID",
  PROGRAM_PAYMENT = "PROGRAM_PAYMENT",
}

/**
 * DiscussionReplyCreateInput represents the necessary fields to create a discussion reply
 */
export interface DiscussionReplyCreateInput {
  discussionID: UUID;
  content: string;
  resolution: boolean;
}

/**
 * ModelPlanChanges represents the possible changes you can make to a model plan when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface ModelPlanChanges {
  modelName?: string | null;
  someNumbers?: number[] | null;
  archived?: boolean | null;
  status?: ModelStatus | null;
}

export interface OperationalSolutionChanges {
  needed?: boolean | null;
  pocName?: string | null;
  pocEmail?: string | null;
  mustStartDts?: Time | null;
  mustFinishDts?: Time | null;
  status?: OpSolutionStatus | null;
}

/**
 * PlanBasicsChanges represents the possible changes you can make to a Plan Basics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanBasicsChanges {
  modelCategory?: ModelCategory | null;
  cmsCenters?: CMSCenter[] | null;
  cmsOther?: string | null;
  cmmiGroups?: CMMIGroup[] | null;
  modelType?: ModelType | null;
  problem?: string | null;
  goal?: string | null;
  testInterventions?: string | null;
  note?: string | null;
  completeICIP?: Time | null;
  clearanceStarts?: Time | null;
  clearanceEnds?: Time | null;
  announced?: Time | null;
  applicationsStart?: Time | null;
  applicationsEnd?: Time | null;
  performancePeriodStarts?: Time | null;
  performancePeriodEnds?: Time | null;
  wrapUpEnds?: Time | null;
  highLevelNote?: string | null;
  phasedIn?: boolean | null;
  phasedInNote?: string | null;
  status?: TaskStatusInput | null;
}

export interface PlanBeneficiariesChanges {
  beneficiaries?: BeneficiariesType[] | null;
  beneficiariesOther?: string | null;
  beneficiariesNote?: string | null;
  treatDualElligibleDifferent?: TriStateAnswer | null;
  treatDualElligibleDifferentHow?: string | null;
  treatDualElligibleDifferentNote?: string | null;
  excludeCertainCharacteristics?: TriStateAnswer | null;
  excludeCertainCharacteristicsCriteria?: string | null;
  excludeCertainCharacteristicsNote?: string | null;
  numberPeopleImpacted?: number | null;
  estimateConfidence?: ConfidenceType | null;
  confidenceNote?: string | null;
  beneficiarySelectionMethod?: SelectionMethodType[] | null;
  beneficiarySelectionOther?: string | null;
  beneficiarySelectionNote?: string | null;
  beneficiarySelectionFrequency?: FrequencyType | null;
  beneficiarySelectionFrequencyOther?: string | null;
  beneficiarySelectionFrequencyNote?: string | null;
  beneficiaryOverlap?: OverlapType | null;
  beneficiaryOverlapNote?: string | null;
  precedenceRules?: string | null;
  status?: TaskStatusInput | null;
}

/**
 * PlanCollaboratorCreateInput represents the data required to create a collaborator on a plan
 */
export interface PlanCollaboratorCreateInput {
  modelPlanID: UUID;
  euaUserID: string;
  fullName: string;
  teamRole: TeamRole;
  email: string;
}

export interface PlanCrTdlChanges {
  idNumber?: string | null;
  dateInitiated?: Time | null;
  title?: string | null;
  note?: string | null;
}

export interface PlanCrTdlCreateInput {
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  title: string;
  note?: string | null;
}

/**
 * PlanDiscussionChanges represents the possible changes you can make to a plan discussion when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanDiscussionChanges {
  content?: string | null;
  status?: DiscussionStatus | null;
}

/**
 * PlanDiscussionCreateInput represents the necessary fields to create a plan discussion
 */
export interface PlanDiscussionCreateInput {
  modelPlanID: UUID;
  content: string;
}

/**
 * PlanDocumentInput
 */
export interface PlanDocumentInput {
  modelPlanID: UUID;
  fileData: Upload;
  documentType: DocumentType;
  restricted: boolean;
  otherTypeDescription?: string | null;
  optionalNotes?: string | null;
}

/**
 * PlanGeneralCharacteristicsChanges represents the possible changes you can make to a
 * general characteristics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanGeneralCharacteristicsChanges {
  isNewModel?: boolean | null;
  existingModel?: string | null;
  resemblesExistingModel?: boolean | null;
  resemblesExistingModelWhich?: string[] | null;
  resemblesExistingModelHow?: string | null;
  resemblesExistingModelNote?: string | null;
  hasComponentsOrTracks?: boolean | null;
  hasComponentsOrTracksDiffer?: string | null;
  hasComponentsOrTracksNote?: string | null;
  alternativePaymentModelTypes?: AlternativePaymentModelType[] | null;
  alternativePaymentModelNote?: string | null;
  keyCharacteristics?: KeyCharacteristic[] | null;
  keyCharacteristicsOther?: string | null;
  keyCharacteristicsNote?: string | null;
  collectPlanBids?: boolean | null;
  collectPlanBidsNote?: string | null;
  managePartCDEnrollment?: boolean | null;
  managePartCDEnrollmentNote?: string | null;
  planContactUpdated?: boolean | null;
  planContactUpdatedNote?: string | null;
  careCoordinationInvolved?: boolean | null;
  careCoordinationInvolvedDescription?: string | null;
  careCoordinationInvolvedNote?: string | null;
  additionalServicesInvolved?: boolean | null;
  additionalServicesInvolvedDescription?: string | null;
  additionalServicesInvolvedNote?: string | null;
  communityPartnersInvolved?: boolean | null;
  communityPartnersInvolvedDescription?: string | null;
  communityPartnersInvolvedNote?: string | null;
  geographiesTargeted?: boolean | null;
  geographiesTargetedTypes?: GeographyType[] | null;
  geographiesTargetedTypesOther?: string | null;
  geographiesTargetedAppliedTo?: GeographyApplication[] | null;
  geographiesTargetedAppliedToOther?: string | null;
  geographiesTargetedNote?: string | null;
  participationOptions?: boolean | null;
  participationOptionsNote?: string | null;
  agreementTypes?: AgreementType[] | null;
  agreementTypesOther?: string | null;
  multiplePatricipationAgreementsNeeded?: boolean | null;
  multiplePatricipationAgreementsNeededNote?: string | null;
  rulemakingRequired?: boolean | null;
  rulemakingRequiredDescription?: string | null;
  rulemakingRequiredNote?: string | null;
  authorityAllowances?: AuthorityAllowance[] | null;
  authorityAllowancesOther?: string | null;
  authorityAllowancesNote?: string | null;
  waiversRequired?: boolean | null;
  waiversRequiredTypes?: WaiverType[] | null;
  waiversRequiredNote?: string | null;
  status?: TaskStatusInput | null;
}

export interface PlanITToolsChanges {
  gcPartCD?: GcPartCDType[] | null;
  gcPartCDOther?: string | null;
  gcPartCDNote?: string | null;
  gcCollectBids?: GcCollectBidsType[] | null;
  gcCollectBidsOther?: string | null;
  gcCollectBidsNote?: string | null;
  gcUpdateContract?: GcUpdateContractType[] | null;
  gcUpdateContractOther?: string | null;
  gcUpdateContractNote?: string | null;
  ppToAdvertise?: PpToAdvertiseType[] | null;
  ppToAdvertiseOther?: string | null;
  ppToAdvertiseNote?: string | null;
  ppCollectScoreReview?: PpCollectScoreReviewType[] | null;
  ppCollectScoreReviewOther?: string | null;
  ppCollectScoreReviewNote?: string | null;
  ppAppSupportContractor?: PpAppSupportContractorType[] | null;
  ppAppSupportContractorOther?: string | null;
  ppAppSupportContractorNote?: string | null;
  ppCommunicateWithParticipant?: PpCommunicateWithParticipantType[] | null;
  ppCommunicateWithParticipantOther?: string | null;
  ppCommunicateWithParticipantNote?: string | null;
  ppManageProviderOverlap?: PpManageProviderOverlapType[] | null;
  ppManageProviderOverlapOther?: string | null;
  ppManageProviderOverlapNote?: string | null;
  bManageBeneficiaryOverlap?: BManageBeneficiaryOverlapType[] | null;
  bManageBeneficiaryOverlapOther?: string | null;
  bManageBeneficiaryOverlapNote?: string | null;
  oelHelpdeskSupport?: OelHelpdeskSupportType[] | null;
  oelHelpdeskSupportOther?: string | null;
  oelHelpdeskSupportNote?: string | null;
  oelManageAco?: OelManageAcoType[] | null;
  oelManageAcoOther?: string | null;
  oelManageAcoNote?: string | null;
  oelPerformanceBenchmark?: OelPerformanceBenchmarkType[] | null;
  oelPerformanceBenchmarkOther?: string | null;
  oelPerformanceBenchmarkNote?: string | null;
  oelProcessAppeals?: OelProcessAppealsType[] | null;
  oelProcessAppealsOther?: string | null;
  oelProcessAppealsNote?: string | null;
  oelEvaluationContractor?: OelEvaluationContractorType[] | null;
  oelEvaluationContractorOther?: string | null;
  oelEvaluationContractorNote?: string | null;
  oelCollectData?: OelCollectDataType[] | null;
  oelCollectDataOther?: string | null;
  oelCollectDataNote?: string | null;
  oelObtainData?: OelObtainDataType[] | null;
  oelObtainDataOther?: string | null;
  oelObtainDataNote?: string | null;
  oelClaimsBasedMeasures?: OelClaimsBasedMeasuresType[] | null;
  oelClaimsBasedMeasuresOther?: string | null;
  oelClaimsBasedMeasuresNote?: string | null;
  oelQualityScores?: OelQualityScoresType[] | null;
  oelQualityScoresOther?: string | null;
  oelQualityScoresNote?: string | null;
  oelSendReports?: OelSendReportsType[] | null;
  oelSendReportsOther?: string | null;
  oelSendReportsNote?: string | null;
  oelLearningContractor?: OelLearningContractorType[] | null;
  oelLearningContractorOther?: string | null;
  oelLearningContractorNote?: string | null;
  oelParticipantCollaboration?: OelParticipantCollaborationType[] | null;
  oelParticipantCollaborationOther?: string | null;
  oelParticipantCollaborationNote?: string | null;
  oelEducateBeneficiaries?: OelEducateBeneficiariesType[] | null;
  oelEducateBeneficiariesOther?: string | null;
  oelEducateBeneficiariesNote?: string | null;
  pMakeClaimsPayments?: PMakeClaimsPaymentsType[] | null;
  pMakeClaimsPaymentsOther?: string | null;
  pMakeClaimsPaymentsNote?: string | null;
  pInformFfs?: PInformFfsType[] | null;
  pInformFfsOther?: string | null;
  pInformFfsNote?: string | null;
  pNonClaimsBasedPayments?: PNonClaimsBasedPaymentsType[] | null;
  pNonClaimsBasedPaymentsOther?: string | null;
  pNonClaimsBasedPaymentsNote?: string | null;
  pSharedSavingsPlan?: PSharedSavingsPlanType[] | null;
  pSharedSavingsPlanOther?: string | null;
  pSharedSavingsPlanNote?: string | null;
  pRecoverPayments?: PRecoverPaymentsType[] | null;
  pRecoverPaymentsOther?: string | null;
  pRecoverPaymentsNote?: string | null;
  status?: TaskStatusInput | null;
}

/**
 * PlanOpsEvalAndLearningChanges represents the possible changes you can make to a
 * ops, eval and learning object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanOpsEvalAndLearningChanges {
  agencyOrStateHelp?: AgencyOrStateHelpType[] | null;
  agencyOrStateHelpOther?: string | null;
  agencyOrStateHelpNote?: string | null;
  stakeholders?: StakeholdersType[] | null;
  stakeholdersOther?: string | null;
  stakeholdersNote?: string | null;
  helpdeskUse?: boolean | null;
  helpdeskUseNote?: string | null;
  contractorSupport?: ContractorSupportType[] | null;
  contractorSupportOther?: string | null;
  contractorSupportHow?: string | null;
  contractorSupportNote?: string | null;
  iddocSupport?: boolean | null;
  iddocSupportNote?: string | null;
  technicalContactsIdentified?: boolean | null;
  technicalContactsIdentifiedDetail?: string | null;
  technicalContactsIdentifiedNote?: string | null;
  captureParticipantInfo?: boolean | null;
  captureParticipantInfoNote?: string | null;
  icdOwner?: string | null;
  draftIcdDueDate?: Time | null;
  icdNote?: string | null;
  uatNeeds?: string | null;
  stcNeeds?: string | null;
  testingTimelines?: string | null;
  testingNote?: string | null;
  dataMonitoringFileTypes?: MonitoringFileType[] | null;
  dataMonitoringFileOther?: string | null;
  dataResponseType?: string | null;
  dataResponseFileFrequency?: string | null;
  dataFullTimeOrIncremental?: DataFullTimeOrIncrementalType | null;
  eftSetUp?: boolean | null;
  unsolicitedAdjustmentsIncluded?: boolean | null;
  dataFlowDiagramsNeeded?: boolean | null;
  produceBenefitEnhancementFiles?: boolean | null;
  fileNamingConventions?: string | null;
  dataMonitoringNote?: string | null;
  benchmarkForPerformance?: BenchmarkForPerformanceType | null;
  benchmarkForPerformanceNote?: string | null;
  computePerformanceScores?: boolean | null;
  computePerformanceScoresNote?: string | null;
  riskAdjustPerformance?: boolean | null;
  riskAdjustFeedback?: boolean | null;
  riskAdjustPayments?: boolean | null;
  riskAdjustOther?: boolean | null;
  riskAdjustNote?: string | null;
  appealPerformance?: boolean | null;
  appealFeedback?: boolean | null;
  appealPayments?: boolean | null;
  appealOther?: boolean | null;
  appealNote?: string | null;
  evaluationApproaches?: EvaluationApproachType[] | null;
  evaluationApproachOther?: string | null;
  evalutaionApproachNote?: string | null;
  ccmInvolvment?: CcmInvolvmentType[] | null;
  ccmInvolvmentOther?: string | null;
  ccmInvolvmentNote?: string | null;
  dataNeededForMonitoring?: DataForMonitoringType[] | null;
  dataNeededForMonitoringOther?: string | null;
  dataNeededForMonitoringNote?: string | null;
  dataToSendParticicipants?: DataToSendParticipantsType[] | null;
  dataToSendParticicipantsOther?: string | null;
  dataToSendParticicipantsNote?: string | null;
  shareCclfData?: boolean | null;
  shareCclfDataNote?: string | null;
  sendFilesBetweenCcw?: boolean | null;
  sendFilesBetweenCcwNote?: string | null;
  appToSendFilesToKnown?: boolean | null;
  appToSendFilesToWhich?: string | null;
  appToSendFilesToNote?: string | null;
  useCcwForFileDistribiutionToParticipants?: boolean | null;
  useCcwForFileDistribiutionToParticipantsNote?: string | null;
  developNewQualityMeasures?: boolean | null;
  developNewQualityMeasuresNote?: string | null;
  qualityPerformanceImpactsPayment?: boolean | null;
  qualityPerformanceImpactsPaymentNote?: string | null;
  dataSharingStarts?: DataStartsType | null;
  dataSharingStartsOther?: string | null;
  dataSharingFrequency?: DataFrequencyType[] | null;
  dataSharingFrequencyOther?: string | null;
  dataSharingStartsNote?: string | null;
  dataCollectionStarts?: DataStartsType | null;
  dataCollectionStartsOther?: string | null;
  dataCollectionFrequency?: DataFrequencyType[] | null;
  dataCollectionFrequencyOther?: string | null;
  dataCollectionFrequencyNote?: string | null;
  qualityReportingStarts?: DataStartsType | null;
  qualityReportingStartsOther?: string | null;
  qualityReportingStartsNote?: string | null;
  modelLearningSystems?: ModelLearningSystemType[] | null;
  modelLearningSystemsOther?: string | null;
  modelLearningSystemsNote?: string | null;
  anticipatedChallenges?: string | null;
  status?: TaskStatusInput | null;
}

/**
 * PlanParticipantsAndProvidersChanges represents the possible changes you can make to a
 * providers and participants object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanParticipantsAndProvidersChanges {
  participants?: ParticipantsType[] | null;
  medicareProviderType?: string | null;
  statesEngagement?: string | null;
  participantsOther?: string | null;
  participantsNote?: string | null;
  participantsCurrentlyInModels?: boolean | null;
  participantsCurrentlyInModelsNote?: string | null;
  modelApplicationLevel?: string | null;
  expectedNumberOfParticipants?: number | null;
  estimateConfidence?: ConfidenceType | null;
  confidenceNote?: string | null;
  recruitmentMethod?: RecruitmentType | null;
  recruitmentOther?: string | null;
  recruitmentNote?: string | null;
  selectionMethod?: ParticipantSelectionType[] | null;
  selectionOther?: string | null;
  selectionNote?: string | null;
  communicationMethod?: ParticipantCommunicationType[] | null;
  communicationMethodOther?: string | null;
  communicationNote?: string | null;
  participantAssumeRisk?: boolean | null;
  riskType?: ParticipantRiskType | null;
  riskOther?: string | null;
  riskNote?: string | null;
  willRiskChange?: boolean | null;
  willRiskChangeNote?: string | null;
  coordinateWork?: boolean | null;
  coordinateWorkNote?: string | null;
  gainsharePayments?: boolean | null;
  gainsharePaymentsTrack?: boolean | null;
  gainsharePaymentsNote?: string | null;
  participantsIds?: ParticipantsIDType[] | null;
  participantsIdsOther?: string | null;
  participantsIDSNote?: string | null;
  providerAdditionFrequency?: FrequencyType | null;
  providerAdditionFrequencyOther?: string | null;
  providerAdditionFrequencyNote?: string | null;
  providerAddMethod?: ProviderAddType[] | null;
  providerAddMethodOther?: string | null;
  providerAddMethodNote?: string | null;
  providerLeaveMethod?: ProviderLeaveType[] | null;
  providerLeaveMethodOther?: string | null;
  providerLeaveMethodNote?: string | null;
  providerOverlap?: OverlapType | null;
  providerOverlapHierarchy?: string | null;
  providerOverlapNote?: string | null;
  status?: TaskStatusInput | null;
}

export interface PlanPaymentsChanges {
  fundingSource?: FundingSource[] | null;
  fundingSourceTrustFund?: string | null;
  fundingSourceOther?: string | null;
  fundingSourceNote?: string | null;
  fundingSourceR?: FundingSource[] | null;
  fundingSourceRTrustFund?: string | null;
  fundingSourceROther?: string | null;
  fundingSourceRNote?: string | null;
  payRecipients?: PayRecipient[] | null;
  payRecipientsOtherSpecification?: string | null;
  payRecipientsNote?: string | null;
  payType?: PayType[] | null;
  payTypeNote?: string | null;
  payClaims?: ClaimsBasedPayType[] | null;
  payClaimsOther?: string | null;
  payClaimsNote?: string | null;
  shouldAnyProvidersExcludedFFSSystems?: boolean | null;
  shouldAnyProviderExcludedFFSSystemsNote?: string | null;
  changesMedicarePhysicianFeeSchedule?: boolean | null;
  changesMedicarePhysicianFeeScheduleNote?: string | null;
  affectsMedicareSecondaryPayerClaims?: boolean | null;
  affectsMedicareSecondaryPayerClaimsHow?: string | null;
  affectsMedicareSecondaryPayerClaimsNote?: string | null;
  payModelDifferentiation?: string | null;
  creatingDependenciesBetweenServices?: boolean | null;
  creatingDependenciesBetweenServicesNote?: string | null;
  needsClaimsDataCollection?: boolean | null;
  needsClaimsDataCollectionNote?: string | null;
  providingThirdPartyFile?: boolean | null;
  isContractorAwareTestDataRequirements?: boolean | null;
  beneficiaryCostSharingLevelAndHandling?: string | null;
  waiveBeneficiaryCostSharingForAnyServices?: boolean | null;
  waiveBeneficiaryCostSharingServiceSpecification?: string | null;
  waiverOnlyAppliesPartOfPayment?: boolean | null;
  waiveBeneficiaryCostSharingNote?: string | null;
  nonClaimsPayments?: NonClaimsBasedPayType[] | null;
  nonClaimsPaymentOther?: string | null;
  paymentCalculationOwner?: string | null;
  numberPaymentsPerPayCycle?: string | null;
  numberPaymentsPerPayCycleNote?: string | null;
  sharedSystemsInvolvedAdditionalClaimPayment?: boolean | null;
  sharedSystemsInvolvedAdditionalClaimPaymentNote?: string | null;
  planningToUseInnovationPaymentContractor?: boolean | null;
  planningToUseInnovationPaymentContractorNote?: string | null;
  fundingStructure?: string | null;
  expectedCalculationComplexityLevel?: ComplexityCalculationLevelType | null;
  expectedCalculationComplexityLevelNote?: string | null;
  canParticipantsSelectBetweenPaymentMechanisms?: boolean | null;
  canParticipantsSelectBetweenPaymentMechanismsHow?: string | null;
  canParticipantsSelectBetweenPaymentMechanismsNote?: string | null;
  anticipatedPaymentFrequency?: AnticipatedPaymentFrequencyType[] | null;
  anticipatedPaymentFrequencyOther?: string | null;
  anticipatedPaymentFrequencyNote?: string | null;
  willRecoverPayments?: boolean | null;
  willRecoverPaymentsNote?: string | null;
  anticipateReconcilingPaymentsRetrospectively?: boolean | null;
  anticipateReconcilingPaymentsRetrospectivelyNote?: string | null;
  paymentStartDate?: Time | null;
  paymentStartDateNote?: string | null;
  status?: TaskStatusInput | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
