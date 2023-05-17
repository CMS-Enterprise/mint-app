/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanParticipantsAndProvidersChanges, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateClearanceParticipantsAndProviders
// ====================================================

export interface UpdateClearanceParticipantsAndProviders_updatePlanParticipantsAndProviders_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface UpdateClearanceParticipantsAndProviders_updatePlanParticipantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  readyForClearanceByUserAccount: UpdateClearanceParticipantsAndProviders_updatePlanParticipantsAndProviders_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface UpdateClearanceParticipantsAndProviders {
  updatePlanParticipantsAndProviders: UpdateClearanceParticipantsAndProviders_updatePlanParticipantsAndProviders;
}

export interface UpdateClearanceParticipantsAndProvidersVariables {
  id: UUID;
  changes: PlanParticipantsAndProvidersChanges;
}
