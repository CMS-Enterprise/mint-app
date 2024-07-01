import { TranslationBasics } from 'types/translation';

import {
  ModelViewFilter,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const basics: TranslationBasics = {
  modelCategory: {
    gqlField: 'modelCategory',
    goField: 'ModelCategory',
    dbField: 'model_category',
    label: 'Primary model category',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    order: 1.01,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'additionalModelCategories'
    },
    options: {
      ACCOUNTABLE_CARE: 'Accountable Care',
      DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episode-Based',
      HEALTH_PLAN: 'Health Plan',
      PRESCRIPTION_DRUG: 'Prescription Drug',
      STATE_BASED: 'State & Community-Based',
      STATUTORY: 'Statutory',
      TO_BE_DETERMINED: 'To be determined'
    },
    tooltips: {
      ACCOUNTABLE_CARE:
        'Models in which a doctor, group of health care providers or hospital takes financial responsibility for improving quality of care, including advanced primary care services, care coordination and health outcomes for a defined group of patients, thereby reducing care fragmentation and unnecessary costs for patients and the health system',
      DISEASE_SPECIFIC_AND_EPISODIC:
        'Models which aim to address deficits in care for a defined population with a specific shared disease or medical condition, procedure, or care episode',
      HEALTH_PLAN: 'Models comprising Medicare Advantage plans',
      PRESCRIPTION_DRUG:
        'Models that seek to improve access to and/or the affordability of prescription drugs covered under Medicare (Part B and D) or Medicaid.',
      STATE_BASED:
        'Models in which a state or community-based organization serves as the main contractual participant, including managed care organizations serving Medicaid beneficiaries.',
      STATUTORY:
        'Models and demonstrations requiring testing as determined by Congress and/or the Secretary of Health and Human Services.',
      TO_BE_DETERMINED: ''
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  additionalModelCategories: {
    gqlField: 'additionalModelCategories',
    goField: 'AdditionalModelCategories',
    dbField: 'additional_model_categories',
    label: 'Additional model categories',
    sublabel:
      'If your model doesn’t fall into any additional categories, you can skip this.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.CHECKBOX,
    order: 1.02,
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'modelCategory'
    },
    options: {
      ACCOUNTABLE_CARE: 'Accountable Care',
      DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episode-Based',
      HEALTH_PLAN: 'Health Plan',
      PRESCRIPTION_DRUG: 'Prescription Drug',
      STATE_BASED: 'State & Community-Based',
      STATUTORY: 'Statutory',
      TO_BE_DETERMINED: 'To be determined'
    },
    tooltips: {
      ACCOUNTABLE_CARE:
        'Models in which a doctor, group of health care providers or hospital takes financial responsibility for improving quality of care, including advanced primary care services, care coordination and health outcomes for a defined group of patients, thereby reducing care fragmentation and unnecessary costs for patients and the health system',
      DISEASE_SPECIFIC_AND_EPISODIC:
        'Models which aim to address deficits in care for a defined population with a specific shared disease or medical condition, procedure, or care episode',
      HEALTH_PLAN: 'Models comprising Medicare Advantage plans',
      PRESCRIPTION_DRUG:
        'Models that seek to improve access to and/or the affordability of prescription drugs covered under Medicare (Part B and D) or Medicaid.',
      STATE_BASED:
        'Models in which a state or community-based organization serves as the main contractual participant, including managed care organizations serving Medicaid beneficiaries.',
      STATUTORY:
        'Models and demonstrations requiring testing as determined by Congress and/or the Secretary of Health and Human Services.',
      TO_BE_DETERMINED: ''
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  amsModelID: {
    gqlField: 'amsModelID',
    goField: 'AmsModelID',
    dbField: 'ams_model_id',
    label: 'Model ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.03
  },
  demoCode: {
    gqlField: 'demoCode',
    goField: 'DemoCode',
    dbField: 'demo_code',
    label: 'Demo code(s)',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.04
  },
  cmsCenters: {
    gqlField: 'cmsCenters',
    goField: 'CMSCenters',
    dbField: 'cms_centers',
    label: 'CMS component',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 1.05,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'cmmiGroups'
    },
    options: {
      CMMI: 'Center for Medicare and Medicaid Innovation (CMMI)',
      CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY:
        'Center for Clinical Standards and Quality (CCSQ)',
      CENTER_FOR_MEDICAID_AND_CHIP_SERVICES:
        'Center for Medicaid and CHIP Services (CMCS)',
      CENTER_FOR_MEDICARE: 'Center for Medicare (CM)',
      FEDERAL_COORDINATED_HEALTH_CARE_OFFICE:
        'Federal Coordinated Health Care Office (FCHCO)',

      CENTER_FOR_PROGRAM_INTEGRITY: 'Center for Program Integrity (CPI)'
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  cmmiGroups: {
    gqlField: 'cmmiGroups',
    goField: 'CMMIGroups',
    dbField: 'cmmi_groups',
    label: 'CMMI Group',
    sublabel:
      'You only need to select the CMMI group if CMMI is selected as the main CMS component.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 1.06,
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'cmsCenters'
    },
    options: {
      PATIENT_CARE_MODELS_GROUP: 'Patient Care Models Group (PCMG)',
      POLICY_AND_PROGRAMS_GROUP: 'Policy and Programs Group (PPG)',
      SEAMLESS_CARE_MODELS_GROUP: 'Seamless Care Models Group (SCMG)',
      STATE_AND_POPULATION_HEALTH_GROUP:
        'State and Population Health Group (SPHG)',
      TBD: 'To be determined'
    },
    filterGroups: [ModelViewFilter.IPC]
  },
  modelType: {
    gqlField: 'modelType',
    goField: 'ModelType',
    dbField: 'model_type',
    label: 'Model Type',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 2.01,
    options: {
      VOLUNTARY: 'Voluntary',
      MANDATORY_NATIONAL: 'Mandatory national',
      MANDATORY_REGIONAL_OR_STATE: 'Mandatory regional or state',
      OTHER: 'Other'
    },
    optionsRelatedInfo: {
      OTHER: 'modelTypeOther'
    },
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  modelTypeOther: {
    gqlField: 'modelTypeOther',
    goField: 'ModelTypeOther',
    dbField: 'model_type_other',
    label: 'Please specify',
    exportLabel: 'Please specify other',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.02,
    isOtherType: true,
    otherParentField: 'modelType',
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  problem: {
    gqlField: 'problem',
    goField: 'Problem',
    dbField: 'problem',
    label: 'Problem statement',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.03
  },
  goal: {
    gqlField: 'goal',
    goField: 'Goal',
    dbField: 'goal',
    label: 'Goal',
    sublabel:
      'Please include the high level goal of the program and a description of the project.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.04,
    filterGroups: [
      ModelViewFilter.DFSDM,
      ModelViewFilter.IPC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.PBG
    ]
  },
  testInterventions: {
    gqlField: 'testInterventions',
    goField: 'TestInterventions',
    dbField: 'test_interventions',
    label: 'Test Interventions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.05
  },
  note: {
    gqlField: 'note',
    goField: 'Note',
    dbField: 'note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Model basics',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.06
  },
  completeICIP: {
    gqlField: 'completeICIP',
    goField: 'CompleteICIP',
    dbField: 'complete_icip',
    label: 'Complete ICIP',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.01,
    filterGroups: [ModelViewFilter.IPC]
  },
  clearanceStarts: {
    gqlField: 'clearanceStarts',
    goField: 'ClearanceStarts',
    dbField: 'clearance_starts',
    label: 'Clearance start date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.02,
    filterGroups: [ModelViewFilter.IPC]
  },
  clearanceEnds: {
    gqlField: 'clearanceEnds',
    goField: 'ClearanceEnds',
    dbField: 'clearance_ends',
    label: 'Clearance end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.03,
    filterGroups: [ModelViewFilter.IPC]
  },
  announced: {
    gqlField: 'announced',
    goField: 'Announced',
    dbField: 'announced',
    label: 'Announce model',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.04,
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  applicationsStart: {
    gqlField: 'applicationsStart',
    goField: 'ApplicationsStart',
    dbField: 'applications_starts',
    label: 'Application start date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.05,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'applicationsEnd'
    },
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  applicationsEnd: {
    gqlField: 'applicationsEnd',
    goField: 'ApplicationsEnd',
    dbField: 'applications_ends',
    label: 'Application end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.06,
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'applicationsStart'
    },
    filterGroups: [ModelViewFilter.CBOSC, ModelViewFilter.IPC]
  },
  performancePeriodStarts: {
    gqlField: 'performancePeriodStarts',
    goField: 'PerformancePeriodStarts',
    dbField: 'performance_period_starts',
    label: 'Performance start date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.07,
    adjacentPositioning: {
      position: 'left',
      adjacentField: 'performancePeriodEnds'
    },
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CCW,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  performancePeriodEnds: {
    gqlField: 'performancePeriodEnds',
    goField: 'PerformancePeriodEnds',
    dbField: 'performance_period_ends',
    label: 'Performance end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.08,
    adjacentPositioning: {
      position: 'right',
      adjacentField: 'performancePeriodStarts'
    },
    filterGroups: [
      ModelViewFilter.CBOSC,
      ModelViewFilter.CCW,
      ModelViewFilter.DFSDM,
      ModelViewFilter.IDDOC,
      ModelViewFilter.IPC,
      ModelViewFilter.PBG
    ]
  },
  highLevelNote: {
    gqlField: 'highLevelNote',
    goField: 'HighLevelNote',
    dbField: 'high_level_note',
    label: 'Notes',
    isNote: true,
    parentReferencesLabel: 'Timeline',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.09
  },
  wrapUpEnds: {
    gqlField: 'wrapUpEnds',
    goField: 'WrapUpEnds',
    dbField: 'wrap_up_ends',
    label: 'Model wrap-up end date',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 3.1,
    filterGroups: [ModelViewFilter.IPC]
  },
  phasedIn: {
    gqlField: 'phasedIn',
    goField: 'PhasedIn',
    dbField: 'phased_in',
    label:
      'If timelines are tight, might there be pieces of the model that can be phased in over time?',
    sublabel:
      'That is, the basic model would start at the earliest possible date but additional facets could be phased in at a later quarter.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.RADIO,
    order: 3.11,
    isPageStart: true,
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  phasedInNote: {
    gqlField: 'phasedInNote',
    goField: 'PhasedInNote',
    dbField: 'phased_in_note',
    label: 'Notes',
    isNote: true,
    otherParentField: 'phasedIn',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 3.12,
    filterGroups: [ModelViewFilter.IDDOC, ModelViewFilter.PBG]
  },
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label: 'This section of the Model Plan (Model basics) is ready for review.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 3.13,
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
    order: 3.14,
    hideFromReadonly: true
  },
  readyForClearanceBy: {
    gqlField: 'readyForClearanceBy',
    goField: 'ReadyForClearanceBy',
    dbField: 'ready_for_clearance_by',
    label:
      'This section of the Model Plan (Model basics) is ready for clearance.',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 3.15,
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
    order: 3.16,
    hideFromReadonly: true
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Model Plan status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 3.17,
    options: {
      READY: 'ready',
      IN_PROGRESS: 'in progress',
      READY_FOR_REVIEW: 'ready for review',
      READY_FOR_CLEARANCE: 'ready for clearance'
    },
    hideFromReadonly: true
  }
};

// Miscellaneous translations outside scope of individual questions
export const basicsMisc: Record<string, string> = {
  heading: 'Model basics',
  description:
    'If there’s a question or field that is not applicable to your model or you don’t currently know the answer, you may leave it blank. If you need help, ask a question using the link below.',
  clearanceHeading: 'Review model basics',
  breadcrumb: 'Model basics',
  previousNames: 'Previous model names',
  validDate: 'Please use a valid date format',
  highLevelTimeline: 'Anticipated high level timeline',
  clearance: 'Clearance',
  clearanceInfo:
    'When you think you’ll begin internal (CMMI) clearance through when you’ll complete OMB/ASRF clearance',
  applicationPeriod: 'Application period',
  demonstrationPerformance: 'Performance period',
  demonstrationPerformanceInfo:
    'When the model will be active beginning with the go-live date',
  milestonesInfo:
    'Please be sure that the dates listed here are updated in the clearance calendar, if applicable. Contact the MINT Team at {{-email}} if you have any questions.',
  required1: 'All fields marked with ',
  required2: ' are required.',
  otherIdentifiers: 'Other identifiers',
  otherIdentifiersInfo1: 'These are created in ',
  otherIdentifiersInfo2: 'CMMI Analysis & Management System (AMS).',
  otherIdentifiersInfo3:
    ' Skip these fields until your model has been added to AMS. Not all models will have demo codes.',
  otherIdentifiersInfo_noEditAccess:
    ' They will be blank until the model is added to AMS. Not all models will have demo codes.'
};

export default basics;
