/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelStatus, ModelCategory, TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllModelPlans
// ====================================================

export interface GetAllModelPlans_modelPlanCollection_basics {
  __typename: "PlanBasics";
  applicationsStart: Time | null;
  modelCategory: ModelCategory | null;
  goal: string | null;
}

export interface GetAllModelPlans_modelPlanCollection_collaborators {
  __typename: "PlanCollaborator";
  fullName: string;
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
