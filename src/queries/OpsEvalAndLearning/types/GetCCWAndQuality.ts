/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetCCWAndQuality
// ====================================================

export interface GetCCWAndQuality_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  iddocSupport: boolean | null;
  sendFilesBetweenCcw: boolean | null;
  sendFilesBetweenCcwNote: string | null;
  appToSendFilesToKnown: boolean | null;
  appToSendFilesToWhich: string | null;
  appToSendFilesToNote: string | null;
  useCcwForFileDistribiutionToParticipants: boolean | null;
  useCcwForFileDistribiutionToParticipantsNote: string | null;
  developNewQualityMeasures: boolean | null;
  developNewQualityMeasuresNote: string | null;
  qualityPerformanceImpactsPayment: boolean | null;
  qualityPerformanceImpactsPaymentNote: string | null;
}

export interface GetCCWAndQuality_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetCCWAndQuality_modelPlan_opsEvalAndLearning;
}

export interface GetCCWAndQuality {
  modelPlan: GetCCWAndQuality_modelPlan;
}

export interface GetCCWAndQualityVariables {
  id: UUID;
}
