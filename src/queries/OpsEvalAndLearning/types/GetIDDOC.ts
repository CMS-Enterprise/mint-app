/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, DataForMonitoringType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetIDDOC
// ====================================================

export interface GetIDDOC_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  iddocSupport: boolean | null;
  technicalContactsIdentified: boolean | null;
  technicalContactsIdentifiedDetail: string | null;
  technicalContactsIdentifiedNote: string | null;
  captureParticipantInfo: boolean | null;
  captureParticipantInfoNote: string | null;
  icdOwner: string | null;
  draftIcdDueDate: Time | null;
  icdNote: string | null;
}

export interface GetIDDOC_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetIDDOC_modelPlan_opsEvalAndLearning;
}

export interface GetIDDOC {
  modelPlan: GetIDDOC_modelPlan;
}

export interface GetIDDOCVariables {
  id: UUID;
}
