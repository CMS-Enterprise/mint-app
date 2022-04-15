/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetModelPlan
// ====================================================

export interface GetModelPlan_modelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  modelName: string | null;
}

export interface GetModelPlan {
  modelPlan: GetModelPlan_modelPlan | null;
}

export interface GetModelPlanVariables {
  id: UUID;
}
