import React from 'react';

import {
  OperationalSolutionCategories,
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories
} from 'data/operationalSolutionCategories';
import { OperationalSolutionKey } from 'types/graphql-global-types';

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

export type ContactRoles =
  | 'Product Owner'
  | 'Senior Lead'
  | 'Chief Quality Officer and Lead'
  | 'Interim Lead'
  | 'Quality Analyst'
  | 'Technical Lead'
  | 'Platform Lead'
  | 'Project Lead'
  | 'Point of Contact'
  | 'Subject Matter Expert'
  | 'CMMI Government Task Lead'
  | 'Contracting Officer Representative'
  | 'Operations and Management Lead '
  | 'Director, Division of Payment Operations'
  | 'Administrator'
  | 'Director, Division of Grants Management'
  | 'Deputy Director, Division of Grants Management'
  | 'Director, Division of System Support, Operation and Security (DSSOS)'
  | 'Co-team Lead'
  | 'Division Director'
  | 'Deputy Division Director'
  | 'Director, Division of Model Learning Systems (DMLS)'
  | 'Deputy Director, Division of Model Learning Systems (DMLS)'
  | 'Beneficiary Listening Session Point of Contact'
  | 'Deputy Director, Division of Enterprise Information Management Services'
  | 'System Owner'
  | 'CMMI/BSG Point of Contact'
  | 'CMMI/BSG Project Support'
  | 'Overlaps Operations Support'
  | 'OIT Point of Contact'
  | 'OIT Government Task Lead'
  | 'Quality Vertical'
  | 'Contracting Officer Representative, Division of Centralized Contracts and Services (DCCS)'
  | 'Quality Subject Matter Expert (QSME)'
  | 'Director, Division of Portfolio Management & Strategy'
  | 'Director, Division of Budget and Administrative Services (DBAS)'
  | 'Product Manager';

export type SolutionContactType = {
  name: string;
  email: string;
  role?: ContactRoles;
};

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

export interface HelpSolutionType {
  enum: OperationalSolutionKey | null; // TODO: should not be null, some enums havent been created
  key: string; // used for translations
  route: string;
  categories: OperationalSolutionCategories[];
  subCategories?: OperationalSolutionSubCategories[];
  acronym?: string;
  name: string;
  pointsOfContact: SolutionContactType[];
  systemOwner?: SystemOwnerType;
  contractors?: SystemOwnerType[];
  components: ModalSolutionComponentType;
}

export const helpSolutions: HelpSolutionType[] = [
  {
    enum: OperationalSolutionKey.INNOVATION,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.APPLICATIONS_ACO],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: '4i',
    name: '4innovation',
    pointsOfContact: [
      {
        name: '4i/ACO-OS Team',
        email: 'ACO-OIT@cms.hhs.gov'
      },
      {
        name: 'Aparna Vyas',
        email: 'aparna.vyas@cms.hhs.gov',
        role: 'Project Lead'
      },
      {
        name: 'Ashley Corbin',
        email: 'ashley.corbin@cms.hhs.gov',
        role: 'Subject Matter Expert'
      },
      {
        name: 'Nora Fleming',
        email: 'nora.fleming@cms.hhs.gov',
        role: 'Subject Matter Expert'
      }
    ],
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
    pointsOfContact: [
      {
        name: '4i/ACO-OS Team',
        email: 'ACO-OIT@cms.hhs.gov'
      },
      {
        name: 'Aparna Vyas',
        email: 'aparna.vyas@cms.hhs.gov',
        role: 'Project Lead'
      },
      {
        name: 'Ashley Corbin',
        email: 'ashley.corbin@cms.hhs.gov',
        role: 'Subject Matter Expert'
      },
      {
        name: 'Nora Fleming',
        email: 'nora.fleming@cms.hhs.gov',
        role: 'Subject Matter Expert'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Aliza Kim',
        email: 'aliza.kim@cms.hhs.gov',
        role: 'Project Lead'
      },
      {
        name: 'Edgar Howard',
        email: 'edgar.howard@cms.hhs.gov',
        role: 'Director, Division of Payment Operations'
      }
    ],
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
    name: 'Beneficiary Claims Data API',
    pointsOfContact: [
      {
        name: 'BCDA Team',
        email: 'bcapi@cms.hhs.gov'
      },
      {
        name: 'Nicole Pham',
        email: 'xuanphien.pham@cms.hhs.gov',
        role: 'Product Manager'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Yolanda Villanova',
        email: 'yolanda.villanova@cms.hhs.gov',
        role: 'Product Owner'
      },
      {
        name: 'Hung Van',
        email: 'hung.van@cms.hhs.gov',
        role: 'Technical Lead'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Cheryl Brown',
        email: 'cheryl.brown@cms.hhs.gov',
        role: 'CMMI Government Task Lead'
      }
    ],
    systemOwner: {
      name: 'Research Data Development Group',
      system: 'Office of Enterprise Data and Analytics'
    },
    contractors: [
      {
        name: 'NewWave',
        system: 'Innovation Development and Operation Services (IDOS)'
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
    name: 'CMS Box',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
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
    acronym: 'CBOSC',
    name: 'Consolidated Business Operations Support Center',
    pointsOfContact: [
      {
        name: 'Richard Speights',
        email: 'richard.speights@cms.hhs.gov',
        role: 'Contracting Officer Representative'
      },
      {
        name: 'Don Rocker',
        email: 'don.rocker1@cms.hhs.gov',
        role: 'Operations and Management Lead '
      }
    ],
    systemOwner: {
      name: 'Business Services Group, Division of IT Operations and Security',
      system: 'Center for Medicare and Medicaid Innovation'
    },
    contractors: [
      {
        name: 'NewWave',
        system: 'Innovation Development and Operation Services (IDOS)'
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
    subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
    name: 'CPI Vetting',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
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
    acronym: 'EFT',
    name: 'Electronic File Transfer',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Zach Nall',
        email: 'r.nall@cms.hhs.gov',
        role: 'Product Owner'
      }
    ],
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
    name: 'GovDelivery',
    pointsOfContact: [
      {
        name: 'Andrew Rushton',
        email: 'andrew.rushton@cms.hhs.gov',
        role: 'Administrator'
      },
      {
        name: 'Alison Rigby',
        email: 'alison.rigby@cms.hhs.gov',
        role: 'Administrator'
      }
    ],
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.GS,
    key: 'grantSolutions',
    route: 'grant-solutions',
    categories: [OperationalSolutionCategories.APPLICATIONS_NON_ACO],
    acronym: 'GS',
    name: 'GrantSolutions',
    pointsOfContact: [
      {
        name: 'Mary Greene',
        email: 'mary.greene@cms.hhs.gov',
        role: 'Director, Division of Grants Management'
      },
      {
        name: 'Michelle Brown',
        email: 'michelle.brown@cms.hhs.gov',
        role: 'Deputy Director, Division of Grants Management'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Donna Schmidt',
        email: 'donna.schmidt@cms.hhs.gov',
        role:
          'Director, Division of System Support, Operation and Security (DSSOS)'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Hung Van',
        email: 'hung.van@cms.hhs.gov',
        role: 'Technical Lead'
      },
      {
        name: 'Curtis Naumann',
        email: 'curtis.naumann@cms.hhs.gov',
        role: 'Product Owner'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Ron Topper',
        email: 'ronald.topper@cms.hhs.gov',
        role: 'Director, Division of Budget and Administrative Services (DBAS)'
      },
      {
        name: 'Sue Nonemaker',
        email: 'sue.nonemaker@cms.hhs.gov',
        role: 'Project Lead'
      },
      {
        name: 'Alyssa Larson',
        email: 'alyssa.larson@cms.hhs.gov',
        role: 'Subject Matter Expert'
      },
      {
        name: 'Philip Tennant',
        email: 'philip.tennant@cms.hhs.gov',
        role: 'Subject Matter Expert'
      }
    ],
    systemOwner: {
      name:
        'Business Services Group, Division of Budget and Administrative Services',
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
    enum: OperationalSolutionKey.IDR,
    key: 'integratedDataRepository',
    route: 'integrated-data-repository',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'IDR',
    name: 'Integrated Data Repository',
    pointsOfContact: [
      {
        name: 'Jim Brogan',
        email: 'jim.brogan@cms.hhs.gov',
        role:
          'Deputy Director, Division of Enterprise Information Management Services'
      },
      {
        name: 'Murari Selvakesavan',
        email: 'murari.selvakesavan@cms.hhs.gov',
        role: 'System Owner'
      }
    ],
    systemOwner: {
      name:
        'Enterprise Architecture and Data Group, Division of Enterprise Information Management Services',
      system: 'Office of Information Technology'
    },
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
    pointsOfContact: [
      {
        name: 'Andrew Philip',
        email: 'andrew.philip@cms.hhs.gov',
        role: 'Director, Division of Model Learning Systems (DMLS)'
      },
      {
        name: 'Taiwanna Messam Lucienne',
        email: 'taiwanna.lucienne@cms.hhs.gov',
        role: 'Deputy Director, Division of Model Learning Systems (DMLS)'
      },
      {
        name: 'Alexis Malfesi',
        email: 'alexis.malfesi@cms.hhs.gov',
        role: 'Beneficiary Listening Session Point of Contact'
      },
      {
        name: 'Erin Carrillo',
        email: 'erin.carrillo1@cms.hhs.gov',
        role: 'Beneficiary Listening Session Point of Contact'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Megan Hyde',
        email: 'megan.hyde@cms.hhs.gov',
        role: 'Co-team Lead'
      },
      {
        name: 'Erin Hagenbrok',
        email: 'erin.hagenbrok1@cms.hhs.gov',
        role: 'Co-team Lead'
      },
      {
        name: 'Ann Vrabel',
        email: 'ann.vrabel1@cms.hhs.gov',
        role: 'Division Director'
      },
      {
        name: 'Melanie Dang',
        email: 'melanie.dang1@cms.hhs.gov',
        role: 'Deputy Division Director'
      }
    ],
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: OperationalSolutionKey.MDM,
    key: 'masterDataManagement',
    route: 'master-data-management',
    categories: [OperationalSolutionCategories.DATA],
    acronym: 'MDM',
    name: 'Master Data Management',
    pointsOfContact: [
      {
        name: 'Cheryl Brown',
        email: 'cheryl.brown@cms.hhs.gov',
        role: 'CMMI/BSG Point of Contact'
      },
      {
        name: 'Felicia Addai',
        email: 'felicia.addai2@cms.hhs.gov',
        role: 'CMMI/BSG Project Support'
      },
      {
        name: 'Miyani Treva',
        email: 'miyani.treva@cms.hhs.gov',
        role: 'Overlaps Operations Support'
      },
      {
        name: 'Sameera Gudipati',
        email: 'sameera.gudipati1@cms.hhs.gov',
        role: 'OIT Point of Contact'
      },
      {
        name: 'Glenn Eyler',
        email: 'cglenn.eyler@cms.hhs.gov',
        role: 'OIT Government Task Lead'
      }
    ],
    systemOwner: {
      name: 'Enterprise Architecture and Data Group',
      system: 'Office of Information Technology'
    },
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  {
    enum: null,
    key: 'measureInstrumentDS',
    route: 'measure-and-instrument-development-and-support',
    categories: [
      OperationalSolutionCategories.CONTRACT_VEHICLES,
      OperationalSolutionCategories.QUALITY
    ],
    acronym: 'MIDS',
    name: 'Measure and Instrument Development and Support',
    pointsOfContact: [
      {
        name: 'Dustin Allison',
        email: 'dustin.allison@cms.hhs.gov',
        role: 'Quality Vertical'
      },
      {
        name: 'Teresa Winder-Wells',
        email: 'teresa.winder-wells@cms.hhs.gov',
        role:
          'Contracting Officer Representative, Division of Centralized Contracts and Services (DCCS)'
      },
      {
        name: 'Tim Day',
        email: 'timothy.day@cms.hhs.gov',
        role: 'Quality Subject Matter Expert (QSME)'
      },
      {
        name: 'Jim Gerber',
        email: 'james.gerber@cms.hhs.gov',
        role: 'Director, Division of Portfolio Management & Strategy'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
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
    name: 'Outlook Mailbox',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Alesia Hovatter',
        email: 'alesia.hovatter@cms.hhs.gov',
        role: 'Senior Lead'
      },
      {
        name: 'Susannah Bernheim',
        email: 'susannah.bernheim@cms.hhs.gov',
        role: 'Chief Quality Officer and Lead'
      },
      {
        name: 'Dustin Allison',
        email: 'dustin.allison1@cms.hhs.gov',
        role: 'Interim Lead'
      },
      {
        name: 'Sasha Gibbel',
        email: 'sasha.gibbel@cms.hhs.gov',
        role: 'Quality Analyst'
      },
      {
        name: 'Whitney Saint-Fleur',
        email: 'whitney.saintfleur@cms.hhs.gov',
        role: 'Quality Analyst'
      }
    ],
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
    pointsOfContact: [
      {
        name: 'Joe Pusateri',
        email: 'joseph.pusateri@cms.hhs.gov',
        role: 'Contracting Officer Representative'
      }
    ],
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
    subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
    acronym: 'ARS',
    name: 'Salesforce Application Review and Scoring',
    pointsOfContact: [
      {
        name: 'Elia Cossis',
        email: 'elia.cossis@cms.hhs.gov',
        role: 'Platform Lead'
      },
      {
        name: 'Chinelo Johnson',
        email: 'echinelo.johnson@cms.hhs.gov',
        role: 'Point of Contact'
      }
    ],
    systemOwner: {
      name: 'Business Services Group',
      system: 'Center for Medicare and Medicaid Innovation'
    },
    contractors: [
      {
        name: 'NewWave',
        system: 'Innovation Development and Operation Services (IDOS)'
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
    name: 'Salesforce Connect',
    pointsOfContact: [
      {
        name: 'Elia Cossis',
        email: 'elia.cossis@cms.hhs.gov',
        role: 'Platform Lead'
      },
      {
        name: 'Chinelo Johnson',
        email: 'echinelo.johnson@cms.hhs.gov',
        role: 'Point of Contact'
      }
    ],
    systemOwner: {
      name: 'Business Services Group',
      system: 'Center for Medicare and Medicaid Innovation'
    },
    contractors: [
      {
        name: 'NewWave',
        system: 'Innovation Development and Operation Services (IDOS)'
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
    subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
    acronym: 'LOI',
    name: 'Salesforce Letter of Intent',
    pointsOfContact: [
      {
        name: 'Elia Cossis',
        email: 'elia.cossis@cms.hhs.gov',
        role: 'Platform Lead'
      },
      {
        name: 'Chinelo Johnson',
        email: 'echinelo.johnson@cms.hhs.gov',
        role: 'Point of Contact'
      }
    ],
    systemOwner: {
      name: 'Business Services Group',
      system: 'Center for Medicare and Medicaid Innovation'
    },
    contractors: [
      {
        name: 'NewWave',
        system: 'Innovation Development and Operation Services (IDOS)'
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
    acronym: 'POST / PORTAL',
    name: 'Salesforce Project Officer Support Tool / Portal',
    pointsOfContact: [
      {
        name: 'Elia Cossis',
        email: 'elia.cossis@cms.hhs.gov',
        role: 'Platform Lead'
      },
      {
        name: 'Chinelo Johnson',
        email: 'echinelo.johnson@cms.hhs.gov',
        role: 'Point of Contact'
      }
    ],
    systemOwner: {
      name: 'Business Services Group',
      system: 'Center for Medicare and Medicaid Innovation'
    },
    contractors: [
      {
        name: 'NewWave',
        system: 'Innovation Development and Operation Services (IDOS)'
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
    subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
    acronym: 'RFA',
    name: 'Salesforce Request for Application',
    pointsOfContact: [
      {
        name: 'Elia Cossis',
        email: 'elia.cossis@cms.hhs.gov',
        role: 'Platform Lead'
      },
      {
        name: 'Chinelo Johnson',
        email: 'echinelo.johnson@cms.hhs.gov',
        role: 'Point of Contact'
      }
    ],
    systemOwner: {
      name: 'Business Services Group',
      system: 'Center for Medicare and Medicaid Innovation'
    },
    contractors: [
      {
        name: 'NewWave',
        system: 'Innovation Development and Operation Services (IDOS)'
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
    pointsOfContact: [
      {
        name: 'Donna Schmidt',
        email: 'donna.schmidt@cms.hhs.gov',
        role:
          'Director, Division of System Support, Operation and Security (DSSOS)'
      },
      {
        name: 'Madhu Annadata',
        email: 'madhu.annadata@cms.hhs.gov',
        role: 'Subject Matter Expert'
      }
    ],
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
