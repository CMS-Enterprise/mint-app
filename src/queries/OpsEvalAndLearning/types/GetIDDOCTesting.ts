/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, DataForMonitoringType, MonitoringFileType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetIDDOCTesting
// ====================================================

export interface GetIDDOCTesting_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  iddocSupport: boolean | null;
  uatNeeds: string | null;
  stcNeeds: string | null;
  testingTimelines: string | null;
  testingNote: string | null;
  dataMonitoringFileTypes: MonitoringFileType[];
  dataMonitoringFileOther: string | null;
  dataResponseType: string | null;
  dataResponseFileFrequency: string | null;
}

export interface GetIDDOCTesting_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetIDDOCTesting_modelPlan_opsEvalAndLearning;
}

export interface GetIDDOCTesting {
  modelPlan: GetIDDOCTesting_modelPlan;
}

export interface GetIDDOCTestingVariables {
  id: UUID;
}
