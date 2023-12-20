import { TranslationOpsEvalAndLearning } from 'types/translation';

export const opsEvalAndLearning: TranslationOpsEvalAndLearning = {
  agencyOrStateHelp: {
    gqlField: 'agencyOrStateHelp',
    goField: 'AgencyOrStateHelp',
    dbField: 'agency_or_state_help',
    label:
      'Will another Agency or State help design/operate the model? Select all that apply.',
    readonlyLabel:
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
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  agencyOrStateHelpNote: {
    gqlField: 'agencyOrStateHelpNote',
    goField: 'AgencyOrStateHelpNote',
    dbField: 'agency_or_state_help_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  stakeholders: {
    gqlField: 'stakeholders',
    goField: 'Stakeholders',
    dbField: 'stakeholders',
    label: 'What stakeholders do you plan to communicate with?',
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
    label:
      'Please describe the other stakeholders you plan to communicate with.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  stakeholdersNote: {
    gqlField: 'stakeholdersNote',
    goField: 'StakeholdersNote',
    dbField: 'stakeholders_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  helpdeskUse: {
    gqlField: 'helpdeskUse',
    goField: 'HelpdeskUse',
    dbField: 'stakeholders_note',
    label: 'Do you plan to use a helpdesk?',
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc']
  },
  contractorSupport: {
    gqlField: 'contractorSupport',
    goField: 'ContractorSupport',
    dbField: 'contractor_support',
    label: 'What contractors will support your model?',
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
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportHow: {
    gqlField: 'contractorSupportHow',
    goField: 'ContractorSupportHow',
    dbField: 'contractor_support_how',
    label: 'In what capacity will they support your model?',
    sublabel: '(implementation, data analysis, quality, etc.)',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  contractorSupportNote: {
    gqlField: 'contractorSupportNote',
    goField: 'ContractorSupportNote',
    dbField: 'contractor_support_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cbosc', 'iddoc']
  },
  iddocSupport: {
    gqlField: 'iddocSupport',
    goField: 'IddocSupport',
    dbField: 'iddoc_support',
    label: 'Are you planning to use IDDOC support?',
    sublabel:
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  technicalContactsIdentified: {
    gqlField: 'technicalContactsIdentified',
    goField: 'TechnicalContactsIdentified',
    dbField: 'technical_contacts_identified',
    label: 'Are technical contacts identified?',
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
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  technicalContactsIdentifiedNote: {
    gqlField: 'technicalContactsIdentifiedNote',
    goField: 'TechnicalContactsIdentifiedNote',
    dbField: 'technical_contacts_identified_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  captureParticipantInfo: {
    gqlField: 'captureParticipantInfo',
    goField: 'CaptureParticipantInfo',
    dbField: 'capture_participant_info',
    label: 'Will you collect participant information?',
    sublabel:
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  icdOwner: {
    gqlField: 'icdOwner',
    goField: 'IcdOwner',
    dbField: 'icd_owner',
    label: 'ICD owner',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  draftIcdDueDate: {
    gqlField: 'draftIcdDueDate',
    goField: 'DraftIcdDueDate',
    dbField: 'draft_icd_due_date',
    label: 'Draft ICD required by',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['iddoc']
  },
  icdNote: {
    gqlField: 'icdNote',
    goField: 'IcdNote',
    dbField: 'icd_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  uatNeeds: {
    gqlField: 'uatNeeds',
    goField: 'UatNeeds',
    dbField: 'uat_needs',
    label: 'User Acceptance Testing (UAT) – test data needs',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  stcNeeds: {
    gqlField: 'stcNeeds',
    goField: 'StcNeeds',
    dbField: 'stc_needs',
    label: 'STC – test data needs',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  testingTimelines: {
    gqlField: 'testingTimelines',
    goField: 'TestingTimelines',
    dbField: 'testing_timelines',
    label: 'Define the testing timelines',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  testingNote: {
    gqlField: 'testingNote',
    goField: 'TestingNote',
    dbField: 'testing_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  dataMonitoringFileTypes: {
    gqlField: 'dataMonitoringFileTypes',
    goField: 'DataMonitoringFileTypes',
    dbField: 'data_monitoring_file_types',
    label: 'What types of files? Select all that apply.',
    readonlyLabel: 'What types of files?',
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
    label: 'What types of responses?',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  dataResponseType: {
    gqlField: 'dataResponseType',
    goField: 'DataResponseType',
    dbField: 'data_response_type',
    label: 'What types of responses?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  dataResponseFileFrequency: {
    gqlField: 'dataResponseFileFrequency',
    goField: 'DataResponseFileFrequency',
    dbField: 'data_response_file_frequency',
    label: 'Frequency of files?',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  dataFullTimeOrIncremental: {
    gqlField: 'dataFullTimeOrIncremental',
    goField: 'DataFullTimeOrIncremental',
    dbField: 'data_full_time_or_incremental',
    label: 'Full time or incremental?',
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
    label: 'Are Electronic File Transfer (EFT) and connectivity set up?',
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
    label: 'Will unsolicited adjustments be included?',
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
    label: 'Are data flow diagrams needed?',
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
    label: 'Will you produce Benefit Enhancement Files?',
    sublabel:
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
    label: 'File naming conventions',
    dataType: 'string',
    formType: 'text',
    filterGroups: ['iddoc']
  },
  dataMonitoringNote: {
    gqlField: 'dataMonitoringNote',
    goField: 'DataMonitoringNote',
    dbField: 'data_monitoring_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  benchmarkForPerformance: {
    gqlField: 'benchmarkForPerformance',
    goField: 'BenchmarkForPerformance',
    dbField: 'benchmark_for_performance',
    label: 'Will you establish a benchmark to capture performance?',
    dataType: 'enum',
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  computePerformanceScores: {
    gqlField: 'computePerformanceScores',
    goField: 'ComputePerformanceScores',
    dbField: 'compute_performance_scores',
    label: 'Will you compute performance scores?',
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  riskAdjustPerformance: {
    gqlField: 'riskAdjustPerformance',
    goField: 'RiskAdjustPerformance',
    dbField: 'risk_adjust_performance',
    label: 'Performance Scores',
    readonlyLabel: 'Will you make risk adjustments to performance scores?',
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
    label: 'Feedback Results',
    readonlyLabel: 'Will you make risk adjustments to feedback results?',
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
    label: 'Payments',
    readonlyLabel: 'Will you make risk adjustments to payments?',
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
    label: 'Others',
    readonlyLabel: 'Will you make risk adjustments to others?',
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  appealPerformance: {
    gqlField: 'appealPerformance',
    goField: 'AppealPerformance',
    dbField: 'appeal_performance',
    label: 'Performance Scores',
    readonlyLabel: 'Will participants be able to appeal performance scores?',
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
    label: 'Feedback Results',
    readonlyLabel: 'Will participants be able to appeal feedback results?',
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
    label: 'Payments',
    readonlyLabel: 'Will participants be able to appeal payments?',
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
    label: 'Others',
    readonlyLabel: 'Will participants be able to appeal others?',
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
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  evaluationApproaches: {
    gqlField: 'evaluationApproaches',
    goField: 'eEvaluationApproaches',
    dbField: 'evaluation_approaches',
    label:
      'What type of evaluation approach are you considering? Select all that apply.',
    readonlyLabel: 'What type of evaluation approach are you considering?',
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
    label: 'Please describe the other evaluation approach you are considering.',
    dataType: 'string',
    formType: 'textarea'
  },
  evalutaionApproachNote: {
    gqlField: 'evalutaionApproachNote',
    goField: 'EvalutaionApproachNote',
    dbField: 'evalutaion_approach_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  ccmInvolvment: {
    gqlField: 'ccmInvolvment',
    goField: 'CcmInvolvment',
    dbField: 'ccm_involvment',
    label: 'Is Chronic Conditions Warehouse (CCW) involved in the model?',
    sublabel:
      'If you select either yes option, there will be additional questions to answer.',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      YES_EVALUATION: 'Yes, for evaluation',
      YES__IMPLEMENTATION: 'Yes, for implementation',
      NO: 'No',
      OTHER: 'Other'
    },
    filterGroups: ['ccw']
  },
  ccmInvolvmentOther: {
    gqlField: 'ccmInvolvmentOther',
    goField: 'CcmInvolvmentOther',
    dbField: 'ccm_involvment_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ccw']
  },
  ccmInvolvmentNote: {
    gqlField: 'ccmInvolvmentNote',
    goField: 'CcmInvolvmentNote',
    dbField: 'ccm_involvment_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ccw']
  },
  dataNeededForMonitoring: {
    gqlField: 'dataNeededForMonitoring',
    goField: 'DataNeededForMonitoring',
    dbField: 'data_needed_for_monitoring',
    label: 'What data do you need to monitor the model? Select all that apply.',
    readonlyLabel: 'What data do you need to monitor the model?',
    sublabel:
      'If you select quality claims-based measures or quality reported measures, there will be additional questions to answer.',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Selected data',
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
    },
    filterGroups: ['cmmi', 'iddoc']
  },
  dataNeededForMonitoringOther: {
    gqlField: 'dataNeededForMonitoringOther',
    goField: 'DataNeededForMonitoringOther',
    dbField: 'data_needed_for_monitoring_other',
    label: 'What other data do you need to monitor?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'iddoc']
  },
  dataNeededForMonitoringNote: {
    gqlField: 'dataNeededForMonitoringNote',
    goField: 'DataNeededForMonitoringNote',
    dbField: 'data_needed_for_monitoring_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'iddoc']
  },
  dataToSendParticicipants: {
    gqlField: 'dataToSendParticicipants',
    goField: 'DataToSendParticicipants',
    dbField: 'data_to_send_particicipants',
    label: 'What data will you send to participants? Select all that apply.',
    readonlyLabel: 'What data will you send to participants?',
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
    },
    filterGroups: ['cmmi']
  },
  dataToSendParticicipantsOther: {
    gqlField: 'dataToSendParticicipantsOther',
    goField: 'DataToSendParticicipantsOther',
    dbField: 'data_to_send_particicipants_other',
    label: 'What other data do you need to send?',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  dataToSendParticicipantsNote: {
    gqlField: 'dataToSendParticicipantsNote',
    goField: 'DataToSendParticicipantsNote',
    dbField: 'data_to_send_particicipants_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  shareCclfData: {
    gqlField: 'shareCclfData',
    goField: 'ShareCclfData',
    dbField: 'share_cclf_data',
    label:
      'Does the model require that identifiable Claim and Claim Line Feed (CCLFs) data need to be shared with participants?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  shareCclfDataNote: {
    gqlField: 'shareCclfDataNote',
    goField: 'ShareCclfDataNote',
    dbField: 'share_cclf_data_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  sendFilesBetweenCcw: {
    gqlField: 'sendFilesBetweenCcw',
    goField: 'SendFilesBetweenCcw',
    dbField: 'send_files_between_ccw',
    label:
      'Will you need to send files between the CCW and other applications?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['ccw']
  },
  sendFilesBetweenCcwNote: {
    gqlField: 'sendFilesBetweenCcwNote',
    goField: 'SendFilesBetweenCcwNote',
    dbField: 'send_files_between_ccw_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ccw']
  },
  appToSendFilesToKnown: {
    gqlField: 'appToSendFilesToKnown',
    goField: 'AppToSendFilesToKnown',
    dbField: 'app_to_send_files_to_known',
    label:
      'Do you know which applications will be on the other sides of the file transfers?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['ccw']
  },
  appToSendFilesToWhich: {
    gqlField: 'appToSendFilesToWhich',
    goField: 'AppToSendFilesToWhich',
    dbField: 'app_to_send_files_to_which',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ccw']
  },
  appToSendFilesToNote: {
    gqlField: 'appToSendFilesToNote',
    goField: 'AppToSendFilesToNote',
    dbField: 'app_to_send_files_to_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ccw']
  },
  useCcwForFileDistribiutionToParticipants: {
    gqlField: 'useCcwForFileDistribiutionToParticipants',
    goField: 'UseCcwForFileDistribiutionToParticipants',
    dbField: 'use_ccw_for_file_distribiution_to_participants',
    label:
      'Will you use the CCW to distribute files to and from model participants?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['ccw']
  },
  useCcwForFileDistribiutionToParticipantsNote: {
    gqlField: 'useCcwForFileDistribiutionToParticipantsNote',
    goField: 'UseCcwForFileDistribiutionToParticipantsNote',
    dbField: 'use_ccw_for_file_distribiution_to_participants_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['ccw']
  },
  developNewQualityMeasures: {
    gqlField: 'developNewQualityMeasures',
    goField: 'DevelopNewQualityMeasures',
    dbField: 'develop_new_quality_measures',
    label:
      'Do you plan to develop a new validated quality measure for your model?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  developNewQualityMeasuresNote: {
    gqlField: 'developNewQualityMeasuresNote',
    goField: 'DevelopNewQualityMeasuresNote',
    dbField: 'develop_new_quality_measures_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  qualityPerformanceImpactsPayment: {
    gqlField: 'qualityPerformanceImpactsPayment',
    goField: 'QualityPerformanceImpactsPayment',
    dbField: 'quality_performance_impacts_payment',
    label: 'Does quality performance impact payment?',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['cmmi']
  },
  qualityPerformanceImpactsPaymentNote: {
    gqlField: 'qualityPerformanceImpactsPaymentNote',
    goField: 'QualityPerformanceImpactsPaymentNote',
    dbField: 'quality_performance_impacts_payment_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  dataSharingStarts: {
    gqlField: 'dataSharingStarts',
    goField: 'DataSharingStarts',
    dbField: 'data_sharing_starts',
    label: 'Data sharing starts',
    sublabel:
      'If using ACO-OS support, SSM request to begin analysis at least 1 year before implementation',
    dataType: 'enum',
    formType: 'select',
    options: {
      DURING_APPLICATION_PERIOD: 'During application period',
      SHORTLY_BEFORE_THE_START_DATE: 'Shortly before the start date',
      EARLY_IN_THE_FIRST_PERFORMANCE_YEAR:
        'Early in the first performance year',
      LATER_IN_THE_FIRST_PERFORMANCE_YEAR:
        'Later in the first performance year',
      IN_THE_SUBSEQUENT_PERFORMANCE_YEAR: 'In the subsequent performance year',
      AT_SOME_OTHER_POINT_IN_TIME: 'At some other point in time',
      NOT_PLANNING_TO_DO_THIS: 'Not planning to do this',
      OTHER: 'Other'
    },
    filterGroups: ['iddoc']
  },
  dataSharingStartsOther: {
    gqlField: 'dataSharingStartsOther',
    goField: 'DataSharingStartsOther',
    dbField: 'data_sharing_starts_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  dataSharingFrequency: {
    gqlField: 'dataSharingFrequency',
    goField: 'DataSharingFrequency',
    dbField: 'data_sharing_frequency',
    label: 'How often do you anticipate sharing data?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Data sharing frequency',
    options: {
      ANNUALLY: 'Annually',
      BIANNUALLY: 'Biannually',
      QUARTERLY: 'Quarterly',
      MONTHLY: 'Monthly',
      SEMI_MONTHLY: 'Semi-monthly',
      WEEKLY: 'Weekly',
      DAILY: 'Daily',
      OTHER: 'Other',
      NOT_PLANNING_TO_DO_THIS: 'Not planning to do this'
    },
    filterGroups: ['cmmi', 'iddoc']
  },
  dataSharingFrequencyOther: {
    gqlField: 'dataSharingFrequencyOther',
    goField: 'DataSharingFrequencyOther',
    dbField: 'data_sharing_frequency_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'iddoc']
  },
  dataSharingStartsNote: {
    gqlField: 'dataSharingStartsNote',
    goField: 'DataSharingStartsNote',
    dbField: 'data_sharing_starts_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi', 'iddoc']
  },
  dataCollectionStarts: {
    gqlField: 'dataCollectionStarts',
    goField: 'DataCollectionStarts',
    dbField: 'data_collection_starts',
    label: 'Data collection starts',
    dataType: 'enum',
    formType: 'select',
    options: {
      DURING_APPLICATION_PERIOD: 'During application period',
      SHORTLY_BEFORE_THE_START_DATE: 'Shortly before the start date',
      EARLY_IN_THE_FIRST_PERFORMANCE_YEAR:
        'Early in the first performance year',
      LATER_IN_THE_FIRST_PERFORMANCE_YEAR:
        'Later in the first performance year',
      IN_THE_SUBSEQUENT_PERFORMANCE_YEAR: 'In the subsequent performance year',
      AT_SOME_OTHER_POINT_IN_TIME: 'At some other point in time',
      NOT_PLANNING_TO_DO_THIS: 'Not planning to do this',
      OTHER: 'Other'
    },
    filterGroups: ['iddoc']
  },
  dataCollectionStartsOther: {
    gqlField: 'dataCollectionStartsOther',
    goField: 'DataCollectionStartsOther',
    dbField: 'data_collection_starts_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc']
  },
  dataCollectionFrequency: {
    gqlField: 'dataCollectionFrequency',
    goField: 'DataCollectionFrequency',
    dbField: 'data_collection_frequency',
    label: 'How often do you anticipate collecting data?',
    dataType: 'enum',
    formType: 'multiSelect',
    multiSelectLabel: 'Data collection frequency',
    options: {
      ANNUALLY: 'Annually',
      BIANNUALLY: 'Biannually',
      QUARTERLY: 'Quarterly',
      MONTHLY: 'Monthly',
      SEMI_MONTHLY: 'Semi-monthly',
      WEEKLY: 'Weekly',
      DAILY: 'Daily',
      OTHER: 'Other',
      NOT_PLANNING_TO_DO_THIS: 'Not planning to do this'
    },
    filterGroups: ['cmmi']
  },
  dataCollectionFrequencyOther: {
    gqlField: 'dataCollectionFrequencyOther',
    goField: 'DataCollectionFrequencyOther',
    dbField: 'data_collection_frequency_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  dataCollectionFrequencyNote: {
    gqlField: 'dataCollectionFrequencyNote',
    goField: 'DataCollectionFrequencyNote',
    dbField: 'data_collection_frequency_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['cmmi']
  },
  qualityReportingStarts: {
    gqlField: 'qualityReportingStarts',
    goField: 'QualityReportingStarts',
    dbField: 'quality_reporting_starts',
    label: 'Quality reporting starts',
    dataType: 'enum',
    formType: 'select',
    options: {
      DURING_APPLICATION_PERIOD: 'During application period',
      SHORTLY_BEFORE_THE_START_DATE: 'Shortly before the start date',
      EARLY_IN_THE_FIRST_PERFORMANCE_YEAR:
        'Early in the first performance year',
      LATER_IN_THE_FIRST_PERFORMANCE_YEAR:
        'Later in the first performance year',
      IN_THE_SUBSEQUENT_PERFORMANCE_YEAR: 'In the subsequent performance year',
      AT_SOME_OTHER_POINT_IN_TIME: 'At some other point in time',
      NOT_PLANNING_TO_DO_THIS: 'Not planning to do this',
      OTHER: 'Other'
    }
  },
  qualityReportingStartsOther: {
    gqlField: 'qualityReportingStartsOther',
    goField: 'QualityReportingStartsOther',
    dbField: 'quality_reporting_starts_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  qualityReportingStartsNote: {
    gqlField: 'qualityReportingStartsNote',
    goField: 'QualityReportingStartsNote',
    dbField: 'quality_reporting_starts_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  modelLearningSystems: {
    gqlField: 'modelLearningSystems',
    goField: 'ModelLearningSystems',
    dbField: 'model_learning_systems',
    label: 'Will the model have a learning strategy?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      LEARNING_CONTRACTOR:
        'We plan to have a learning contractor (cross-model or individual)',
      IT_PLATFORM_CONNECT: 'We plan to use an IT platform (Connect)',
      PARTICIPANT_COLLABORATION:
        'We plan to enable participant-to-participant collaboration',
      EDUCATE_BENEFICIARIES: 'We plan to educate beneficiaries',
      OTHER: 'Other',
      NO_LEARNING_SYSTEM: 'No, we will not have a learning strategy'
    }
  },
  modelLearningSystemsOther: {
    gqlField: 'modelLearningSystemsOther',
    goField: 'ModelLearningSystemsOther',
    dbField: 'model_learning_systems_other',
    label: 'Please specify',
    dataType: 'string',
    formType: 'textarea'
  },
  modelLearningSystemsNote: {
    gqlField: 'modelLearningSystemsNote',
    goField: 'ModelLearningSystemsNote',
    dbField: 'model_learning_systems_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  anticipatedChallenges: {
    gqlField: 'anticipatedChallenges',
    goField: 'AnticipatedChallenges',
    dbField: 'anticipated_challenges',
    label:
      'What challenges do you anticipate during Model design and implementation?',
    sublabel:
      'Please list and known ’unknowns,’ that is, are there policy decisions that you are aware of that are still pending or are subject to change? If so, please list to the best of your ability.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['iddoc', 'pbg']
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    }
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
  iddocReadonlyHeading: 'IDDOC Operations',
  icdHeading: 'Interface Control Document (ICD) questions',
  icdReadonlyHeading: 'Interface Control Document (ICD)',
  icdSubheading:
    'An interface control document provides a record of all interface information generated for a project.',
  testingQuestions: 'Testing questions',
  ssmRequest:
    'SSM request to begin analysis at least 1 year before implementation',
  dataMonitoring: 'Data monitoring questions',
  dataMonitoringHeading: 'Data Monitoring',
  dataMonitoringContinued: 'Data monitoring questions continued',
  participantAppeal: 'Will participants be able to appeal the following?',
  riskAdjustments: 'Will you make risk adjustments to the following?',
  appealsWarning:
    'If yes to any of the following, please check with the Legal Vertical on what needs to be in a Participation Agreement and/or regulatory text around your model’s appeal process steps and time frames.',
  ccwSpecific: 'Chronic Conditions Warehouse (CCW) questions',
  ccwSpecificReadonly: 'Chronic Conditions Warehouse (CCW)',
  qualityQuestions: 'Quality questions',
  qualityReadonly: 'Quality',
  reportingTiming: 'Data sharing timing and frequency',
  dataCollectionTiming: 'Data collection timing and frequency',
  dataReadonly: 'Data Sharing, Collection, and Reporting Timing and Frequency',
  testing: 'Testing'
};

export default opsEvalAndLearning;
