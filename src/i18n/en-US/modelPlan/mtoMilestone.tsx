import React from 'react';

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
    label: 'Milestone title',
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
      'The "draft" indicator will signal to others that this milestone is more of a work in progress than the rest of the model-to-operations matrix (MTO).',
    questionTooltip:
      'The "draft" indicator indicates that this milestone is more of a work in progress than the rest of the model-to-operations matrix (MTO).',
    exportLabel: 'Is this a draft milestone?',
    dataType: TranslationDataType.BOOLEAN,
    formType: TranslationFormType.CHECKBOX,
    order: 1.01,
    options: {
      true: 'Yes',
      false: ' No'
    }
  },
  responsibleComponent: {
    gqlField: 'responsibleComponent',
    goField: 'ResponsibleComponent',
    dbField: 'responsible_component',
    label: 'Responsible component',
    exportLabel: 'Milestone responsible component',
    sublabel:
      'Choose the CMS component or CMMI group responsible for this work.',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 1.03,
    options: {
      NOT_STARTED: 'TEST CMMI/BSG',
      IN_PROGRESS: 'TEST DATA 2',
      COMPLETED: 'TEST OTHER'
    }
  },
  facilitatedBy: {
    gqlField: 'facilitatedBy',
    goField: 'FacilitatedBy',
    dbField: 'facilitated_by',
    label: 'Facilitated by',
    exportLabel: 'Milestone facilitated by',
    sublabel: 'Choose the role or group responsible for this work.',
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
    exportLabel: 'Milestone facilitated by (other)',
    sublabel:
      'Because you selected “Other” above, please provide a role or title.',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.045
  },
  needBy: {
    gqlField: 'needBy',
    goField: 'NeedBy',
    dbField: 'need_by',
    label: 'Need by',
    exportLabel: 'Milestone needed by',
    sublabel:
      'Choose the date when onboarding and implementation work for all solutions in this milestone should be complete. Format: mm/dd/yyyy',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.05
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Status',
    exportLabel: 'Milestone status',
    questionTooltip: (
      <div style={{ fontSize: '0.875rem', fontWeight: 400, padding: '0.5rem' }}>
        Milestone progress statuses:
        <ul className="margin-0 padding-left-3">
          <li>
            Not started: No work has started on any part of this milestone
          </li>
          <li>
            In progress: Work for this milestone and/or any of its selected
            solutions is in progress (e.g., coordination, development,
            configuration, testing, etc.)
          </li>
          <li>
            Completed: Work for this milestone and all of its selected solutions
            is finished
          </li>
        </ul>
      </div>
    ),
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 1.06,
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
    exportLabel: 'Milestone risk indicator',
    sublabel:
      'Select the risk level for this milestone. This will help you and your team identify potential risks and plan accordingly.',
    questionTooltip: (
      <div style={{ fontSize: '0.875rem', fontWeight: 400, padding: '0.5rem' }}>
        Risk indicators:
        <ul className="margin-0 padding-left-3">
          <li>No risk (on track)</li>
          <li>Some risk (off track)</li>
          <li>Significantly at risk</li>
        </ul>
      </div>
    ),
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 1.07,
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
      CDAC: 'CMMI Data Aggregation Contract',
      CMS_BOX: 'CMS Box',
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
      MDM_NCBP: 'Master Data Management for Non-Claims Based Payments',
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
      RMD: 'Rapid Measure Development',
      MS_FORMS: 'Microsoft Forms',
      RESDAC_CMDS:
        'ResDAC CMMI Model Data Sharing Model Participation Data Initiative',
      OVERLAPS_OPERATIONS_WORKGROUP: 'Overlaps Operations Workgroup'
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
    exportLabel: 'Linked solutions',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 2.1,
    multiSelectLabel: 'Selected solutions',
    flattenNestedData: 'name',
    options: {
      INNOVATION: '4innovation',
      ACO_OS: 'Accountable Care Organization - Operational System',
      APPS: 'Automated Plan Payment System',
      BCDA: 'Beneficiary Claims Data API',
      CDX: 'Centralized Data Exchange',
      CCW: 'Chronic Conditions Warehouse',
      CDAC: 'CMMI Data Aggregation Contract',
      CMS_BOX: 'CMS Box',
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
      MDM_NCBP: 'Master Data Management for Non-Claims Based Payments',
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
      RMD: 'Rapid Measure Development',
      MS_FORMS: 'Microsoft Forms',
      RESDAC_CMDS:
        'ResDAC CMMI Model Data Sharing Model Participation Data Initiative',
      OVERLAPS_OPERATIONS_WORKGROUP: 'Overlaps Operations Workgroup'
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
