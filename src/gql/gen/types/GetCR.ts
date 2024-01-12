/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCR
// ====================================================

export interface GetCR_planCR {
  __typename: "PlanCR";
  id: UUID;
  modelPlanID: UUID;
  title: string;
  idNumber: string;
  dateInitiated: Time;
  dateImplemented: Time | null;
  note: string | null;
}

export interface GetCR {
  planCR: GetCR_planCR;
}

export interface GetCRVariables {
  id: UUID;
}
