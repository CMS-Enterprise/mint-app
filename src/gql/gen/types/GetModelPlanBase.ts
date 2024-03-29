/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanBase
// ====================================================

export interface GetModelPlanBase_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  modifiedDts: Time | null;
  status: ModelStatus;
}

export interface GetModelPlanBase {
  modelPlan: GetModelPlanBase_modelPlan;
}

export interface GetModelPlanBaseVariables {
  id: UUID;
}
