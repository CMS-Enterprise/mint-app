/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { KeyCharacteristic } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelSummary
// ====================================================

export interface GetModelSummary_modelPlan_basics {
  __typename: "PlanBasics";
  goal: string | null;
  applicationsStart: Time | null;
}

export interface GetModelSummary_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  keyCharacteristics: KeyCharacteristic[];
}

export interface GetModelSummary_modelPlan_collaborators {
  __typename: "PlanCollaborator";
  fullName: string;
}

export interface GetModelSummary_modelPlan {
  __typename: "ModelPlan";
  modelName: string;
  basics: GetModelSummary_modelPlan_basics;
  generalCharacteristics: GetModelSummary_modelPlan_generalCharacteristics;
  collaborators: GetModelSummary_modelPlan_collaborators[];
}

export interface GetModelSummary {
  modelPlan: GetModelSummary_modelPlan;
}

export interface GetModelSummaryVariables {
  id: UUID;
}
