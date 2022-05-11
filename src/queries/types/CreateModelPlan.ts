/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateModelPlan
// ====================================================

export interface CreateModelPlan_createModelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  createdBy: string | null;
}

export interface CreateModelPlan {
  createModelPlan: CreateModelPlan_createModelPlan | null;
}

export interface CreateModelPlanVariables {
  modelName: string;
}
