/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanCrTdlChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateCRTDL
// ====================================================

export interface UpdateCRTDL_updatePlanCrTdl {
  __typename: "PlanCrTdl";
  id: UUID;
}

export interface UpdateCRTDL {
  updatePlanCrTdl: UpdateCRTDL_updatePlanCrTdl;
}

export interface UpdateCRTDLVariables {
  id: UUID;
  changes: PlanCrTdlChanges;
}
