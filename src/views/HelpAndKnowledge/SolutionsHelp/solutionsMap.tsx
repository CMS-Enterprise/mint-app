import React from 'react';

import OperationalSolutionCategories from 'data/operationalSolutionCategories';
import { OperationalSolutionKey } from 'types/graphql-global-types';

import { SolutionDetailProps } from './SolutionDetails/Solutions';
import Innovation4 from './SolutionDetails/Solutions/4Innovation';
import CentralizedDataExhange from './SolutionDetails/Solutions/CentralizedDataExchange';

type CategoryType = {
  [key: string]: OperationalSolutionCategories;
};

// Operational Solution categories
export const operationalSolutionCategoryMap: CategoryType = {
  applications: OperationalSolutionCategories.APPLICATIONS,
  'communication-tools': OperationalSolutionCategories.COMMUNICATION_TOOLS,
  'contractors-and-contract-vehicles':
    OperationalSolutionCategories.CC_VEHICLES,
  'database-and-data-management':
    OperationalSolutionCategories.DATABASE_MANAGEMENT,
  'data-exchange': OperationalSolutionCategories.DATA_EXCHANGE,
  'data-reporting': OperationalSolutionCategories.DATA_REPORTING,
  'help-desks': OperationalSolutionCategories.HELP_DESKS,
  learning: OperationalSolutionCategories.LEARNING,
  legal: OperationalSolutionCategories.LEGAL,
  'medicare-advantage-and-part-d':
    OperationalSolutionCategories.MEDICARE_ADVANTAGE_D,
  'medicare-fee-for-service': OperationalSolutionCategories.MEDICARE_FFS,
  quality: OperationalSolutionCategories.QUALITY
};

type ContactRoles =
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
  | 'Beneficiary Listening Session Point of Contact'
  | 'Deputy Director, Division of Enterprise Information Management Services'
  | 'System Owner'
  | 'Director, Division of System Support, Operation and Security (DSSOS)'
  | 'CMMI/BSG Point of Contact'
  | 'CMMI/BSG Project Support'
  | 'Overlaps Operations Support'
  | 'OIT Point of Contact'
  | 'OIT Government Task Lead'
  | 'Quality Vertical'
  | 'Contracting Officer Representative, Division of Centralized Contracts and Services (DCCS)'
  | 'Quality Subject Matter Expert (QSME)'
  | 'Director, Division of Portfolio Management & Strategy'
  | 'Division Director, Division of System Support, Operation and Security (DSSOS)';

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

export interface HelpSolutionType {
  enum: OperationalSolutionKey | null; // TODO: should not be null, some enums havent been created
  key: string; // used for translations
  route: string;
  categories: OperationalSolutionCategories[];
  acronym?: string;
  name: string;
  pointsOfContact: SolutionContactType[];
  systemOwner?: SystemOwnerType;
  contractors?: SystemOwnerType[];
  generic: SolutionGenericType;
  component: (props: SolutionDetailProps) => JSX.Element;
}

export const helpSolutions: HelpSolutionType[] = [
  {
    enum: OperationalSolutionKey.INNOVATION,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => <Innovation4 {...props} />
  },
  {
    enum: OperationalSolutionKey.ACO_OS,
    key: 'accountableCare',
    route: 'accountable-care-organization',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: 'CO-OS',
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'centralizedDataExhange',
    route: 'centralized-data-exchange',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.CCW,
    key: 'ccWarehouse',
    route: 'chronic-conditions-warehouse',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'cmsBox',
    route: 'cms-box',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    name: 'CMS Box',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'cmsQualtrics',
    route: 'cms-qualtrics',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    name: 'CMS Qualtrics',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.CBOSC,
    key: 'cbosc',
    route: 'consolidated-business-operations-support-center',
    categories: [OperationalSolutionCategories.HELP_DESKS],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'cpiVetting',
    route: 'cpi-vetting',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    name: 'CPI Vetting',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'electronicFileTransfer',
    route: 'electronic-file-transfer',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: 'EFT',
    name: 'Electronic File Transfer',
    pointsOfContact: [
      {
        name: 'MINT Team',
        email: 'MINTTeam@cms.hhs.gov'
      }
    ],
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'expandedDataFeedback',
    route: 'expanded-data-feedback-reporting',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.GRANT_SOLUTIONS,
    key: 'grantSolutions',
    route: 'grant-solutions',
    categories: [
      OperationalSolutionCategories.APPLICATIONS,
      OperationalSolutionCategories.COMMUNICATION_TOOLS
    ],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.HIGLAS,
    key: 'higlas',
    route: 'healthcare-integrated-general-kedger-accounting-system',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.NEW_CMMI_PROCESS,
    key: 'healthDataReporting',
    route: 'health-data-reporting',
    categories: [OperationalSolutionCategories.QUALITY],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.IPC,
    key: 'innovationPayment',
    route: 'innovation-payment-contract',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: 'IPC',
    name: 'Innovation Payment Contractor',
    pointsOfContact: [
      {
        name: 'Donna Schmidt',
        email: 'donna.schmidt@cms.hhs.gov',
        role:
          'Director, Division of System Support, Operation and Security (DSSOS)'
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
        'Business Services Group, Division of System Support, Operation and Security',
      system: 'Center for Medicare and Medicaid Innovation'
    },
    contractors: [
      {
        name: 'National Government Services (NGS)'
      }
    ],
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.IDR,
    key: 'integratedDataRepository',
    route: 'integrated-data-repository',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.MDM,
    key: 'masterDataManagement',
    route: 'master-data-management',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'measureInstrumentDS',
    route: 'measure-and-instrument-development-and-support',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.RMADA,
    key: 'rmada',
    route: 'research-measurement-assessment-design-and-analysis',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: 'RMADA',
    name: 'Research, Measurement, Assessment, Design, and Analysis',
    pointsOfContact: [
      {
        name: 'Joe Pusateri',
        email: 'joseph.pusateri@cms.hhs.gov',
        role: 'Contracting Officer Representative'
      }
    ],
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.ARS,
    key: 'ars',
    route: 'salesforce-application-review-and-scoring',
    categories: [OperationalSolutionCategories.APPLICATIONS],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: null,
    key: 'salesforceLOI',
    route: 'salesforce-letter-of-intent',
    categories: [OperationalSolutionCategories.APPLICATIONS],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.SALESFORCE_PORTAL,
    key: 'salesforcePortal',
    route: 'salesforce-project-officer-support-tool-portal',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  },
  {
    enum: OperationalSolutionKey.RFA,
    key: 'salesforceRequestApplication',
    route: 'salesforce-request-for-application',
    categories: [OperationalSolutionCategories.APPLICATIONS],
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
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
          'Division Director, Division of System Support, Operation and Security (DSSOS)'
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
    generic: {
      about: true,
      timeline: false,
      'points-of-contact': true
    },
    component: (props: SolutionDetailProps) => (
      <CentralizedDataExhange {...props} />
    )
  }
];
