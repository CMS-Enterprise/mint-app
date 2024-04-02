/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetIsCollaborator
// ====================================================

export interface GetIsCollaborator_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  isCollaborator: boolean;
}

export interface GetIsCollaborator {
  modelPlan: GetIsCollaborator_modelPlan;
}

export interface GetIsCollaboratorVariables {
  id: UUID;
}
