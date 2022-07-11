/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ParticipantCommunicationType, PpCommunicateWithParticipantType, PpManageProviderOverlapType, BManageBeneficiaryOverlapType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageThree
// ====================================================

export interface GetITToolPageThree_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  communicationMethod: ParticipantCommunicationType[];
}

export interface GetITToolPageThree_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  ppCommunicateWithParticipant: PpCommunicateWithParticipantType[];
  ppCommunicateWithParticipantOther: string | null;
  ppCommunicateWithParticipantNote: string | null;
  ppManageProviderOverlap: PpManageProviderOverlapType[];
  ppManageProviderOverlapOther: string | null;
  ppManageProviderOverlapNote: string | null;
  bManageBeneficiaryOverlap: BManageBeneficiaryOverlapType[];
  bManageBeneficiaryOverlapOther: string | null;
  bManageBeneficiaryOverlapNote: string | null;
}

export interface GetITToolPageThree_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetITToolPageThree_modelPlan_participantsAndProviders;
  itTools: GetITToolPageThree_modelPlan_itTools;
}

export interface GetITToolPageThree {
  modelPlan: GetITToolPageThree_modelPlan;
}

export interface GetITToolPageThreeVariables {
  id: UUID;
}
