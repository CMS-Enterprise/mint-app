/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetModelPlan
// ====================================================

export interface GetModelPlan_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID | null;
}

export interface GetModelPlan_modelPlan_milestones {
  __typename: "PlanMilestones";
  id: UUID | null;
}

export interface GetModelPlan_modelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  modelName: string | null;
  basics: GetModelPlan_modelPlan_basics | null;
  milestones: GetModelPlan_modelPlan_milestones | null;
}

export interface GetModelPlan {
  modelPlan: GetModelPlan_modelPlan | null;
}

export interface GetModelPlanVariables {
  id: UUID;
}
