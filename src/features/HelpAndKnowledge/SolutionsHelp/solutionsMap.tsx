import React from 'react';
import {
  GetMtoSolutionContactsQuery,
  MtoCommonSolutionKey
} from 'gql/generated/graphql';

import {
  OperationalSolutionCategories,
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories
} from 'types/operationalSolutionCategories';

import GatheringInfoAlert from './SolutionDetails/_components/GatheringInfoAlert';
import Innovation4TimeLine from './SolutionDetails/Solutions/4Innovation';
import BCDATimeLine from './SolutionDetails/Solutions/BCDA';
import CentralizedDataExhangeTimeline from './SolutionDetails/Solutions/CentralizedDataExchange';
import ChronicConditionsTimeline from './SolutionDetails/Solutions/ChronicConditions';
import CMSBoxTimeline from './SolutionDetails/Solutions/CMSBox';
import CMSQualtricsTimeline from './SolutionDetails/Solutions/CMSQualtrics';
import GenericTimeline from './SolutionDetails/Solutions/Generic/timeline';
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
  OperationalSolutionCategories
> = {
  'applications-and-participation-interaction-aco-and-kidney':
    OperationalSolutionCategories.APPLICATIONS_ACO,
  'applications-and-participation-interaction-non-aco':
    OperationalSolutionCategories.APPLICATIONS_NON_ACO,
  'communication-tools-and-help-desk':
    OperationalSolutionCategories.COMMUNICATION_TOOLS,
  'contract-vehicles': OperationalSolutionCategories.CONTRACT_VEHICLES,
  data: OperationalSolutionCategories.DATA,
  'evaluation-and-review': OperationalSolutionCategories.EVALUATION_AND_REVIEW,
  learning: OperationalSolutionCategories.LEARNING,
  legal: OperationalSolutionCategories.LEGAL,
  'medicare-advantage-and-part-d':
    OperationalSolutionCategories.MEDICARE_ADVANTAGE_D,
  'medicare-fee-for-service': OperationalSolutionCategories.MEDICARE_FFS,
  'payments-and-financials': OperationalSolutionCategories.PAYMENT_FINANCIALS,
  quality: OperationalSolutionCategories.QUALITY
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

export interface HelpSolutionType extends HelpSolutionBaseType {
  pointsOfContact?: SolutionContactType[];
}

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
  enum: MtoCommonSolutionKey;
  key: string; // used for translations
  route: string;
  categories: OperationalSolutionCategories[];
  subCategories?: OperationalSolutionSubCategories[];
  acronym?: string;
  type:
    | 'IT system'
    | 'Cross-cutting group'
    | 'Contracts and contractors'
    | 'Other';
  name: string;
  alertPrimaryContact?: boolean; // Alert primary contact with missing info
  systemOwner?: SystemOwnerType;
  contractors?: SystemOwnerType[];
  components: ModalSolutionComponentType;
}

export const helpSolutions: HelpSolutionBaseType[] = [
  {
    enum: MtoCommonSolutionKey.INNOVATION,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: '4i',
    type: 'IT system',
    name: '4innovation',
    systemOwner: {
      name: 'Enterprise Systems Solutions Group, Division of Applications Development and Support',
      system: 'Office of Information Technology'
    },
    contractors: [
      {
        name: 'Softrams',
        system:
          'Innovative Design, Development, and Operations Contract (IDDOC)'
      }
    ],
    components: {
      timeline: (props: SolutionDetailProps) => (
        <Innovation4TimeLine {...props} />
      )
    }
  },
  {
    enum: MtoCommonSolutionKey.ACO_OS,
    key: 'accountableCare',
    route: 'accountable-care-organization',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'ACO-OS',
    type: 'IT system',
    name: 'Accountable Care Organization - Operational System',
    systemOwner: {
      name: 'Enterprise Systems Solutions Group, Division of Applications Development and Support',
      system: 'Office of Information Technology'
    },
    contractors: [
      {
        name: 'Softrams',
        system:
          'Innovative Design, Development, and Operations Contract (IDDOC)'
      }
    ],
    components: {
      timeline: (props: SolutionDetailProps) => (
        // Timeline is the same as 4Innovation
        <Innovation4TimeLine
          solution={{ key: 'innovation' } as HelpSolutionType}
        />
      )
    }
  },
  {
    enum: MtoCommonSolutionKey.APPS,
    key: 'automatedPlanPayment',
    route: 'automated-plan-payment-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: 'APPS',
    type: 'IT system',
    name: 'Automated Plan Payment System',
    systemOwner: {
      name: 'Medicare Plan Payment Group, Division of Payment Operations',
      system: 'Center for Medicare'
    },
    components: {}
  },
  {
    enum: MtoCommonSolutionKey.BCDA,
    key: 'bcda',
    route: 'beneficiary-claims-data-api',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'BCDA',
    type: 'IT system',
    name: 'Beneficiary Claims Data API',
    systemOwner: {
      name: 'Data Analytics and Strategy Group',
      system: 'Office of Enterprise Data and Analytics'
    },
    components: {
      timeline: (props: SolutionDetailProps) => <BCDATimeLine {...props} />
    }
  },
  {
    enum: MtoCommonSolutionKey.CDX,
    key: 'centralizedDataExhange',
    route: 'centralized-data-exchange',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'CDX',
    type: 'IT system',
    name: 'Centralized Data Exchange',
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
      timeline: (props: SolutionDetailProps) => (
        <CentralizedDataExhangeTimeline {...props} />
      )
    }
  },
  {
    enum: MtoCommonSolutionKey.CCW,
    key: 'ccWarehouse',
    route: 'chronic-conditions-warehouse',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'CCW',
    type: 'IT system',
    name: 'Chronic Conditions Warehouse',
    systemOwner: {
      name: 'Research Data Development Group',
      system: 'Office of Enterprise Data and Analytics'
    },
    contractors: [
      {
        name: 'Softrams',
        system: 'CMMI Technology Solution (CTS)'
      }
    ],
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
      OperationalSolutionCategories.CONTRACT_VEHICLES,
      OperationalSolutionCategories.DATA
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
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'CMS Box',
    type: 'IT system',
    components: {
      timeline: (props: SolutionDetailProps) => <CMSBoxTimeline {...props} />
    }
  },
  {
    enum: MtoCommonSolutionKey.CMS_QUALTRICS,
    key: 'cmsQualtrics',
    route: 'cms-qualtrics',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
    name: 'CMS Qualtrics',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.HELP_DESK],
    acronym: 'CBOSC',
    type: 'IT system',
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
      OperationalSolutionCategories.APPLICATIONS_ACO,
      OperationalSolutionCategories.APPLICATIONS_NON_ACO
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
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    acronym: 'EFT',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'eDFR',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'GovDelivery',
    type: 'IT system',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: MtoCommonSolutionKey.GS,
    key: 'grantSolutions',
    route: 'grant-solutions',
    categories: [OperationalSolutionCategories.APPLICATIONS_NON_ACO],
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
    categories: [OperationalSolutionCategories.PAYMENT_FINANCIALS],
    acronym: 'HIGLAS',
    type: 'IT system',
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
      OperationalSolutionCategories.DATA,
      OperationalSolutionCategories.QUALITY
    ],
    acronym: 'HDR',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: 'HPMS',
    type: 'IT system',
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
      OperationalSolutionCategories.CONTRACT_VEHICLES,
      OperationalSolutionCategories.PAYMENT_FINANCIALS
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
      OperationalSolutionCategories.APPLICATIONS_NON_ACO,
      OperationalSolutionCategories.CONTRACT_VEHICLES
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
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'IDR',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.LEARNING],
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
    categories: [OperationalSolutionCategories.LEGAL],
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
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'MDM-POR',
    type: 'IT system',
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
      OperationalSolutionCategories.DATA,
      OperationalSolutionCategories.PAYMENT_FINANCIALS
    ],
    acronym: 'MDM-NCBP',
    type: 'IT system',
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
      OperationalSolutionCategories.CONTRACT_VEHICLES,
      OperationalSolutionCategories.QUALITY
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
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: 'MARx',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.DATA],
    name: 'Model Space',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'Outlook Mailbox',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.QUALITY],
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
    categories: [OperationalSolutionCategories.CONTRACT_VEHICLES],
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
      OperationalSolutionCategories.APPLICATIONS_ACO,
      OperationalSolutionCategories.APPLICATIONS_NON_ACO
    ],
    subCategories: [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
    ],
    acronym: 'ARS',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.LEARNING],
    name: 'Salesforce CONNECT',
    acronym: 'CONNECT',
    type: 'IT system',
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
      OperationalSolutionCategories.APPLICATIONS_ACO,
      OperationalSolutionCategories.APPLICATIONS_NON_ACO
    ],
    subCategories: [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
    ],
    acronym: 'LOI',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.APPLICATIONS_NON_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'POST / PORTAL',
    type: 'IT system',
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
      OperationalSolutionCategories.APPLICATIONS_ACO,
      OperationalSolutionCategories.APPLICATIONS_NON_ACO
    ],
    subCategories: [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
    ],
    acronym: 'RFA',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.MEDICARE_FFS],
    name: 'Shared Systems',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.EVALUATION_AND_REVIEW],
    name: 'Research and Rapid Cycle Evaluation Group',
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
    categories: [OperationalSolutionCategories.CONTRACT_VEHICLES],
    name: 'Federal Funded Research and Development Center',
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
    categories: [OperationalSolutionCategories.CONTRACT_VEHICLES],
    name: 'Advanced Research and Development Services',
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
    categories: [OperationalSolutionCategories.DATA],
    name: 'Transformed Medicaid Statistical Information System',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.DATA],
    name: 'Enterprise Privacy Policy Engine Cloud',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    name: 'Division of Stakeholder Engagement and Policy',
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
    categories: [OperationalSolutionCategories.DATA],
    name: 'CMMI Analysis and Management System',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.APPLICATIONS_NON_ACO],
    name: 'Innovation Center Landing Page',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    name: 'Risk Adjustment Suite of Systems',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    name: 'Drug Data Processing System',
    type: 'IT system',
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
    categories: [OperationalSolutionCategories.EVALUATION_AND_REVIEW],
    name: 'Office of the Actuary',
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
    categories: [OperationalSolutionCategories.QUALITY],
    name: 'Quality Payment Program',
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
      OperationalSolutionCategories.QUALITY,
      OperationalSolutionCategories.CONTRACT_VEHICLES
    ],
    name: 'Patient Activation Measure',
    type: 'Contracts and contractors',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  }
];
