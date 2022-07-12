/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EvaluationApproachType, DataForMonitoringType, OelProcessAppealsType, OelEvaluationContractorType, OelCollectDataType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageFive
// ====================================================

export interface GetITToolPageFive_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  appealPerformance: boolean | null;
  appealFeedback: boolean | null;
  appealPayments: boolean | null;
  appealOther: boolean | null;
  evaluationApproaches: EvaluationApproachType[];
  dataNeededForMonitoring: DataForMonitoringType[];
}

export interface GetITToolPageFive_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  oelProcessAppeals: OelProcessAppealsType[];
  oelProcessAppealsOther: string | null;
  oelProcessAppealsNote: string | null;
  oelEvaluationContractor: OelEvaluationContractorType[];
  oelEvaluationContractorOther: string | null;
  oelEvaluationContractorNote: string | null;
  oelCollectData: OelCollectDataType[];
  oelCollectDataOther: string | null;
  oelCollectDataNote: string | null;
}

export interface GetITToolPageFive_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetITToolPageFive_modelPlan_opsEvalAndLearning;
  itTools: GetITToolPageFive_modelPlan_itTools;
}

export interface GetITToolPageFive {
  modelPlan: GetITToolPageFive_modelPlan;
}

export interface GetITToolPageFiveVariables {
  id: UUID;
}
