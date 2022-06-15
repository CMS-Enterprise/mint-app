/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanParticipantsAndProvidersChanges } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanProvidersAndParticipants
// ====================================================

export interface UpdateModelPlanProvidersAndParticipants_updatePlanParticipantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
}

export interface UpdateModelPlanProvidersAndParticipants {
  updatePlanParticipantsAndProviders: UpdateModelPlanProvidersAndParticipants_updatePlanParticipantsAndProviders;
}

export interface UpdateModelPlanProvidersAndParticipantsVariables {
  id: UUID;
  changes: PlanParticipantsAndProvidersChanges;
}
