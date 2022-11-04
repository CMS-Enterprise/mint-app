/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RecruitmentType, ParticipantSelectionType, ParticipantCommunicationType, BenchmarkForPerformanceType, EvaluationApproachType, DataForMonitoringType, DataToSendParticipantsType, ModelLearningSystemType, PayType, NonClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOperationalNeedAnswer
// ====================================================

export interface GetOperationalNeedAnswer_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  managePartCDEnrollment: boolean | null;
  collectPlanBids: boolean | null;
  planContactUpdated: boolean | null;
}

export interface GetOperationalNeedAnswer_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  recruitmentMethod: RecruitmentType | null;
  selectionMethod: ParticipantSelectionType[];
  communicationMethod: ParticipantCommunicationType[];
}

export interface GetOperationalNeedAnswer_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  helpdeskUse: boolean | null;
  iddocSupport: boolean | null;
  benchmarkForPerformance: BenchmarkForPerformanceType | null;
  appealPerformance: boolean | null;
  appealFeedback: boolean | null;
  appealPayments: boolean | null;
  appealOther: boolean | null;
  evaluationApproaches: EvaluationApproachType[];
  dataNeededForMonitoring: DataForMonitoringType[];
  dataToSendParticicipants: DataToSendParticipantsType[];
  modelLearningSystems: ModelLearningSystemType[];
}

export interface GetOperationalNeedAnswer_modelPlan_payments {
  __typename: "PlanPayments";
  payType: PayType[];
  shouldAnyProvidersExcludedFFSSystems: boolean | null;
  nonClaimsPayments: NonClaimsBasedPayType[];
  willRecoverPayments: boolean | null;
}

export interface GetOperationalNeedAnswer_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  generalCharacteristics: GetOperationalNeedAnswer_modelPlan_generalCharacteristics;
  participantsAndProviders: GetOperationalNeedAnswer_modelPlan_participantsAndProviders;
  opsEvalAndLearning: GetOperationalNeedAnswer_modelPlan_opsEvalAndLearning;
  payments: GetOperationalNeedAnswer_modelPlan_payments;
}

export interface GetOperationalNeedAnswer {
  modelPlan: GetOperationalNeedAnswer_modelPlan;
}

export interface GetOperationalNeedAnswerVariables {
  id: UUID;
  generalCharacteristics: boolean;
  participantsAndProviders: boolean;
  opsEvalAndLearning: boolean;
  payments: boolean;
  managePartCDEnrollment: boolean;
  collectPlanBids: boolean;
  planContactUpdated: boolean;
  recruitmentMethod: boolean;
  selectionMethod: boolean;
  communicationMethod: boolean;
  helpdeskUse: boolean;
  iddocSupport: boolean;
  benchmarkForPerformance: boolean;
  appealPerformance: boolean;
  appealFeedback: boolean;
  appealPayments: boolean;
  appealOther: boolean;
  evaluationApproaches: boolean;
  dataNeededForMonitoring: boolean;
  dataToSendParticicipants: boolean;
  modelLearningSystems: boolean;
  payType: boolean;
  shouldAnyProvidersExcludedFFSSystems: boolean;
  nonClaimsPayments: boolean;
  willRecoverPayments: boolean;
}
