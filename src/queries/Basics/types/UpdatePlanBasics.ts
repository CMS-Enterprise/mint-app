/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBasicsChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanBasics
// ====================================================

export interface UpdatePlanBasics_updatePlanBasics {
  __typename: "PlanBasics";
  id: UUID;
}

export interface UpdatePlanBasics {
  updatePlanBasics: UpdatePlanBasics_updatePlanBasics;
}

export interface UpdatePlanBasicsVariables {
  id: UUID;
  changes: PlanBasicsChanges;
}
