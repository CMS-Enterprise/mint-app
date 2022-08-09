/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BenchmarkForPerformanceType, OelHelpdeskSupportType, OelManageAcoType, OelPerformanceBenchmarkType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageFour
// ====================================================

export interface GetITToolPageFour_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  helpdeskUse: boolean | null;
  iddocSupport: boolean | null;
  benchmarkForPerformance: BenchmarkForPerformanceType | null;
}

export interface GetITToolPageFour_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  oelHelpdeskSupport: OelHelpdeskSupportType[];
  oelHelpdeskSupportOther: string | null;
  oelHelpdeskSupportNote: string | null;
  oelManageAco: OelManageAcoType[];
  oelManageAcoOther: string | null;
  oelManageAcoNote: string | null;
  oelPerformanceBenchmark: OelPerformanceBenchmarkType[];
  oelPerformanceBenchmarkOther: string | null;
  oelPerformanceBenchmarkNote: string | null;
}

export interface GetITToolPageFour_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetITToolPageFour_modelPlan_opsEvalAndLearning;
  itTools: GetITToolPageFour_modelPlan_itTools;
}

export interface GetITToolPageFour {
  modelPlan: GetITToolPageFour_modelPlan;
}

export interface GetITToolPageFourVariables {
  id: UUID;
}
