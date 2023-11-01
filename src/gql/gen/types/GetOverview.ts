/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOverview
// ====================================================

export interface GetOverview_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelType: ModelType | null;
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
}

export interface GetOverview_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  basics: GetOverview_modelPlan_basics;
}

export interface GetOverview {
  modelPlan: GetOverview_modelPlan;
}

export interface GetOverviewVariables {
  id: UUID;
}
