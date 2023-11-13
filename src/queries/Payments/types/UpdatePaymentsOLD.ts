/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanPaymentsChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePaymentsOLD
// ====================================================

export interface UpdatePaymentsOLD_updatePlanPayments {
  __typename: "PlanPayments";
  id: UUID;
}

export interface UpdatePaymentsOLD {
  updatePlanPayments: UpdatePaymentsOLD_updatePlanPayments;
}

export interface UpdatePaymentsOLDVariables {
  id: UUID;
  changes: PlanPaymentsChanges;
}
