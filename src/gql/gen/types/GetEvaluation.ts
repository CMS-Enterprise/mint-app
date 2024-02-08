/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, DataForMonitoringType, EvaluationApproachType, DataToSendParticipantsType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetEvaluation
// ====================================================

export interface GetEvaluation_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  iddocSupport: boolean | null;
  evaluationApproaches: EvaluationApproachType[];
  evaluationApproachOther: string | null;
  evalutaionApproachNote: string | null;
  ccmInvolvmentOther: string | null;
  ccmInvolvmentNote: string | null;
  dataNeededForMonitoringOther: string | null;
  dataNeededForMonitoringNote: string | null;
  dataToSendParticicipants: DataToSendParticipantsType[];
  dataToSendParticicipantsOther: string | null;
  dataToSendParticicipantsNote: string | null;
  shareCclfData: boolean | null;
  shareCclfDataNote: string | null;
}

export interface GetEvaluation_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetEvaluation_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetEvaluation_modelPlan_opsEvalAndLearning;
  operationalNeeds: GetEvaluation_modelPlan_operationalNeeds[];
}

export interface GetEvaluation {
  modelPlan: GetEvaluation_modelPlan;
}

export interface GetEvaluationVariables {
  id: UUID;
}
