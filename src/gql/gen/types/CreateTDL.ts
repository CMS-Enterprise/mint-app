/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanTDLCreateInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateTDL
// ====================================================

export interface CreateTDL_createPlanTDL {
  __typename: "PlanTDL";
  id: UUID;
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  title: string;
  note: string | null;
}

export interface CreateTDL {
  createPlanTDL: CreateTDL_createPlanTDL;
}

export interface CreateTDLVariables {
  input: PlanTDLCreateInput;
}
