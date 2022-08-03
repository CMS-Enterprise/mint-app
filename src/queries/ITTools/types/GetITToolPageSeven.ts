/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DataToSendParticipantsType, ModelLearningSystemType, OelSendReportsType, OelLearningContractorType, OelParticipantCollaborationType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetITToolPageSeven
// ====================================================

export interface GetITToolPageSeven_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  dataToSendParticicipants: DataToSendParticipantsType[];
  modelLearningSystems: ModelLearningSystemType[];
}

export interface GetITToolPageSeven_modelPlan_itTools {
  __typename: "PlanITTools";
  id: UUID;
  oelSendReports: OelSendReportsType[];
  oelSendReportsOther: string | null;
  oelSendReportsNote: string | null;
  oelLearningContractor: OelLearningContractorType[];
  oelLearningContractorOther: string | null;
  oelLearningContractorNote: string | null;
  oelParticipantCollaboration: OelParticipantCollaborationType[];
  oelParticipantCollaborationOther: string | null;
  oelParticipantCollaborationNote: string | null;
}

export interface GetITToolPageSeven_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetITToolPageSeven_modelPlan_opsEvalAndLearning;
  itTools: GetITToolPageSeven_modelPlan_itTools;
}

export interface GetITToolPageSeven {
  modelPlan: GetITToolPageSeven_modelPlan;
}

export interface GetITToolPageSevenVariables {
  id: UUID;
}
