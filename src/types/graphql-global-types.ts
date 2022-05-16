/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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
 * Represents plan basics
 */
export interface PlanBasicsInput {
  id?: UUID | null;
  modelPlanID?: UUID | null;
  modelType?: ModelType | null;
  problem?: string | null;
  goal?: string | null;
  testInventions?: string | null;
  note?: string | null;
  createdBy?: string | null;
  createdDts?: Time | null;
  modifiedBy?: string | null;
  modifiedDts?: Time | null;
  status?: TaskStatus | null;
}

/**
 * PlanCollaboratorInput represents the data required to create, modify, or delete a collaborator on a plan
 */
export interface PlanCollaboratorInput {
  id?: UUID | null;
  modelPlanID: UUID;
  euaUserID: string;
  fullName: string;
  teamRole: TeamRole;
  createdBy?: string | null;
  createdDts?: Time | null;
  modifiedBy?: string | null;
  modifiedDts?: Time | null;
}

/**
 * Represents plan milestones input
 */
export interface PlanMilestonesInput {
  id?: UUID | null;
  modelPlanID?: UUID | null;
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
  createdBy?: string | null;
  createdDts?: Time | null;
  modifiedBy?: string | null;
  modifiedDts?: Time | null;
  status?: TaskStatus | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
