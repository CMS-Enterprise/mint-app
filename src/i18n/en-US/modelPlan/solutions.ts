import { TranslationOperationalSolutions } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const operationalSolutions: TranslationOperationalSolutions = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Solution',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  isOther: {
    gqlField: 'isOther',
    goField: 'isOther',
    dbField: 'is_other_',
    label: 'Is this a solution considered an other option?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.BOOLEAN,
    order: 1.02,
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  nameOther: {
    gqlField: 'nameOther',
    goField: 'NameOther',
    dbField: 'name_other',
    label: 'Please add a name for your solution or contractor',
    exportLabel: 'Name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.03
  },
  otherHeader: {
    gqlField: 'otherHeader',
    goField: 'OtherHeader',
    dbField: 'other_header',
    label: 'Please add a name for your solution or contractor',
    exportLabel: 'Name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.04
  },
  pocName: {
    gqlField: 'pocName',
    goField: 'PocName',
    dbField: 'poc_name',
    label: 'Point of contact',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.05
  },
  pocEmail: {
    gqlField: 'pocEmail',
    goField: 'PocEmail',
    dbField: 'poc_email',
    label: 'Email',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.06
  },
  mustStartDts: {
    gqlField: 'mustStartDts',
    goField: 'MustStartDts',
    dbField: 'must_start_dts',
    label: 'Must start by',
    sublabel: 'mm/dd/yyyy',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.07
  },
  mustFinishDts: {
    gqlField: 'mustFinishDts',
    goField: 'MustFinishDts',
    dbField: 'must_finish_dts',
    label: 'Must be ready by',
    sublabel: 'mm/dd/yyyy',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.08
  },
  needed: {
    gqlField: 'needed',
    goField: 'Needed',
    dbField: 'needed',
    label: 'Is the solution needed?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 1.09,
    options: {
      true: 'Needed',
      false: 'Not needed'
    }
  },
  key: {
    gqlField: 'key',
    goField: 'Key',
    dbField: 'key',
    label: 'How will you solve this?',
    sublabel:
      'Select an operational solution or select "Other" if you’ll solve this a different way.',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 1.1,
    options: {
      INNOVATION: '4innovation',
      ACO_OS: 'Accountable Care Organization - Operational System',
      APPS: 'Automated Plan Payment System',
      CDX: 'Centralized Data Exchange',
      CCW: 'Chronic Conditions Warehouse',
      CMS_BOX: 'CMS Box',
      CBOSC: 'Consolidated Business Operations Support Center',
      CONTRACTOR: 'Contractor',
      CPI_VETTING: 'CPI Vetting',
      CROSS_MODEL_CONTRACT: 'Cross-model contract',
      EFT: 'Electronic File Transfer',
      EXISTING_CMS_DATA_AND_PROCESS: 'Existing CMS data and process',
      EDFR: 'Expanded Data Feedback Reporting',
      GOVDELIVERY: 'GovDelivery',
      GS: 'GrantSolutions',
      HDR: 'Health Data Reporting',
      HPMS: 'Health Plan Management System',
      HIGLAS: 'Healthcare Integrated General Ledger Accounting System',
      IPC: 'Innovation Payment Contractor',
      IDR: 'Integrated Data Repository',
      INTERNAL_STAFF: 'Internal staff',
      LDG: 'Learning and Diffusion Group',
      LV: 'Legal Vertical',
      MDM_POR: 'Master Data Management Program-Organization Relationship',
      MDM_NCBP: 'Master Data Management for Non-Claims Based Payments',
      MARX: 'Medicare Advantage Prescription Drug System',
      OTHER_NEW_PROCESS: 'Other',
      OUTLOOK_MAILBOX: 'Outlook Mailbox',
      QV: 'Quality Vertical',
      RMADA: 'Research, Measurement, Assessment, Design, and Analysis',
      ARS: 'Salesforce Application Review and Scoring',
      CONNECT: 'Salesforce CONNECT',
      LOI: 'Salesforce Letter of Intent',
      POST_PORTAL: 'Salesforce Project Officer Support Tool / Portal',
      RFA: 'Salesforce Request for Application',
      SHARED_SYSTEMS: 'Shared Systems',
      BCDA: 'Beneficiary Claims Data API',
      ISP: 'Innovation Support Platform',
      MIDS: 'Measure and Instrument Development and Support',
      MODEL_SPACE: 'Model Space'
    }
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'What is the status of this solution?',
    exportLabel: 'Status',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 1.11,
    options: {
      NOT_STARTED: 'Not started',
      ONBOARDING: 'Onboarding',
      BACKLOG: 'Backlog',
      IN_PROGRESS: 'In progress',
      COMPLETED: 'Completed',
      AT_RISK: 'At risk'
    }
  }
};

export default operationalSolutions;
