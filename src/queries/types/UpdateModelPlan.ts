/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanChanges, PlanBasicsChanges } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlan
// ====================================================

export interface UpdateModelPlan_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID;
}

export interface UpdateModelPlan_updatePlanBasics {
  __typename: "PlanBasics";
  id: UUID;
}

export interface UpdateModelPlan {
  updateModelPlan: UpdateModelPlan_updateModelPlan;
  updatePlanBasics: UpdateModelPlan_updatePlanBasics;
}

export interface UpdateModelPlanVariables {
  id: UUID;
  changes: ModelPlanChanges;
  basicsId: UUID;
  basicsChanges: PlanBasicsChanges;
}
