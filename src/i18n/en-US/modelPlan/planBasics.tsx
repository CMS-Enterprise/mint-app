import { TranslationPlanBasics } from 'types/translation';

export const planBasics: TranslationPlanBasics = {
  modelCategory: {
    gqlField: 'modelCategory',
    goField: 'ModelCategory',
    dbField: 'model_category',
    question: 'Primary model category',
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
    tooltip: {
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
    question: 'Additional model categories',
    hint:
      'If your model doesn’t fall into any additional categories, you can skip this.',
    dataType: 'string',
    formType: 'checkbox'
  },
  amsModelID: {
    gqlField: 'amsModelID',
    goField: 'AmsModelID',
    dbField: 'ams_model_ID',
    question: 'Model ID',
    dataType: 'string',
    formType: 'textarea'
  },
  demoCode: {
    gqlField: 'demoCode',
    goField: 'DemoCode',
    dbField: 'demo_code',
    question: 'Demo code(s)',
    dataType: 'string',
    formType: 'textarea'
  },
  cmsCenters: {
    gqlField: 'cmsCenters',
    goField: 'CMMIGroups',
    dbField: 'cmmi_groups',
    question: 'CMS component',
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
    }
  },
  cmmiGroups: {
    gqlField: 'cmmiGroups',
    goField: 'CMSCenters',
    dbField: 'cms_centers',
    question: 'CMMI Group',
    hint:
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
    }
  },
  modelType: {
    gqlField: 'modelType',
    goField: 'ModelType',
    dbField: 'model_type',
    question: 'Model Type',
    dataType: 'enum',
    formType: 'radio',
    options: {
      VOLUNTARY: 'Voluntary',
      MANDATORY: 'Mandatory'
    }
  },
  problem: {
    gqlField: 'problem',
    goField: 'Problem',
    dbField: 'problem',
    question: 'Problem statement',
    dataType: 'string',
    formType: 'textarea'
  },
  goal: {
    gqlField: 'goal',
    goField: 'Goal',
    dbField: 'goal',
    question: 'Goal',
    hint:
      'Please include the high level goal of the program and a description of the project.',
    dataType: 'string',
    formType: 'textarea'
  },
  testInterventions: {
    gqlField: 'testInterventions',
    goField: 'TestInterventions',
    dbField: 'test_interventions',
    question: 'Test Interventions',
    dataType: 'string',
    formType: 'textarea'
  },
  completeICIP: {
    gqlField: 'completeICIP',
    goField: 'CompleteICIP',
    dbField: 'complete_icip',
    question: 'Complete ICIP',
    dataType: 'date',
    formType: 'datePicker'
  },
  clearanceStarts: {
    gqlField: 'clearanceStarts',
    goField: 'ClearanceStarts',
    dbField: 'clearance_starts',
    question: 'Clearance start date',
    dataType: 'date',
    formType: 'datePicker'
  },
  clearanceEnds: {
    gqlField: 'clearanceEnds',
    goField: 'ClearanceEnds',
    dbField: 'clearance_ends',
    question: 'Clearance end date',
    dataType: 'date',
    formType: 'datePicker'
  },
  announced: {
    gqlField: 'announced',
    goField: 'Announced',
    dbField: 'announced',
    question: 'Announce model',
    dataType: 'date',
    formType: 'datePicker'
  },
  applicationsStart: {
    gqlField: 'applicationsStart',
    goField: 'ApplicationsStart',
    dbField: 'applications_starts',
    question: 'Application start date',
    dataType: 'date',
    formType: 'datePicker'
  },
  applicationsEnd: {
    gqlField: 'applicationsEnd',
    goField: 'ApplicationsEnd',
    dbField: 'applications_ends',
    question: 'Application end date',
    dataType: 'date',
    formType: 'datePicker'
  },
  performancePeriodStarts: {
    gqlField: 'performancePeriodStarts',
    goField: 'PerformancePeriodStarts',
    dbField: 'performance_period_starts',
    question: 'Performance start date',
    dataType: 'date',
    formType: 'datePicker'
  },
  performancePeriodEnds: {
    gqlField: 'performancePeriodEnds',
    goField: 'PerformancePeriodEnds',
    dbField: 'performance_period_ends',
    question: 'Performance end date',
    dataType: 'date',
    formType: 'datePicker'
  },
  highLevelNote: {
    gqlField: 'highLevelNote',
    goField: 'HighLevelNote',
    dbField: 'high_level_note',
    question: 'Note',
    dataType: 'string',
    formType: 'textarea'
  },
  wrapUpEnds: {
    gqlField: 'wrapUpEnds',
    goField: 'WrapUpEnds',
    dbField: 'wrap_up_ends',
    question: 'Model wrap-up end date',
    dataType: 'date',
    formType: 'datePicker'
  },
  phasedIn: {
    gqlField: 'phasedIn',
    goField: 'PhasedIn',
    dbField: 'phased_in',
    question:
      'If timelines are tight, might there be pieces of the model that can be phased in over time?',
    hint:
      'That is, the basic model would start at the earliest possible date but additional facets could be phased in at a later quarter.',
    dataType: 'boolean',
    formType: 'radio',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  phasedInNote: {
    gqlField: 'phasedInNote',
    goField: 'PhasedInNote',
    dbField: 'phased_in_note',
    question: 'Note',
    dataType: 'string',
    formType: 'textarea'
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    question: 'Model Plan status',
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
export const planBasicsMisc: Record<string, string> = {
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
  otherNotSpecificed: 'Other not specified',
  milestonesInfo:
    'Please be sure that the dates listed here are updated in the clearance calendar, if applicable. Contact the MINT Team at {{-email}} if you have any questions.',
  required1: 'All fields marked with ',
  required2: ' are required.',
  noneEntered: 'None entered',
  otherIdentifiers: 'Other identifiers',
  otherIdentifiersInfo1: 'These are created in ',
  otherIdentifiersInfo2: 'CMMI Analysis & Management System (AMS).',
  otherIdentifiersInfo3:
    ' Skip these fields until your model has been added to AMS. Not all models will have demo codes.'
};

export default planBasics;
