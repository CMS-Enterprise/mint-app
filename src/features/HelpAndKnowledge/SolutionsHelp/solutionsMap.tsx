import React from 'react';
import {
  GetMtoSolutionContactsQuery,
  MtoCommonSolutionKey,
  MtoCommonSolutionSubject,
  MtoSolutionType
} from 'gql/generated/graphql';

import {
  MtoCommonSolutionSubject,
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories
} from 'types/MtoCommonSolutionSubject';

import GatheringInfoAlert from './SolutionDetails/_components/GatheringInfoAlert';
import Innovation4TimeLine from './SolutionDetails/Solutions/4Innovation';
import BCDATimeLine from './SolutionDetails/Solutions/BCDA';
import CentralizedDataExhangeTimeline from './SolutionDetails/Solutions/CentralizedDataExchange';
import ChronicConditionsTimeline from './SolutionDetails/Solutions/ChronicConditions';
import CMSBoxTimeline from './SolutionDetails/Solutions/CMSBox';
import CMSQualtricsTimeline from './SolutionDetails/Solutions/CMSQualtrics';
import GenericTimeline from './SolutionDetails/Solutions/Generic/Timeline';
import HIGLASTimeline from './SolutionDetails/Solutions/HIGLAS';
import OutlookMailboxTimeLine from './SolutionDetails/Solutions/OutlookMailbox';
import RMADATimeline from './SolutionDetails/Solutions/RMADA';
import SalesforceApplicationReviewTimeline from './SolutionDetails/Solutions/SalesforceApplicationReview';
import SharedSystemsTimeLine from './SolutionDetails/Solutions/SharedSystems';

export type SolutionDetailProps = {
  solution: HelpSolutionType;
};

export const solutionHelpRoute: string =
  '/help-and-knowledge/operational-solutions';

// Operational Solution categories
export const operationalSolutionCategoryMap: Record<
  OperationalSolutionCategoryRoute,
  MtoCommonSolutionSubject
> = {
  'applications-and-participation-interaction-aco-and-kidney':
    MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
  'applications-and-participation-interaction-non-aco':
    MtoCommonSolutionSubject.APPLICATIONS_NON_ACO,
  'communication-tools-and-help-desk':
    MtoCommonSolutionSubject.COMMUNICATION_TOOLS,
  'contract-vehicles': MtoCommonSolutionSubject.CONTRACT_VEHICLES,
  data: MtoCommonSolutionSubject.DATA,
  'evaluation-and-review': MtoCommonSolutionSubject.EVALUATION_AND_REVIEW,
  learning: MtoCommonSolutionSubject.LEARNING,
  legal: MtoCommonSolutionSubject.LEGAL,
  'medicare-advantage-and-part-d':
    MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D,
  'medicare-fee-for-service': MtoCommonSolutionSubject.MEDICARE_FFS,
  'payments-and-financials': MtoCommonSolutionSubject.PAYMENT_FINANCIALS,
  quality: MtoCommonSolutionSubject.QUALITY
};

export const operationalSolutionSubCategoryMap: Record<
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories[] | null
> = {
  'applications-and-participation-interaction-aco-and-kidney': [
    OperationalSolutionSubCategories.APPLICATIONS,
    OperationalSolutionSubCategories.PARTICIPANT_INTERACTION
  ],
  'applications-and-participation-interaction-non-aco': [
    OperationalSolutionSubCategories.COOPERATIVE_AGREEMENT_APPS,
    OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS,
    OperationalSolutionSubCategories.PARTICIPANT_INTERACTION
  ],
  'communication-tools-and-help-desk': [
    OperationalSolutionSubCategories.COMMUNICATION_TOOLS,
    OperationalSolutionSubCategories.HELP_DESK
  ],
  'contract-vehicles': null,
  data: null,
  'evaluation-and-review': null,
  learning: null,
  legal: null,
  'medicare-advantage-and-part-d': null,
  'medicare-fee-for-service': null,
  'payments-and-financials': null,
  quality: null
};

export type SolutionContactType =
  GetMtoSolutionContactsQuery['mtoCommonSolutions'][0]['contactInformation']['pointsOfContact'][0];

export type SolutionContractorType =
  GetMtoSolutionContactsQuery['mtoCommonSolutions'][0]['contractors'][0];

export interface HelpSolutionType extends HelpSolutionBaseType {
  contractors?: SolutionContractorType[];
  pointsOfContact?: SolutionContactType[];
}
// TODO:replace this type with query generated once query is added
export type SystemOwnerType = {
  name: string;
  system?: string;
};

export type SolutionGenericType = {
  about: boolean;
  timeline: boolean;
  'points-of-contact': boolean;
};

type SolutionComponentType = (props: SolutionDetailProps) => JSX.Element;

export type ModalSolutionComponentType = {
  about?: SolutionComponentType;
  timeline?: SolutionComponentType;
  'points-of-contact'?: SolutionComponentType;
};

export interface HelpSolutionBaseType {
  categories: MtoCommonSolutionSubject[];
  subCategories?: OperationalSolutionSubCategories[];
  acronym?: string;
  type: MtoSolutionType;
  name: string;
  components: ModalSolutionComponentType;
}

export const helpSolutions: Record<MtoCommonSolutionKey, HelpSolutionBaseType> = {
  
    [MtoCommonSolutionKey.INNOVATION]: {
      categories: [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS],
      subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
      acronym: '4i',
      type: MtoSolutionType.IT_SYSTEM,
      name: '4innovation',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <Innovation4TimeLine {...props} />
        )
      }
    },
    [MtoCommonSolutionKey.ACO_OS]: {
      categories: [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS],
      subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
      acronym: 'ACO-OS',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Accountable Care Organization - Operational System',
      components: {
        timeline: (props: SolutionDetailProps) => (
          // Timeline is the same as 4Innovation
          <Innovation4TimeLine
            solution={{ key: 'innovation' } as HelpSolutionType}
          />
        )
      }
    },
    [MtoCommonSolutionKey.APPS]: {
      categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
      acronym: 'APPS',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Automated Plan Payment System',
      components: {}
    },
    [MtoCommonSolutionKey.BCDA]: {
      categories: [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS],
      subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
      acronym: 'BCDA',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Beneficiary Claims Data API',
      components: {
        timeline: (props: SolutionDetailProps) => <BCDATimeLine {...props} />
      }
    },
    [MtoCommonSolutionKey.BCDA]: {
      categories: [MtoCommonSolutionSubject.DATA],
      acronym: 'CDX',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Centralized Data Exchange',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <CentralizedDataExhangeTimeline {...props} />
        )
      }
    },
    [MtoCommonSolutionKey.CCW]: {
      categories: [MtoCommonSolutionSubject.DATA],
      acronym: 'CCW',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Chronic Conditions Warehouse',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <ChronicConditionsTimeline {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.CDAC,
      key: 'cdac',
      route: 'cmmi-data-aggregation-contract',
      categories: [
        MtoCommonSolutionSubject.CONTRACT_VEHICLES,
        MtoCommonSolutionSubject.DATA
      ],
      acronym: 'CDAC',
      type: 'Contracts and contractors',
      name: 'CMMI Data Aggregation Contract',
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.CMS_BOX,
      key: 'cmsBox',
      route: 'cms-box',
      categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS],
      subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
      name: 'CMS Box',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => <CMSBoxTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.CMS_QUALTRICS,
      key: 'cmsQualtrics',
      route: 'cms-qualtrics',
      categories: [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS],
      subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
      name: 'CMS Qualtrics',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <CMSQualtricsTimeline {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.CBOSC,
      key: 'cbosc',
      route: 'consolidated-business-operations-support-center',
      categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS],
      subCategories: [OperationalSolutionSubCategories.HELP_DESK],
      acronym: 'CBOSC',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Consolidated Business Operations Support Center',
      systemOwner: {
        name: 'Business Services Group, Division of System Support, Operations, and Security',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Softrams',
          system: 'CMMI Technology Solution (CTS)'
        }
      ],
      components: {}
    },
    {
      enum: MtoCommonSolutionKey.CPI_VETTING,
      key: 'cpiVetting',
      route: 'cpi-vetting',
      categories: [
        MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
        MtoCommonSolutionSubject.APPLICATIONS_NON_ACO
      ],
      subCategories: [
        OperationalSolutionSubCategories.APPLICATIONS,
        OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
      ],
      name: 'CPI Vetting',
      type: 'Other',
      alertPrimaryContact: true,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.EFT,
      key: 'electronicFileTransfer',
      route: 'electronic-file-transfer',
      categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS],
      subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
      acronym: 'EFT',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Electronic File Transfer',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.EDFR,
      key: 'expandedDataFeedback',
      route: 'expanded-data-feedback-reporting',
      categories: [MtoCommonSolutionSubject.DATA],
      acronym: 'eDFR',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Expanded Data Feedback Reporting',
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Global Alliant',
          system: 'Innovation Support Platform (ISP)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.GOVDELIVERY,
      key: 'govDelivery',
      route: 'gov-delivery',
      categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS],
      subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
      name: 'GovDelivery',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.GS,
      key: 'grantSolutions',
      route: 'grant-solutions',
      categories: [MtoCommonSolutionSubject.APPLICATIONS_NON_ACO],
      subCategories: [
        OperationalSolutionSubCategories.COOPERATIVE_AGREEMENT_APPS
      ],
      acronym: 'GS',
      type: 'Other',
      name: 'GrantSolutions',
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.HIGLAS,
      key: 'higlas',
      route: 'healthcare-integrated-general-kedger-accounting-system',
      categories: [MtoCommonSolutionSubject.PAYMENT_FINANCIALS],
      acronym: 'HIGLAS',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Healthcare Integrated General Ledger Accounting System',
      systemOwner: {
        name: 'Accounting Management Group',
        system: 'Office of Financial Management'
      },
      components: {
        timeline: (props: SolutionDetailProps) => <HIGLASTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.HDR,
      key: 'healthDataReporting',
      route: 'health-data-reporting',
      categories: [
        MtoCommonSolutionSubject.DATA,
        MtoCommonSolutionSubject.QUALITY
      ],
      acronym: 'HDR',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Health Data Reporting',
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Global Alliant',
          system: 'Innovation Support Platform (ISP)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.HPMS,
      key: 'healthPlanManagement',
      route: 'health-plan-management-system',
      categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
      acronym: 'HPMS',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Health Plan Management System',
      systemOwner: {
        name: 'Division of Plan Data',
        system: 'Center for Medicare'
      },
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.IPC,
      key: 'innovationPayment',
      route: 'innovation-payment-contract',
      categories: [
        MtoCommonSolutionSubject.CONTRACT_VEHICLES,
        MtoCommonSolutionSubject.PAYMENT_FINANCIALS
      ],
      acronym: 'IPC',
      type: 'Contracts and contractors',
      name: 'Innovation Payment Contractor',
      systemOwner: {
        name: 'Business Services Group, Division of Budget Operations & Management',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'National Government Services (NGS)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.ISP,
      key: 'innovationSupport',
      route: 'innovation-support-platform',
      categories: [
        MtoCommonSolutionSubject.APPLICATIONS_NON_ACO,
        MtoCommonSolutionSubject.CONTRACT_VEHICLES
      ],
      subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
      acronym: 'ISP',
      type: 'Contracts and contractors',
      name: 'Innovation Support Platform',
      contractors: [
        {
          name: 'Global Alliant',
          system: 'Prime'
        },
        {
          name: 'Acument',
          system: 'Subcontractor'
        },
        {
          name: 'ICF International',
          system: 'Subcontractor'
        },
        {
          name: 'Tier 1 Consulting',
          system: 'Subcontractor'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.IDR,
      key: 'integratedDataRepository',
      route: 'integrated-data-repository',
      categories: [MtoCommonSolutionSubject.DATA],
      acronym: 'IDR',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Integrated Data Repository',
      systemOwner: {
        name: 'Enterprise Architecture and Data Group, Division of Enterprise Information Management Services',
        system: 'Office of Information Technology'
      },
      alertPrimaryContact: true,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.LDG,
      key: 'learningAndDiffusion',
      route: 'learning-and-diffusion-group',
      categories: [MtoCommonSolutionSubject.LEARNING],
      acronym: 'LDG',
      type: 'Cross-cutting group',
      name: 'Learning and Diffusion Group',
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.LV,
      key: 'legalVertical',
      route: 'legal-vertical',
      categories: [MtoCommonSolutionSubject.LEGAL],
      acronym: 'LV',
      type: 'Other',
      name: 'Legal Vertical',
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.MDM_POR,
      key: 'masterDataManagementProgramOrganizationRelationship',
      route: 'master-data-management-program-organization-relationship',
      categories: [MtoCommonSolutionSubject.DATA],
      acronym: 'MDM-POR',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Master Data Management Program-Organization Relationship',
      systemOwner: {
        name: 'Enterprise Architecture and Data Group',
        system: 'Office of Information Technology'
      },
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.MDM_NCBP,
      key: 'masterDataManagementForNCBP',
      route: 'master-data-management-for-ncbp',
      categories: [
        MtoCommonSolutionSubject.DATA,
        MtoCommonSolutionSubject.PAYMENT_FINANCIALS
      ],
      acronym: 'MDM-NCBP',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Master Data Management for Non-Claims Based Payments',
      systemOwner: {
        name: 'Enterprise Architecture and Data Group',
        system: 'Office of Information Technology'
      },
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.MIDS,
      key: 'measureInstrumentDS',
      route: 'measure-and-instrument-development-and-support',
      categories: [
        MtoCommonSolutionSubject.CONTRACT_VEHICLES,
        MtoCommonSolutionSubject.QUALITY
      ],
      acronym: 'MIDS',
      type: 'Contracts and contractors',
      name: 'Measure and Instrument Development and Support',
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.MARX,
      key: 'marx',
      route: 'medicare-advantage-prescription-drug-system',
      categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
      acronym: 'MARx',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Medicare Advantage Prescription Drug System',
      systemOwner: {
        name: 'Medicare Plan Payment Group, Division of Payment Operations',
        system: 'Center for Medicare'
      },
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.MODEL_SPACE,
      key: 'modelSpace',
      route: 'model-space',
      categories: [MtoCommonSolutionSubject.DATA],
      name: 'Model Space',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      },
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Global Alliant',
          system: 'Innovation Support Platform (ISP)'
        }
      ]
    },
    {
      enum: MtoCommonSolutionKey.OUTLOOK_MAILBOX,
      key: 'outlookMailbox',
      route: 'outlook-mailbox',
      categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS],
      subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
      name: 'Outlook Mailbox',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <OutlookMailboxTimeLine {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.QV,
      key: 'qualityVertical',
      route: 'quality-vertical',
      categories: [MtoCommonSolutionSubject.QUALITY],
      acronym: 'QV',
      type: 'Other',
      name: 'Quality Vertical',
      components: {
        timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.RMADA,
      key: 'rmada',
      route: 'research-measurement-assessment-design-and-analysis',
      categories: [MtoCommonSolutionSubject.CONTRACT_VEHICLES],
      acronym: 'RMADA',
      type: 'Contracts and contractors',
      name: 'Research, Measurement, Assessment, Design, and Analysis',
      components: {
        timeline: (props: SolutionDetailProps) => <RMADATimeline {...props} />
      }
    },
    {
      enum: MtoCommonSolutionKey.ARS,
      key: 'ars',
      route: 'salesforce-application-review-and-scoring',
      categories: [
        MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
        MtoCommonSolutionSubject.APPLICATIONS_NON_ACO
      ],
      subCategories: [
        OperationalSolutionSubCategories.APPLICATIONS,
        OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
      ],
      acronym: 'ARS',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Salesforce Application Review and Scoring',
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Softrams',
          system: 'CMMI Technology Solution (CTS)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => (
          <SalesforceApplicationReviewTimeline {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.CONNECT,
      key: 'salesforceConnect',
      route: 'salesforce-connect',
      categories: [MtoCommonSolutionSubject.LEARNING],
      name: 'Salesforce CONNECT',
      acronym: 'CONNECT',
      type: MtoSolutionType.IT_SYSTEM,
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Softrams',
          system: 'CMMI Technology Solution (CTS)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => (
          // Timeline is the same as 4Innovation
          <SalesforceApplicationReviewTimeline
            solution={{ key: 'ars' } as HelpSolutionType}
          />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.LOI,
      key: 'salesforceLOI',
      route: 'salesforce-letter-of-intent',
      categories: [
        MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
        MtoCommonSolutionSubject.APPLICATIONS_NON_ACO
      ],
      subCategories: [
        OperationalSolutionSubCategories.APPLICATIONS,
        OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
      ],
      acronym: 'LOI',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Salesforce Letter of Intent',
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Softrams',
          system: 'CMMI Technology Solution (CTS)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => (
          // Timeline is the same as 4Innovation
          <SalesforceApplicationReviewTimeline
            solution={{ key: 'ars' } as HelpSolutionType}
          />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.POST_PORTAL,
      key: 'salesforcePortal',
      route: 'salesforce-project-officer-support-tool-portal',
      categories: [MtoCommonSolutionSubject.APPLICATIONS_NON_ACO],
      subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
      acronym: 'POST / PORTAL',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Salesforce Project Officer Support Tool / Portal',
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Softrams',
          system: 'CMMI Technology Solution (CTS)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => (
          // Timeline is the same as 4Innovation
          <SalesforceApplicationReviewTimeline
            solution={{ key: 'ars' } as HelpSolutionType}
          />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.RFA,
      key: 'salesforceRequestApplication',
      route: 'salesforce-request-for-application',
      categories: [
        MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
        MtoCommonSolutionSubject.APPLICATIONS_NON_ACO
      ],
      subCategories: [
        OperationalSolutionSubCategories.APPLICATIONS,
        OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
      ],
      acronym: 'RFA',
      type: MtoSolutionType.IT_SYSTEM,
      name: 'Salesforce Request for Application',
      systemOwner: {
        name: 'Business Services Group',
        system: 'Center for Medicare and Medicaid Innovation'
      },
      contractors: [
        {
          name: 'Softrams',
          system: 'CMMI Technology Solution (CTS)'
        }
      ],
      components: {
        timeline: (props: SolutionDetailProps) => (
          // Timeline is the same as 4Innovation
          <SalesforceApplicationReviewTimeline
            solution={{ key: 'ars' } as HelpSolutionType}
          />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.SHARED_SYSTEMS,
      key: 'sharedSystems',
      route: 'shared-systems',
      categories: [MtoCommonSolutionSubject.MEDICARE_FFS],
      name: 'Shared Systems',
      type: MtoSolutionType.IT_SYSTEM,
      systemOwner: {
        name: 'Applications Management Group, Division of Shared Systems Management',
        system: 'Office of Information Technology'
      },
      components: {
        timeline: (props: SolutionDetailProps) => (
          <SharedSystemsTimeLine {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.RREG,
      key: 'reasearchAndRapidCycleEvaluationGroup',
      route: 'research-and-rapid-cycle-evaluation-group',
      categories: [MtoCommonSolutionSubject.EVALUATION_AND_REVIEW],
      name: 'Research and Rapid Cycle Evaluation Group',
      acronym: 'RREG',
      type: 'Cross-cutting group',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.FFRDC,
      key: 'federallyFundedResearchAndDevelopmentCenter',
      route: 'federally-funded-research-and-development-center',
      categories: [MtoCommonSolutionSubject.CONTRACT_VEHICLES],
      name: 'Federal Funded Research and Development Center',
      acronym: 'FFRDC',
      type: 'Contracts and contractors',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.ARDS,
      key: 'actuarialResearchAndDesignServices',
      route: 'actuarial-research-and-design-services',
      categories: [MtoCommonSolutionSubject.CONTRACT_VEHICLES],
      name: 'Actuarial Research and Development Services',
      acronym: 'ARDS',
      type: 'Contracts and contractors',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.T_MISS,
      key: 'transformedMedicaidStatisticalInformationSystem',
      route: 'transformed-medicaid-statistical-information-system',
      categories: [MtoCommonSolutionSubject.DATA],
      name: 'Transformed Medicaid Statistical Information System',
      acronym: 'T-MSIS',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.EPPE,
      key: 'enterprisePrivacyPolicyEngine',
      route: 'enterprise-privacy-policy-engine',
      categories: [MtoCommonSolutionSubject.DATA],
      name: 'Enterprise Privacy Policy Engine Cloud',
      acronym: 'EPPE',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.DSEP,
      key: 'divisionOfStakeholderEngagementAndPolicy',
      route: 'division-of-stakeholder-engagement-and-policy',
      categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS],
      name: 'Division of Stakeholder Engagement and Policy',
      acronym: 'DSEP',
      type: 'Other',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.AMS,
      key: 'cmmiAnalysisAndManagementSystem',
      route: 'cmmi-analysis-and-management-system',
      categories: [MtoCommonSolutionSubject.DATA],
      name: 'CMMI Analysis and Management System',
      acronym: 'AMS',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.IC_LANDING,
      key: 'innovationCenterLandingPage',
      route: 'innovation-center-landing-page',
      categories: [MtoCommonSolutionSubject.APPLICATIONS_NON_ACO],
      name: 'Innovation Center Landing Page',
      acronym: 'IC Landing',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.RASS,
      key: 'riskAdjustmentSuiteOfSystems',
      route: 'risk-adjustment-suite-of-systems',
      categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
      name: 'Risk Adjustment Suite of Systems',
      acronym: 'RASS',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.DDPS,
      key: 'drugDataProcessingSystem',
      route: 'drug-data-processing-system',
      categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
      name: 'Drug Data Processing System',
      acronym: 'DDPS',
      type: MtoSolutionType.IT_SYSTEM,
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.OACT,
      key: 'officeOfTheActuary',
      route: 'office-of-the-actuary',
      categories: [MtoCommonSolutionSubject.EVALUATION_AND_REVIEW],
      name: 'Office of the Actuary',
      acronym: 'OACT',
      type: 'Other',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.QPP,
      key: 'qualityPaymentProgram',
      route: 'quality-payment-program',
      categories: [MtoCommonSolutionSubject.QUALITY],
      name: 'Quality Payment Program',
      acronym: 'QPP',
      type: 'Other',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    },
    {
      enum: MtoCommonSolutionKey.PAM,
      key: 'patientActivationMeasure',
      route: 'patient-activation-measure',
      categories: [
        MtoCommonSolutionSubject.QUALITY,
        MtoCommonSolutionSubject.CONTRACT_VEHICLES
      ],
      name: 'Patient Activation Measure',
      acronym: 'PAM',
      type: 'Contracts and contractors',
      components: {
        timeline: (props: SolutionDetailProps) => (
          <GatheringInfoAlert {...props} />
        )
      }
    }
  };
