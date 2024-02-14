/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, DataForMonitoringType, BenchmarkForPerformanceType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetPerformance
// ====================================================

export interface GetPerformance_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  iddocSupport: boolean | null;
  benchmarkForPerformance: BenchmarkForPerformanceType | null;
  benchmarkForPerformanceNote: string | null;
  computePerformanceScores: boolean | null;
  computePerformanceScoresNote: string | null;
  riskAdjustPerformance: boolean | null;
  riskAdjustFeedback: boolean | null;
  riskAdjustPayments: boolean | null;
  riskAdjustOther: boolean | null;
  riskAdjustNote: string | null;
  appealPerformance: boolean | null;
  appealFeedback: boolean | null;
  appealPayments: boolean | null;
  appealOther: boolean | null;
  appealNote: string | null;
}

export interface GetPerformance_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetPerformance_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetPerformance_modelPlan_opsEvalAndLearning;
  operationalNeeds: GetPerformance_modelPlan_operationalNeeds[];
}

export interface GetPerformance {
  modelPlan: GetPerformance_modelPlan;
}

export interface GetPerformanceVariables {
  id: UUID;
}
