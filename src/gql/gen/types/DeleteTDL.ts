/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTDL
// ====================================================

export interface DeleteTDL_deletePlanTDL {
  __typename: "PlanTDL";
  id: UUID;
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  title: string;
  note: string | null;
}

export interface DeleteTDL {
  deletePlanTDL: DeleteTDL_deletePlanTDL;
}

export interface DeleteTDLVariables {
  id: UUID;
}
