/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanCRCreateInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateCR
// ====================================================

export interface CreateCR_createPlanCR {
  __typename: "PlanCR";
  id: UUID;
  modelPlanID: UUID;
  idNumber: string;
  dateInitiated: Time;
  dateImplemented: Time | null;
  title: string;
  note: string | null;
}

export interface CreateCR {
  createPlanCR: CreateCR_createPlanCR;
}

export interface CreateCRVariables {
  input: PlanCRCreateInput;
}
