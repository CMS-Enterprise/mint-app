/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup, ModelType, TaskStatus, TeamRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlan
// ====================================================

export interface CreateModelPlan_createModelPlan_basics {
  __typename: "PlanBasics";
  id: UUID | null;
  modelPlanID: UUID | null;
  modelType: ModelType | null;
  problem: string | null;
  goal: string | null;
  testInventions: string | null;
  note: string | null;
  createdBy: string | null;
  createdDts: Time | null;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface CreateModelPlan_createModelPlan_milestones {
  __typename: "PlanMilestones";
  id: UUID | null;
  modelPlanID: UUID | null;
  completeICIP: Time | null;
  clearanceStarts: Time | null;
  clearanceEnds: Time | null;
  announced: Time | null;
  applicationsStart: Time | null;
  applicationsEnd: Time | null;
  performancePeriodStarts: Time | null;
  performancePeriodEnds: Time | null;
  wrapUpEnds: Time | null;
  highLevelNote: string | null;
  phasedIn: boolean | null;
  phasedInNote: string | null;
  createdBy: string | null;
  createdDts: Time | null;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus | null;
}

export interface CreateModelPlan_createModelPlan_collaborators {
  __typename: "PlanCollaborator";
  id: UUID;
  fullName: string;
  euaUserID: string;
  teamRole: TeamRole;
}

export interface CreateModelPlan_createModelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  createdBy: string | null;
  modelName: string;
  modelCategory: ModelCategory | null;
  cmsCenters: CMSCenter[];
  cmsOther: string | null;
  cmmiGroups: CMMIGroup[];
  basics: CreateModelPlan_createModelPlan_basics | null;
  milestones: CreateModelPlan_createModelPlan_milestones | null;
  collaborators: CreateModelPlan_createModelPlan_collaborators[];
}

export interface CreateModelPlan {
  createModelPlan: CreateModelPlan_createModelPlan | null;
}

export interface CreateModelPlanVariables {
  modelName: string;
}
