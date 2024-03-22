/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlan
// ====================================================

export interface UpdateModelPlan_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID;
}

export interface UpdateModelPlan {
  updateModelPlan: UpdateModelPlan_updateModelPlan;
}

export interface UpdateModelPlanVariables {
  id: UUID;
  changes: ModelPlanChanges;
}
