import React from 'react';
import {
  OperationalSolutionCategories,
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories
} from 'features/ModelPlan/TaskList/ITSolutions/operationalSolutionCategories';
import {
  GetPossibleSolutionsQuery,
  OperationalSolutionKey
} from 'gql/generated/graphql';

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
  learning: null,
  legal: null,
  'medicare-advantage-and-part-d': null,
  'medicare-fee-for-service': null,
  'payments-and-financials': null,
  quality: null
};

export type SolutionContactType = GetPossibleSolutionsQuery['possibleOperationalSolutions'][0]['pointsOfContact'][0];

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
  enum: OperationalSolutionKey;
  key: string; // used for translations
  route: string;
  categories: OperationalSolutionCategories[];
  subCategories?: OperationalSolutionSubCategories[];
  acronym?: string;
  name: string;
  alertPrimaryContact?: boolean; // Alert primary contact with missing info
  systemOwner?: SystemOwnerType;
  contractors?: SystemOwnerType[];
  components: ModalSolutionComponentType;
}

export const helpSolutions: HelpSolutionBaseType[] = [
  {
    enum: OperationalSolutionKey.INNOVATION,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: '4i',
    name: '4innovation',
    systemOwner: {
      name:
        'Enterprise Systems Solutions Group, Division of Applications Development and Support',
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
    enum: OperationalSolutionKey.ACO_OS,
    key: 'accountableCare',
    route: 'accountable-care-organization',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'ACO-OS',
    name: 'Accountable Care Organization - Operational System',
    systemOwner: {
      name:
        'Enterprise Systems Solutions Group, Division of Applications Development and Support',
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
    enum: OperationalSolutionKey.APPS,
    key: 'automatedPlanPayment',
    route: 'automated-plan-payment-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: 'APPS',
    name: 'Automated Plan Payment System',
    systemOwner: {
      name: 'Medicare Plan Payment Group, Division of Payment Operations',
      system: 'Center for Medicare'
    },
    components: {}
  },
  {
    enum: OperationalSolutionKey.BCDA,
    key: 'bcda',
    route: 'beneficiary-claims-data-api',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'BCDA',
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
    enum: OperationalSolutionKey.CDX,
    key: 'centralizedDataExhange',
    route: 'centralized-data-exchange',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'CDX',
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
    enum: OperationalSolutionKey.CCW,
    key: 'ccWarehouse',
    route: 'chronic-conditions-warehouse',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'CCW',
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
    enum: OperationalSolutionKey.CMS_BOX,
    key: 'cmsBox',
    route: 'cms-box',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'CMS Box',
    components: {
      timeline: (props: SolutionDetailProps) => <CMSBoxTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.CMS_QUALTRICS,
    key: 'cmsQualtrics',
    route: 'cms-qualtrics',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
    name: 'CMS Qualtrics',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <CMSQualtricsTimeline {...props} />
      )
    }
  },
  {
    enum: OperationalSolutionKey.CBOSC,
    key: 'cbosc',
    route: 'consolidated-business-operations-support-center',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.HELP_DESK],
    acronym: 'CBOSC',
    name: 'Consolidated Business Operations Support Center',
    systemOwner: {
      name:
        'Business Services Group, Division of System Support, Operations, and Security',
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
    enum: OperationalSolutionKey.CPI_VETTING,
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
    alertPrimaryContact: true,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  {
    enum: OperationalSolutionKey.EFT,
    key: 'electronicFileTransfer',
    route: 'electronic-file-transfer',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    acronym: 'EFT',
    name: 'Electronic File Transfer',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  {
    enum: OperationalSolutionKey.EDFR,
    key: 'expandedDataFeedback',
    route: 'expanded-data-feedback-reporting',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'eDFR',
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
    enum: OperationalSolutionKey.GOVDELIVERY,
    key: 'govDelivery',
    route: 'gov-delivery',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'GovDelivery',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.GS,
    key: 'grantSolutions',
    route: 'grant-solutions',
    categories: [OperationalSolutionCategories.APPLICATIONS_NON_ACO],
    subCategories: [
      OperationalSolutionSubCategories.COOPERATIVE_AGREEMENT_APPS
    ],
    acronym: 'GS',
    name: 'GrantSolutions',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.HIGLAS,
    key: 'higlas',
    route: 'healthcare-integrated-general-kedger-accounting-system',
    categories: [OperationalSolutionCategories.PAYMENT_FINANCIALS],
    acronym: 'HIGLAS',
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
    enum: OperationalSolutionKey.HDR,
    key: 'healthDataReporting',
    route: 'health-data-reporting',
    categories: [
      OperationalSolutionCategories.DATA,
      OperationalSolutionCategories.QUALITY
    ],
    acronym: 'HDR',
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
    enum: OperationalSolutionKey.HPMS,
    key: 'healthPlanManagement',
    route: 'health-plan-management-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: 'HPMS',
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
    enum: OperationalSolutionKey.IPC,
    key: 'innovationPayment',
    route: 'innovation-payment-contract',
    categories: [
      OperationalSolutionCategories.CONTRACT_VEHICLES,
      OperationalSolutionCategories.PAYMENT_FINANCIALS
    ],
    acronym: 'IPC',
    name: 'Innovation Payment Contractor',
    systemOwner: {
      name:
        'Business Services Group, Division of Budget Operations & Management',
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
    enum: OperationalSolutionKey.ISP,
    key: 'innovationSupport',
    route: 'innovation-support-platform',
    categories: [
      OperationalSolutionCategories.APPLICATIONS_NON_ACO,
      OperationalSolutionCategories.CONTRACT_VEHICLES
    ],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'ISP',
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
    enum: OperationalSolutionKey.IDR,
    key: 'integratedDataRepository',
    route: 'integrated-data-repository',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'IDR',
    name: 'Integrated Data Repository',
    systemOwner: {
      name:
        'Enterprise Architecture and Data Group, Division of Enterprise Information Management Services',
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
    enum: OperationalSolutionKey.LDG,
    key: 'learningAndDiffusion',
    route: 'learning-and-diffusion-group',
    categories: [OperationalSolutionCategories.LEARNING],
    acronym: 'LDG',
    name: 'Learning and Diffusion Group',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.LV,
    key: 'legalVertical',
    route: 'legal-vertical',
    categories: [OperationalSolutionCategories.LEGAL],
    acronym: 'LV',
    name: 'Legal Vertical',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.MDM_POR,
    key: 'masterDataManagementProgramOrganizationRelationship',
    route: 'master-data-management-program-organization-relationship',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'MDM-POR',
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
    enum: OperationalSolutionKey.MDM_NCBP,
    key: 'masterDataManagementForNCBP',
    route: 'master-data-management-for-ncbp',
    categories: [
      OperationalSolutionCategories.DATA,
      OperationalSolutionCategories.PAYMENT_FINANCIALS
    ],
    acronym: 'MDM-NCBP',
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
    enum: OperationalSolutionKey.MIDS,
    key: 'measureInstrumentDS',
    route: 'measure-and-instrument-development-and-support',
    categories: [
      OperationalSolutionCategories.CONTRACT_VEHICLES,
      OperationalSolutionCategories.QUALITY
    ],
    acronym: 'MIDS',
    name: 'Measure and Instrument Development and Support',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.MARX,
    key: 'marx',
    route: 'medicare-advantage-prescription-drug-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: 'MARx',
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
    enum: OperationalSolutionKey.OUTLOOK_MAILBOX,
    key: 'outlookMailbox',
    route: 'outlook-mailbox',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'Outlook Mailbox',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <OutlookMailboxTimeLine {...props} />
      )
    }
  },
  {
    enum: OperationalSolutionKey.QV,
    key: 'qualityVertical',
    route: 'quality-vertical',
    categories: [OperationalSolutionCategories.QUALITY],
    acronym: 'QV',
    name: 'Quality Vertical',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.RMADA,
    key: 'rmada',
    route: 'research-measurement-assessment-design-and-analysis',
    categories: [OperationalSolutionCategories.CONTRACT_VEHICLES],
    acronym: 'RMADA',
    name: 'Research, Measurement, Assessment, Design, and Analysis',
    components: {
      timeline: (props: SolutionDetailProps) => <RMADATimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.ARS,
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
    enum: OperationalSolutionKey.CONNECT,
    key: 'salesforceConnect',
    route: 'salesforce-connect',
    categories: [OperationalSolutionCategories.LEARNING],
    name: 'Salesforce CONNECT',
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
    enum: OperationalSolutionKey.LOI,
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
    enum: OperationalSolutionKey.POST_PORTAL,
    key: 'salesforcePortal',
    route: 'salesforce-project-officer-support-tool-portal',
    categories: [OperationalSolutionCategories.APPLICATIONS_NON_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'POST / PORTAL',
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
    enum: OperationalSolutionKey.RFA,
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
    enum: OperationalSolutionKey.SHARED_SYSTEMS,
    key: 'sharedSystems',
    route: 'shared-systems',
    categories: [OperationalSolutionCategories.MEDICARE_FFS],
    name: 'Shared Systems',
    systemOwner: {
      name:
        'Applications Management Group, Division of Shared Systems Management',
      system: 'Office of Information Technology'
    },
    components: {
      timeline: (props: SolutionDetailProps) => (
        <SharedSystemsTimeLine {...props} />
      )
    }
  }
];
