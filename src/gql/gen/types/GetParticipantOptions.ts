/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfidenceType, RecruitmentType, ParticipantSelectionType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetParticipantOptions
// ====================================================

export interface GetParticipantOptions_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  expectedNumberOfParticipants: number | null;
  estimateConfidence: ConfidenceType | null;
  confidenceNote: string | null;
  recruitmentMethod: RecruitmentType | null;
  recruitmentOther: string | null;
  recruitmentNote: string | null;
  selectionMethod: ParticipantSelectionType[];
  selectionOther: string | null;
  selectionNote: string | null;
}

export interface GetParticipantOptions_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetParticipantOptions_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetParticipantOptions_modelPlan_participantsAndProviders;
  operationalNeeds: GetParticipantOptions_modelPlan_operationalNeeds[];
}

export interface GetParticipantOptions {
  modelPlan: GetParticipantOptions_modelPlan;
}

export interface GetParticipantOptionsVariables {
  id: UUID;
}
