/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanGeneralCharacteristicsChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearanceCharacteristics
// ====================================================

export interface UpdateClearanceCharacteristics_updatePlanGeneralCharacteristics_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface UpdateClearanceCharacteristics_updatePlanGeneralCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  readyForClearanceByUserAccount: UpdateClearanceCharacteristics_updatePlanGeneralCharacteristics_readyForClearanceByUserAccount | null;
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
