/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTDL
// ====================================================

export interface GetTDL_planTDL {
  __typename: "PlanTDL";
  id: UUID;
  modelPlanID: UUID;
  title: string;
  idNumber: string;
  dateInitiated: Time;
  note: string | null;
}

export interface GetTDL {
  planTDL: GetTDL_planTDL;
}

export interface GetTDLVariables {
  id: UUID;
}
