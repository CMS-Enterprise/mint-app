interface NeedMap {
  route: string;
  fieldName: string | string[];
  parentField: string;
  question: string;
  answer: string;
}

type NeedMapType = {
  [key: string]: NeedMap;
};

const operationalNeedMap: NeedMapType = {
  MANAGE_CD: {
    route: '/key-characteristics',
    fieldName: 'managePartCDEnrollment',
    parentField: 'generalCharacteristics',
    question: 'generalCharacteristics:manageEnrollment',
    answer: 'translateBoolean'
  }
  // REV_COL_BIDS: {
  //   route: '/key-characteristics',
  //   fieldName: 'collectPlanBids',
  //   parentField: 'generalCharacteristics'
  // },
  // UPDATE_CONTRACT: {
  //   route: '/key-characteristics',
  //   fieldName: 'planContactUpdated',
  //   parentField: 'generalCharacteristics'
  // },
  // ADVERTISE_MODEL: {
  //   route: '/participant-options',
  //   fieldName: 'recruitmentMethod',
  //   parentField: 'participantsAndProviders'
  // },
  // COL_REV_SCORE_APP: {
  //   route: '/participant-options',
  //   fieldName: 'selectionMethod',
  //   parentField: 'participantsAndProviders'
  // },
  // COMM_W_PART: {
  //   route: '/communication',
  //   fieldName: 'communicationMethod',
  //   parentField: 'participantsAndProviders'
  // },
  // HELPDESK_SUPPORT: {
  //   route: '/ops-eval-and-learning',
  //   fieldName: 'helpdeskUse',
  //   parentField: 'opsEvalAndLearning'
  // },
  // IDDOC_SUPPORT: {
  //   route: '/ccw-and-quality',
  //   fieldName: 'iddocSupport',
  //   parentField: 'opsEvalAndLearning'
  // },
  // ESTABLISH_BENCH: {
  //   route: '/performance',
  //   fieldName: 'benchmarkForPerformance',
  //   parentField: 'opsEvalAndLearning'
  // },
  // PROCESS_PART_APPEALS: {
  //   route: '/performance',
  //   fieldName: [
  //     'appealPerformance',
  //     'appealFeedback',
  //     'appealPayments',
  //     'appealOther'
  //   ],
  //   parentField: 'opsEvalAndLearning'
  // },
  // ACQUIRE_AN_EVAL_CONT: {
  //   route: '/evaluation',
  //   fieldName: 'evaluationApproaches',
  //   parentField: 'participantsAndProviders'
  // },
  // DATA_TO_MONITOR: {
  //   route: '/evaluation',
  //   fieldName: 'dataNeededForMonitoring',
  //   parentField: 'participantsAndProviders'
  // },
  // COMM_WSEND_REPDATA_TO_PART_PART: {
  //   route: '/evaluation',
  //   fieldName: 'dataToSendParticicipants',
  //   parentField: 'participantsAndProviders'
  // },
  // ACQUIRE_A_LEARN_CONT: {
  //   route: '/learning',
  //   fieldName: 'modelLearningSystems',
  //   parentField: 'participantsAndProviders'
  // },
  // ADJUST_FFS_CLAIMS: {
  //   route: '/payment',
  //   fieldName: 'payType',
  //   parentField: 'payments'
  // },
  // MANAGE_FFS_EXCL_PAYMENTS: {
  //   route: '/claims-based-payment',
  //   fieldName: 'shouldAnyProvidersExcludedFFSSystems',
  //   parentField: 'payments'
  // },
  // MAKE_NON_CLAIMS_BASED_PAYMENTS: {
  //   route: '/non-claims-based-payment',
  //   fieldName: 'nonClaimsPayments',
  //   parentField: 'payments'
  // },
  // RECOVER_PAYMENTS: {
  //   route: '/recover',
  //   fieldName: 'willRecoverPayments',
  //   parentField: 'payments'
  // }
};

export default operationalNeedMap;
