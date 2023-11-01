/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanChanges, PlanBasicsChanges } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanAndBasicsOLD
// ====================================================

export interface UpdateModelPlanAndBasicsOLD_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID;
}

export interface UpdateModelPlanAndBasicsOLD_updatePlanBasics {
  __typename: "PlanBasics";
  id: UUID;
}

export interface UpdateModelPlanAndBasicsOLD {
  updateModelPlan: UpdateModelPlanAndBasicsOLD_updateModelPlan;
  updatePlanBasics: UpdateModelPlanAndBasicsOLD_updatePlanBasics;
}

export interface UpdateModelPlanAndBasicsOLDVariables {
  id: UUID;
  changes: ModelPlanChanges;
  basicsId: UUID;
  basicsChanges: PlanBasicsChanges;
}
