/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanGeneralCharacteristicsChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearanceCharacteristics
// ====================================================

export interface UpdateClearanceCharacteristics_updatePlanGeneralCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdateClearanceCharacteristics {
  updatePlanGeneralCharacteristics: UpdateClearanceCharacteristics_updatePlanGeneralCharacteristics;
}

export interface UpdateClearanceCharacteristicsVariables {
  id: UUID;
  changes: PlanGeneralCharacteristicsChanges;
}
