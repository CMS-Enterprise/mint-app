/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteCR
// ====================================================

export interface DeleteCR_deletePlanCR {
  __typename: "PlanCR";
  id: UUID;
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  title: string;
  note: string | null;
}

export interface DeleteCR {
  deletePlanCR: DeleteCR_deletePlanCR;
}

export interface DeleteCRVariables {
  id: UUID;
}
