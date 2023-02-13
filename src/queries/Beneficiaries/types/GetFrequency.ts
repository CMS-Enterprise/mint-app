/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FrequencyType, OverlapType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetFrequency
// ====================================================

export interface GetFrequency_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  beneficiarySelectionFrequency: FrequencyType | null;
  beneficiarySelectionFrequencyNote: string | null;
  beneficiarySelectionFrequencyOther: string | null;
  beneficiaryOverlap: OverlapType | null;
  beneficiaryOverlapNote: string | null;
  precedenceRules: string | null;
  readyForReviewBy: UUID | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetFrequency_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  modifiedDts: Time | null;
}

export interface GetFrequency_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  beneficiaries: GetFrequency_modelPlan_beneficiaries;
  operationalNeeds: GetFrequency_modelPlan_operationalNeeds[];
}

export interface GetFrequency {
  modelPlan: GetFrequency_modelPlan;
}

export interface GetFrequencyVariables {
  id: UUID;
}
