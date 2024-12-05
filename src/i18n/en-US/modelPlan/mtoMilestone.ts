import { TranslationMTOMilestoneCustom } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoMilestone: TranslationMTOMilestoneCustom = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Milestone title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.0
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
  }
};

export default mtoMilestone;
