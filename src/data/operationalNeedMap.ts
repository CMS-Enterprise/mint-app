import { OperationalNeedKey } from 'types/graphql-global-types';

export interface NeedMap {
  route: string;
  fieldName: string | string[];
  parentField: string;
  question: string; // Translation function name to a need question
  answer: string; // Translation function name for the answer to a need question
  multiPart?: boolean; // Used to idenfify if multiple question pertain to a single need
  multiPartQuestion?: string; // Used to identify translations of each quest that pertains to this need,
  section: string;
}

// TODO: replance 'answer' translation methods with new mapped translations enums once all work is done
const operationalNeedMap: Record<OperationalNeedKey | string, NeedMap> = {
  MANAGE_CD: {
    route: 'characteristics/key-characteristics',
    fieldName: 'managePartCDEnrollment',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:managePartCDEnrollment.question',
    answer: 'translateBoolean',
    section: 'generalCharacteristicsMisc'
  },
  REV_COL_BIDS: {
    route: 'characteristics/key-characteristics',
    fieldName: 'collectPlanBids',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:collectPlanBids.question',
    answer: 'translateBoolean',
    section: 'generalCharacteristicsMisc'
  },
  UPDATE_CONTRACT: {
    route: 'characteristics/key-characteristics',
    fieldName: 'planContractUpdated',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:planContractUpdated.question',
    answer: 'translateBoolean',
    section: 'generalCharacteristicsMisc'
  },
  SIGN_PARTICIPATION_AGREEMENTS: {
    route: 'characteristics/targets-and-options',
    fieldName: 'agreementTypes',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:agreementTypes.question',
    answer: 'translateAgreementTypes',
    section: 'generalCharacteristicsMisc'
  },
  RECRUIT_PARTICIPANTS: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'recruitmentMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:recruitmentMethod.question',
    answer: 'translateRecruitmentType',
    section: 'participantsAndProvidersMisc'
  },
  APP_SUPPORT_CON: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'selectionMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:selectionMethod.question',
    answer: 'translateParticipantSelectiontType',
    section: 'participantsAndProvidersMisc'
  },
  REV_SCORE_APP: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'selectionMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:selectionMethod.question',
    answer: 'translateParticipantSelectiontType',
    section: 'participantsAndProvidersMisc'
  },
  COMM_W_PART: {
    route: 'participants-and-providers/communication',
    fieldName: 'communicationMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:communicationMethod.question',
    answer: 'translateCommunicationType',
    section: 'participantsAndProvidersMisc'
  },
  MANAGE_PROV_OVERLAP: {
    route: 'participants-and-providers/provider-options',
    fieldName: 'providerOverlap',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:providerOverlap.question',
    answer: 'translateOverlapType',
    section: 'participantsAndProvidersMisc'
  },
  VET_PROVIDERS_FOR_PROGRAM_INTEGRITY: {
    route: 'participants-and-providers/coordination',
    fieldName: 'participantsIds',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:participantsIds.question',
    answer: 'translateParticipantIDType',
    section: 'participantsAndProvidersMisc'
  },
  MANAGE_BEN_OVERLAP: {
    route: 'beneficiaries/beneficiary-frequency',
    fieldName: 'beneficiaryOverlap',
    parentField: 'beneficiaries',
    question: 'beneficiaries:beneficiaryOverlap.question',
    answer: 'translateOverlapType',
    section: 'beneficiariesMisc'
  },
  HELPDESK_SUPPORT: {
    route: 'ops-eval-and-learning',
    fieldName: 'helpdeskUse',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:helpdeskUse.question',
    answer: 'translateBoolean',
    section: 'operationsEvaluationAndLearningMisc'
  },
  IDDOC_SUPPORT: {
    route: 'ops-eval-and-learning',
    fieldName: 'iddocSupport',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:iddocSupport.question',
    answer: 'translateBoolean',
    section: 'operationsEvaluationAndLearningMisc'
  },
  ESTABLISH_BENCH: {
    route: 'ops-eval-and-learning/performance',
    fieldName: 'benchmarkForPerformance',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:establishBenchmark',
    answer: 'translateBenchmarkForPerformanceType',
    section:
      'operationsEvaluaoperationsEvaluationAndLearningMisctionAndLearning'
  },
  PROCESS_PART_APPEALS: {
    route: 'ops-eval-and-learning/performance',
    fieldName: [
      'appealPerformance',
      'appealFeedback',
      'appealPayments',
      'appealOther'
    ],
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:participantAppeal',
    answer: 'translateBoolean',
    multiPart: true,
    multiPartQuestion: 'translateAppealsQuestionType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  ACQUIRE_AN_EVAL_CONT: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'evaluationApproaches',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:evaluationApproach',
    answer: 'translateEvaluationApproachType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  QUALITY_PERFORMANCE_SCORES: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  CLAIMS_BASED_MEASURES: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  DATA_TO_SUPPORT_EVAL: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  DATA_TO_MONITOR: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  SEND_REPDATA_TO_PART: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataToSendParticicipants',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataToSend',
    answer: 'translateDataToSendParticipantsType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  PART_TO_PART_COLLAB: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType',
    section: 'operationsEvaluationAndLearning'
  },
  EDUCATE_BENEF: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  ACQUIRE_A_LEARN_CONT: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR: {
    route: 'ops-eval-and-learning/ccw-and-quality',
    fieldName: 'developNewQualityMeasures',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:validatedQuality',
    answer: 'translateBoolean',
    section: 'operationsEvaluationAndLearningMisc'
  },
  IT_PLATFORM_FOR_LEARNING: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType',
    section: 'operationsEvaluationAndLearningMisc'
  },
  ADJUST_FFS_CLAIMS: {
    route: 'payment',
    fieldName: 'payType',
    parentField: 'payments',
    question: 'payments:whatWillYouPay',
    answer: 'translatePayType',
    section: 'payments'
  },
  MANAGE_FFS_EXCL_PAYMENTS: {
    route: 'payment/claims-based-payment',
    fieldName: 'shouldAnyProvidersExcludedFFSSystems',
    parentField: 'payments',
    question: 'payments:excludedFromPayment',
    answer: 'translateBoolean',
    section: 'payments'
  },
  MAKE_NON_CLAIMS_BASED_PAYMENTS: {
    route: 'payment',
    fieldName: 'payType',
    parentField: 'payments',
    question: 'payments:whatWillYouPay',
    answer: 'translatePayType',
    section: 'payments'
  },
  COMPUTE_SHARED_SAVINGS_PAYMENT: {
    route: 'payment/non-claims-based-payment',
    fieldName: 'nonClaimsPayments',
    parentField: 'payments',
    question: 'payments:nonClaimsPayments',
    answer: 'translateNonClaimsBasedPayType',
    section: 'payments'
  },
  RECOVER_PAYMENTS: {
    route: 'payment/recover-payment',
    fieldName: 'willRecoverPayments',
    parentField: 'payments',
    question: 'payments:willRecoverPayments',
    answer: 'translateBoolean',
    section: 'payments'
  }
};

export default operationalNeedMap;
