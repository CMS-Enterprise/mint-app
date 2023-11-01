/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetBasicsOLD
// ====================================================

export interface GetBasicsOLD_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelType: ModelType | null;
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
}

export interface GetBasicsOLD_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  basics: GetBasicsOLD_modelPlan_basics;
}

export interface GetBasicsOLD {
  modelPlan: GetBasicsOLD_modelPlan;
}

export interface GetBasicsOLDVariables {
  id: UUID;
}
