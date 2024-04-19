/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelStatus, KeyCharacteristic, TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelSummary
// ====================================================

export interface GetModelSummary_modelPlan_basics {
  __typename: "PlanBasics";
  goal: string | null;
  performancePeriodStarts: Time | null;
}

export interface GetModelSummary_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  keyCharacteristics: KeyCharacteristic[];
}

export interface GetModelSummary_modelPlan_collaborators_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface GetModelSummary_modelPlan_collaborators {
  __typename: "PlanCollaborator";
  userAccount: GetModelSummary_modelPlan_collaborators_userAccount;
  teamRoles: TeamRole[];
}

export interface GetModelSummary_modelPlan_crs {
  __typename: "PlanCR";
  id: UUID;
  idNumber: string;
}

export interface GetModelSummary_modelPlan_tdls {
  __typename: "PlanTDL";
  id: UUID;
  idNumber: string;
}

export interface GetModelSummary_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  abbreviation: string | null;
  createdDts: Time;
  modifiedDts: Time | null;
  status: ModelStatus;
  isFavorite: boolean;
  basics: GetModelSummary_modelPlan_basics;
  generalCharacteristics: GetModelSummary_modelPlan_generalCharacteristics;
  isCollaborator: boolean;
  collaborators: GetModelSummary_modelPlan_collaborators[];
  crs: GetModelSummary_modelPlan_crs[];
  tdls: GetModelSummary_modelPlan_tdls[];
}

export interface GetModelSummary {
  modelPlan: GetModelSummary_modelPlan;
}

export interface GetModelSummaryVariables {
  id: UUID;
}
