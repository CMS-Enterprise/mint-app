import { TranslationFieldObject } from 'types/translation';

const planBasics: Record<string, TranslationFieldObject> = {
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
  }
};

export default planBasics;
