export interface NeedMap {
  route: string;
  fieldName: string | string[];
  parentField: string;
  question: string; // Translation function name to a need question
  answer: string; // Translation function name for the answer to a need question
  multiPart?: boolean; // Used to idenfify if multiple question pertain to a single need
  multiPartQuestion?: string; // Used to identify translations of each quest that pertains to this need
}

type NeedMapType = {
  [key: string]: NeedMap;
};

const operationalNeedMap: NeedMapType = {
  MANAGE_CD: {
    route: 'characteristics/key-characteristics',
    fieldName: 'managePartCDEnrollment',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:manageEnrollment',
    answer: 'translateBoolean'
  },
  REV_COL_BIDS: {
    route: 'characteristics/key-characteristics',
    fieldName: 'collectPlanBids',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:reviewPlanBids',
    answer: 'translateBoolean'
  },
  UPDATE_CONTRACT: {
    route: 'characteristics/key-characteristics',
    fieldName: 'planContractUpdated',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:updatedContract',
    answer: 'translateBoolean'
  },
  SIGN_PARTICIPATION_AGREEMENTS: {
    route: 'characteristics/targets-and-options',
    fieldName: 'agreementTypes',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:agreementType',
    answer: 'translateAgreementTypes'
  },
  RECRUIT_PARTICIPANTS: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'recruitmentMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:recruitParticipants',
    answer: 'translateRecruitmentType'
  },
  APP_SUPPORT_CON: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'selectionMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:howWillYouSelect',
    answer: 'translateParticipantSelectiontType'
  },
  REV_SCORE_APP: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'selectionMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:howWillYouSelect',
    answer: 'translateParticipantSelectiontType'
  },
  COMM_W_PART: {
    route: 'participants-and-providers/communication',
    fieldName: 'communicationMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:participantCommunication',
    answer: 'translateCommunicationType'
  },
  MANAGE_PROV_OVERLAP: {
    route: 'participants-and-providers/provder-options',
    fieldName: 'providerOverlap',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:overlap',
    answer: 'translateOverlapType'
  },
  VET_PROVIDERS_FOR_PROGRAM_INTEGRITY: {
    route: 'participants-and-providers/coordination',
    fieldName: 'participantsIds',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:collectTINs',
    answer: 'translateParticipantIDType'
  },
  MANAGE_BEN_OVERLAP: {
    route: 'beneficiaries/beneficiary-frequency',
    fieldName: 'beneficiaryOverlap',
    parentField: 'beneficiaries',
    question: 'beneficiaries:beneficiaryOverlap',
    answer: 'translateOverlapType'
  },
  HELPDESK_SUPPORT: {
    route: 'ops-eval-and-learning',
    fieldName: 'helpdeskUse',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:helpDesk',
    answer: 'translateBoolean'
  },
  IDDOC_SUPPORT: {
    route: 'ops-eval-and-learning',
    fieldName: 'iddocSupport',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:iddocSupport',
    answer: 'translateBoolean'
  },
  ESTABLISH_BENCH: {
    route: 'ops-eval-and-learning/performance',
    fieldName: 'benchmarkForPerformance',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:establishBenchmark',
    answer: 'translateBenchmarkForPerformanceType'
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
    multiPartQuestion: 'translateAppealsQuestionType'
  },
  ACQUIRE_AN_EVAL_CONT: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'evaluationApproaches',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:evaluationApproach',
    answer: 'translateEvaluationApproachType'
  },
  QUALITY_PERFORMANCE_SCORES: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType'
  },
  CLAIMS_BASED_MEASURES: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType'
  },
  DATA_TO_SUPPORT_EVAL: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType'
  },
  DATA_TO_MONITOR: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataNeeded',
    answer: 'translateDataForMonitoringType'
  },
  SEND_REPDATA_TO_PART: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataToSendParticicipants',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataToSend',
    answer: 'translateDataToSendParticipantsType'
  },
  COMM_WSEND_REPDATA_TO_PART_PART: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataToSendParticicipants',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:dataToSend',
    answer: 'translateDataToSendParticipantsType'
  },
  PART_TO_PART_COLLAB: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType'
  },
  EDUCATE_BENEF: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType'
  },
  ACQUIRE_A_LEARN_CONT: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType'
  },
  UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR: {
    route: 'ops-eval-and-learning/ccw-and-quality',
    fieldName: 'developNewQualityMeasures',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:validatedQuality',
    answer: 'translateBoolean'
  },
  IT_PLATFORM_FOR_LEARNING: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'operationsEvaluationAndLearning:learningSystem',
    answer: 'translateModelLearningSystemType'
  },
  ADJUST_FFS_CLAIMS: {
    route: 'payment',
    fieldName: 'payType',
    parentField: 'payments',
    question: 'payments:whatWillYouPay',
    answer: 'translatePayType'
  },
  MANAGE_FFS_EXCL_PAYMENTS: {
    route: 'payment/claims-based-payment',
    fieldName: 'shouldAnyProvidersExcludedFFSSystems',
    parentField: 'payments',
    question: 'payments:excludedFromPayment',
    answer: 'translateBoolean'
  },
  MAKE_NON_CLAIMS_BASED_PAYMENTS: {
    route: 'payment',
    fieldName: 'payType',
    parentField: 'payments',
    question: 'payments:whatWillYouPay',
    answer: 'translatePayType'
  },
  COMPUTE_SHARED_SAVINGS_PAYMENT: {
    route: 'payment/non-claims-based-payment',
    fieldName: 'nonClaimsPayments',
    parentField: 'payments',
    question: 'payments:nonClaimsPayments',
    answer: 'translateNonClaimsBasedPayType'
  },
  RECOVER_PAYMENTS: {
    route: 'payment/recover',
    fieldName: 'willRecoverPayments',
    parentField: 'payments',
    question: 'payments:willRecoverPayments',
    answer: 'translateBoolean'
  }
};

export default operationalNeedMap;
