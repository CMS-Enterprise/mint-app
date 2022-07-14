/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DataForMonitoringType, OelObtainDataType, OelClaimsBasedMeasuresType, OelQualityScoresType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageSix
// ====================================================

export interface GetITToolPageSix_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  dataNeededForMonitoring: DataForMonitoringType[];
}

export interface GetITToolPageSix_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  oelObtainData: OelObtainDataType[];
  oelObtainDataOther: string | null;
  oelObtainDataNote: string | null;
  oelClaimsBasedMeasures: OelClaimsBasedMeasuresType[];
  oelClaimsBasedMeasuresOther: string | null;
  oelClaimsBasedMeasuresNote: string | null;
  oelQualityScores: OelQualityScoresType[];
  oelQualityScoresOther: string | null;
  oelQualityScoresNote: string | null;
}

export interface GetITToolPageSix_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetITToolPageSix_modelPlan_opsEvalAndLearning;
  itTools: GetITToolPageSix_modelPlan_itTools;
}

export interface GetITToolPageSix {
  modelPlan: GetITToolPageSix_modelPlan;
}

export interface GetITToolPageSixVariables {
  id: UUID;
}
