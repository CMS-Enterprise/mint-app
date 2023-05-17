/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, DataForMonitoringType, DataFullTimeOrIncrementalType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetIDDOCMonitoring
// ====================================================

export interface GetIDDOCMonitoring_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  iddocSupport: boolean | null;
  dataFullTimeOrIncremental: DataFullTimeOrIncrementalType | null;
  eftSetUp: boolean | null;
  unsolicitedAdjustmentsIncluded: boolean | null;
  dataFlowDiagramsNeeded: boolean | null;
  produceBenefitEnhancementFiles: boolean | null;
  fileNamingConventions: string | null;
  dataMonitoringNote: string | null;
}

export interface GetIDDOCMonitoring_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetIDDOCMonitoring_modelPlan_opsEvalAndLearning;
}

export interface GetIDDOCMonitoring {
  modelPlan: GetIDDOCMonitoring_modelPlan;
}

export interface GetIDDOCMonitoringVariables {
  id: UUID;
}
