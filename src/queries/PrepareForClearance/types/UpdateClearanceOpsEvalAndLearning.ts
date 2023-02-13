/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanOpsEvalAndLearningChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearanceOpsEvalAndLearning
// ====================================================

export interface UpdateClearanceOpsEvalAndLearning_updatePlanOpsEvalAndLearning_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface UpdateClearanceOpsEvalAndLearning_updatePlanOpsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  readyForClearanceByUserAccount: UpdateClearanceOpsEvalAndLearning_updatePlanOpsEvalAndLearning_readyForClearanceByUserAccount | null;
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
