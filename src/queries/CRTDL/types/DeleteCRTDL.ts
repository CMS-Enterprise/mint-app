/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteCRTDL
// ====================================================

export interface DeleteCRTDL_deletePlanCrTdl {
  __typename: "PlanCrTdl";
  idNumber: string;
}

export interface DeleteCRTDL {
  deletePlanCrTdl: DeleteCRTDL_deletePlanCrTdl;
}

export interface DeleteCRTDLVariables {
  id: UUID;
}
