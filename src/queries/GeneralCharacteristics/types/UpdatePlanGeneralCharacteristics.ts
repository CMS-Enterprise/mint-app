/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanGeneralCharacteristicsChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanGeneralCharacteristics
// ====================================================

export interface UpdatePlanGeneralCharacteristics_updatePlanGeneralCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
}

export interface UpdatePlanGeneralCharacteristics {
  updatePlanGeneralCharacteristics: UpdatePlanGeneralCharacteristics_updatePlanGeneralCharacteristics;
}

export interface UpdatePlanGeneralCharacteristicsVariables {
  id: UUID;
  changes: PlanGeneralCharacteristicsChanges;
}
