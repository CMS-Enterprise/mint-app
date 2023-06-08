import { TranslationPlanBasics } from 'types/translation';

export const planBasics: TranslationPlanBasics = {
  modelCategory: {
    gqlField: 'modelCategory',
    goField: 'ModelCategory',
    dbField: 'model_category',
    question: 'Model category',
    dataType: 'enum',
    formType: 'select',
    options: {
      ACCOUNTABLE_CARE: 'Accountable Care',
      DEMONSTRATION: 'Demonstration',
      EPISODE_BASED_PAYMENT_INITIATIVES: 'Episode-based Payment Initiatives',
      INIT_ACCEL_DEV_AND_TEST:
        'Initiatives Focused on the Medicaid and CHIP Population',
      INIT_MEDICAID_CHIP_POP:
        'Initiatives to Accelerate the Development and Testing of New Payment and Service Delivery Models',
      INIT_SPEED_ADOPT_BEST_PRACTICE:
        'Initiatives to Speed the Adoption of Best Practices',
      INIT__MEDICARE_MEDICAID_ENROLLEES:
        'Initiatives Focused on the Medicare and Medicaid Enrollees',
      PRIMARY_CARE_TRANSFORMATION: 'Primary Care Transformation',
      UNKNOWN: 'Unknown'
    }
  },
  cmsCenters: {
    gqlField: 'cmsCenters',
    goField: 'CMMIGroups',
    dbField: 'cmmi_groups',
    question: 'CMMI Group',
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
    question: 'CMS Component',
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
  }
};

export const planBasicsMisc: Record<string, string> = {
  heading: 'Model basics',
  clearanceHeading: 'Review model basics',
  breadcrumb: 'Model basics',
  previousNames: 'Previous model names',
  validDate: 'Please use a valid date format',
  highLevelTimeline: 'Anticipated high level timeline',
  completeICIP: 'Complete ICIP',
  clearance: 'Clearance',
  clearanceInfo:
    'When you think you’ll begin internal (CMMI) clearance through when you’ll complete OMB/ASRF clearance',
  clearanceStartDate: 'Clearance start date',
  clearanceEndDate: 'Clearance end date',
  annouceModel: 'Announce model',
  applicationPeriod: 'Application period',
  applicationStartDate: 'Application start date',
  applicationEndDate: 'Application end date',
  perforamncePeriod: 'Performance period',
  performanceStartDate: 'Performance start date',
  performanceEndDate: 'Performance end date',
  demonstrationPerformance: 'Performance period',
  demonstrationPerformanceInfo:
    'When the model will be active beginning with the go-live date',
  modelWrapUp: 'Model wrap-up end date',
  notes: 'Notes',
  tightTimeline:
    'If timelines are tight, might there be pieces of the model that can be phased in over time?',
  tightTimelineInfo:
    'That is, the basic model would start at the earliest possible date but additional facets could be phased in at a later quarter.',
  na: 'No answer entered',
  otherNotSpecificed: 'Other not specified',
  milestonesInfo:
    'Please be sure that the dates listed here are updated in the clearance calendar, if applicable. Contact the MINT Team at {{-email}} if you have any questions.'
};

export default planBasics;
