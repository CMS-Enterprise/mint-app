/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanFilter, ModelStatus, ModelCategory, TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllModelPlans
// ====================================================

export interface GetAllModelPlans_modelPlanCollection_basics {
  __typename: "PlanBasics";
  performancePeriodStarts: Time | null;
  modelCategory: ModelCategory | null;
  goal: string | null;
}

export interface GetAllModelPlans_modelPlanCollection_collaborators_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface GetAllModelPlans_modelPlanCollection_collaborators {
  __typename: "PlanCollaborator";
  userAccount: GetAllModelPlans_modelPlanCollection_collaborators_userAccount;
  userID: UUID;
  teamRole: TeamRole;
}

export interface GetAllModelPlans_modelPlanCollection_crTdls {
  __typename: "PlanCrTdl";
  id: UUID;
  idNumber: string;
}

export interface GetAllModelPlans_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  nameHistory: string[];
  status: ModelStatus;
  isFavorite: boolean;
  isCollaborator: boolean;
  basics: GetAllModelPlans_modelPlanCollection_basics;
  collaborators: GetAllModelPlans_modelPlanCollection_collaborators[];
  crTdls: GetAllModelPlans_modelPlanCollection_crTdls[];
}

export interface GetAllModelPlans {
  modelPlanCollection: GetAllModelPlans_modelPlanCollection[];
}

export interface GetAllModelPlansVariables {
  filter: ModelPlanFilter;
}
