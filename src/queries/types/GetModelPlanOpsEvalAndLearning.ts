/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AgencyOrStateHelpType, StakeholdersType, HelpdeskUseType, ContractorSupportType, IddocOperationsType, MonitoringFileType, DataFullTimeOrIncrementalType, BenchmarkForPerformanceType, EvaluationApproachType, CcmInvolvmentType, DataForMonitoringType, DataToSendParticipantsType, DataStartsType, DataFrequencyType, ModelLearningSystemType, TaskStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanOpsEvalAndLearning
// ====================================================

export interface GetModelPlanOpsEvalAndLearning_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  agencyOrStateHelp: AgencyOrStateHelpType[];
  agencyOrStateHelpOther: string | null;
  agencyOrStateHelpNote: string | null;
  stakeholders: StakeholdersType[];
  stakeholdersOther: string | null;
  stakeholdersNote: string | null;
  helpdeskUse: HelpdeskUseType[];
  helpdeskUseOther: string | null;
  helpdeskUseNote: string | null;
  contractorSupport: ContractorSupportType[];
  contractorSupportOther: string | null;
  contractorSupportHow: string | null;
  contractorSupportNote: string | null;
  iddocSupport: boolean | null;
  iddocSupportNote: string | null;
  iddocOperations: IddocOperationsType | null;
  iddocOperationsOther: string | null;
  iddocOperationsNote: string | null;
  technicalContactsIdentified: boolean | null;
  technicalContactsIdentifiedDetail: string | null;
  technicalContactsIdentifiedNote: string | null;
  captureParticipantInfo: boolean | null;
  captureParticipantInfoNote: string | null;
  icdOwner: string | null;
  draftIcdDueDate: Time | null;
  icdNote: string | null;
  uatNeeds: string | null;
  stcNeeds: string | null;
  testingTimelines: string | null;
  testingNote: string | null;
  dataMonitoringFileTypes: MonitoringFileType[];
  dataMonitoringFileOther: string | null;
  dataResponseType: string | null;
  dataResponseFileFrequency: string | null;
  dataFullTimeOrIncremental: DataFullTimeOrIncrementalType | null;
  eftSetUp: boolean | null;
  unsolicitedAdjustmentsIncluded: boolean | null;
  dataFlowDiagramsNeeded: boolean | null;
  produceBenefitEnhancementFiles: boolean | null;
  fileNamingConventions: string | null;
  dataMonitoringNote: string | null;
  benchmarkForPerformance: BenchmarkForPerformanceType | null;
  benchmarkForPerformanceNote: string | null;
  computePerformanceScores: boolean | null;
  computePerformanceScoresNote: string | null;
  riskAdjustPerformance: boolean | null;
  riskAdjustFeedback: boolean | null;
  riskAdjustPayments: boolean | null;
  riskAdjustOther: boolean | null;
  riskAdjustNote: string | null;
  appealPerformance: boolean | null;
  appealFeedback: boolean | null;
  appealPayments: boolean | null;
  appealOther: boolean | null;
  appealNote: string | null;
  evaluationApproaches: EvaluationApproachType[];
  evaluationApproachOther: string | null;
  evalutaionApproachNote: string | null;
  ccmInvolvment: CcmInvolvmentType[];
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
  sendFilesBetweenCcw: boolean | null;
  sendFilesBetweenCcwNote: string | null;
  appToSendFilesToKnown: boolean | null;
  appToSendFilesToWhich: string | null;
  appToSendFilesToNote: string | null;
  useCcwForFileDistribiutionToParticipants: boolean | null;
  useCcwForFileDistribiutionToParticipantsNote: string | null;
  developNewQualityMeasures: boolean | null;
  developNewQualityMeasuresNote: string | null;
  qualityPerformanceImpactsPayment: boolean | null;
  qualityPerformanceImpactsPaymentNote: string | null;
  dataSharingStarts: DataStartsType | null;
  dataSharingStartsOther: string | null;
  dataSharingFrequency: DataFrequencyType[];
  dataSharingFrequencyOther: string | null;
  dataSharingStartsNote: string | null;
  dataCollectionStarts: DataStartsType | null;
  dataCollectionStartsOther: string | null;
  dataCollectionFrequency: DataFrequencyType[];
  dataCollectionFrequencyOther: string | null;
  dataCollectionFrequencyNote: string | null;
  qualityReportingStarts: DataStartsType | null;
  qualityReportingStartsOther: string | null;
  qualityReportingStartsNote: string | null;
  modelLearningSystems: ModelLearningSystemType[];
  modelLearningSystemsOther: string | null;
  modelLearningSystemsNote: string | null;
  anticipatedChallenges: string | null;
  status: TaskStatus;
}

export interface GetModelPlanOpsEvalAndLearning_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  opsEvalAndLearning: GetModelPlanOpsEvalAndLearning_modelPlan_opsEvalAndLearning;
}

export interface GetModelPlanOpsEvalAndLearning {
  modelPlan: GetModelPlanOpsEvalAndLearning_modelPlan;
}

export interface GetModelPlanOpsEvalAndLearningVariables {
  id: UUID;
}
