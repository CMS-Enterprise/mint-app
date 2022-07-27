/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMilestones
// ====================================================

export interface GetMilestones_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
}

export interface GetMilestones {
  modelPlan: GetMilestones_modelPlan;
}

export interface GetMilestonesVariables {
  id: UUID;
}
