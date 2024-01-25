/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanCRChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCR
// ====================================================

export interface UpdateCR_updatePlanCR {
  __typename: "PlanCR";
  id: UUID;
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  dateImplemented: Time | null;
  title: string;
  note: string | null;
}

export interface UpdateCR {
  updatePlanCR: UpdateCR_updatePlanCR;
}

export interface UpdateCRVariables {
  id: UUID;
  changes: PlanCRChanges;
}
