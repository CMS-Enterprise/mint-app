/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup, ModelStatus, ModelType, TaskStatus, DiscussionStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlan
// ====================================================

export interface GetModelPlan_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelPlanID: UUID;
  modelType: ModelType | null;
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan_milestones {
  __typename: "PlanMilestones";
  id: UUID;
  modelPlanID: UUID;
  completeICIP: Time | null;
  clearanceStarts: Time | null;
  clearanceEnds: Time | null;
  announced: Time | null;
  applicationsStart: Time | null;
  applicationsEnd: Time | null;
  performancePeriodStarts: Time | null;
  performancePeriodEnds: Time | null;
  highLevelNote: string | null;
  wrapUpEnds: Time | null;
  phasedIn: boolean | null;
  phasedInNote: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan_documents {
  __typename: "PlanDocument";
  id: UUID;
  fileName: string;
}

export interface GetModelPlan_modelPlan_discussions_replies {
  __typename: "DiscussionReply";
  id: UUID;
  discussionID: UUID;
  content: string | null;
  createdBy: string;
  createdDts: Time;
  resolution: boolean | null;
}

export interface GetModelPlan_modelPlan_discussions {
  __typename: "PlanDiscussion";
  id: UUID;
  content: string | null;
  createdBy: string;
  createdDts: Time;
  status: DiscussionStatus;
  replies: GetModelPlan_modelPlan_discussions_replies[];
}

export interface GetModelPlan_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  modelCategory: ModelCategory | null;
  cmsCenters: CMSCenter[];
  cmsOther: string | null;
  cmmiGroups: CMMIGroup[];
  modifiedDts: Time | null;
  archived: boolean;
  status: ModelStatus;
  basics: GetModelPlan_modelPlan_basics;
  milestones: GetModelPlan_modelPlan_milestones;
  documents: GetModelPlan_modelPlan_documents[];
  discussions: GetModelPlan_modelPlan_discussions[];
  generalCharacteristics: GetModelPlan_modelPlan_generalCharacteristics;
  participantsAndProviders: GetModelPlan_modelPlan_participantsAndProviders;
  beneficiaries: GetModelPlan_modelPlan_beneficiaries;
  opsEvalAndLearning: GetModelPlan_modelPlan_opsEvalAndLearning;
  itTools: GetModelPlan_modelPlan_itTools;
}

export interface GetModelPlan {
  modelPlan: GetModelPlan_modelPlan;
}

export interface GetModelPlanVariables {
  id: UUID;
}
