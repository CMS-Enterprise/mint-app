/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCRTDL
// ====================================================

export interface GetCRTDL_crTdl {
  __typename: "PlanCrTdl";
  id: UUID;
  modelPlanID: UUID;
  title: string;
  idNumber: string;
  dateInitiated: Time;
  note: string | null;
}

export interface GetCRTDL {
  crTdl: GetCRTDL_crTdl;
}

export interface GetCRTDLVariables {
  id: UUID;
}
