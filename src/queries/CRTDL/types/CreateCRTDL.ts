/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanCrTdlCreateInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateCRTDL
// ====================================================

export interface CreateCRTDL_createPlanCrTdl {
  __typename: "PlanCrTdl";
  modelPlanID: UUID;
  title: string;
  idNumber: string;
  dateInitiated: Time;
  note: string | null;
}

export interface CreateCRTDL {
  createPlanCrTdl: CreateCRTDL_createPlanCrTdl;
}

export interface CreateCRTDLVariables {
  input: PlanCrTdlCreateInput;
}
