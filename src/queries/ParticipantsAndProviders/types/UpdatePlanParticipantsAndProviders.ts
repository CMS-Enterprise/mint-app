/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanParticipantsAndProvidersChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanParticipantsAndProviders
// ====================================================

export interface UpdatePlanParticipantsAndProviders_updatePlanParticipantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
}

export interface UpdatePlanParticipantsAndProviders {
  updatePlanParticipantsAndProviders: UpdatePlanParticipantsAndProviders_updatePlanParticipantsAndProviders;
}

export interface UpdatePlanParticipantsAndProvidersVariables {
  id: UUID;
  changes: PlanParticipantsAndProvidersChanges;
}
