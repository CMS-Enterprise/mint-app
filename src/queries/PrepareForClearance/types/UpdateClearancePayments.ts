/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanPaymentsChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearancePayments
// ====================================================

export interface UpdateClearancePayments_updatePlanPayments {
  __typename: "PlanPayments";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdateClearancePayments {
  updatePlanPayments: UpdateClearancePayments_updatePlanPayments;
}

export interface UpdateClearancePaymentsVariables {
  id: UUID;
  changes: PlanPaymentsChanges;
}
