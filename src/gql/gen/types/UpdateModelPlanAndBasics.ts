/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanChanges, PlanBasicsChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanAndBasics
// ====================================================

export interface UpdateModelPlanAndBasics_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID;
}

export interface UpdateModelPlanAndBasics_updatePlanBasics {
  __typename: "PlanBasics";
  id: UUID;
}

export interface UpdateModelPlanAndBasics {
  updateModelPlan: UpdateModelPlanAndBasics_updateModelPlan;
  updatePlanBasics: UpdateModelPlanAndBasics_updatePlanBasics;
}

export interface UpdateModelPlanAndBasicsVariables {
  id: UUID;
  changes: ModelPlanChanges;
  basicsId: UUID;
  basicsChanges: PlanBasicsChanges;
}
