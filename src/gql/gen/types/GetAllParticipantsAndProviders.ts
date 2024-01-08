/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ParticipantsType, ConfidenceType, RecruitmentType, ParticipantSelectionType, ParticipantCommunicationType, ParticipantRiskType, GainshareArrangementEligibility, ParticipantsIDType, FrequencyType, ProviderAddType, ProviderLeaveType, OverlapType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllParticipantsAndProviders
// ====================================================

export interface GetAllParticipantsAndProviders_modelPlan_participantsAndProviders {
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
  expectedNumberOfParticipants: number | null;
  estimateConfidence: ConfidenceType | null;
  confidenceNote: string | null;
  recruitmentMethod: RecruitmentType | null;
  recruitmentOther: string | null;
  recruitmentNote: string | null;
  selectionMethod: ParticipantSelectionType[];
  selectionOther: string | null;
  selectionNote: string | null;
  communicationMethod: ParticipantCommunicationType[];
  communicationMethodOther: string | null;
  communicationNote: string | null;
  riskType: ParticipantRiskType[];
  riskOther: string | null;
  riskNote: string | null;
  willRiskChange: boolean | null;
  willRiskChangeNote: string | null;
  coordinateWork: boolean | null;
  coordinateWorkNote: string | null;
  gainsharePayments: boolean | null;
  gainsharePaymentsTrack: boolean | null;
  gainsharePaymentsNote: string | null;
  gainsharePaymentsEligibility: GainshareArrangementEligibility[];
  gainsharePaymentsEligibilityOther: string | null;
  participantsIds: ParticipantsIDType[];
  participantsIdsOther: string | null;
  participantsIDSNote: string | null;
  providerAdditionFrequency: FrequencyType[];
  providerAdditionFrequencyOther: string | null;
  providerAdditionFrequencyNote: string | null;
  providerAddMethod: ProviderAddType[];
  providerAddMethodOther: string | null;
  providerAddMethodNote: string | null;
  providerLeaveMethod: ProviderLeaveType[];
  providerLeaveMethodOther: string | null;
  providerLeaveMethodNote: string | null;
  providerOverlap: OverlapType | null;
  providerOverlapHierarchy: string | null;
  providerOverlapNote: string | null;
  status: TaskStatus;
}

export interface GetAllParticipantsAndProviders_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  participantsAndProviders: GetAllParticipantsAndProviders_modelPlan_participantsAndProviders;
}

export interface GetAllParticipantsAndProviders {
  modelPlan: GetAllParticipantsAndProviders_modelPlan;
}

export interface GetAllParticipantsAndProvidersVariables {
  id: UUID;
}
