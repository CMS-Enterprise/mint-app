/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, DataForMonitoringType, DataStartsType, FrequencyTypeNew } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetDataSharing
// ====================================================

export interface GetDataSharing_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  iddocSupport: boolean | null;
  dataSharingStarts: DataStartsType | null;
  dataSharingStartsOther: string | null;
  dataSharingFrequency: FrequencyTypeNew[];
  dataSharingFrequencyContinually: string | null;
  dataSharingFrequencyOther: string | null;
  dataSharingStartsNote: string | null;
  dataCollectionStarts: DataStartsType | null;
  dataCollectionStartsOther: string | null;
  dataCollectionFrequency: FrequencyTypeNew[];
  dataCollectionFrequencyContinually: string | null;
  dataCollectionFrequencyOther: string | null;
  dataCollectionFrequencyNote: string | null;
  qualityReportingStarts: DataStartsType | null;
  qualityReportingStartsOther: string | null;
  qualityReportingStartsNote: string | null;
}

export interface GetDataSharing_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetDataSharing_modelPlan_opsEvalAndLearning;
}

export interface GetDataSharing {
  modelPlan: GetDataSharing_modelPlan;
}

export interface GetDataSharingVariables {
  id: UUID;
}
