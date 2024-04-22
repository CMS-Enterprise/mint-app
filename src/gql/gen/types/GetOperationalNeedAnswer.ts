/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AgreementType, RecruitmentType, ParticipantSelectionType, ParticipantCommunicationType, OverlapType, ParticipantsIDType, BenchmarkForPerformanceType, EvaluationApproachType, DataForMonitoringType, DataToSendParticipantsType, ModelLearningSystemType, PayType, NonClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetOperationalNeedAnswer
// ====================================================

export interface GetOperationalNeedAnswer_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  managePartCDEnrollment: boolean | null;
  collectPlanBids: boolean | null;
  planContractUpdated: boolean | null;
  agreementTypes: AgreementType[];
}

export interface GetOperationalNeedAnswer_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  recruitmentMethod: RecruitmentType | null;
  selectionMethod: ParticipantSelectionType[];
  communicationMethod: ParticipantCommunicationType[];
  providerOverlap: OverlapType | null;
  participantsIds: ParticipantsIDType[];
}

export interface GetOperationalNeedAnswer_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  beneficiaryOverlap: OverlapType | null;
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
  developNewQualityMeasures: boolean | null;
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
  beneficiaries: GetOperationalNeedAnswer_modelPlan_beneficiaries;
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
  beneficiaries: boolean;
  opsEvalAndLearning: boolean;
  payments: boolean;
  managePartCDEnrollment: boolean;
  collectPlanBids: boolean;
  planContractUpdated: boolean;
  agreementTypes: boolean;
  recruitmentMethod: boolean;
  selectionMethod: boolean;
  communicationMethod: boolean;
  providerOverlap: boolean;
  participantsIds: boolean;
  beneficiaryOverlap: boolean;
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
  developNewQualityMeasures: boolean;
  payType: boolean;
  shouldAnyProvidersExcludedFFSSystems: boolean;
  nonClaimsPayments: boolean;
  willRecoverPayments: boolean;
}
