/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanOpsEvalAndLearningChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearanceOpsEvalAndLearning
// ====================================================

export interface UpdateClearanceOpsEvalAndLearning_updatePlanOpsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdateClearanceOpsEvalAndLearning {
  updatePlanOpsEvalAndLearning: UpdateClearanceOpsEvalAndLearning_updatePlanOpsEvalAndLearning;
}

export interface UpdateClearanceOpsEvalAndLearningVariables {
  id: UUID;
  changes: PlanOpsEvalAndLearningChanges;
}
