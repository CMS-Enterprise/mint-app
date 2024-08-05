import { TranslationOpsEvalAndLearning } from 'types/translation';

import {
  ModelViewFilter,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

import { frequencyOptions } from './miscellaneous';

export const opsEvalAndLearning: TranslationOpsEvalAndLearning = {
  stakeholders: {
    gqlField: 'stakeholders',
    goField: 'Stakeholders',
    dbField: 'stakeholders',
    label: 'What stakeholders do you plan to communicate with?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 1.01,
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
    optionsRelatedInfo: {
      OTHER: 'stakeholdersOther'
    },
    filterGroups: [ModelViewFilter.CBOSC]
  },
  stakeholdersOther: {
    gqlField: 'stakeholdersOther',
    goField: 'StakeholdersOther',
    dbField: 'stakeholders_other',
    label:
      'Please describe the other stakeholders you plan to communicate with.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.02,
    isOtherType: true,
    filterGroups: [ModelViewFilter.CBOSC]
  },
  stakeholdersNote: {
    gqlField: 'stakeholdersNote',
    goField: 'StakeholdersNote',
    dbField: 'stakeholders_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'stakeholders',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.03,
    filterGroups: [ModelViewFilter.CBOSC]
  },
  helpdeskUse: {
    gqlField: 'helpdeskUse',
    goField: 'HelpdeskUse',
    dbField: 'helpdesk_use',
    label: 'Do you plan to use a helpdesk?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.04,
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  helpdeskUseNote: {
    gqlField: 'helpdeskUseNote',
    goField: 'HelpdeskUseNote',
    dbField: 'helpdesk_use_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'helpdeskUse',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.05,
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  contractorSupport: {
    gqlField: 'contractorSupport',
    goField: 'ContractorSupport',
    dbField: 'contractor_support',
    label: 'What contractors will support your model?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 1.06,
    options: {
      ONE: 'One contractor to support implementation',
      MULTIPLE:
        'May have separate contractors for different implementation functions',
      NONE: 'Do not plan to use an implemenation contractor',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'contractorSupportOther'
    },
    childRelation: {
      ONE: [() => opsEvalAndLearning.contractorSupportHow],
      MULTIPLE: [() => opsEvalAndLearning.contractorSupportHow],
      OTHER: [() => opsEvalAndLearning.contractorSupportHow]
    },
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  contractorSupportOther: {
    gqlField: 'contractorSupportOther',
    goField: 'ContractorSupportOther',
    dbField: 'contractor_support_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.07,
    isOtherType: true,
    otherParentField: 'contractorSupport',
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  contractorSupportHow: {
    gqlField: 'contractorSupportHow',
    goField: 'ContractorSupportHow',
    dbField: 'contractor_support_how',
    label: 'In what capacity will they support your model?',
    sublabel: '(implementation, data analysis, quality, etc.)',
    questionTooltip: '(implementation, data analysis, quality, etc.)',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.08,
    parentRelation: () => opsEvalAndLearning.contractorSupport,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  contractorSupportNote: {
    gqlField: 'contractorSupportNote',
    goField: 'ContractorSupportNote',
    dbField: 'contractor_support_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'contractorSupport',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.09,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  iddocSupport: {
    gqlField: 'iddocSupport',
    goField: 'IddocSupport',
    dbField: 'iddoc_support',
    label: 'Are you planning to use IDDOC support?',
    sublabel:
      'IDDOC is commonly known as ACO-OS (Accountable Care Organization Operating System). They can provide support for design, development, operations, and maintenance.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.1,
    isPageStart: true,
    readonlyHeader: 'IDDOC operations',
    options: {
      true: 'Yes',
      false: 'No'
    },
    childRelation: {
      true: [
        () => opsEvalAndLearning.technicalContactsIdentified,
        () => opsEvalAndLearning.captureParticipantInfo,
        () => opsEvalAndLearning.icdOwner,
        () => opsEvalAndLearning.draftIcdDueDate,
        () => opsEvalAndLearning.uatNeeds,
        () => opsEvalAndLearning.stcNeeds,
        () => opsEvalAndLearning.testingTimelines,
        () => opsEvalAndLearning.dataMonitoringFileTypes,
        () => opsEvalAndLearning.dataResponseType,
        () => opsEvalAndLearning.dataResponseFileFrequency,
        () => opsEvalAndLearning.dataFullTimeOrIncremental,
        () => opsEvalAndLearning.eftSetUp,
        () => opsEvalAndLearning.unsolicitedAdjustmentsIncluded,
        () => opsEvalAndLearning.dataFlowDiagramsNeeded,
        () => opsEvalAndLearning.produceBenefitEnhancementFiles,
        () => opsEvalAndLearning.fileNamingConventions
      ]
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.IPC]
  },
  iddocSupportNote: {
    gqlField: 'iddocSupportNote',
    goField: 'IddocSupportNote',
    dbField: 'iddoc_support_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'iddocSupport',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.11,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.IPC]
  },
  technicalContactsIdentified: {
    gqlField: 'technicalContactsIdentified',
    goField: 'TechnicalContactsIdentified',
    dbField: 'technical_contacts_identified',
    label: 'Are technical contacts identified?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.01,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'technicalContactsIdentifiedDetail'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  technicalContactsIdentifiedDetail: {
    gqlField: 'technicalContactsIdentifiedDetail',
    goField: 'TechnicalContactsIdentifiedDetail',
    dbField: 'technical_contacts_identified_detail',
    label: 'Please specify',
    exportLabel: 'Please specify yes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.02,
    isOtherType: true,
    otherParentField: 'technicalContactsIdentified',
    filterGroups: [ModelViewFilter.IDDOC]
  },
  technicalContactsIdentifiedNote: {
    gqlField: 'technicalContactsIdentifiedNote',
    goField: 'TechnicalContactsIdentifiedNote',
    dbField: 'technical_contacts_identified_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'technicalContactsIdentified',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.03,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  captureParticipantInfo: {
    gqlField: 'captureParticipantInfo',
    goField: 'CaptureParticipantInfo',
    dbField: 'capture_participant_info',
    label: 'Will you collect participant information?',
    sublabel:
      'This means the participant record for a model would be included in the ACO-OS Entity File.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.04,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  captureParticipantInfoNote: {
    gqlField: 'captureParticipantInfoNote',
    goField: 'CaptureParticipantInfoNote',
    dbField: 'capture_participant_info_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'captureParticipantInfo',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.05,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  icdOwner: {
    gqlField: 'icdOwner',
    goField: 'IcdOwner',
    dbField: 'icd_owner',
    label: 'ICD owner',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 2.06,
    isPageStart: true,
    readonlyHeader: 'Interface Control Document (ICD)',
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  draftIcdDueDate: {
    gqlField: 'draftIcdDueDate',
    goField: 'DraftIcdDueDate',
    dbField: 'draft_icd_due_date',
    label: 'Draft ICD required by',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 2.07,
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  icdNote: {
    gqlField: 'icdNote',
    goField: 'IcdNote',
    dbField: 'icd_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Interface Control Document (ICD) questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.08,
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  uatNeeds: {
    gqlField: 'uatNeeds',
    goField: 'UatNeeds',
    dbField: 'uat_needs',
    label: 'User Acceptance Testing (UAT) – test data needs',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.01,
    isPageStart: true,
    readonlyHeader: 'Testing',
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  stcNeeds: {
    gqlField: 'stcNeeds',
    goField: 'StcNeeds',
    dbField: 'stc_needs',
    label: 'STC – test data needs',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.02,
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  testingTimelines: {
    gqlField: 'testingTimelines',
    goField: 'TestingTimelines',
    dbField: 'testing_timelines',
    label: 'Define the testing timelines',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.03,
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  testingNote: {
    gqlField: 'testingNote',
    goField: 'TestingNote',
    dbField: 'testing_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Testing questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.04,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataMonitoringFileTypes: {
    gqlField: 'dataMonitoringFileTypes',
    goField: 'DataMonitoringFileTypes',
    dbField: 'data_monitoring_file_types',
    label: 'What types of files? Select all that apply.',
    readonlyLabel: 'What types of files?',
    exportLabel: 'What types of files?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 3.05,
    isPageStart: true,
    readonlyHeader: 'Data monitoring',
    options: {
      BENEFICIARY: 'Beneficiary',
      PROVIDER: 'Provider',
      PART_A: 'Part A',
      PART_B: 'Part B',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'dataMonitoringFileOther'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataMonitoringFileOther: {
    gqlField: 'dataMonitoringFileOther',
    goField: 'DataMonitoringFileOther',
    dbField: 'data_monitoring_file_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.06,
    isOtherType: true,
    otherParentField: 'dataMonitoringFileTypes',
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataResponseType: {
    gqlField: 'dataResponseType',
    goField: 'DataResponseType',
    dbField: 'data_response_type',
    label: 'What types of responses?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.07,
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataResponseFileFrequency: {
    gqlField: 'dataResponseFileFrequency',
    goField: 'DataResponseFileFrequency',
    dbField: 'data_response_file_frequency',
    label: 'Frequency of files?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.08,
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataFullTimeOrIncremental: {
    gqlField: 'dataFullTimeOrIncremental',
    goField: 'DataFullTimeOrIncremental',
    dbField: 'data_full_time_or_incremental',
    label: 'Full time or incremental?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.01,
    options: {
      FULL_TIME: 'Full time',
      INCREMENTAL: 'Incremental'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  eftSetUp: {
    gqlField: 'eftSetUp',
    goField: 'EftSetUp',
    dbField: 'eft_set_up',
    label: 'Are Electronic File Transfer (EFT) and connectivity set up?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.02,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  unsolicitedAdjustmentsIncluded: {
    gqlField: 'unsolicitedAdjustmentsIncluded',
    goField: 'UnsolicitedAdjustmentsIncluded',
    dbField: 'unsolicited_adjustments_included',
    label: 'Will unsolicited adjustments be included?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.03,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataFlowDiagramsNeeded: {
    gqlField: 'dataFlowDiagramsNeeded',
    goField: 'DataFlowDiagramsNeeded',
    dbField: 'data_flow_diagrams_needed',
    label: 'Are data flow diagrams needed?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.04,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  produceBenefitEnhancementFiles: {
    gqlField: 'produceBenefitEnhancementFiles',
    goField: 'ProduceBenefitEnhancementFiles',
    dbField: 'produce_benefit_enhancement_files',
    label: 'Will you produce Benefit Enhancement Files?',
    sublabel:
      'This means we would use these files for Participating and Preferred Providers.',
    questionTooltip:
      'This means we would use these files for Participating and Preferred Providers.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 4.05,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  fileNamingConventions: {
    gqlField: 'fileNamingConventions',
    goField: 'FileNamingConventions',
    dbField: 'file_naming_conventions',
    label: 'File naming conventions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 4.06,
    parentRelation: () => opsEvalAndLearning.iddocSupport,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataMonitoringNote: {
    gqlField: 'dataMonitoringNote',
    goField: 'DataMonitoringNote',
    dbField: 'data_monitoring_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Data monitoring questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 4.07,
    filterGroups: [ModelViewFilter.IDDOC]
  },
  benchmarkForPerformance: {
    gqlField: 'benchmarkForPerformance',
    goField: 'BenchmarkForPerformance',
    dbField: 'benchmark_for_performance',
    label: 'Will you establish a benchmark to capture performance?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 5.01,
    isPageStart: true,
    options: {
      YES_RECONCILE: 'Yes, and we will reconcile actual performance against it',
      YES_NO_RECONCILE:
        'Yes, but we will not reconcile actual performance against it',
      NO: 'No'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  benchmarkForPerformanceNote: {
    gqlField: 'benchmarkForPerformanceNote',
    goField: 'BenchmarkForPerformanceNote',
    dbField: 'benchmark_for_performance_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'benchmarkForPerformance',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.02,
    filterGroups: [ModelViewFilter.CMMI]
  },
  computePerformanceScores: {
    gqlField: 'computePerformanceScores',
    goField: 'ComputePerformanceScores',
    dbField: 'compute_performance_scores',
    label: 'Will you compute performance scores?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.03,
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  computePerformanceScoresNote: {
    gqlField: 'computePerformanceScoresNote',
    goField: 'ComputePerformanceScoresNote',
    dbField: 'compute_performance_scores_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'computePerformanceScores',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.04,
    filterGroups: [ModelViewFilter.CMMI]
  },
  riskAdjustPerformance: {
    gqlField: 'riskAdjustPerformance',
    goField: 'RiskAdjustPerformance',
    dbField: 'risk_adjust_performance',
    label: 'Performance Scores',
    readonlyLabel: 'Will you make risk adjustments to performance scores?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.05,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'riskAdjustFeedback'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  riskAdjustFeedback: {
    gqlField: 'riskAdjustFeedback',
    goField: 'RiskAdjustFeedback',
    dbField: 'risk_adjust_feedback',
    label: 'Feedback Results',
    readonlyLabel: 'Will you make risk adjustments to feedback results?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.06,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'riskAdjustPerformance'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  riskAdjustPayments: {
    gqlField: 'riskAdjustPayments',
    goField: 'RiskAdjustPayments',
    dbField: 'risk_adjust_payments',
    label: 'Payments',
    readonlyLabel: 'Will you make risk adjustments to payments?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.07,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'riskAdjustOther'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  riskAdjustOther: {
    gqlField: 'riskAdjustOther',
    goField: 'RiskAdjustOther',
    dbField: 'risk_adjust_other',
    label: 'Others',
    readonlyLabel: 'Will you make risk adjustments to others?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.08,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'riskAdjustPayments'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  riskAdjustNote: {
    gqlField: 'riskAdjustNote',
    goField: 'RiskAdjustNote',
    dbField: 'risk_adjust_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Risk adjustment questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.09
  },
  appealPerformance: {
    gqlField: 'appealPerformance',
    goField: 'AppealPerformance',
    dbField: 'appeal_performance',
    label: 'Performance Scores',
    readonlyLabel: 'Will participants be able to appeal performance scores?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.1,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'appealFeedback'
    }
  },
  appealFeedback: {
    gqlField: 'appealFeedback',
    goField: 'AppealFeedback',
    dbField: 'appeal_feedback',
    label: 'Feedback Results',
    readonlyLabel: 'Will participants be able to appeal feedback results?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.11,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'appealPerformance'
    }
  },
  appealPayments: {
    gqlField: 'appealPayments',
    goField: 'AppealPayments',
    dbField: 'appeal_payments',
    label: 'Payments',
    readonlyLabel: 'Will participants be able to appeal payments?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.12,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'appealOther'
    }
  },
  appealOther: {
    gqlField: 'appealOther',
    goField: 'AppealOther',
    dbField: 'appeal_other',
    label: 'Others',
    readonlyLabel: 'Will participants be able to appeal others?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 5.13,
    options: {
      true: 'Yes',
      false: 'No'
    },
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'appealPayments'
    }
  },
  appealNote: {
    gqlField: 'appealNote',
    goField: 'AppealNote',
    dbField: 'appeal_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Participant appeal questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 5.14
  },
  evaluationApproaches: {
    gqlField: 'evaluationApproaches',
    goField: 'eEvaluationApproaches',
    dbField: 'evaluation_approaches',
    label:
      'What type of evaluation approach are you considering? Select all that apply.',
    readonlyLabel: 'What type of evaluation approach are you considering?',
    exportLabel: 'What type of evaluation approach are you considering?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 6.01,
    isPageStart: true,
    options: {
      COMPARISON_MATCH: 'Identify a comparison/match group',
      CONTROL_INTERVENTION: 'Establish control and intervention groups',
      INTERRUPTED_TIME: 'Interrupted time series',
      NON_MEDICARE_DATA:
        'Leverage non-Medicare data (such as Medicaid data, external data sets)',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'evaluationApproachOther'
    }
  },
  evaluationApproachOther: {
    gqlField: 'evaluationApproachOther',
    goField: 'EvaluationApproachOther',
    dbField: 'evaluation_approach_other',
    label: 'Please describe the other evaluation approach you are considering.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.02,
    isOtherType: true
  },
  evalutaionApproachNote: {
    gqlField: 'evalutaionApproachNote',
    goField: 'EvalutaionApproachNote',
    dbField: 'evalutaion_approach_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'evaluationApproaches',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.03
  },
  ccmInvolvment: {
    gqlField: 'ccmInvolvment',
    goField: 'CcmInvolvment',
    dbField: 'ccm_involvment',
    label: 'Is Chronic Conditions Warehouse (CCW) involved in the model?',
    sublabel:
      'If you select either yes option, there will be additional questions to answer.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 6.04,
    hideRelatedQuestionAlert: true,
    disconnectedLabel: `questionNotApplicableCCW`,
    options: {
      YES_EVALUATION: 'Yes, for evaluation',
      YES__IMPLEMENTATION: 'Yes, for implementation',
      NO: 'No',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'ccmInvolvmentOther'
    },
    childRelation: {
      YES_EVALUATION: [
        () => opsEvalAndLearning.sendFilesBetweenCcw,
        () => opsEvalAndLearning.appToSendFilesToKnown,
        () => opsEvalAndLearning.useCcwForFileDistribiutionToParticipants
      ],
      YES__IMPLEMENTATION: [
        () => opsEvalAndLearning.sendFilesBetweenCcw,
        () => opsEvalAndLearning.appToSendFilesToKnown,
        () => opsEvalAndLearning.useCcwForFileDistribiutionToParticipants
      ]
    },
    filterGroups: [ModelViewFilter.CCW]
  },
  ccmInvolvmentOther: {
    gqlField: 'ccmInvolvmentOther',
    goField: 'CcmInvolvmentOther',
    dbField: 'ccm_involvment_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.05,
    isOtherType: true,
    otherParentField: 'ccmInvolvment',
    filterGroups: [ModelViewFilter.CCW]
  },
  ccmInvolvmentNote: {
    gqlField: 'ccmInvolvmentNote',
    goField: 'CcmInvolvmentNote',
    dbField: 'ccm_involvment_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'ccmInvolvment',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.06,
    filterGroups: [ModelViewFilter.CCW]
  },
  dataNeededForMonitoring: {
    gqlField: 'dataNeededForMonitoring',
    goField: 'DataNeededForMonitoring',
    dbField: 'data_needed_for_monitoring',
    label: 'What data do you need to monitor the model? Select all that apply.',
    readonlyLabel: 'What data do you need to monitor the model?',
    sublabel:
      'If you select quality claims-based measures or quality reported measures, there will be additional questions to answer.',
    exportLabel: 'What data do you need to monitor the model?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 6.07,
    disconnectedLabel: `questionNotApplicableQuality`,
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
    hideRelatedQuestionAlert: true,
    optionsRelatedInfo: {
      OTHER: 'dataNeededForMonitoringOther'
    },
    childRelation: {
      QUALITY_CLAIMS_BASED_MEASURES: [
        () => opsEvalAndLearning.developNewQualityMeasures,
        () => opsEvalAndLearning.qualityPerformanceImpactsPayment
      ],
      QUALITY_REPORTED_MEASURES: [
        () => opsEvalAndLearning.developNewQualityMeasures,
        () => opsEvalAndLearning.qualityPerformanceImpactsPayment
      ]
    },
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IDDOC]
  },
  dataNeededForMonitoringOther: {
    gqlField: 'dataNeededForMonitoringOther',
    goField: 'DataNeededForMonitoringOther',
    dbField: 'data_needed_for_monitoring_other',
    label: 'What other data do you need to monitor?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.08,
    isOtherType: true,
    otherParentField: 'dataNeededForMonitoring',
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IDDOC]
  },
  dataNeededForMonitoringNote: {
    gqlField: 'dataNeededForMonitoringNote',
    goField: 'DataNeededForMonitoringNote',
    dbField: 'data_needed_for_monitoring_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'dataNeededForMonitoring',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.09,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IDDOC]
  },
  dataToSendParticicipants: {
    gqlField: 'dataToSendParticicipants',
    goField: 'DataToSendParticicipants',
    dbField: 'data_to_send_particicipants',
    label: 'What data will you send to participants? Select all that apply.',
    readonlyLabel: 'What data will you send to participants?',
    multiSelectLabel: 'Selected data',
    exportLabel: 'What data will you send to participants?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 6.1,
    options: {
      BASELINE_HISTORICAL_DATA: 'Baseline/historical data',
      CLAIMS_LEVEL_DATA: 'Claims-level data',
      BENEFICIARY_LEVEL_DATA: 'Beneficiary-level data',
      PARTICIPANT_LEVEL_DATA: 'Participant-level data',
      PROVIDER_LEVEL_DATA: 'Provider-level data',
      OTHER_MIPS_DATA: 'Other',
      NOT_PLANNING_TO_SEND_DATA: 'Not planning to send data'
    },
    optionsRelatedInfo: {
      OTHER_MIPS_DATA: 'dataToSendParticicipantsOther'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  dataToSendParticicipantsOther: {
    gqlField: 'dataToSendParticicipantsOther',
    goField: 'DataToSendParticicipantsOther',
    dbField: 'data_to_send_particicipants_other',
    label: 'What other data do you need to send?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.11,
    isOtherType: true,
    otherParentField: 'dataToSendParticicipants',
    filterGroups: [ModelViewFilter.CMMI]
  },
  dataToSendParticicipantsNote: {
    gqlField: 'dataToSendParticicipantsNote',
    goField: 'DataToSendParticicipantsNote',
    dbField: 'data_to_send_particicipants_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'dataToSendParticicipants',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.12,
    filterGroups: [ModelViewFilter.CMMI]
  },
  shareCclfData: {
    gqlField: 'shareCclfData',
    goField: 'ShareCclfData',
    dbField: 'share_cclf_data',
    label:
      'Does the model require that identifiable Claim and Claim Line Feed (CCLFs) data need to be shared with participants?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 6.13,
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  shareCclfDataNote: {
    gqlField: 'shareCclfDataNote',
    goField: 'ShareCclfDataNote',
    dbField: 'share_cclf_data_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'shareCclfData',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 6.14,
    filterGroups: [ModelViewFilter.CMMI]
  },
  sendFilesBetweenCcw: {
    gqlField: 'sendFilesBetweenCcw',
    goField: 'SendFilesBetweenCcw',
    dbField: 'send_files_between_ccw',
    label:
      'Will you need to send files between the CCW and other applications?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 7.01,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.ccmInvolvment,
    filterGroups: [ModelViewFilter.CCW]
  },
  sendFilesBetweenCcwNote: {
    gqlField: 'sendFilesBetweenCcwNote',
    goField: 'SendFilesBetweenCcwNote',
    dbField: 'send_files_between_ccw_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'sendFilesBetweenCcw',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 7.02,
    filterGroups: [ModelViewFilter.CCW]
  },
  appToSendFilesToKnown: {
    gqlField: 'appToSendFilesToKnown',
    goField: 'AppToSendFilesToKnown',
    dbField: 'app_to_send_files_to_known',
    label:
      'Do you know which applications will be on the other sides of the file transfers?',
    readonlyLabel:
      'Do you know which applications will be on the other sides of the file transfers? If so, please specify.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 7.03,
    options: {
      true: 'Yes',
      false: 'No'
    },
    optionsRelatedInfo: {
      true: 'appToSendFilesToWhich'
    },
    parentRelation: () => opsEvalAndLearning.ccmInvolvment,
    filterGroups: [ModelViewFilter.CCW]
  },
  appToSendFilesToWhich: {
    gqlField: 'appToSendFilesToWhich',
    goField: 'AppToSendFilesToWhich',
    dbField: 'app_to_send_files_to_which',
    label: 'Please specify',
    exportLabel: 'Please specify yes',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 7.04,
    isOtherType: true,
    otherParentField: 'appToSendFilesToWhich',
    filterGroups: [ModelViewFilter.CCW]
  },
  appToSendFilesToNote: {
    gqlField: 'appToSendFilesToNote',
    goField: 'AppToSendFilesToNote',
    dbField: 'app_to_send_files_to_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'appToSendFilesToKnown',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 7.05,
    filterGroups: [ModelViewFilter.CCW]
  },
  useCcwForFileDistribiutionToParticipants: {
    gqlField: 'useCcwForFileDistribiutionToParticipants',
    goField: 'UseCcwForFileDistribiutionToParticipants',
    dbField: 'use_ccw_for_file_distribiution_to_participants',
    label:
      'Will you use the CCW to distribute files to and from model participants?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 7.06,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.ccmInvolvment,
    filterGroups: [ModelViewFilter.CCW]
  },
  useCcwForFileDistribiutionToParticipantsNote: {
    gqlField: 'useCcwForFileDistribiutionToParticipantsNote',
    goField: 'UseCcwForFileDistribiutionToParticipantsNote',
    dbField: 'use_ccw_for_file_distribiution_to_participants_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'useCcwForFileDistribiutionToParticipants',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 7.07,
    filterGroups: [ModelViewFilter.CCW]
  },
  developNewQualityMeasures: {
    gqlField: 'developNewQualityMeasures',
    goField: 'DevelopNewQualityMeasures',
    dbField: 'develop_new_quality_measures',
    label:
      'Do you plan to develop a new validated quality measure for your model?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 7.08,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => opsEvalAndLearning.dataNeededForMonitoring,
    filterGroups: [ModelViewFilter.CMMI]
  },
  developNewQualityMeasuresNote: {
    gqlField: 'developNewQualityMeasuresNote',
    goField: 'DevelopNewQualityMeasuresNote',
    dbField: 'develop_new_quality_measures_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'developNewQualityMeasures',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 7.09,
    filterGroups: [ModelViewFilter.CMMI]
  },
  qualityPerformanceImpactsPayment: {
    gqlField: 'qualityPerformanceImpactsPayment',
    goField: 'QualityPerformanceImpactsPayment',
    dbField: 'quality_performance_impacts_payment',
    label: 'Does quality performance impact payment?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 7.1,
    options: {
      YES: 'Yes',
      NO: 'No',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'qualityPerformanceImpactsPaymentOther'
    },
    parentRelation: () => opsEvalAndLearning.dataNeededForMonitoring,
    filterGroups: [ModelViewFilter.CMMI]
  },
  qualityPerformanceImpactsPaymentOther: {
    gqlField: 'qualityPerformanceImpactsPaymentOther',
    goField: 'QualityPerformanceImpactsPaymentOther',
    dbField: 'quality_performance_impacts_payment_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 7.11,
    isOtherType: true,
    otherParentField: 'qualityPerformanceImpactsPayment',
    filterGroups: [ModelViewFilter.CMMI]
  },
  qualityPerformanceImpactsPaymentNote: {
    gqlField: 'qualityPerformanceImpactsPaymentNote',
    goField: 'QualityPerformanceImpactsPaymentNote',
    dbField: 'quality_performance_impacts_payment_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'qualityPerformanceImpactsPayment',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 7.12,
    filterGroups: [ModelViewFilter.CMMI]
  },
  dataSharingStarts: {
    gqlField: 'dataSharingStarts',
    goField: 'DataSharingStarts',
    dbField: 'data_sharing_starts',
    label: 'Data sharing starts',
    sublabel:
      'If using ACO-OS support, SSM request to begin analysis at least 1 year before implementation',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 8.01,
    isPageStart: true,
    readonlyHeader:
      'Data sharing, collection, and reporting timing and frequency',
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
    optionsRelatedInfo: {
      OTHER: 'dataSharingStartsOther'
    },
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataSharingStartsOther: {
    gqlField: 'dataSharingStartsOther',
    goField: 'DataSharingStartsOther',
    dbField: 'data_sharing_starts_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.02,
    isOtherType: true,
    otherParentField: 'dataSharingStarts',
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataSharingFrequency: {
    gqlField: 'dataSharingFrequency',
    goField: 'DataSharingFrequency',
    dbField: 'data_sharing_frequency',
    label: 'How often do you anticipate sharing data?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 8.03,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'dataSharingFrequencyContinually',
      OTHER: 'dataSharingFrequencyOther'
    },
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IDDOC]
  },
  dataSharingFrequencyContinually: {
    gqlField: 'dataSharingFrequencyContinually',
    goField: 'DataSharingFrequencyContinually',
    dbField: 'data_sharing_frequency_continually',
    label: 'Please specify',
    exportLabel: 'Please specify continually',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.04,
    isOtherType: true,
    otherParentField: 'dataSharingFrequency',
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IDDOC]
  },
  dataSharingFrequencyOther: {
    gqlField: 'dataSharingFrequencyOther',
    goField: 'DataSharingFrequencyOther',
    dbField: 'data_sharing_frequency_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.05,
    isOtherType: true,
    otherParentField: 'dataSharingFrequency',
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IDDOC]
  },
  dataSharingStartsNote: {
    gqlField: 'dataSharingStartsNote',
    goField: 'DataSharingStartsNote',
    dbField: 'data_sharing_starts_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Data sharing timing and frequency questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.06,
    filterGroups: [ModelViewFilter.CMMI, ModelViewFilter.IDDOC]
  },
  dataCollectionStarts: {
    gqlField: 'dataCollectionStarts',
    goField: 'DataCollectionStarts',
    dbField: 'data_collection_starts',
    label: 'Data collection starts',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 8.07,
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
    optionsRelatedInfo: {
      OTHER: 'dataCollectionStartsOther'
    },
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataCollectionStartsOther: {
    gqlField: 'dataCollectionStartsOther',
    goField: 'DataCollectionStartsOther',
    dbField: 'data_collection_starts_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.08,
    isOtherType: true,
    otherParentField: 'dataCollectionStarts',
    filterGroups: [ModelViewFilter.IDDOC]
  },
  dataCollectionFrequency: {
    gqlField: 'dataCollectionFrequency',
    goField: 'DataCollectionFrequency',
    dbField: 'data_collection_frequency',
    label: 'How often do you anticipate collecting data?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 8.09,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'dataCollectionFrequencyContinually',
      OTHER: 'dataCollectionFrequencyOther'
    },
    filterGroups: [ModelViewFilter.CMMI]
  },
  dataCollectionFrequencyContinually: {
    gqlField: 'dataCollectionFrequencyContinually',
    goField: 'DataCollectionFrequencyContinually',
    dbField: 'data_collection_frequency_continually',
    label: 'Please specify',
    exportLabel: 'Please specify continually',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.1,
    isOtherType: true,
    otherParentField: 'dataCollectionFrequency',
    filterGroups: [ModelViewFilter.CMMI]
  },
  dataCollectionFrequencyOther: {
    gqlField: 'dataCollectionFrequencyOther',
    goField: 'DataCollectionFrequencyOther',
    dbField: 'data_collection_frequency_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.11,
    isOtherType: true,
    otherParentField: 'dataCollectionFrequency',
    filterGroups: [ModelViewFilter.CMMI]
  },
  dataCollectionFrequencyNote: {
    gqlField: 'dataCollectionFrequencyNote',
    goField: 'DataCollectionFrequencyNote',
    dbField: 'data_collection_frequency_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Data collection timing and frequency questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.12,
    filterGroups: [ModelViewFilter.CMMI]
  },
  qualityReportingStarts: {
    gqlField: 'qualityReportingStarts',
    goField: 'QualityReportingStarts',
    dbField: 'quality_reporting_starts',
    label: 'Quality reporting starts',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 8.13,
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
    optionsRelatedInfo: {
      OTHER: 'qualityReportingStartsOther'
    }
  },
  qualityReportingStartsOther: {
    gqlField: 'qualityReportingStartsOther',
    goField: 'QualityReportingStartsOther',
    dbField: 'quality_reporting_starts_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.14,
    isOtherType: true,
    otherParentField: 'qualityReportingStarts'
  },
  qualityReportingStartsNote: {
    gqlField: 'qualityReportingStartsNote',
    goField: 'QualityReportingStartsNote',
    dbField: 'quality_reporting_starts_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Quality reporting timing and frequency questions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.15
  },
  qualityReportingFrequency: {
    gqlField: 'qualityReportingFrequency',
    goField: 'QualityReportingFrequency',
    dbField: 'quality_reporting_frequency',
    label: 'How frequently does quality reporting happen?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 8.16,
    options: frequencyOptions,
    optionsRelatedInfo: {
      CONTINUALLY: 'qualityReportingFrequencyContinually',
      OTHER: 'qualityReportingFrequencyOther'
    }
  },
  qualityReportingFrequencyContinually: {
    gqlField: 'qualityReportingFrequencyContinually',
    goField: 'QualityReportingFrequencyContinually',
    dbField: 'quality_reporting_frequency_continually',
    label: 'Please specify',
    exportLabel: 'Please specify continually',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.17,
    isOtherType: true,
    otherParentField: 'qualityReportingFrequency'
  },
  qualityReportingFrequencyOther: {
    gqlField: 'qualityReportingFrequencyOther',
    goField: 'QualityReportingFrequencyOther',
    dbField: 'quality_reporting_frequency_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 8.18,
    isOtherType: true,
    otherParentField: 'qualityReportingFrequency'
  },
  modelLearningSystems: {
    gqlField: 'modelLearningSystems',
    goField: 'ModelLearningSystems',
    dbField: 'model_learning_systems',
    label: 'Will the model have a learning strategy?',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 9.01,
    isPageStart: true,
    options: {
      LEARNING_CONTRACTOR:
        'We plan to have a learning contractor (cross-model or individual)',
      IT_PLATFORM_CONNECT: 'We plan to use an IT platform (Connect)',
      PARTICIPANT_COLLABORATION:
        'We plan to enable participant-to-participant collaboration',
      EDUCATE_BENEFICIARIES: 'We plan to educate beneficiaries',
      OTHER: 'Other',
      NO_LEARNING_SYSTEM: 'No, we will not have a learning strategy'
    },
    optionsRelatedInfo: {
      OTHER: 'modelLearningSystemsOther'
    }
  },
  modelLearningSystemsOther: {
    gqlField: 'modelLearningSystemsOther',
    goField: 'ModelLearningSystemsOther',
    dbField: 'model_learning_systems_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 9.02,
    isOtherType: true,
    otherParentField: 'modelLearningSystems'
  },
  modelLearningSystemsNote: {
    gqlField: 'modelLearningSystemsNote',
    goField: 'ModelLearningSystemsNote',
    dbField: 'model_learning_systems_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'modelLearningSystems',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 9.03
  },
  anticipatedChallenges: {
    gqlField: 'anticipatedChallenges',
    goField: 'AnticipatedChallenges',
    dbField: 'anticipated_challenges',
    label:
      'What challenges do you anticipate during model design and implementation?',
    sublabel:
      'Please list and known ’unknowns,’ that is, are there policy decisions that you are aware of that are still pending or are subject to change? If so, please list to the best of your ability.',
    questionTooltip:
      'Please list and known ’unknowns,’ that is, are there policy decisions that you are aware of that are still pending or are subject to change? If so, please list to the best of your ability.',

    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 9.04,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label:
      'This section of the Model Plan (Operations, evaluation, and learning) is ready for review.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 9.05,
    tableReference: TableName.USER_ACCOUNT,
    hideFromReadonly: true
  },
  readyForReviewDts: {
    gqlField: 'readyForReviewDts',
    goField: 'ReadyForReviewDts',
    dbField: 'ready_for_review_dts',
    label: 'Ready for review date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 9.06,
    hideFromReadonly: true
  },
  readyForClearanceBy: {
    gqlField: 'readyForClearanceBy',
    goField: 'ReadyForClearanceBy',
    dbField: 'ready_for_clearance_by',
    label:
      'This section of the Model Plan (Operations, evaluation, and learning) is ready for clearance.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 9.07,
    tableReference: TableName.USER_ACCOUNT,
    hideFromReadonly: true
  },
  readyForClearanceDts: {
    gqlField: 'readyForClearanceDts',
    goField: 'ReadyForClearanceDts',
    dbField: 'ready_for_clearance_dts',
    label: 'Ready for clearance date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 9.08,
    hideFromReadonly: true
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 9.09,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    },
    hideFromReadonly: true
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
  qualityReportTiming: 'Quality reporting timing and frequency',
  dataReadonly: 'Data Sharing, Collection, and Reporting Timing and Frequency',
  testing: 'Testing'
};

export default opsEvalAndLearning;
