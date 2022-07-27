/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetModelPlanInfo
// ====================================================

export interface GetModelPlanInfo_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
}

export interface GetModelPlanInfo {
  modelPlan: GetModelPlanInfo_modelPlan;
}

export interface GetModelPlanInfoVariables {
  id: UUID;
}
