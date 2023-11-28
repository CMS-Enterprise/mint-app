/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanOpsEvalAndLearningChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanOpsEvalAndLearning
// ====================================================

export interface UpdatePlanOpsEvalAndLearning_updatePlanOpsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
}

export interface UpdatePlanOpsEvalAndLearning {
  updatePlanOpsEvalAndLearning: UpdatePlanOpsEvalAndLearning_updatePlanOpsEvalAndLearning;
}

export interface UpdatePlanOpsEvalAndLearningVariables {
  id: UUID;
  changes: PlanOpsEvalAndLearningChanges;
}
