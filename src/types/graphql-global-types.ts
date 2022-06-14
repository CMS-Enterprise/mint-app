/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AgreementType {
  COOPERATIVE = "COOPERATIVE",
  OTHER = "OTHER",
  PARTICIPATION = "PARTICIPATION",
}

export enum AlternativePaymentModelType {
  ADVANCED = "ADVANCED",
  MIPS = "MIPS",
  REGULAR = "REGULAR",
}

export enum AuthorityAllowance {
  ACA = "ACA",
  CONGRESSIONALLY_MANDATED = "CONGRESSIONALLY_MANDATED",
  OTHER = "OTHER",
  SSA_PART_B = "SSA_PART_B",
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

export enum TaskStatus {
  COMPLETE = "COMPLETE",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
}

export enum TeamRole {
  EVALUATION = "EVALUATION",
  LEADERSHIP = "LEADERSHIP",
  LEARNING = "LEARNING",
  MODEL_LEAD = "MODEL_LEAD",
  MODEL_TEAM = "MODEL_TEAM",
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
 * Input associated with a document to be uploaded
 */
export interface GeneratePresignedUploadURLInput {
  fileName: string;
  mimeType: string;
  size: number;
}

/**
 * ModelPlanChanges represents the possible changes you can make to a model plan when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface ModelPlanChanges {
  modelName?: string | null;
  modelCategory?: ModelCategory | null;
  cmsCenters?: CMSCenter[] | null;
  cmsOther?: string | null;
  cmmiGroups?: CMMIGroup[] | null;
  someNumbers?: number[] | null;
  archived?: boolean | null;
  status?: ModelStatus | null;
}

/**
 * PlanBasicsChanges represents the possible changes you can make to a Plan Basics object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanBasicsChanges {
  modelType?: ModelType | null;
  problem?: string | null;
  goal?: string | null;
  testInventions?: string | null;
  note?: string | null;
}

/**
 * PlanCollaboratorCreateInput represents the data required to create a collaborator on a plan
 */
export interface PlanCollaboratorCreateInput {
  modelPlanID: UUID;
  euaUserID: string;
  fullName: string;
  teamRole: TeamRole;
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
 * PlanDocumentInput represents the data required to create, modify, or delete a document on a plan
 */
export interface PlanDocumentInput {
  id?: UUID | null;
  modelPlanID: UUID;
  documentParameters: PlanDocumentParameters;
  url?: string | null;
}

/**
 * PlanDocumentCreateParameters represents the specific data required to create or modify a document on a plan
 */
export interface PlanDocumentParameters {
  fileName?: string | null;
  fileSize: number;
  fileType?: string | null;
  documentType?: DocumentType | null;
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
  alternativePaymentModel?: boolean | null;
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
}

/**
 * PlanMilestoneChanges represents the possible changes you can make to a Plan Milestones object when updating it.
 * Fields explicitly set with NULL will be unset, and omitted fields will be left unchanged.
 * https: // gqlgen.com/reference/changesets/
 */
export interface PlanMilestoneChanges {
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
}

//==============================================================
// END Enums and Input Objects
//==============================================================
