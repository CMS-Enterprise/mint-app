/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: createModelPlan
// ====================================================

export interface createModelPlan_createModelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
}

export interface createModelPlan {
  createModelPlan: createModelPlan_createModelPlan | null;
}

export interface createModelPlanVariables {
  input: ModelPlanInput;
}
