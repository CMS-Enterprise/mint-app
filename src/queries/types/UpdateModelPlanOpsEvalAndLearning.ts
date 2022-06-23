/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanOpsEvalAndLearningChanges } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanOpsEvalAndLearning
// ====================================================

export interface UpdateModelPlanOpsEvalAndLearning_updatePlanOpsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
}

export interface UpdateModelPlanOpsEvalAndLearning {
  updatePlanOpsEvalAndLearning: UpdateModelPlanOpsEvalAndLearning_updatePlanOpsEvalAndLearning;
}

export interface UpdateModelPlanOpsEvalAndLearningVariables {
  id: UUID;
  changes: PlanOpsEvalAndLearningChanges;
}
