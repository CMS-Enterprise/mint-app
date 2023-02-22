import OperationalSolutionCategories from 'data/operationalSolutionCategories';
import { OperationalSolutionKey } from 'types/graphql-global-types';

type CategoryPropertiesType = {
  route: string; // route to display relevant categories
};

type CategoryType = {
  [key in OperationalSolutionCategories]: CategoryPropertiesType;
};

// Operational Solution categories
export const operationalSolutionCategoryMap: CategoryType = {
  applications: {
    route: 'applications'
  },
  communicationTools: {
    route: 'communication-tools'
  },
  contractorsContractVehicles: {
    route: 'contractors-and-contract-vehicles'
  },
  databaseDataManagement: {
    route: 'database-and-data-management'
  },
  dataExchange: {
    route: 'data-exchange'
  },
  dataReporting: {
    route: 'data-reporting'
  },
  helpDesks: {
    route: 'help-desks'
  },
  learning: {
    route: 'learning'
  },
  legal: {
    route: 'legal'
  },
  medicareAdvantagePartD: {
    route: 'medicare-advantage-and-part-d'
  },
  medicareFeeForService: {
    route: 'medicare-fee-for-service'
  },
  quality: {
    route: 'quality'
  }
};

type ContactRoles =
  | 'Technical Lead'
  | 'Project Lead'
  | 'Subject Matter Expert'
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
  | 'Director, Division of Portfolio Management & Strategy';

type SolutionContactType = {
  name: string;
  email: string;
  role?: ContactRoles;
};

type SystemOwnerType = {
  name: string;
  system?: string;
};

export interface HelpSolutionType {
  enum: OperationalSolutionKey | null; // TODO: should not be null, some enums havent been created
  key: string; // used for translations
  route: string;
  categories: OperationalSolutionCategories[];
  acronym: string | null;
  name: string;
  pointOfContact: SolutionContactType[];
  systemOwner?: SystemOwnerType;
  contractors?: SystemOwnerType[];
}

export const helpSolutions: HelpSolutionType[] = [
  {
    enum: OperationalSolutionKey.INNOVATION,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: '4i',
    name: '4innovation',
    pointOfContact: [
      {
        name: '4i/ACO-OS Team',
        email: 'ACO-OIT@cms.hhs.gov'
      }
    ]
  },
  {
    enum: OperationalSolutionKey.ACO_OS,
    key: 'accountableCare',
    route: 'accountable-care-organization',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: 'Accountable Care Organization - Operational System',
    name: 'ACO-OS',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.APPS,
    key: 'automatedPlanPayment',
    route: 'automated-plan-payment-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'centralizedDataExhange',
    route: 'centralized-data-exchange',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.CCW,
    key: 'ccWarehouse',
    route: 'chronic-conditions-warehouse',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'cmsBox',
    route: 'cms-box',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'cmsQualtrics',
    route: 'cms-qualtrics',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.CBOSC,
    key: 'cbosc',
    route: 'consolidated-business-operations-support-center',
    categories: [OperationalSolutionCategories.HELP_DESKS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'cpiVetting',
    route: 'cpi-vetting',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'electronicFileTransfer',
    route: 'electronic-file-transfer',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'expandedDataFeedback',
    route: 'expanded-data-feedback-reporting',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.GOVDELIVERY,
    key: 'govDelivery',
    route: 'gov-delivery',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.GRANT_SOLUTIONS,
    key: 'grantSolutions',
    route: 'grant-solutions',
    categories: [
      OperationalSolutionCategories.APPLICATIONS,
      OperationalSolutionCategories.COMMUNICATION_TOOLS
    ],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.HIGLAS,
    key: 'higlas',
    route: 'healthcare-integrated-general-kedger-accounting-system',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.NEW_CMMI_PROCESS,
    key: 'healthDataReporting',
    route: 'health-data-reporting',
    categories: [OperationalSolutionCategories.QUALITY],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.HPMS,
    key: 'healthPlanManagement',
    route: 'health-plan-management-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.IPC,
    key: 'innovationPayment',
    route: 'innovation-payment-contract',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.IDR,
    key: 'integratedDataRepository',
    route: 'integrated-data-repository',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'learningAndDiffusion',
    route: 'learning-and-diffusion-group',
    categories: [OperationalSolutionCategories.LEARNING],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'legalVertical',
    route: 'legal-vertical',
    categories: [OperationalSolutionCategories.LEGAL],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.MDM,
    key: 'masterDataManagement',
    route: 'master-data-management',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'measureInstrumentDS',
    route: 'measure-and-instrument-development-and-support',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.MARX,
    key: 'marx',
    route: 'medicare-advantage-prescription-drug-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.OUTLOOK_MAILBOX,
    key: 'outlookMailbox',
    route: 'outlook-mailbox',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'qualityVertical',
    route: 'quality-vertical',
    categories: [OperationalSolutionCategories.QUALITY],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.RMADA,
    key: 'rmada',
    route: 'research-measurement-assessment-design-and-analysis',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.ARS,
    key: 'ars',
    route: 'salesforce-application-review-and-scoring',
    categories: [OperationalSolutionCategories.APPLICATIONS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.CONNECT,
    key: 'salesforceConnect',
    route: 'salesforce-connect',
    categories: [OperationalSolutionCategories.LEARNING],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: null,
    key: 'salesforceLOI',
    route: 'salesforce-letter-of-intent',
    categories: [OperationalSolutionCategories.APPLICATIONS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.SALESFORCE_PORTAL,
    key: 'salesforcePortal',
    route: 'salesforce-project-officer-support-tool-portal',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.RFA,
    key: 'salesforceRequestApplication',
    route: 'salesforce-request-for-application',
    categories: [OperationalSolutionCategories.APPLICATIONS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  },
  {
    enum: OperationalSolutionKey.SHARED_SYSTEMS,
    key: 'sharedSystems',
    route: 'shared-systems',
    categories: [OperationalSolutionCategories.MEDICARE_FFS],
    acronym: '',
    name: '',
    pointOfContact: [
      {
        name: '',
        email: '',
        role: ''
      }
    ]
  }
];
