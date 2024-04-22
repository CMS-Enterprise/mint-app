/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ParticipantRequireFinancialGuaranteeType, GainshareArrangementEligibility, ParticipantsIDType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetCoordination
// ====================================================

export interface GetCoordination_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  participantRequireFinancialGuarantee: boolean | null;
  participantRequireFinancialGuaranteeType: ParticipantRequireFinancialGuaranteeType[];
  participantRequireFinancialGuaranteeOther: string | null;
  participantRequireFinancialGuaranteeNote: string | null;
  coordinateWork: boolean | null;
  coordinateWorkNote: string | null;
  gainsharePayments: boolean | null;
  gainsharePaymentsEligibility: GainshareArrangementEligibility[];
  gainsharePaymentsEligibilityOther: string | null;
  gainsharePaymentsTrack: boolean | null;
  gainsharePaymentsNote: string | null;
  participantsIds: ParticipantsIDType[];
  participantsIdsOther: string | null;
  participantsIDSNote: string | null;
}

export interface GetCoordination_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetCoordination_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetCoordination_modelPlan_participantsAndProviders;
  operationalNeeds: GetCoordination_modelPlan_operationalNeeds[];
}

export interface GetCoordination {
  modelPlan: GetCoordination_modelPlan;
}

export interface GetCoordinationVariables {
  id: UUID;
}
