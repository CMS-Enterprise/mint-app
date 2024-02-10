/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBasicsChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateBasics
// ====================================================

export interface UpdateBasics_updatePlanBasics {
  __typename: "PlanBasics";
  id: UUID;
}

export interface UpdateBasics {
  updatePlanBasics: UpdateBasics_updatePlanBasics;
}

export interface UpdateBasicsVariables {
  id: UUID;
  changes: PlanBasicsChanges;
}
