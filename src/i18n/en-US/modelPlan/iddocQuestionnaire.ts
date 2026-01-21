import { TranslationIddocQuestionnaire } from 'types/translation';

import {
  ModelViewFilter,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const iddocQuestionnaire: TranslationIddocQuestionnaire = {
  needed: {
    gqlField: 'needed',
    goField: 'Needed',
    dbField: 'needed',
    label: '',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 1.1,
    options: {
      true: '',
      false: ''
    },
    // hideFromReadonly: true,
    disconnectedLabel: `questionsNotApplicablePerMTO`,
    childRelation: {
      true: [
        () => iddocQuestionnaire.technicalContactsIdentified,
        () => iddocQuestionnaire.captureParticipantInfo,
        () => iddocQuestionnaire.icdOwner,
        () => iddocQuestionnaire.draftIcdDueDate,
        () => iddocQuestionnaire.uatNeeds,
        () => iddocQuestionnaire.stcNeeds,
        () => iddocQuestionnaire.testingTimelines,
        () => iddocQuestionnaire.dataMonitoringFileTypes,
        () => iddocQuestionnaire.dataResponseType,
        () => iddocQuestionnaire.dataResponseFileFrequency,
        () => iddocQuestionnaire.dataFullTimeOrIncremental,
        () => iddocQuestionnaire.eftSetUp,
        () => iddocQuestionnaire.unsolicitedAdjustmentsIncluded,
        () => iddocQuestionnaire.dataFlowDiagramsNeeded,
        () => iddocQuestionnaire.produceBenefitEnhancementFiles,
        () => iddocQuestionnaire.fileNamingConventions
      ]
    },
    filterGroups: [ModelViewFilter.IDDOC]
  },
  technicalContactsIdentified: {
    gqlField: 'technicalContactsIdentified',
    goField: 'TechnicalContactsIdentified',
    dbField: 'technical_contacts_identified',
    label: 'Are technical contacts identified?',
    readonlyLabel: 'Are technical contacts identified? If so, please specify.',
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
    readonlyHeader: 'IDDOC operations',
    hideRelatedQuestionAlert: true,
    parentRelation: () => iddocQuestionnaire.needed,
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
    label: 'Will you capture participant information?',
    sublabel:
      'This means the participant record for a model would be included in the ACO-OS Entity File.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 2.04,
    options: {
      true: 'Yes',
      false: 'No'
    },
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
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
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'eftSetUp'
    },
    parentRelation: () => iddocQuestionnaire.needed,
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
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'dataFullTimeOrIncremental'
    },
    parentRelation: () => iddocQuestionnaire.needed,
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
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'dataFlowDiagramsNeeded'
    },
    parentRelation: () => iddocQuestionnaire.needed,
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
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'unsolicitedAdjustmentsIncluded'
    },
    parentRelation: () => iddocQuestionnaire.needed,
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
    parentRelation: () => iddocQuestionnaire.needed,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  fileNamingConventions: {
    gqlField: 'fileNamingConventions',
    goField: 'FileNamingConventions',
    dbField: 'file_naming_conventions',
    label: 'File naming conventions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 4.06,
    parentRelation: () => iddocQuestionnaire.needed,
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
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Questionnaire status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 7.19,
    options: {
      READY: 'Ready',
      IN_PROGRESS: 'In progress',
      READY_FOR_REVIEW: 'Ready for review',
      READY_FOR_CLEARANCE: 'Ready for clearance'
    },
    hideFromReadonly: true
  }
};

export const iddocQuestionnaireMisc = {
  heading: '4i and ACO-OS',
  needHelpDiscussion: 'Need help with this questionnaire?',
  bannerText:
    'Your 4i and ACO-OS questionnaire can only be accessed by one person at a time. If you are not actively editing or reviewing this section, please exit out of it so others can access it.',
  iddocHeading: 'Operations questions',
  icdHeading: 'Interface Control Document (ICD) questions',
  icdSubheading:
    'An interface control document provides a record of all interface information generated for a project.',
  testingHeading: 'Testing questions',
  ssmRequest:
    'SSM request to begin analysis at least 1 year before implementation',
  dataMonitoringHeading: 'Data monitoring questions',
  dataMonitoringContinued: 'Data monitoring questions continued',
  // // readview section heading
  // iddocOperations: 'IDDOC Operations',
  // icd: 'Interface Control Document (ICD)',
  // testingQuestions: 'Testing',
  // dataMonitoring: 'Data monitoring',
  iddocQuestionnaireIsRequired:
    'This questionnaire is required for this model due to specific answers in the Model Plan or model-to-operations matrix (MTO).',
  iddocQuestionnaireIsNotNeeded:
    'This questionnaire is not needed for this model due to specific answers in the Model Plan or model-to-operations matrix (MTO).'
};

export default iddocQuestionnaire;
