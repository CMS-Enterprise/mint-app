/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBasicsChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearanceBasics
// ====================================================

export interface UpdateClearanceBasics_updatePlanBasics_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface UpdateClearanceBasics_updatePlanBasics {
  __typename: "PlanBasics";
  readyForClearanceByUserAccount: UpdateClearanceBasics_updatePlanBasics_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdateClearanceBasics {
  updatePlanBasics: UpdateClearanceBasics_updatePlanBasics;
}

export interface UpdateClearanceBasicsVariables {
  id: UUID;
  changes: PlanBasicsChanges;
}
