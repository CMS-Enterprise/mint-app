/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup, ModelType, TaskStatus, TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlan
// ====================================================

export interface CreateModelPlan_createModelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelPlanID: UUID;
  modelCategory: ModelCategory | null;
  cmsCenters: CMSCenter[];
  cmmiGroups: CMMIGroup[];
  modelType: ModelType[];
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
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
  createdBy: UUID;
  createdDts: Time;
  modifiedBy: UUID | null;
  modifiedDts: Time | null;
  status: TaskStatus;
}

export interface CreateModelPlan_createModelPlan_collaborators_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface CreateModelPlan_createModelPlan_collaborators {
  __typename: "PlanCollaborator";
  id: UUID;
  userAccount: CreateModelPlan_createModelPlan_collaborators_userAccount;
  userID: UUID;
  teamRoles: TeamRole[];
}

export interface CreateModelPlan_createModelPlan {
  __typename: "ModelPlan";
  id: UUID;
  createdBy: UUID;
  modelName: string;
  basics: CreateModelPlan_createModelPlan_basics;
  collaborators: CreateModelPlan_createModelPlan_collaborators[];
}

export interface CreateModelPlan {
  createModelPlan: CreateModelPlan_createModelPlan;
}

export interface CreateModelPlanVariables {
  modelName: string;
}
