/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanFilter } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlansBase
// ====================================================

export interface GetModelPlansBase_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
}

export interface GetModelPlansBase {
  modelPlanCollection: GetModelPlansBase_modelPlanCollection[];
}

export interface GetModelPlansBaseVariables {
  filter: ModelPlanFilter;
}
