/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelType, TaskStatus, TeamRole } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlan
// ====================================================

export interface CreateModelPlan_createModelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelPlanID: UUID;
  modelType: ModelType | null;
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: TaskStatus;
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
  id: UUID;
  createdBy: string;
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
