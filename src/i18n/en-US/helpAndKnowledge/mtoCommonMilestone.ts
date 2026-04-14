import { TranslationMTOCommonMilestoneCustom } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const mtoCommonMilestone: TranslationMTOCommonMilestoneCustom = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Milestone title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.0
  },
  description: {
    gqlField: 'description',
    goField: 'Description',
    dbField: 'description',
    label: 'Milestone description',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  categoryName: {
    gqlField: 'categoryName',
    goField: 'CategoryName',
    dbField: 'category_name',
    label: 'Category',
    sublabel:
      'Choose the primary category that best fits this milestone. IT Leads adding this milestone to their MTO will be able to update this if necessary.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02
  },
  subCategoryName: {
    gqlField: 'subCategoryName',
    goField: 'SubCategoryName',
    dbField: 'sub_category_name',
    label: 'Sub-category',
    sublabel:
      'Choose the sub-category that best fits this milestone. IT Leads adding this milestone to their MTO will be able to update this if necessary.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.03
  },
  facilitatedByRole: {
    gqlField: 'facilitatedByRole',
    goField: 'FacilitatedByRole',
    dbField: 'facilitated_by_role',
    label: 'Facilitated by',
    sublabel:
      'Choose the role(s) or group(s) most often responsible for this work. Select all that apply. IT Leads adding this milestone to their MTO will be able to update this if necessary.',
    multiSelectLabel: 'Selected roles',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.MULTISELECT,
    order: 1.04,
    options: {
      IT_LEAD: 'IT Lead',
      MODEL_TEAM: 'Model team',
      MODEL_LEAD: 'Model Lead',
      MODEL_DATA_LEAD: 'Model Data Lead',
      SOLUTION_ARCHITECT: 'Solution Architect',
      IT_SYSTEM_PRODUCT_OWNER: 'IT System Product Owner',
      APPLICATION_SUPPORT_CONTRACTOR: 'Application support contractor',
      DATA_ANALYTICS_CONTRACTOR: 'Data analytics contractor',
      EVALUATION_CONTRACTOR: 'Evaluation contractor',
      IMPLEMENTATION_CONTRACTOR: 'Implementation contractor',
      LEARNING_CONTRACTOR: 'Learning contractor',
      MONITORING_CONTRACTOR: 'Monitoring contractor',
      QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR:
        'Quality measures development contractor',
      CONTRACTING_OFFICERS_REPRESENTATIVE:
        'Contracting Officers Representative (COR)',
      LEARNING_AND_DIFFUSION_GROUP: 'Learning and Diffusion Group (LDG)',
      RESEARCH_AND_RAPID_CYCLE_EVALUATION_GROUP:
        'Research and Rapid Cycle Evaluation Group (RREG)',
      PARTICIPANTS: 'Participants',
      OTHER: 'Other'
    }
  },
  facilitatedByOther: {
    gqlField: 'facilitatedByOther',
    goField: 'FacilitatedByOther',
    dbField: 'facilitated_by_other',
    label: 'Please describe',
    sublabel:
      'Because you selected “Other” above, please provide a role or group.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.05
  },
  commonSolutions: {
    gqlField: 'commonSolutions',
    goField: 'CommonSolutions',
    dbField: 'common_solutions',
    label: 'Commonly used solutions',
    sublabel:
      'Choose the solution(s) that are often used to implement this milestone. Select all that apply. IT Leads adding this milestone to their MTO will be able to update this if necessary.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 1.06,
    multiSelectLabel: 'Selected solutions',
    options: {
      INNOVATION: '4innovation',
      ACO_OS: 'Accountable Care Organization - Operational System',
      APPS: 'Automated Plan Payment System',
      BCDA: 'Beneficiary Claims Data API',
      CDX: 'Centralized Data Exchange',
      CCW: 'Chronic Conditions Warehouse',
      CDAC: 'CMMI Data Aggregation Contract',
      CMS_BOX: 'CMS Box',
      CMS_QUALTRICS: 'CMS Qualtrics',
      CBOSC: 'Consolidated Business Operations Support Center',
      CPI_VETTING: 'CPI Vetting',
      EFT: 'Electronic File Transfer',
      EDFR: 'Expanded Data Feedback Reporting',
      GOVDELIVERY: 'GovDelivery',
      GS: 'GrantSolutions',
      HDR: 'Health Data Reporting',
      HPMS: 'Health Plan Management System',
      HIGLAS: 'Healthcare Integrated General Ledger Accounting System',
      IPC: 'Innovation Payment Contractor',
      ISP: 'Innovation Support Platform',
      IDR: 'Integrated Data Repository',
      LDG: 'Learning and Diffusion Group',
      LV: 'Legal Vertical',
      MIDS: 'Measure and Instrument Development and Support',
      MODEL_SPACE: 'Model Space',
      MARX: 'Medicare Advantage Prescription Drug System',
      OUTLOOK_MAILBOX: 'Outlook Mailbox',
      QV: 'Quality Vertical',
      RMADA: 'Research, Measurement, Assessment, Design, and Analysis',
      ARS: 'Salesforce Application Review and Scoring',
      CONNECT: 'Salesforce CONNECT',
      LOI: 'Salesforce Letter of Intent',
      POST_PORTAL: 'Salesforce Project Officer Support Tool / Portal',
      RFA: 'Salesforce Request for Application',
      SHARED_SYSTEMS: 'Shared Systems',
      RREG: 'Research and Rapid Cycle Evaluation Group',
      FFRDC: 'Federally Funded Research and Development Center',
      ARDS: 'Actuarial Research and Development Solutions',
      T_MISS: 'Transformed Medicaid Statistical Information System',
      EPPE: 'Enterprise Privacy Policy Engine Cloud',
      DSEP: 'Division of Stakeholder Engagement and Policy',
      AMS: 'CMMI Analysis and Management System',
      IC_LANDING: 'Innovation Center Landing Page',
      RASS: 'Risk Adjustment Suite of Systems',
      DDPS: 'Drug Data Processing System',
      OACT: 'Office of the Actuary',
      QPP: 'Quality Payment Program',
      PAM: 'Patient Activation Measure',
      NCQA: 'National Committee for Quality Assurance',
      MS_FORMS: 'Microsoft Forms',
      RESDAC_CMDS:
        'ResDAC CMMI Model Data Sharing Model Participation Data Initiative',
      OVERLAPS_OPERATIONS_WORKGROUP: 'Overlaps Operations Workgroup',
      HETS: 'HIPAA Eligibility Transaction System',
      MCBS: 'Medicare Current Beneficiary Survey'
    },
    readonlyOptions: {
      INNOVATION: '4i'
    }
  }
};

export const mtoCommonMilestoneMisc = {
  allFieldsRequired:
    'Fields marked with an asterisk ( <s>*</s> ) are required.',
  addCommonMilestone: {
    heading: 'Add a common milestone',
    cta: 'Add milestone'
  },
  editCommonMilestone: {
    heading: 'Edit milestone',
    cta: 'Save changes'
  },
  removeCommonMilestone: 'Remove milestone',
  validation: {
    fillOut: 'Please fill out the required field.'
  },
  defaultSelectOptions: '- Select - ',
  unCategories: 'Uncategorized',
  charactersAllowed: '75 characters allowed',
  confirmationModal: {
    editCommonMilestone: {
      heading: 'Are you sure you want to save changes?',
      text: 'If you have made title and description changes, they will be updated for all models using this common milestone. All other changes will only be applied when this common milestone is added to an MTO after you save changes. These changes will also be made in any template that includes this milestone.',
      cta: 'Save changes'
    },
    removeCommonMilestone: {
      heading: 'Are you sure you want to remove this common milestone?',
      text: 'This action cannot be undone. This action will also remove this milestone from any templates. Any models using this in their model-to-operations matrix (MTO) will still have the milestone in their MTO, but may choose to manually remove it.',
      cta: 'Remove milestone'
    }
  },
  unsavedChanges: '{{count}} unsaved change',
  unsavedChanges_other: '{{count}} unsaved changes',
  save: 'Save',
  saveChanges: 'Save changes',
  cancel: 'Cancel'
};

export default mtoCommonMilestone;
