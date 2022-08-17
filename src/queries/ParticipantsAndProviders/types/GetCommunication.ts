/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ParticipantCommunicationType, ParticipantRiskType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetCommunication
// ====================================================

export interface GetCommunication_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  communicationMethod: ParticipantCommunicationType[];
  communicationMethodOther: string | null;
  communicationNote: string | null;
  participantAssumeRisk: boolean | null;
  riskType: ParticipantRiskType | null;
  riskOther: string | null;
  riskNote: string | null;
  willRiskChange: boolean | null;
  willRiskChangeNote: string | null;
}

export interface GetCommunication_modelPlan_itTools {
  __typename: "PlanITTools";
  status: TaskStatus;
}

export interface GetCommunication_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetCommunication_modelPlan_participantsAndProviders;
  itTools: GetCommunication_modelPlan_itTools;
}

export interface GetCommunication {
  modelPlan: GetCommunication_modelPlan;
}

export interface GetCommunicationVariables {
  id: UUID;
}
