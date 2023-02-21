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

export type HelpSolutionType = {
  enum: OperationalSolutionKey | null; // TODO: should not be null, some enums havent been created
  key: string; // used for translations
  route: string;
  categories: OperationalSolutionCategories[];
  acronym: string | null;
  name: string;
  pocName: string;
};

export const helpSolutions: HelpSolutionType[] = [
  {
    enum: OperationalSolutionKey.INNOVATION,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: '4i',
    name: '4innovation',
    pocName: '4i/ACO-OS Team'
  },
  {
    enum: OperationalSolutionKey.ACO_OS,
    key: 'accountableCare',
    route: 'accountable-care-organization',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.APPS,
    key: 'automatedPlanPayment',
    route: 'automated-plan-payment-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'centralizedDataExhange',
    route: 'centralized-data-exchange',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.CCW,
    key: 'ccWarehouse',
    route: 'chronic-conditions-warehouse',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'cmsBox',
    route: 'cms-box',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'cmsQualtrics',
    route: 'cms-qualtrics',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.CBOSC,
    key: 'cbosc',
    route: 'consolidated-business-operations-support-center',
    categories: [OperationalSolutionCategories.HELP_DESKS],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'cpiVetting',
    route: 'cpi-vetting',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'electronicFileTransfer',
    route: 'electronic-file-transfer',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'expandedDataFeedback',
    route: 'expanded-data-feedback-reporting',
    categories: [OperationalSolutionCategories.DATA_REPORTING],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.GOVDELIVERY,
    key: 'govDelivery',
    route: 'gov-delivery',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    acronym: '',
    name: '',
    pocName: ''
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
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.HIGLAS,
    key: 'higlas',
    route: 'healthcare-integrated-general-kedger-accounting-system',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.NEW_CMMI_PROCESS,
    key: 'healthDataReporting',
    route: 'health-data-reporting',
    categories: [OperationalSolutionCategories.QUALITY],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.HPMS,
    key: 'healthPlanManagement',
    route: 'health-plan-management-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.IPC,
    key: 'innovationPayment',
    route: 'innovation-payment-contract',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.IDR,
    key: 'integratedDataRepository',
    route: 'integrated-data-repository',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'learningAndDiffusion',
    route: 'learning-and-diffusion-group',
    categories: [OperationalSolutionCategories.LEARNING],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'legalVertical',
    route: 'legal-vertical',
    categories: [OperationalSolutionCategories.LEGAL],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.MDM,
    key: 'masterDataManagement',
    route: 'master-data-management',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'measureInstrumentDS',
    route: 'measure-and-instrument-development-and-support',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.MARX,
    key: 'marx',
    route: 'medicare-advantage-prescription-drug-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.OUTLOOK_MAILBOX,
    key: 'outlookMailbox',
    route: 'outlook-mailbox',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'qualityVertical',
    route: 'quality-vertical',
    categories: [OperationalSolutionCategories.QUALITY],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.RMADA,
    key: 'rmada',
    route: 'research-measurement-assessment-design-and-analysis',
    categories: [OperationalSolutionCategories.CC_VEHICLES],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.ARS,
    key: 'ars',
    route: 'salesforce-application-review-and-scoring',
    categories: [OperationalSolutionCategories.APPLICATIONS],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.CONNECT,
    key: 'salesforceConnect',
    route: 'salesforce-connect',
    categories: [OperationalSolutionCategories.LEARNING],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: null,
    key: 'salesforceLOI',
    route: 'salesforce-letter-of-intent',
    categories: [OperationalSolutionCategories.APPLICATIONS],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.SALESFORCE_PORTAL,
    key: 'salesforcePortal',
    route: 'salesforce-project-officer-support-tool-portal',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.RFA,
    key: 'salesforceRequestApplication',
    route: 'salesforce-request-for-application',
    categories: [OperationalSolutionCategories.APPLICATIONS],
    acronym: '',
    name: '',
    pocName: ''
  },
  {
    enum: OperationalSolutionKey.SHARED_SYSTEMS,
    key: 'sharedSystems',
    route: 'shared-systems',
    categories: [OperationalSolutionCategories.MEDICARE_FFS],
    acronym: '',
    name: '',
    pocName: ''
  }
];
