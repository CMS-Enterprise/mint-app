/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanGeneralCharacteristicsChanges } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanCharacteristics
// ====================================================

export interface UpdateModelPlanCharacteristics_updatePlanGeneralCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
}

export interface UpdateModelPlanCharacteristics {
  updatePlanGeneralCharacteristics: UpdateModelPlanCharacteristics_updatePlanGeneralCharacteristics;
}

export interface UpdateModelPlanCharacteristicsVariables {
  id: UUID;
  changes: PlanGeneralCharacteristicsChanges;
}
