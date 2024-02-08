/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FrequencyType, ParticipantCommunicationType, ParticipantRiskType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetCommunication
// ====================================================

export interface GetCommunication_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  participantAddedFrequency: FrequencyType[];
  participantAddedFrequencyContinually: string | null;
  participantAddedFrequencyOther: string | null;
  participantAddedFrequencyNote: string | null;
  participantRemovedFrequency: FrequencyType[];
  participantRemovedFrequencyContinually: string | null;
  participantRemovedFrequencyOther: string | null;
  participantRemovedFrequencyNote: string | null;
  communicationMethod: ParticipantCommunicationType[];
  communicationMethodOther: string | null;
  communicationNote: string | null;
  riskType: ParticipantRiskType[];
  riskOther: string | null;
  riskNote: string | null;
  willRiskChange: boolean | null;
  willRiskChangeNote: string | null;
}

export interface GetCommunication_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetCommunication_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetCommunication_modelPlan_participantsAndProviders;
  operationalNeeds: GetCommunication_modelPlan_operationalNeeds[];
}

export interface GetCommunication {
  modelPlan: GetCommunication_modelPlan;
}

export interface GetCommunicationVariables {
  id: UUID;
}
