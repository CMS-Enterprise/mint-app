import { TranslationBasics } from 'types/translation';

export const basics: TranslationBasics = {
  modelCategory: {
    gqlField: 'modelCategory',
    goField: 'ModelCategory',
    dbField: 'model_category',
    label: 'Primary model category',
    dataType: 'enum',
    formType: 'radio',
    options: {
      ACCOUNTABLE_CARE: 'Accountable Care',
      DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episodic',
      HEALTH_PLAN: 'Health Plan',
      PRESCRIPTION_DRUG: 'Prescription Drug',
      STATE_BASED: 'State-Based',
      STATUTORY: 'Statutory',
      TO_BE_DETERMINED: 'To be determined'
    },
    optionsLabels: {
      ACCOUNTABLE_CARE:
        'Models in which a doctor, group of health care providers or hospital takes financial responsibility for improving quality of care, including advanced primary care services, care coordination and health outcomes for a defined group of patients, thereby reducing care fragmentation and unnecessary costs for patients and the health system',
      DISEASE_SPECIFIC_AND_EPISODIC:
        'Models which aim to address deficits in care for a defined population with a specific shared disease or medical condition, procedure, or care episode',
      HEALTH_PLAN: 'Models comprising Medicare Advantage plans',
      PRESCRIPTION_DRUG:
        'Models which seek to mitigate the total cost of care by improving access to and the affordability of prescription drugs covered under Part B or Part D, including gene cell therapy, accelerated approvals and biosimilars',
      STATE_BASED:
        'Models in which a state serves as the main contractual participant',
      STATUTORY:
        'Models and demonstrations requiring testing as determined by Congress under Social Security Act 1115A',
      TO_BE_DETERMINED: 'To be determined'
    }
  },
  additionalModelCategories: {
    gqlField: 'additionalModelCategories',
    goField: 'AdditionalModelCategories',
    dbField: 'additional_model_categories',
    label: 'Additional model categories',
    sublabel:
      'If your model doesn’t fall into any additional categories, you can skip this.',
    dataType: 'string',
    formType: 'checkbox',
    options: {
      ACCOUNTABLE_CARE: 'Accountable Care',
      DISEASE_SPECIFIC_AND_EPISODIC: 'Disease-Specific & Episodic',
      HEALTH_PLAN: 'Health Plan',
      PRESCRIPTION_DRUG: 'Prescription Drug',
      STATE_BASED: 'State-Based',
      STATUTORY: 'Statutory',
      TO_BE_DETERMINED: 'To be determined'
    },
    optionsLabels: {
      ACCOUNTABLE_CARE:
        'Models in which a doctor, group of health care providers or hospital takes financial responsibility for improving quality of care, including advanced primary care services, care coordination and health outcomes for a defined group of patients, thereby reducing care fragmentation and unnecessary costs for patients and the health system',
      DISEASE_SPECIFIC_AND_EPISODIC:
        'Models which aim to address deficits in care for a defined population with a specific shared disease or medical condition, procedure, or care episode',
      HEALTH_PLAN: 'Models comprising Medicare Advantage plans',
      PRESCRIPTION_DRUG:
        'Models which seek to mitigate the total cost of care by improving access to and the affordability of prescription drugs covered under Part B or Part D, including gene cell therapy, accelerated approvals and biosimilars',
      STATE_BASED:
        'Models in which a state serves as the main contractual participant',
      STATUTORY:
        'Models and demonstrations requiring testing as determined by Congress under Social Security Act 1115A',
      TO_BE_DETERMINED: 'To be determined'
    }
  },
  amsModelID: {
    gqlField: 'amsModelID',
    goField: 'AmsModelID',
    dbField: 'ams_model_ID',
    label: 'Model ID',
    dataType: 'string',
    formType: 'textarea'
  },
  demoCode: {
    gqlField: 'demoCode',
    goField: 'DemoCode',
    dbField: 'demo_code',
    label: 'Demo code(s)',
    dataType: 'string',
    formType: 'textarea'
  },
  cmsCenters: {
    gqlField: 'cmsCenters',
    goField: 'CMMIGroups',
    dbField: 'cmmi_groups',
    label: 'CMS component',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      CMMI: 'CMMI',
      CENTER_FOR_MEDICARE: 'Center for Medicare (CM)',
      FEDERAL_COORDINATED_HEALTH_CARE_OFFICE: 'Federal Coordinated Health Care',
      CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY:
        'Center for Clinical Standards and Quality (CCSQ)',
      CENTER_FOR_PROGRAM_INTEGRITY: 'Center for Program Integrity (CPI)',
      OTHER: 'Other'
    },
    filterGroups: ['ipc']
  },
  cmmiGroups: {
    gqlField: 'cmmiGroups',
    goField: 'CMSCenters',
    dbField: 'cms_centers',
    label: 'CMMI Group',
    sublabel:
      'You only need to select the CMMI group if CMMI is selected as the main CMS component.',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      PATIENT_CARE_MODELS_GROUP: 'Patient Care Models Group (PCMG)',
      POLICY_AND_PROGRAMS_GROUP: 'Policy and Programs Group (PPG)',
      SEAMLESS_CARE_MODELS_GROUP: 'Seamless Care Models Group (SCMG)',
      STATE_AND_POPULATION_HEALTH_GROUP:
        'State and Population Health Group (SPHG)',
      TBD: 'To be determined'
    },
    filterGroups: ['ipc']
  },
  modelType: {
    gqlField: 'modelType',
    goField: 'ModelType',
    dbField: 'model_type',
    label: 'Model Type',
    dataType: 'enum',
    formType: 'radio',
    options: {
      VOLUNTARY: 'Voluntary',
      MANDATORY: 'Mandatory',
      TBD: 'To be determined'
    },
    filterGroups: ['dfsdm', 'ipc', 'iddoc', 'pbg']
  },
  problem: {
    gqlField: 'problem',
    goField: 'Problem',
    dbField: 'problem',
    label: 'Problem statement',
    dataType: 'string',
    formType: 'textarea'
  },
  goal: {
    gqlField: 'goal',
    goField: 'Goal',
    dbField: 'goal',
    label: 'Goal',
    sublabel:
      'Please include the high level goal of the program and a description of the project.',
    dataType: 'string',
    formType: 'textarea',
    filterGroups: ['dfsdm', 'ipc', 'iddoc', 'pbg']
  },
  testInterventions: {
    gqlField: 'testInterventions',
    goField: 'TestInterventions',
    dbField: 'test_interventions',
    label: 'Test Interventions',
    dataType: 'string',
    formType: 'textarea'
  },
  note: {
    gqlField: 'note',
    goField: 'Note',
    dbField: 'note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  completeICIP: {
    gqlField: 'completeICIP',
    goField: 'CompleteICIP',
    dbField: 'complete_icip',
    label: 'Complete ICIP',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['ipc']
  },
  clearanceStarts: {
    gqlField: 'clearanceStarts',
    goField: 'ClearanceStarts',
    dbField: 'clearance_starts',
    label: 'Clearance start date',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['ipc']
  },
  clearanceEnds: {
    gqlField: 'clearanceEnds',
    goField: 'ClearanceEnds',
    dbField: 'clearance_ends',
    label: 'Clearance end date',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['ipc']
  },
  announced: {
    gqlField: 'announced',
    goField: 'Announced',
    dbField: 'announced',
    label: 'Announce model',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['cbosc', 'iddoc', 'ipc', 'pbg']
  },
  applicationsStart: {
    gqlField: 'applicationsStart',
    goField: 'ApplicationsStart',
    dbField: 'applications_starts',
    label: 'Application start date',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['cbosc', 'ipc']
  },
  applicationsEnd: {
    gqlField: 'applicationsEnd',
    goField: 'ApplicationsEnd',
    dbField: 'applications_ends',
    label: 'Application end date',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['ipc']
  },
  performancePeriodStarts: {
    gqlField: 'performancePeriodStarts',
    goField: 'PerformancePeriodStarts',
    dbField: 'performance_period_starts',
    label: 'Performance start date',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['cbosc', 'ccw', 'dfsdm', 'iddoc', 'ipc', 'pbg']
  },
  performancePeriodEnds: {
    gqlField: 'performancePeriodEnds',
    goField: 'PerformancePeriodEnds',
    dbField: 'performance_period_ends',
    label: 'Performance end date',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['ipc']
  },
  highLevelNote: {
    gqlField: 'highLevelNote',
    goField: 'HighLevelNote',
    dbField: 'high_level_note',
    label: 'Notes',
    dataType: 'string',
    formType: 'textarea'
  },
  wrapUpEnds: {
    gqlField: 'wrapUpEnds',
    goField: 'WrapUpEnds',
    dbField: 'wrap_up_ends',
    label: 'Model wrap-up end date',
    dataType: 'date',
    formType: 'datePicker',
    filterGroups: ['ipc']
  },
  phasedIn: {
    gqlField: 'phasedIn',
    goField: 'PhasedIn',
    dbField: 'phased_in',
    label:
      'If timelines are tight, might there be pieces of the model that can be phased in over time?',
    sublabel:
      'That is, the basic model would start at the earliest possible date but additional facets could be phased in at a later quarter.',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    },
    filterGroups: ['iddoc', 'pbg']
  },
  phasedInNote: {
    gqlField: 'phasedInNote',
    goField: 'PhasedInNote',
    dbField: 'phased_in_note',
    label: 'Notes',
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
      READY:
        'This section of the Model Plan (Model basics) is ready for review.',
      IN_PROGRESS:
        'This section of the Model Plan (Model basics) is ready for review.',
      READY_FOR_REVIEW:
        'This section of the Model Plan (Model basics) is ready for review.',
      READY_FOR_CLEARANCE:
        'This section of the Model Plan (Model basics) is ready for review.'
    }
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
  na: 'No answer entered',
  otherNotSpecified: 'Other not specified',
  milestonesInfo:
    'Please be sure that the dates listed here are updated in the clearance calendar, if applicable. Contact the MINT Team at {{-email}} if you have any questions.',
  required1: 'All fields marked with ',
  required2: ' are required.',
  notes: 'Notes',
  noneEntered: 'None entered',
  otherIdentifiers: 'Other identifiers',
  otherIdentifiersInfo1: 'These are created in ',
  otherIdentifiersInfo2: 'CMMI Analysis & Management System (AMS).',
  otherIdentifiersInfo3:
    ' Skip these fields until your model has been added to AMS. Not all models will have demo codes.'
};

export default basics;
