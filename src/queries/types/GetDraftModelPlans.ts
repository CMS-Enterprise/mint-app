/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetDraftModelPlans
// ====================================================

export interface GetDraftModelPlans_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID | null;
  modelName: string | null;
  modelCategory: ModelCategory | null;
}

export interface GetDraftModelPlans {
  modelPlanCollection: (GetDraftModelPlans_modelPlanCollection | null)[] | null;
}
