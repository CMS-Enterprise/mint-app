/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBasicsChanges, ModelType } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanBasics
// ====================================================

export interface UpdatePlanBasics_updatePlanBasics {
  __typename: "PlanBasics";
  id: UUID | null;
  modelPlanID: UUID | null;
  modelType: ModelType | null;
  problem: string | null;
  goal: string | null;
  testInventions: string | null;
  note: string | null;
}

export interface UpdatePlanBasics {
  updatePlanBasics: UpdatePlanBasics_updatePlanBasics | null;
}

export interface UpdatePlanBasicsVariables {
  id: UUID;
  changes: PlanBasicsChanges;
}
