import { TranslationOpsEvalAndLearning } from 'types/translation';

export const opsEvalAndLearning: TranslationOpsEvalAndLearning = {
  agencyOrStateHelp: {
    gqlField: 'agencyOrStateHelp',
    goField: 'AgencyOrStateHelp',
    dbField: 'agency_or_state_help',
    question:
      'Will another Agency or State help design/operate the model? Select all that apply.',
    readonlyQuestion:
      'Will another Agency or State help design/operate the model?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      YES_STATE: 'Yes, we will partner with states',
      YES_AGENCY_IDEAS: 'Yes, we will get ideas from another agency',
      YES_AGENCY_IAA:
        'Yes, we will get support from another agency through Inter Agency Agreement (IAA)',
      NO: 'No',
      OTHER: 'Other'
    }
  },
  agencyOrStateHelpOther: {
    gqlField: 'agencyOrStateHelpOther',
    goField: 'AgencyOrStateHelpOther',
    dbField: 'agency_or_state_help_other',
    question: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  agencyOrStateHelpNote: {
    gqlField: 'agencyOrStateHelpNote',
    goField: 'AgencyOrStateHelpNote',
    dbField: 'agency_or_state_help_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  stakeholders: {
    gqlField: 'stakeholders',
    goField: 'Stakeholders',
    dbField: 'stakeholders',
    question: 'What stakeholders do you plan to communicate with?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected stakeholders',
    options: {
      BENEFICIARIES: 'Beneficiaries',
      COMMUNITY_ORGANIZATIONS: 'Community organizations',
      PARTICIPANTS: 'Participants',
      PROFESSIONAL_ORGANIZATIONS: 'Professional organizations',
      PROVIDERS: 'Providers',
      STATES: 'States',
      OTHER: 'Other'
    },
    filterGroups: ['cbosc']
  },
  stakeholdersOther: {
    gqlField: 'stakeholdersOther',
    goField: 'StakeholdersOther',
    dbField: 'stakeholders',
    question:
      'Please describe the other stakeholders you plan to communicate with.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  stakeholdersNote: {
    gqlField: 'stakeholdersNote',
    goField: 'StakeholdersNote',
    dbField: 'stakeholders_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  helpdeskUse: {
    gqlField: 'helpdeskUse',
    goField: 'HelpdeskUse',
    dbField: 'stakeholders_note',
    question: 'Do you plan to use a helpdesk?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cbosc']
  },
  helpdeskUseNote: {
    gqlField: 'helpdeskUseNote',
    goField: 'HelpdeskUseNote',
    dbField: 'helpdesk_use_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  contractorSupport: {
    gqlField: 'contractorSupport',
    goField: 'ContractorSupport',
    dbField: 'contractor_support',
    question: 'What contractors will support your model?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      ONE: 'One contractor to support implementation',
      MULTIPLE:
        'May have separate contractors for different implementation functions',
      NONE: 'Do not plan to use an implemenation contractor',
      OTHER: 'Other'
    },
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportOther: {
    gqlField: 'contractorSupportOther',
    goField: 'ContractorSupportOther',
    dbField: 'contractor_support_other',
    question: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportHow: {
    gqlField: 'contractorSupportHow',
    goField: 'ContractorSupportHow',
    dbField: 'contractor_support_how',
    question: 'In what capacity will they support your model?',
    hint: '(implementation, data analysis, quality, etc.)',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportNote: {
    gqlField: 'contractorSupportNote',
    goField: 'ContractorSupportNote',
    dbField: 'contractor_support_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  iddocSupport: {
    gqlField: 'iddocSupport',
    goField: 'IddocSupport',
    dbField: 'iddoc_support',
    question: 'Are you planning to use IDDOC support?',
    hint:
      'IDDOC is commonly known as ACO-OS (Accountable Care Organization Operating System). They can provide support for design, development, operations, and maintenance.',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc']
  },
  iddocSupportNote: {
    gqlField: 'iddocSupportNote',
    goField: 'IddocSupportNote',
    dbField: 'iddoc_support_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  technicalContactsIdentified: {
    gqlField: 'technicalContactsIdentified',
    goField: 'TechnicalContactsIdentified',
    dbField: 'technical_contacts_identified',
    question: 'Are technical contacts identified?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc']
  },
  technicalContactsIdentifiedDetail: {
    gqlField: 'technicalContactsIdentifiedDetail',
    goField: 'TechnicalContactsIdentifiedDetail',
    dbField: 'technical_contacts_identified_detail',
    question: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  technicalContactsIdentifiedNote: {
    gqlField: 'technicalContactsIdentifiedNote',
    goField: 'TechnicalContactsIdentifiedNote',
    dbField: 'technical_contacts_identified_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  captureParticipantInfo: {
    gqlField: 'captureParticipantInfo',
    goField: 'CaptureParticipantInfo',
    dbField: 'capture_participant_info',
    question: 'Will you capture participant information?',
    hint:
      'This means the participant record for a model would be included in the ACO-OS Entity File.',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc']
  },
  captureParticipantInfoNote: {
    gqlField: 'captureParticipantInfoNote',
    goField: 'CaptureParticipantInfoNote',
    dbField: 'capture_participant_info',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  icdOwner: {
    gqlField: 'icdOwner',
    goField: 'IcdOwner',
    dbField: 'icd_owner',
    question: 'ICD owner',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  draftIcdDueDate: {
    gqlField: 'draftIcdDueDate',
    goField: 'DraftIcdDueDate',
    dbField: 'draft_icd_due_date',
    question: 'Draft ICD required by',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['iddoc']
  },
  icdNote: {
    gqlField: 'icdNote',
    goField: 'IcdNote',
    dbField: 'icd_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  uatNeeds: {
    gqlField: 'uatNeeds',
    goField: 'UatNeeds',
    dbField: 'uat_needs',
    question: 'User Acceptance Testing (UAT) – test data needs',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  stcNeeds: {
    gqlField: 'stcNeeds',
    goField: 'StcNeeds',
    dbField: 'stc_needs',
    question: 'STC – test data needs',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  testingTimelines: {
    gqlField: 'testingTimelines',
    goField: 'TestingTimelines',
    dbField: 'testing_timelines',
    question: 'Define the testing timelines',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  testingNote: {
    gqlField: 'testingNote',
    goField: 'TestingNote',
    dbField: 'testing_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  dataMonitoringFileTypes: {
    gqlField: 'dataMonitoringFileTypes',
    goField: 'DataMonitoringFileTypes',
    dbField: 'data_monitoring_file_types',
    question: 'What types of files? Select all that apply.',
    readonlyQuestion: 'What types of files?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      BENEFICIARY: 'Beneficiary',
      PROVIDER: 'Provider',
      PART_A: 'Part A',
      PART_B: 'Part B',
      OTHER: 'Other'
    },
    filterGroups: ['iddoc']
  },
  dataMonitoringFileOther: {
    gqlField: 'dataMonitoringFileOther',
    goField: 'DataMonitoringFileOther',
    dbField: 'data_monitoring_file_other',
    question: 'What types of responses?',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  dataResponseType: {
    gqlField: 'dataResponseType',
    goField: 'DataResponseType',
    dbField: 'data_response_type',
    question: 'What types of responses?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  dataResponseFileFrequency: {
    gqlField: 'dataResponseFileFrequency',
    goField: 'DataResponseFileFrequency',
    dbField: 'data_response_file_frequency',
    question: 'Frequency of files?',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  dataFullTimeOrIncremental: {
    gqlField: 'dataFullTimeOrIncremental',
    goField: 'DataFullTimeOrIncremental',
    dbField: 'data_full_time_or_incremental',
    question: 'Full time or incremental?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      FULL_TIME: 'Full time',
      INCREMENTAL: 'Incremental'
    },
    filterGroups: ['iddoc']
  },
  eftSetUp: {
    gqlField: 'eftSetUp',
    goField: 'EftSetUp',
    dbField: 'eft_set_up',
    question: 'Are Electronic File Transfer (EFT) and connectivity set up?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  unsolicitedAdjustmentsIncluded: {
    gqlField: 'unsolicitedAdjustmentsIncluded',
    goField: 'UnsolicitedAdjustmentsIncluded',
    dbField: 'unsolicited_adjustments_included',
    question: 'Will unsolicited adjustments be included?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc']
  },
  dataFlowDiagramsNeeded: {
    gqlField: 'dataFlowDiagramsNeeded',
    goField: 'DataFlowDiagramsNeeded',
    dbField: 'data_flow_diagrams_needed',
    question: 'Are data flow diagrams needed?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  produceBenefitEnhancementFiles: {
    gqlField: 'produceBenefitEnhancementFiles',
    goField: 'ProduceBenefitEnhancementFiles',
    dbField: 'produce_benefit_enhancement_files',
    question: 'Will you produce Benefit Enhancement Files?',
    hint:
      'This means we would use these files for Participating and Preferred Providers.',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc']
  },
  fileNamingConventions: {
    gqlField: 'fileNamingConventions',
    goField: 'FileNamingConventions',
    dbField: 'file_naming_conventions',
    question: 'File naming conventions',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  dataMonitoringNote: {
    gqlField: 'dataMonitoringNote',
    goField: 'DataMonitoringNote',
    dbField: 'data_monitoring_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  benchmarkForPerformance: {
    gqlField: 'benchmarkForPerformance',
    goField: 'BenchmarkForPerformance',
    dbField: 'benchmark_for_performance',
    question: 'Are data flow diagrams needed?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      YES_RECONCILE: 'Yes, and we will reconcile actual performance against it',
      YES_NO_RECONCILE:
        'Yes, but we will not reconcile actual performance against it',
      NO: 'No'
    },
    filterGroups: ['cmmi']
  },
  benchmarkForPerformanceNote: {
    gqlField: 'benchmarkForPerformanceNote',
    goField: 'BenchmarkForPerformanceNote',
    dbField: 'benchmark_for_performance_note',
    question: 'Are data flow diagrams needed?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  computePerformanceScores: {
    gqlField: 'computePerformanceScores',
    goField: 'ComputePerformanceScores',
    dbField: 'compute_performance_scores',
    question: 'Will you compute performance scores?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  computePerformanceScoresNote: {
    gqlField: 'computePerformanceScoresNote',
    goField: 'ComputePerformanceScoresNote',
    dbField: 'compute_performance_scores_note',
    question: 'Are data flow diagrams needed?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  riskAdjustPerformance: {
    gqlField: 'riskAdjustPerformance',
    goField: 'RiskAdjustPerformance',
    dbField: 'risk_adjust_performance',
    question: 'Performance Scores',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  riskAdjustFeedback: {
    gqlField: 'riskAdjustFeedback',
    goField: 'RiskAdjustFeedback',
    dbField: 'risk_adjust_feedback',
    question: 'Feedback Results',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  riskAdjustPayments: {
    gqlField: 'riskAdjustPayments',
    goField: 'RiskAdjustPayments',
    dbField: 'risk_adjust_payments',
    question: 'Payments',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  riskAdjustOther: {
    gqlField: 'riskAdjustOther',
    goField: 'RiskAdjustOther',
    dbField: 'risk_adjust_other',
    question: 'Others',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  riskAdjustNote: {
    gqlField: 'riskAdjustNote',
    goField: 'RiskAdjustNote',
    dbField: 'risk_adjust_note',
    question: 'Are data flow diagrams needed?',
    dataType: 'string',
    formType: 'textarea'
  },
  appealPerformance: {
    gqlField: 'appealPerformance',
    goField: 'AppealPerformance',
    dbField: 'appeal_performance',
    question: 'Performance Scores',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  appealFeedback: {
    gqlField: 'appealFeedback',
    goField: 'AppealFeedback',
    dbField: 'appeal_feedback',
    question: 'Feedback Results',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  appealPayments: {
    gqlField: 'appealPayments',
    goField: 'AppealPayments',
    dbField: 'appeal_payments',
    question: 'Payments',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  appealOther: {
    gqlField: 'appealOther',
    goField: 'AppealOther',
    dbField: 'appeal_other',
    question: 'Others',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  appealNote: {
    gqlField: 'appealNote',
    goField: 'AppealNote',
    dbField: 'appeal_note',
    question: 'Are data flow diagrams needed?',
    dataType: 'string',
    formType: 'textarea'
  },
  evaluationApproaches: {
    gqlField: 'evaluationApproaches',
    goField: 'eEvaluationApproaches',
    dbField: 'evaluation_approaches',
    question:
      'What type of evaluation approach are you considering? Select all that apply.',
    readonlyQuestion: 'What type of evaluation approach are you considering?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      COMPARISON_MATCH: 'Identify a comparison/match group',
      CONTROL_INTERVENTION: 'Establish control and intervention groups',
      INTERRUPTED_TIME: 'Interrupted time series',
      NON_MEDICARE_DATA:
        'Leverage non-Medicare data (such as Medicaid data, external data sets)',
      OTHER: 'Other'
    }
  },
  evaluationApproachOther: {
    gqlField: 'evaluationApproachOther',
    goField: 'EvaluationApproachOther',
    dbField: 'evaluation_approach_other',
    question:
      'Please describe the other evaluation approach you are considering.',
    dataType: 'string',
    formType: 'textarea'
  },
  evalutaionApproachNote: {
    gqlField: 'evalutaionApproachNote',
    goField: 'EvalutaionApproachNote',
    dbField: 'evalutaion_approach_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  ccmInvolvment: {
    gqlField: 'ccmInvolvment',
    goField: 'CcmInvolvment',
    dbField: 'ccm_involvment',
    question: 'Is Chronic Conditions Warehouse (CCW) involved in the model?',
    hint:
      'If you select either yes option, there will be additional questions to answer.',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      YES_EVALUATION: 'Yes, for evaluation',
      YES__IMPLEMENTATION: 'Yes, for implementation',
      NO: 'No',
      OTHER: 'Other'
    }
  },
  ccmInvolvmentOther: {
    gqlField: 'ccmInvolvmentOther',
    goField: 'CcmInvolvmentOther',
    dbField: 'ccm_involvment_other',
    question: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  ccmInvolvmentNote: {
    gqlField: 'ccmInvolvmentNote',
    goField: 'CcmInvolvmentNote',
    dbField: 'ccm_involvment_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  dataNeededForMonitoring: {
    gqlField: 'dataNeededForMonitoring',
    goField: 'DataNeededForMonitoring',
    dbField: 'data_needed_for_monitoring',
    question:
      'What data do you need to monitor the model? Select all that apply.',
    readonlyQuestion: 'What data do you need to monitor the model?',
    hint:
      'If you select quality claims-based measures or quality reported measures, there will be additional questions to answer.',
    dataType: 'enum',
    formType: 'multiSelect',
    options: {
      SITE_VISITS: 'Site visits',
      MEDICARE_CLAIMS: 'Medicare claims',
      MEDICAID_CLAIMS: 'Medicaid claims',
      ENCOUNTER_DATA: 'Encounter data',
      NO_PAY_CLAIMS: 'No pay claims',
      QUALITY_CLAIMS_BASED_MEASURES: 'Quality claims-based measures',
      QUALITY_REPORTED_MEASURES: 'Quality reported measures',
      CLINICAL_DATA: 'Clinical data',
      NON_CLINICAL_DATA: 'Non-clinical data (e.g., surveys)',
      NON_MEDICAL_DATA: 'Non-medical data (e.g., housing, nutrition)',
      OTHER: 'Other',
      NOT_PLANNING_TO_COLLECT_DATA: 'Not planning to collect data'
    }
  },
  dataNeededForMonitoringOther: {
    gqlField: 'dataNeededForMonitoringOther',
    goField: 'DataNeededForMonitoringOther',
    dbField: 'data_needed_for_monitoring_other',
    question: 'What other data do you need to monitor?',
    dataType: 'string',
    formType: 'textarea'
  },
  dataNeededForMonitoringNote: {
    gqlField: 'dataNeededForMonitoringNote',
    goField: 'DataNeededForMonitoringNote',
    dbField: 'data_needed_for_monitoring_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  dataToSendParticicipants: {
    gqlField: 'dataToSendParticicipants',
    goField: 'DataToSendParticicipants',
    dbField: 'data_to_send_particicipants',
    question: 'What data will you send to participants? Select all that apply.',
    readonlyQuestion: 'What data will you send to participants?',
    dataType: 'enum',
    formType: 'multiSelect',
    options: {
      BASELINE_HISTORICAL_DATA: 'Baseline/historical data',
      CLAIMS_LEVEL_DATA: 'Claims-level data',
      BENEFICIARY_LEVEL_DATA: 'Beneficiary-level data',
      PARTICIPANT_LEVEL_DATA: 'Participant-level data',
      PROVIDER_LEVEL_DATA: 'Provider-level data',
      OTHER_MIPS_DATA: 'Other',
      NOT_PLANNING_TO_SEND_DATA: 'Not planning to send data'
    }
  },
  dataToSendParticicipantsOther: {
    gqlField: 'dataToSendParticicipantsOther',
    goField: 'DataToSendParticicipantsOther',
    dbField: 'data_to_send_particicipants_other',
    question: 'What other data do you need to send?',
    dataType: 'string',
    formType: 'textarea'
  },
  dataToSendParticicipantsNote: {
    gqlField: 'dataToSendParticicipantsNote',
    goField: 'DataToSendParticicipantsNote',
    dbField: 'data_to_send_particicipants_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  shareCclfData: {
    gqlField: 'shareCclfData',
    goField: 'ShareCclfData',
    dbField: 'share_cclf_data',
    question:
      'Does the model require that identifiable Claim and Claim Line Feed (CCLFs) data need to be shared with participants?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  shareCclfDataNote: {
    gqlField: 'shareCclfDataNote',
    goField: 'ShareCclfDataNote',
    dbField: 'share_cclf_data_note',
    question: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  }
};

export const opsEvalAndLearningMisc = {
  heading: 'Operations, evaluation, and learning',
  operationsEvaluationAndLearningHeading:
    'Review operations, evaluation, and learning',
  breadcrumb: 'Operations, evaluation, and learning',
  additionalQuestionsInfo:
    'If you select yes, there will be additional questions to answer.',
  iddocHeading: 'IDDOC operations questions',
  icdHeading: 'Interface Control Document (ICD) questions',
  icdSubheading:
    'An interface control document provides a record of all interface information generated for a project.',
  testingQuestions: 'Testing questions',
  ssmRequest:
    'SSM request to begin analysis at least 1 year before implementation',
  dataMonitoring: 'Data monitoring questions',
  dataMonitoringContinued: 'Data monitoring questions continued',
  participantAppeal: 'Will participants be able to appeal the following?',
  riskAdjustments: 'Will you make risk adjustments to the following?',
  appealsWarning:
    'If yes to any of the following, please check with the Legal Vertical on what needs to be in a Participation Agreement and/or regulatory text around your model’s appeal process steps and time frames.'
};

export default opsEvalAndLearning;
