/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, DataForMonitoringType, ModelLearningSystemType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetLearning
// ====================================================

export interface GetLearning_modelPlan_opsEvalAndLearning_readyForReviewByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetLearning_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  iddocSupport: boolean | null;
  modelLearningSystems: ModelLearningSystemType[];
  modelLearningSystemsOther: string | null;
  modelLearningSystemsNote: string | null;
  anticipatedChallenges: string | null;
  readyForReviewByUserAccount: GetLearning_modelPlan_opsEvalAndLearning_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetLearning_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetLearning_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetLearning_modelPlan_opsEvalAndLearning;
  operationalNeeds: GetLearning_modelPlan_operationalNeeds[];
}

export interface GetLearning {
  modelPlan: GetLearning_modelPlan;
}

export interface GetLearningVariables {
  id: UUID;
}
