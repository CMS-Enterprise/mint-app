import { TranslationMTOMilestoneCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoMilestone: TranslationMTOMilestoneCustom = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Milestone name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.0
  },
  isDraft: {
    gqlField: 'isDraft',
    goField: 'IsDraft',
    dbField: 'is_draft',
    label: 'Check if this milestone is a draft milestone',
    sublabel:
      'The "draft" indicator will signal to others that this milestone is more of a work in progress than the rest of the model-to-operations matrix.',
    exportLabel: 'Is this a draft milestone?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 1.01,
    options: {
      true: 'Draft',
      false: ' '
    }
  },
  facilitatedBy: {
    gqlField: 'facilitatedBy',
    goField: 'FacilitatedBy',
    dbField: 'facilitated_by',
    label: 'Facilitated by',
    sublabel: 'Choose the role or group responsible for this work.',
    multiSelectLabel: 'Selected roles',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.MULTISELECT,
    order: 1.03,
    options: {
      MODEL_TEAM: 'Model team',
      MODEL_LEAD: 'Model lead',
      IT_LEAD: 'IT lead',
      SOLUTION_ARCHITECT: 'Solution architect',
      IT_SYSTEM_TEAM_OR_PRODUCT_OWNER: 'IT system team or Product owner',
      PARTICIPANTS: 'Participants',
      APPLICATION_SUPPORT_CONTRACTOR: 'Application support contractor',
      IMPLEMENTATION_CONTRACTOR: 'Implementation contractor',
      EVALUATION_CONTRACTOR: 'Evaluation contractor',
      QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR:
        'Quality measures development contractor',
      LEARNING_CONTRACTOR: 'Learning contractor',
      MONITORING_CONTRACTOR: 'Monitoring contractor',
      CONTRACTING_OFFICERS_REPRESENTATIVE:
        'Contracting Officer’s Representative (COR)',
      LEARNING_AND_DIFFUSION_GROUP: 'Learning and diffusion group (LDG)',
      RESEARCH_AND_RAPID_CYCLE_EVALUATION_GROUP:
        'Research and Rapid Cycle Evaluation Group (RREG)',
      OTHER: 'Other'
    }
  },
  needBy: {
    gqlField: 'needBy',
    goField: 'NeedBy',
    dbField: 'need_by',
    label: 'Need by',
    sublabel:
      'Choose the date when onboarding and implementation work for all solutions in this milestone should be complete. Format: mm/dd/yyyy',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.04
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 1.05,
    options: {
      NOT_STARTED: 'Not started',
      IN_PROGRESS: 'In progress',
      COMPLETED: 'Completed'
    }
  },
  riskIndicator: {
    gqlField: 'riskIndicator',
    goField: 'RiskIndicator',
    dbField: 'risk_indicator',
    label: 'Risk indicator',
    sublabel:
      'Select the risk level for this milestone. This will help you and your team identify potential risks and plan accordingly.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 1.06,
    options: {
      ON_TRACK: 'No risk (on track)',
      OFF_TRACK: 'Some risk (off track)',
      AT_RISK: 'Significantly at risk'
    }
  },
  commonSolutions: {
    gqlField: 'commonSolutions',
    goField: 'CommonSolutions',
    dbField: 'common_solutions',
    label: 'Solutions',
    sublabel:
      'Select from all operational solutions and IT systems included in MINT. Select all that apply. If you choose not to add solutions now, you may add them later via the solution library or by adding a custom solution.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    order: 2.0,
    multiSelectLabel: 'Selected solutions',
    options: {
      INNOVATION: '4innovation',
      ACO_OS: 'Accountable Care Organization - Operational System',
      APPS: 'Automated Plan Payment System',
      BCDA: 'Beneficiary Claims Data API',
      CDX: 'Centralized Data Exchange',
      CCW: 'Chronic Conditions Warehouse',
      CMS_BOX: 'CMS Box',
      CMS_QUALTRICS: 'CMS Qualtrics',
      CBOSC: 'Consolidated Business Operations Support Center',
      CPI_VETTING: 'CPI Vetting',
      EFT: 'Electronic File Transfer',
      EXISTING_CMS_DATA_AND_PROCESS: 'Existing CMS Data and Process',
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
      MDM_NCBP: 'Master Data Management for Non-Claims Based Payments',
      MDM_POR: 'Master Data Management Program-Organization Relationship',
      MIDS: 'Measure and Instrument Development and Support',
      MODEL_SPACE: 'Model Space',
      MARX: 'Medicare Advantage Prescription Drug System',
      OUTLOOK_MAILBOX: 'Outlook Mailbox',
      QV: 'Quality Vertical',
      RMADA: 'Research, Measurement, Assessment, Design, and Analysis',
      ARS: 'Salesforce Application Review and Scorin',
      CONNECT: 'Salesforce CONNECT',
      LOI: 'Salesforce Letter of Intent',
      POST_PORTAL: 'Salesforce Project Officer Support Tool / Portal',
      RFA: 'Salesforce Request for Application',
      SHARED_SYSTEMS: 'Shared Systems'
    },
    readonlyOptions: {
      INNOVATION: '4i'
    }
  },
  solutions: {
    gqlField: 'solutions',
    goField: 'Solutions',
    dbField: 'solutions',
    label: 'Available solutions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.1,
    multiSelectLabel: 'Selected solutions',
    options: {
      INNOVATION: '4innovation',
      ACO_OS: 'Accountable Care Organization - Operational System',
      APPS: 'Automated Plan Payment System',
      BCDA: 'Beneficiary Claims Data API',
      CDX: 'Centralized Data Exchange',
      CCW: 'Chronic Conditions Warehouse',
      CMS_BOX: 'CMS Box',
      CMS_QUALTRICS: 'CMS Qualtrics',
      CBOSC: 'Consolidated Business Operations Support Center',
      CPI_VETTING: 'CPI Vetting',
      EFT: 'Electronic File Transfer',
      EXISTING_CMS_DATA_AND_PROCESS: 'Existing CMS Data and Process',
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
      MDM_NCBP: 'Master Data Management for Non-Claims Based Payments',
      MDM_POR: 'Master Data Management Program-Organization Relationship',
      MIDS: 'Measure and Instrument Development and Support',
      MODEL_SPACE: 'Model Space',
      MARX: 'Medicare Advantage Prescription Drug System',
      OUTLOOK_MAILBOX: 'Outlook Mailbox',
      QV: 'Quality Vertical',
      RMADA: 'Research, Measurement, Assessment, Design, and Analysis',
      ARS: 'Salesforce Application Review and Scorin',
      CONNECT: 'Salesforce CONNECT',
      LOI: 'Salesforce Letter of Intent',
      POST_PORTAL: 'Salesforce Project Officer Support Tool / Portal',
      RFA: 'Salesforce Request for Application',
      SHARED_SYSTEMS: 'Shared Systems'
    },
    readonlyOptions: {
      INNOVATION: '4i'
    }
  },
  key: {
    gqlField: 'key',
    goField: 'Key',
    dbField: 'mto_common_milestone_key',
    label: 'Key',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 3.0,
    tableReference: TableName.MTO_COMMON_MILESTONE
  },
  mtoCategoryID: {
    gqlField: 'mtoCategoryID',
    goField: 'MTOCategoryID',
    dbField: 'mto_category_id',
    label: 'MTO Category ID',
    exportLabel: 'Category',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 4.0,
    tableReference: TableName.MTO_CATEGORY
  }
};

export default mtoMilestone;
