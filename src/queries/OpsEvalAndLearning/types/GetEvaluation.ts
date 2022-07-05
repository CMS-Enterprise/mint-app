/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CcmInvolvmentType, EvaluationApproachType, DataForMonitoringType, DataToSendParticipantsType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetEvaluation
// ====================================================

export interface GetEvaluation_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  ccmInvolvment: CcmInvolvmentType[];
  iddocSupport: boolean | null;
  evaluationApproaches: EvaluationApproachType[];
  evaluationApproachOther: string | null;
  evalutaionApproachNote: string | null;
  ccmInvolvmentOther: string | null;
  ccmInvolvmentNote: string | null;
  dataNeededForMonitoring: DataForMonitoringType[];
  dataNeededForMonitoringOther: string | null;
  dataNeededForMonitoringNote: string | null;
  dataToSendParticicipants: DataToSendParticipantsType[];
  dataToSendParticicipantsOther: string | null;
  dataToSendParticicipantsNote: string | null;
  shareCclfData: boolean | null;
  shareCclfDataNote: string | null;
}

export interface GetEvaluation_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetEvaluation_modelPlan_opsEvalAndLearning;
}

export interface GetEvaluation {
  modelPlan: GetEvaluation_modelPlan;
}

export interface GetEvaluationVariables {
  id: UUID;
}
