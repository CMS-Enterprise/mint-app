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

/**
 * ActivityType represents the possible activities that happen in application that might result in a notification
 */
export enum ActivityType {
  ADDED_AS_COLLABORATOR = "ADDED_AS_COLLABORATOR",
  DAILY_DIGEST_COMPLETE = "DAILY_DIGEST_COMPLETE",
  MODEL_PLAN_SHARED = "MODEL_PLAN_SHARED",
  NEW_DISCUSSION_REPLY = "NEW_DISCUSSION_REPLY",
  TAGGED_IN_DISCUSSION = "TAGGED_IN_DISCUSSION",
  TAGGED_IN_DISCUSSION_REPLY = "TAGGED_IN_DISCUSSION_REPLY",
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

export enum AuditFieldChangeType {
  ANSWERED = "ANSWERED",
  REMOVED = "REMOVED",
  UPDATED = "UPDATED",
}

export enum AuthorityAllowance {
  ACA = "ACA",
  CONGRESSIONALLY_MANDATED = "CONGRESSIONALLY_MANDATED",
  OTHER = "OTHER",
  SSA_PART_B = "SSA_PART_B",
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
  UNDERSERVED = "UNDERSERVED",
}

export enum CMMIGroup {
  PATIENT_CARE_MODELS_GROUP = "PATIENT_CARE_MODELS_GROUP",
  POLICY_AND_PROGRAMS_GROUP = "POLICY_AND_PROGRAMS_GROUP",
  SEAMLESS_CARE_MODELS_GROUP = "SEAMLESS_CARE_MODELS_GROUP",
  STATE_AND_POPULATION_HEALTH_GROUP = "STATE_AND_POPULATION_HEALTH_GROUP",
  TBD = "TBD",
}

export enum CMSCenter {
  CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY = "CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY",
  CENTER_FOR_MEDICAID_AND_CHIP_SERVICES = "CENTER_FOR_MEDICAID_AND_CHIP_SERVICES",
  CENTER_FOR_MEDICARE = "CENTER_FOR_MEDICARE",
  CENTER_FOR_PROGRAM_INTEGRITY = "CENTER_FOR_PROGRAM_INTEGRITY",
  CMMI = "CMMI",
  FEDERAL_COORDINATED_HEALTH_CARE_OFFICE = "FEDERAL_COORDINATED_HEALTH_CARE_OFFICE",
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
  PAYMENTS_FOR_POST_DISCHARGE_HOME_VISITS = "PAYMENTS_FOR_POST_DISCHARGE_HOME_VISITS",
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

export enum DatabaseOperation {
  DELETE = "DELETE",
  INSERT = "INSERT",
  TRUNCATE = "TRUNCATE",
  UPDATE = "UPDATE",
}

export enum DiscussionUserRole {
  CMS_SYSTEM_SERVICE_TEAM = "CMS_SYSTEM_SERVICE_TEAM",
  IT_ARCHITECT = "IT_ARCHITECT",
  LEADERSHIP = "LEADERSHIP",
  MEDICARE_ADMINISTRATIVE_CONTRACTOR = "MEDICARE_ADMINISTRATIVE_CONTRACTOR",
  MINT_TEAM = "MINT_TEAM",
  MODEL_IT_LEAD = "MODEL_IT_LEAD",
  MODEL_TEAM = "MODEL_TEAM",
  NONE_OF_THE_ABOVE = "NONE_OF_THE_ABOVE",
  SHARED_SYSTEM_MAINTAINER = "SHARED_SYSTEM_MAINTAINER",
}

export enum DocumentType {
  CONCEPT_PAPER = "CONCEPT_PAPER",
  DESIGN_PARAMETERS_MEMO = "DESIGN_PARAMETERS_MEMO",
  ICIP_DRAFT = "ICIP_DRAFT",
  MARKET_RESEARCH = "MARKET_RESEARCH",
  OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION = "OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION",
  OTHER = "OTHER",
  POLICY_PAPER = "POLICY_PAPER",
}

export enum EaseOfUse {
  AGREE = "AGREE",
  DISAGREE = "DISAGREE",
  UNSURE = "UNSURE",
}

export enum EvaluationApproachType {
  COMPARISON_MATCH = "COMPARISON_MATCH",
  CONTROL_INTERVENTION = "CONTROL_INTERVENTION",
  INTERRUPTED_TIME = "INTERRUPTED_TIME",
  NON_MEDICARE_DATA = "NON_MEDICARE_DATA",
  OTHER = "OTHER",
}

export enum ExisitingModelLinkFieldType {
  GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH = "GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH",
  GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH = "GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH",
}

export enum FrequencyType {
  ANNUALLY = "ANNUALLY",
  CONTINUALLY = "CONTINUALLY",
  MONTHLY = "MONTHLY",
  OTHER = "OTHER",
  QUARTERLY = "QUARTERLY",
  SEMIANNUALLY = "SEMIANNUALLY",
}

export enum FundingSource {
  MEDICARE_PART_A_HI_TRUST_FUND = "MEDICARE_PART_A_HI_TRUST_FUND",
  MEDICARE_PART_B_SMI_TRUST_FUND = "MEDICARE_PART_B_SMI_TRUST_FUND",
  OTHER = "OTHER",
  PATIENT_PROTECTION_AFFORDABLE_CARE_ACT = "PATIENT_PROTECTION_AFFORDABLE_CARE_ACT",
}

export enum GainshareArrangementEligibility {
  ALL_PROVIDERS = "ALL_PROVIDERS",
  NO = "NO",
  OTHER = "OTHER",
  SOME_PROVIDERS = "SOME_PROVIDERS",
}

export enum GeographyApplication {
  BENEFICIARIES = "BENEFICIARIES",
  OTHER = "OTHER",
  PARTICIPANTS = "PARTICIPANTS",
  PROVIDERS = "PROVIDERS",
}

export enum GeographyRegionType {
  CBSA = "CBSA",
  HRR = "HRR",
  MSA = "MSA",
}

export enum GeographyType {
  OTHER = "OTHER",
  REGION = "REGION",
  STATE = "STATE",
}

export enum KeyCharacteristic {
  EPISODE_BASED = "EPISODE_BASED",
  MEDICAID_MODEL = "MEDICAID_MODEL",
  MEDICARE_FFS_MODEL = "MEDICARE_FFS_MODEL",
  OTHER = "OTHER",
  PART_C = "PART_C",
  PART_D = "PART_D",
  PAYMENT = "PAYMENT",
  POPULATION_BASED = "POPULATION_BASED",
  PREVENTATIVE = "PREVENTATIVE",
  SERVICE_DELIVERY = "SERVICE_DELIVERY",
  SHARED_SAVINGS = "SHARED_SAVINGS",
}

export enum MintUses {
  CONTRIBUTE_DISCUSSIONS = "CONTRIBUTE_DISCUSSIONS",
  EDIT_MODEL = "EDIT_MODEL",
  OTHER = "OTHER",
  SHARE_MODEL = "SHARE_MODEL",
  TRACK_SOLUTIONS = "TRACK_SOLUTIONS",
  VIEW_HELP = "VIEW_HELP",
  VIEW_MODEL = "VIEW_MODEL",
}

export enum ModelCategory {
  ACCOUNTABLE_CARE = "ACCOUNTABLE_CARE",
  DISEASE_SPECIFIC_AND_EPISODIC = "DISEASE_SPECIFIC_AND_EPISODIC",
  HEALTH_PLAN = "HEALTH_PLAN",
  PRESCRIPTION_DRUG = "PRESCRIPTION_DRUG",
  STATE_BASED = "STATE_BASED",
  STATUTORY = "STATUTORY",
  TO_BE_DETERMINED = "TO_BE_DETERMINED",
}

export enum ModelLearningSystemType {
  EDUCATE_BENEFICIARIES = "EDUCATE_BENEFICIARIES",
  IT_PLATFORM_CONNECT = "IT_PLATFORM_CONNECT",
  LEARNING_CONTRACTOR = "LEARNING_CONTRACTOR",
  NO_LEARNING_SYSTEM = "NO_LEARNING_SYSTEM",
  OTHER = "OTHER",
  PARTICIPANT_COLLABORATION = "PARTICIPANT_COLLABORATION",
}

export enum ModelPlanFilter {
  COLLAB_ONLY = "COLLAB_ONLY",
  INCLUDE_ALL = "INCLUDE_ALL",
  WITH_CR_TDLS = "WITH_CR_TDLS",
}

export enum ModelStatus {
  ACTIVE = "ACTIVE",
  ANNOUNCED = "ANNOUNCED",
  CANCELED = "CANCELED",
  CLEARED = "CLEARED",
  CMS_CLEARANCE = "CMS_CLEARANCE",
  ENDED = "ENDED",
  HHS_CLEARANCE = "HHS_CLEARANCE",
  ICIP_COMPLETE = "ICIP_COMPLETE",
  INTERNAL_CMMI_CLEARANCE = "INTERNAL_CMMI_CLEARANCE",
  OMB_ASRF_CLEARANCE = "OMB_ASRF_CLEARANCE",
  PAUSED = "PAUSED",
  PLAN_COMPLETE = "PLAN_COMPLETE",
  PLAN_DRAFT = "PLAN_DRAFT",
}

export enum ModelType {
  MANDATORY_NATIONAL = "MANDATORY_NATIONAL",
  MANDATORY_REGIONAL_OR_STATE = "MANDATORY_REGIONAL_OR_STATE",
  OTHER = "OTHER",
  VOLUNTARY = "VOLUNTARY",
}

export enum ModelViewFilter {
  CBOSC = "CBOSC",
  CCW = "CCW",
  CMMI = "CMMI",
  DFSDM = "DFSDM",
  IDDOC = "IDDOC",
  IPC = "IPC",
  MDM = "MDM",
  OACT = "OACT",
  PBG = "PBG",
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
  INCENTIVE_PAYMENT = "INCENTIVE_PAYMENT",
  MAPD_SHARED_SAVINGS = "MAPD_SHARED_SAVINGS",
  OTHER = "OTHER",
  SHARED_SAVINGS = "SHARED_SAVINGS",
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
  APP_SUPPORT_CON = "APP_SUPPORT_CON",
  CLAIMS_BASED_MEASURES = "CLAIMS_BASED_MEASURES",
  COMM_W_PART = "COMM_W_PART",
  COMPUTE_SHARED_SAVINGS_PAYMENT = "COMPUTE_SHARED_SAVINGS_PAYMENT",
  DATA_TO_MONITOR = "DATA_TO_MONITOR",
  DATA_TO_SUPPORT_EVAL = "DATA_TO_SUPPORT_EVAL",
  EDUCATE_BENEF = "EDUCATE_BENEF",
  ESTABLISH_BENCH = "ESTABLISH_BENCH",
  HELPDESK_SUPPORT = "HELPDESK_SUPPORT",
  IDDOC_SUPPORT = "IDDOC_SUPPORT",
  IT_PLATFORM_FOR_LEARNING = "IT_PLATFORM_FOR_LEARNING",
  MAKE_NON_CLAIMS_BASED_PAYMENTS = "MAKE_NON_CLAIMS_BASED_PAYMENTS",
  MANAGE_BEN_OVERLAP = "MANAGE_BEN_OVERLAP",
  MANAGE_CD = "MANAGE_CD",
  MANAGE_FFS_EXCL_PAYMENTS = "MANAGE_FFS_EXCL_PAYMENTS",
  MANAGE_PROV_OVERLAP = "MANAGE_PROV_OVERLAP",
  PART_TO_PART_COLLAB = "PART_TO_PART_COLLAB",
  PROCESS_PART_APPEALS = "PROCESS_PART_APPEALS",
  QUALITY_PERFORMANCE_SCORES = "QUALITY_PERFORMANCE_SCORES",
  RECOVER_PAYMENTS = "RECOVER_PAYMENTS",
  RECRUIT_PARTICIPANTS = "RECRUIT_PARTICIPANTS",
  REV_COL_BIDS = "REV_COL_BIDS",
  REV_SCORE_APP = "REV_SCORE_APP",
  SEND_REPDATA_TO_PART = "SEND_REPDATA_TO_PART",
  SIGN_PARTICIPATION_AGREEMENTS = "SIGN_PARTICIPATION_AGREEMENTS",
  UPDATE_CONTRACT = "UPDATE_CONTRACT",
  UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR = "UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR",
  VET_PROVIDERS_FOR_PROGRAM_INTEGRITY = "VET_PROVIDERS_FOR_PROGRAM_INTEGRITY",
}

export enum OperationalSolutionKey {
  ACO_OS = "ACO_OS",
  APPS = "APPS",
  ARS = "ARS",
  BCDA = "BCDA",
  CBOSC = "CBOSC",
  CCW = "CCW",
  CDX = "CDX",
  CMS_BOX = "CMS_BOX",
  CMS_QUALTRICS = "CMS_QUALTRICS",
  CONNECT = "CONNECT",
  CONTRACTOR = "CONTRACTOR",
  CPI_VETTING = "CPI_VETTING",
  CROSS_MODEL_CONTRACT = "CROSS_MODEL_CONTRACT",
  EDFR = "EDFR",
  EFT = "EFT",
  EXISTING_CMS_DATA_AND_PROCESS = "EXISTING_CMS_DATA_AND_PROCESS",
  GOVDELIVERY = "GOVDELIVERY",
  GS = "GS",
  HDR = "HDR",
  HIGLAS = "HIGLAS",
  HPMS = "HPMS",
  IDR = "IDR",
  INNOVATION = "INNOVATION",
  INTERNAL_STAFF = "INTERNAL_STAFF",
  IPC = "IPC",
  ISP = "ISP",
  LDG = "LDG",
  LOI = "LOI",
  LV = "LV",
  MARX = "MARX",
  MDM = "MDM",
  MIDS = "MIDS",
  OTHER_NEW_PROCESS = "OTHER_NEW_PROCESS",
  OUTLOOK_MAILBOX = "OUTLOOK_MAILBOX",
  POST_PORTAL = "POST_PORTAL",
  QV = "QV",
  RFA = "RFA",
  RMADA = "RMADA",
  SHARED_SYSTEMS = "SHARED_SYSTEMS",
}

export enum OperationalSolutionSubtaskStatus {
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  TODO = "TODO",
}

export enum OverlapType {
  NO = "NO",
  YES_NEED_POLICIES = "YES_NEED_POLICIES",
  YES_NO_ISSUES = "YES_NO_ISSUES",
}

export enum ParticipantCommunicationType {
  IT_TOOL = "IT_TOOL",
  MASS_EMAIL = "MASS_EMAIL",
  NO_COMMUNICATION = "NO_COMMUNICATION",
  OTHER = "OTHER",
}

export enum ParticipantRequireFinancialGuaranteeType {
  ESCROW = "ESCROW",
  LETTER_OF_CREDIT = "LETTER_OF_CREDIT",
  OTHER = "OTHER",
  SURETY_BOND = "SURETY_BOND",
}

export enum ParticipantRiskType {
  CAPITATION = "CAPITATION",
  NOT_RISK_BASED = "NOT_RISK_BASED",
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
  ACCOUNTABLE_CARE_ORGANIZATION = "ACCOUNTABLE_CARE_ORGANIZATION",
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
  APPLICATION_COLLECTION_TOOL = "APPLICATION_COLLECTION_TOOL",
  LOI = "LOI",
  NA = "NA",
  NOFO = "NOFO",
  OTHER = "OTHER",
}

export enum ReportAProblemSection {
  HELP_CENTER = "HELP_CENTER",
  IT_SOLUTIONS = "IT_SOLUTIONS",
  OTHER = "OTHER",
  READ_VIEW = "READ_VIEW",
  TASK_LIST = "TASK_LIST",
}

export enum ReportAProblemSeverity {
  DELAYED_TASK = "DELAYED_TASK",
  MINOR = "MINOR",
  OTHER = "OTHER",
  PREVENTED_TASK = "PREVENTED_TASK",
}

export enum SatisfactionLevel {
  DISSATISFIED = "DISSATISFIED",
  NEUTRAL = "NEUTRAL",
  SATISFIED = "SATISFIED",
  VERY_DISSATISFIED = "VERY_DISSATISFIED",
  VERY_SATISFIED = "VERY_SATISFIED",
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

export enum StatesAndTerritories {
  AK = "AK",
  AL = "AL",
  AR = "AR",
  AS = "AS",
  AZ = "AZ",
  CA = "CA",
  CO = "CO",
  CT = "CT",
  DC = "DC",
  DE = "DE",
  FL = "FL",
  GA = "GA",
  GU = "GU",
  HI = "HI",
  IA = "IA",
  ID = "ID",
  IL = "IL",
  IN = "IN",
  KS = "KS",
  KY = "KY",
  LA = "LA",
  MA = "MA",
  MD = "MD",
  ME = "ME",
  MI = "MI",
  MN = "MN",
  MO = "MO",
  MP = "MP",
  MS = "MS",
  MT = "MT",
  NC = "NC",
  ND = "ND",
  NE = "NE",
  NH = "NH",
  NJ = "NJ",
  NM = "NM",
  NV = "NV",
  NY = "NY",
  OH = "OH",
  OK = "OK",
  OR = "OR",
  PA = "PA",
  PR = "PR",
  RI = "RI",
  SC = "SC",
  SD = "SD",
  TN = "TN",
  TX = "TX",
  UM = "UM",
  UT = "UT",
  VA = "VA",
  VI = "VI",
  VT = "VT",
  WA = "WA",
  WI = "WI",
  WV = "WV",
  WY = "WY",
}

export enum TaskListSection {
  BASICS = "BASICS",
  BENEFICIARIES = "BENEFICIARIES",
  GENERAL_CHARACTERISTICS = "GENERAL_CHARACTERISTICS",
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
  CM_FFS_COUNTERPART = "CM_FFS_COUNTERPART",
  COR = "COR",
  EVALUATION = "EVALUATION",
  IT_LEAD = "IT_LEAD",
  LEADERSHIP = "LEADERSHIP",
  LEARNING = "LEARNING",
  MODEL_LEAD = "MODEL_LEAD",
  MODEL_TEAM = "MODEL_TEAM",
  OACT = "OACT",
  PAYMENT = "PAYMENT",
  QUALITY = "QUALITY",
}

export enum TriStateAnswer {
  NO = "NO",
  TBD = "TBD",
  YES = "YES",
}

export enum UserNotificationPreferenceFlag {
  EMAIL = "EMAIL",
  IN_APP = "IN_APP",
}

export enum WaiverType {
  FRAUD_ABUSE = "FRAUD_ABUSE",
  MEDICAID = "MEDICAID",
  PROGRAM_PAYMENT = "PROGRAM_PAYMENT",
}

export enum YesNoOtherType {
  NO = "NO",
  OTHER = "OTHER",
  YES = "YES",
}

export enum YesNoType {
  NO = "NO",
  YES = "YES",
}

export interface CreateOperationalSolutionSubtaskInput {
  name: string;
  status: OperationalSolutionSubtaskStatus;
}

/**
 * DiscussionReplyCreateInput represents the necessary fields to create a discussion reply
 */
export interface DiscussionReplyCreateInput {
  discussionID: UUID;
  content: TaggedHTML;
  userRole?: DiscussionUserRole | null;
  userRoleDescription?: string | null;
}

/**
 * ModelPlanChanges represents the possible changes you can make to a model plan when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface ModelPlanChanges {
  modelName?: string | null;
  abbreviation?: string | null;
  someNumbers?: number[] | null;
  archived?: boolean | null;
  status?: ModelStatus | null;
}

export interface OperationalSolutionChanges {
  needed?: boolean | null;
  nameOther?: string | null;
  pocName?: string | null;
  pocEmail?: string | null;
  mustStartDts?: Time | null;
  mustFinishDts?: Time | null;
  otherHeader?: string | null;
  status?: OpSolutionStatus | null;
}

/**
 * PlanBasicsChanges represents the possible changes you can make to a Plan Basics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanBasicsChanges {
  demoCode?: string | null;
  amsModelID?: string | null;
  modelCategory?: ModelCategory | null;
  additionalModelCategories?: ModelCategory[] | null;
  cmsCenters?: CMSCenter[] | null;
  cmmiGroups?: CMMIGroup[] | null;
  modelType?: ModelType[] | null;
  modelTypeOther?: string | null;
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
  diseaseSpecificGroup?: string | null;
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
  beneficiarySelectionFrequency?: FrequencyType[] | null;
  beneficiarySelectionFrequencyContinually?: string | null;
  beneficiarySelectionFrequencyOther?: string | null;
  beneficiarySelectionFrequencyNote?: string | null;
  beneficiaryRemovalFrequency?: FrequencyType[] | null;
  beneficiaryRemovalFrequencyContinually?: string | null;
  beneficiaryRemovalFrequencyOther?: string | null;
  beneficiaryRemovalFrequencyNote?: string | null;
  beneficiaryOverlap?: OverlapType | null;
  beneficiaryOverlapNote?: string | null;
  precedenceRules?: YesNoType[] | null;
  precedenceRulesYes?: string | null;
  precedenceRulesNo?: string | null;
  precedenceRulesNote?: string | null;
  status?: TaskStatusInput | null;
}

export interface PlanCRChanges {
  idNumber?: string | null;
  dateInitiated?: Time | null;
  dateImplemented?: Time | null;
  title?: string | null;
  note?: string | null;
}

export interface PlanCRCreateInput {
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  dateImplemented: Time;
  title: string;
  note?: string | null;
}

/**
 * PlanCollaboratorCreateInput represents the data required to create a collaborator on a plan
 */
export interface PlanCollaboratorCreateInput {
  modelPlanID: UUID;
  userName: string;
  teamRoles: TeamRole[];
}

/**
 * PlanDiscussionCreateInput represents the necessary fields to create a plan discussion
 */
export interface PlanDiscussionCreateInput {
  modelPlanID: UUID;
  content: TaggedHTML;
  userRole?: DiscussionUserRole | null;
  userRoleDescription?: string | null;
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
 * PlanDocumentLinkInput
 */
export interface PlanDocumentLinkInput {
  modelPlanID: UUID;
  url: string;
  name: string;
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
  currentModelPlanID?: UUID | null;
  existingModelID?: number | null;
  resemblesExistingModel?: YesNoOtherType | null;
  resemblesExistingModelWhyHow?: string | null;
  resemblesExistingModelOtherSpecify?: string | null;
  resemblesExistingModelOtherSelected?: boolean | null;
  resemblesExistingModelOtherOption?: string | null;
  resemblesExistingModelHow?: string | null;
  resemblesExistingModelNote?: string | null;
  participationInModelPrecondition?: YesNoOtherType | null;
  participationInModelPreconditionWhyHow?: string | null;
  participationInModelPreconditionOtherSpecify?: string | null;
  participationInModelPreconditionOtherSelected?: boolean | null;
  participationInModelPreconditionOtherOption?: string | null;
  participationInModelPreconditionNote?: string | null;
  hasComponentsOrTracks?: boolean | null;
  hasComponentsOrTracksDiffer?: string | null;
  hasComponentsOrTracksNote?: string | null;
  agencyOrStateHelp?: AgencyOrStateHelpType[] | null;
  agencyOrStateHelpOther?: string | null;
  agencyOrStateHelpNote?: string | null;
  alternativePaymentModelTypes?: AlternativePaymentModelType[] | null;
  alternativePaymentModelNote?: string | null;
  keyCharacteristics?: KeyCharacteristic[] | null;
  keyCharacteristicsOther?: string | null;
  keyCharacteristicsNote?: string | null;
  collectPlanBids?: boolean | null;
  collectPlanBidsNote?: string | null;
  managePartCDEnrollment?: boolean | null;
  managePartCDEnrollmentNote?: string | null;
  planContractUpdated?: boolean | null;
  planContractUpdatedNote?: string | null;
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
  geographiesStatesAndTerritories?: StatesAndTerritories[] | null;
  geographiesRegionTypes?: GeographyRegionType[] | null;
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

/**
 * PlanOpsEvalAndLearningChanges represents the possible changes you can make to a
 * ops, eval and learning object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanOpsEvalAndLearningChanges {
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
  qualityPerformanceImpactsPayment?: YesNoOtherType | null;
  qualityPerformanceImpactsPaymentOther?: string | null;
  qualityPerformanceImpactsPaymentNote?: string | null;
  dataSharingStarts?: DataStartsType | null;
  dataSharingStartsOther?: string | null;
  dataSharingFrequency?: FrequencyType[] | null;
  dataSharingFrequencyContinually?: string | null;
  dataSharingFrequencyOther?: string | null;
  dataSharingStartsNote?: string | null;
  dataCollectionStarts?: DataStartsType | null;
  dataCollectionStartsOther?: string | null;
  dataCollectionFrequency?: FrequencyType[] | null;
  dataCollectionFrequencyContinually?: string | null;
  dataCollectionFrequencyOther?: string | null;
  dataCollectionFrequencyNote?: string | null;
  qualityReportingStarts?: DataStartsType | null;
  qualityReportingStartsOther?: string | null;
  qualityReportingStartsNote?: string | null;
  qualityReportingFrequency?: FrequencyType[] | null;
  qualityReportingFrequencyContinually?: string | null;
  qualityReportingFrequencyOther?: string | null;
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
  participantAddedFrequency?: FrequencyType[] | null;
  participantAddedFrequencyContinually?: string | null;
  participantAddedFrequencyOther?: string | null;
  participantAddedFrequencyNote?: string | null;
  participantRemovedFrequency?: FrequencyType[] | null;
  participantRemovedFrequencyContinually?: string | null;
  participantRemovedFrequencyOther?: string | null;
  participantRemovedFrequencyNote?: string | null;
  communicationMethod?: ParticipantCommunicationType[] | null;
  communicationMethodOther?: string | null;
  communicationNote?: string | null;
  riskType?: ParticipantRiskType[] | null;
  riskOther?: string | null;
  riskNote?: string | null;
  willRiskChange?: boolean | null;
  willRiskChangeNote?: string | null;
  participantRequireFinancialGuarantee?: boolean | null;
  participantRequireFinancialGuaranteeType?: ParticipantRequireFinancialGuaranteeType[] | null;
  participantRequireFinancialGuaranteeOther?: string | null;
  participantRequireFinancialGuaranteeNote?: string | null;
  coordinateWork?: boolean | null;
  coordinateWorkNote?: string | null;
  gainsharePayments?: boolean | null;
  gainsharePaymentsTrack?: boolean | null;
  gainsharePaymentsNote?: string | null;
  gainsharePaymentsEligibility?: GainshareArrangementEligibility[] | null;
  gainsharePaymentsEligibilityOther?: string | null;
  participantsIds?: ParticipantsIDType[] | null;
  participantsIdsOther?: string | null;
  participantsIDSNote?: string | null;
  providerAdditionFrequency?: FrequencyType[] | null;
  providerAdditionFrequencyContinually?: string | null;
  providerAdditionFrequencyOther?: string | null;
  providerAdditionFrequencyNote?: string | null;
  providerAddMethod?: ProviderAddType[] | null;
  providerAddMethodOther?: string | null;
  providerAddMethodNote?: string | null;
  providerLeaveMethod?: ProviderLeaveType[] | null;
  providerLeaveMethodOther?: string | null;
  providerLeaveMethodNote?: string | null;
  providerRemovalFrequency?: FrequencyType[] | null;
  providerRemovalFrequencyContinually?: string | null;
  providerRemovalFrequencyOther?: string | null;
  providerRemovalFrequencyNote?: string | null;
  providerOverlap?: OverlapType | null;
  providerOverlapHierarchy?: string | null;
  providerOverlapNote?: string | null;
  status?: TaskStatusInput | null;
}

export interface PlanPaymentsChanges {
  fundingSource?: FundingSource[] | null;
  fundingSourceMedicareAInfo?: string | null;
  fundingSourceMedicareBInfo?: string | null;
  fundingSourceOther?: string | null;
  fundingSourceNote?: string | null;
  fundingSourceR?: FundingSource[] | null;
  fundingSourceRMedicareAInfo?: string | null;
  fundingSourceRMedicareBInfo?: string | null;
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
  nonClaimsPaymentsNote?: string | null;
  paymentCalculationOwner?: string | null;
  numberPaymentsPerPayCycle?: string | null;
  numberPaymentsPerPayCycleNote?: string | null;
  sharedSystemsInvolvedAdditionalClaimPayment?: boolean | null;
  sharedSystemsInvolvedAdditionalClaimPaymentNote?: string | null;
  planningToUseInnovationPaymentContractor?: boolean | null;
  planningToUseInnovationPaymentContractorNote?: string | null;
  expectedCalculationComplexityLevel?: ComplexityCalculationLevelType | null;
  expectedCalculationComplexityLevelNote?: string | null;
  claimsProcessingPrecedence?: boolean | null;
  claimsProcessingPrecedenceOther?: string | null;
  claimsProcessingPrecedenceNote?: string | null;
  canParticipantsSelectBetweenPaymentMechanisms?: boolean | null;
  canParticipantsSelectBetweenPaymentMechanismsHow?: string | null;
  canParticipantsSelectBetweenPaymentMechanismsNote?: string | null;
  anticipatedPaymentFrequency?: FrequencyType[] | null;
  anticipatedPaymentFrequencyContinually?: string | null;
  anticipatedPaymentFrequencyOther?: string | null;
  anticipatedPaymentFrequencyNote?: string | null;
  willRecoverPayments?: boolean | null;
  willRecoverPaymentsNote?: string | null;
  anticipateReconcilingPaymentsRetrospectively?: boolean | null;
  anticipateReconcilingPaymentsRetrospectivelyNote?: string | null;
  paymentReconciliationFrequency?: FrequencyType[] | null;
  paymentReconciliationFrequencyContinually?: string | null;
  paymentReconciliationFrequencyOther?: string | null;
  paymentReconciliationFrequencyNote?: string | null;
  paymentDemandRecoupmentFrequency?: FrequencyType[] | null;
  paymentDemandRecoupmentFrequencyContinually?: string | null;
  paymentDemandRecoupmentFrequencyOther?: string | null;
  paymentDemandRecoupmentFrequencyNote?: string | null;
  paymentStartDate?: Time | null;
  paymentStartDateNote?: string | null;
  status?: TaskStatusInput | null;
}

export interface PlanTDLChanges {
  idNumber?: string | null;
  dateInitiated?: Time | null;
  title?: string | null;
  note?: string | null;
}

export interface PlanTDLCreateInput {
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  title: string;
  note?: string | null;
}

export interface ReportAProblemInput {
  isAnonymousSubmission: boolean;
  allowContact?: boolean | null;
  section?: ReportAProblemSection | null;
  sectionOther?: string | null;
  whatDoing?: string | null;
  whatWentWrong?: string | null;
  severity?: ReportAProblemSeverity | null;
  severityOther?: string | null;
}

/**
 * The inputs to the user feedback form
 */
export interface SendFeedbackEmailInput {
  isAnonymousSubmission: boolean;
  allowContact?: boolean | null;
  cmsRole?: string | null;
  mintUsedFor?: MintUses[] | null;
  mintUsedForOther?: string | null;
  systemEasyToUse?: EaseOfUse | null;
  systemEasyToUseOther?: string | null;
  howSatisfied?: SatisfactionLevel | null;
  howCanWeImprove?: string | null;
}

export interface UpdateOperationalSolutionSubtaskChangesInput {
  name: string;
  status: OperationalSolutionSubtaskStatus;
}

export interface UpdateOperationalSolutionSubtaskInput {
  id: UUID;
  changes: UpdateOperationalSolutionSubtaskChangesInput;
}

/**
 * UserNotificationPreferencesChanges represents the ways that a UserNotifications Preferences object can be updated
 */
export interface UserNotificationPreferencesChanges {
  dailyDigestComplete?: UserNotificationPreferenceFlag[] | null;
  addedAsCollaborator?: UserNotificationPreferenceFlag[] | null;
  taggedInDiscussion?: UserNotificationPreferenceFlag[] | null;
  taggedInDiscussionReply?: UserNotificationPreferenceFlag[] | null;
  newDiscussionReply?: UserNotificationPreferenceFlag[] | null;
  modelPlanShared?: UserNotificationPreferenceFlag[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
