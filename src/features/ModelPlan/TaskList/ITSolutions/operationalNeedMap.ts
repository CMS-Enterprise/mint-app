import { OperationalNeedKey } from 'gql/generated/graphql';

export interface NeedMap {
  route: string;
  fieldName: string | string[];
  parentField: string;
  question: string; // Translation function name to a need question
  multiPart?: boolean; // Used to idenfify if multiple question pertain to a single need
  section: string;
}

const operationalNeedMap: Record<OperationalNeedKey | string, NeedMap> = {
  MANAGE_CD: {
    route: 'characteristics/key-characteristics',
    fieldName: 'managePartCDEnrollment',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:managePartCDEnrollment.label',
    section: 'generalCharacteristicsMisc'
  },
  REV_COL_BIDS: {
    route: 'characteristics/key-characteristics',
    fieldName: 'collectPlanBids',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:collectPlanBids.label',
    section: 'generalCharacteristicsMisc'
  },
  UPDATE_CONTRACT: {
    route: 'characteristics/key-characteristics',
    fieldName: 'planContractUpdated',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:planContractUpdated.label',
    section: 'generalCharacteristicsMisc'
  },
  SIGN_PARTICIPATION_AGREEMENTS: {
    route: 'characteristics/targets-and-options',
    fieldName: 'agreementTypes',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:agreementTypes.label',
    section: 'generalCharacteristicsMisc'
  },
  RECRUIT_PARTICIPANTS: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'recruitmentMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:recruitmentMethod.label',
    section: 'participantsAndProvidersMisc'
  },
  APP_SUPPORT_CON: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'selectionMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:selectionMethod.label',
    section: 'participantsAndProvidersMisc'
  },
  REV_SCORE_APP: {
    route: 'participants-and-providers/participants-options',
    fieldName: 'selectionMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:selectionMethod.label',
    section: 'participantsAndProvidersMisc'
  },
  COMM_W_PART: {
    route: 'participants-and-providers/communication',
    fieldName: 'communicationMethod',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:communicationMethod.label',
    section: 'participantsAndProvidersMisc'
  },
  MANAGE_PROV_OVERLAP: {
    route: 'participants-and-providers/provider-options',
    fieldName: 'providerOverlap',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:providerOverlap.label',
    section: 'participantsAndProvidersMisc'
  },
  VET_PROVIDERS_FOR_PROGRAM_INTEGRITY: {
    route: 'participants-and-providers/coordination',
    fieldName: 'participantsIds',
    parentField: 'participantsAndProviders',
    question: 'participantsAndProviders:participantsIds.label',
    section: 'participantsAndProvidersMisc'
  },
  MANAGE_BEN_OVERLAP: {
    route: 'beneficiaries/beneficiary-frequency',
    fieldName: 'beneficiaryOverlap',
    parentField: 'beneficiaries',
    question: 'beneficiaries:beneficiaryOverlap.label',
    section: 'beneficiariesMisc'
  },
  HELPDESK_SUPPORT: {
    route: 'ops-eval-and-learning',
    fieldName: 'helpdeskUse',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:helpdeskUse.label',
    section: 'opsEvalAndLearningMisc'
  },
  IDDOC_SUPPORT: {
    route: 'ops-eval-and-learning',
    fieldName: 'iddocSupport',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:iddocSupport.label',
    section: 'opsEvalAndLearningMisc'
  },
  ESTABLISH_BENCH: {
    route: 'ops-eval-and-learning/performance',
    fieldName: 'benchmarkForPerformance',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:benchmarkForPerformance.label',
    section: 'opsEvalAndLearningMisc'
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
    question: 'opsEvalAndLearningMisc:participantAppeal',
    multiPart: true,
    section: 'opsEvalAndLearningMisc'
  },
  ACQUIRE_AN_EVAL_CONT: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'evaluationApproaches',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:evaluationApproaches.label',
    section: 'opsEvalAndLearningMisc'
  },
  QUALITY_PERFORMANCE_SCORES: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:dataNeededForMonitoring.label',
    section: 'opsEvalAndLearningMisc'
  },
  CLAIMS_BASED_MEASURES: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:dataNeededForMonitoring.label',
    section: 'opsEvalAndLearningMisc'
  },
  DATA_TO_SUPPORT_EVAL: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:dataNeededForMonitoring.label',
    section: 'opsEvalAndLearningMisc'
  },
  DATA_TO_MONITOR: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataNeededForMonitoring',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:dataNeededForMonitoring.label',
    section: 'opsEvalAndLearningMisc'
  },
  SEND_REPDATA_TO_PART: {
    route: 'ops-eval-and-learning/evaluation',
    fieldName: 'dataToSendParticicipants',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:dataToSendParticicipants.label',
    section: 'opsEvalAndLearningMisc'
  },
  PART_TO_PART_COLLAB: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:modelLearningSystems.label',
    section: 'opsEvalAndLearningMisc'
  },
  EDUCATE_BENEF: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:modelLearningSystems.label',
    section: 'opsEvalAndLearningMisc'
  },
  ACQUIRE_A_LEARN_CONT: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:modelLearningSystems.label',
    section: 'opsEvalAndLearningMisc'
  },
  UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR: {
    route: 'ops-eval-and-learning/ccw-and-quality',
    fieldName: 'developNewQualityMeasures',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:developNewQualityMeasures.label',
    section: 'opsEvalAndLearningMisc'
  },
  IT_PLATFORM_FOR_LEARNING: {
    route: 'ops-eval-and-learning/learning',
    fieldName: 'modelLearningSystems',
    parentField: 'opsEvalAndLearning',
    question: 'opsEvalAndLearning:modelLearningSystems.label',
    section: 'opsEvalAndLearningMisc'
  },
  ADJUST_FFS_CLAIMS: {
    route: 'payment',
    fieldName: 'payType',
    parentField: 'payments',
    question: 'payments:payType.label',
    section: 'paymentsMisc'
  },
  MANAGE_FFS_EXCL_PAYMENTS: {
    route: 'payment/claims-based-payment',
    fieldName: 'shouldAnyProvidersExcludedFFSSystems',
    parentField: 'payments',
    question: 'payments:shouldAnyProvidersExcludedFFSSystems.label',
    section: 'paymentsMisc'
  },
  MAKE_NON_CLAIMS_BASED_PAYMENTS: {
    route: 'payment',
    fieldName: 'payType',
    parentField: 'payments',
    question: 'payments:payType.label',
    section: 'paymentsMisc'
  },
  COMPUTE_SHARED_SAVINGS_PAYMENT: {
    route: 'payment/non-claims-based-payment',
    fieldName: 'nonClaimsPayments',
    parentField: 'payments',
    question: 'payments:nonClaimsPayments.label',
    section: 'paymentsMisc'
  },
  RECOVER_PAYMENTS: {
    route: 'payment/recover-payment',
    fieldName: 'willRecoverPayments',
    parentField: 'payments',
    question: 'payments:willRecoverPayments.label',
    section: 'paymentsMisc'
  }
};

export default operationalNeedMap;
