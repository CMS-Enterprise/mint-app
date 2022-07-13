/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanPaymentsChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePayments
// ====================================================

export interface UpdatePayments_updatePlanPayments {
  __typename: "PlanPayments";
  id: UUID;
}

export interface UpdatePayments {
  updatePlanPayments: UpdatePayments_updatePlanPayments;
}

export interface UpdatePaymentsVariables {
  id: UUID;
  changes: PlanPaymentsChanges;
}
