/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBeneficiariesChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearanceBeneficiaries
// ====================================================

export interface UpdateClearanceBeneficiaries_updatePlanBeneficiaries_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface UpdateClearanceBeneficiaries_updatePlanBeneficiaries {
  __typename: "PlanBeneficiaries";
  readyForClearanceByUserAccount: UpdateClearanceBeneficiaries_updatePlanBeneficiaries_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdateClearanceBeneficiaries {
  updatePlanBeneficiaries: UpdateClearanceBeneficiaries_updatePlanBeneficiaries;
}

export interface UpdateClearanceBeneficiariesVariables {
  id: UUID;
  changes: PlanBeneficiariesChanges;
}
