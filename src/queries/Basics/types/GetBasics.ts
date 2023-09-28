/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetBasics
// ====================================================

export interface GetBasics_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelType: ModelType[];
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
}

export interface GetBasics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  basics: GetBasics_modelPlan_basics;
}

export interface GetBasics {
  modelPlan: GetBasics_modelPlan;
}

export interface GetBasicsVariables {
  id: UUID;
}
