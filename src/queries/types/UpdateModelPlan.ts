/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlan
// ====================================================

export interface UpdateModelPlan_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  createdBy: string | null;
}

export interface UpdateModelPlan {
  updateModelPlan: UpdateModelPlan_updateModelPlan | null;
}

export interface UpdateModelPlanVariables {
  input: ModelPlanInput;
}
