/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBasicsInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreatePlanBasics
// ====================================================

export interface CreatePlanBasics_createPlanBasics {
  __typename: "PlanBasics";
  id: UUID | null;
}

export interface CreatePlanBasics {
  createPlanBasics: CreatePlanBasics_createPlanBasics | null;
}

export interface CreatePlanBasicsVariables {
  input: PlanBasicsInput;
}
