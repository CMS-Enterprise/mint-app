/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FrequencyType, ProviderAddType, ProviderLeaveType, OverlapType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetProviderOptions
// ====================================================

export interface GetProviderOptions_modelPlan_participantsAndProviders_readyForReviewByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetProviderOptions_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
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
  readyForReviewByUserAccount: GetProviderOptions_modelPlan_participantsAndProviders_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetProviderOptions_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetProviderOptions_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  participantsAndProviders: GetProviderOptions_modelPlan_participantsAndProviders;
  operationalNeeds: GetProviderOptions_modelPlan_operationalNeeds[];
}

export interface GetProviderOptions {
  modelPlan: GetProviderOptions_modelPlan;
}

export interface GetProviderOptionsVariables {
  id: UUID;
}
