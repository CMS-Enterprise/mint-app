/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanPaymentsChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearancePayments
// ====================================================

export interface UpdateClearancePayments_updatePlanPayments_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface UpdateClearancePayments_updatePlanPayments {
  __typename: "PlanPayments";
  readyForClearanceByUserAccount: UpdateClearancePayments_updatePlanPayments_readyForClearanceByUserAccount | null;
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
