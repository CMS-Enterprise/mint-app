/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ParticipantsType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetParticipantsAndProviders
// ====================================================

export interface GetParticipantsAndProviders_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  participants: ParticipantsType[];
  medicareProviderType: string | null;
  statesEngagement: string | null;
  participantsOther: string | null;
  participantsNote: string | null;
  participantsCurrentlyInModels: boolean | null;
  participantsCurrentlyInModelsNote: string | null;
  modelApplicationLevel: string | null;
}

export interface GetParticipantsAndProviders_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetParticipantsAndProviders_modelPlan_participantsAndProviders;
}

export interface GetParticipantsAndProviders {
  modelPlan: GetParticipantsAndProviders_modelPlan;
}

export interface GetParticipantsAndProvidersVariables {
  id: UUID;
}
