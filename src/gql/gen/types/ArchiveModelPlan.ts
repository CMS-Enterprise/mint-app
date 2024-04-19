/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ArchiveModelPlan
// ====================================================

export interface ArchiveModelPlan_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID;
}

export interface ArchiveModelPlan {
  updateModelPlan: ArchiveModelPlan_updateModelPlan;
}

export interface ArchiveModelPlanVariables {
  id: UUID;
  archived: boolean;
}
