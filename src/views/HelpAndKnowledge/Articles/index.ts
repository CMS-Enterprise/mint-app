import OperationalSolutionCategories from 'data/operationalSolutionCategories';
import { OperationalSolutionKey } from 'types/graphql-global-types';

type ArticleProps = {
  name: string;
  route: string;
  translation: string;
};

export type ArticleTypeProps = {
  type: 'gettingStarted' | 'itImplementation';
};

// Help and Knowledge Articles
const helpAndKnowledgeArticles: (ArticleProps & ArticleTypeProps)[] = [
  {
    name: 'Model Plan Overview',
    route: '/model-plan-overview', // route for hitting rendered article component
    translation: 'modelPlanOverview', // Should reference the translation used to index the title and description for cards
    type: 'gettingStarted'
  },
  {
    name: 'Sample Model Plan',
    route: '/sample-model-plan',
    translation: 'sampleModelPlan',
    type: 'gettingStarted'
  }
];

export default helpAndKnowledgeArticles;

type CategoryProps = {
  key: OperationalSolutionCategories;
  route: string; // route for hitting rendered article component
};

// Operational Solution categories
export const operationalSolutionCategoryMap: CategoryProps[] = [
  {
    key: OperationalSolutionCategories.APPLICATIONS,
    route: 'applications'
  },
  {
    key: OperationalSolutionCategories.COMMUNICATION_TOOLS,
    route: 'communication-tools'
  },
  {
    key: OperationalSolutionCategories.CC_VEHICLES,
    route: 'contractors-and-contract-vehicles'
  },
  {
    key: OperationalSolutionCategories.DATABASE_MANAGEMENT,
    route: 'database-and-data-management'
  },
  {
    key: OperationalSolutionCategories.DATA_EXCHANGE,
    route: 'data-exchange'
  },
  {
    key: OperationalSolutionCategories.DATA_REPORTING,
    route: 'data-reporting'
  },
  {
    key: OperationalSolutionCategories.HELP_DESKS,
    route: 'help-desks'
  },
  {
    key: OperationalSolutionCategories.LEARNING,
    route: 'learning'
  },
  {
    key: OperationalSolutionCategories.LEGAL,
    route: 'legal'
  },
  {
    key: OperationalSolutionCategories.MEDICARE_ADVANTAGE_D,
    route: 'medicare-advantage-and-part-d'
  },
  {
    key: OperationalSolutionCategories.MEDICARE_FFS,
    route: 'medicare-fee-for-service'
  },
  {
    key: OperationalSolutionCategories.QUALITY,
    route: 'quality'
  }
];

type HelpSolutionType = {
  enum: OperationalSolutionKey | null; // TODO: should not be null, some enums havent been created
  key: string; // used for translations
  route: string;
  categories: OperationalSolutionCategories[];
};

export const helpSolutions: HelpSolutionType[] = [
  {
    enum: OperationalSolutionKey.INNOVATION,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.DATA_REPORTING]
  },
  {
    enum: OperationalSolutionKey.ACO_OS,
    key: 'accountableCare',
    route: 'accountable-care-organization',
    categories: [OperationalSolutionCategories.DATA_REPORTING]
  },
  {
    enum: OperationalSolutionKey.APPS,
    key: 'automatedPlanPayment',
    route: 'automated-plan-payment-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D]
  },
  {
    enum: null,
    key: 'centralizedDataExhange',
    route: 'centralized-data-exchange',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE]
  },
  {
    enum: OperationalSolutionKey.CCW,
    key: 'ccWarehouse',
    route: 'chronic-conditions-warehouse',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT]
  },
  {
    enum: null,
    key: 'cmsBox',
    route: 'cms-box',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE]
  },
  {
    enum: OperationalSolutionKey.CCW,
    key: 'innovation',
    route: '4-innovation',
    categories: [OperationalSolutionCategories.DATA_REPORTING]
  },
  {
    enum: null,
    key: 'cmsQualtrics',
    route: 'cms-qualtrics',
    categories: [OperationalSolutionCategories.DATA_REPORTING]
  },
  {
    enum: OperationalSolutionKey.CBOSC,
    key: 'cbosc',
    route: 'consolidated-business-operations-support-center',
    categories: [OperationalSolutionCategories.HELP_DESKS]
  },
  {
    enum: null,
    key: 'cpiVetting',
    route: 'cpi-vetting',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE]
  },
  {
    enum: null,
    key: 'electronicFileTransfer',
    route: 'electronic-file-transfer',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE]
  },
  {
    enum: null,
    key: 'expandedDataFeedback',
    route: 'expanded-data-feedback-reporting',
    categories: [OperationalSolutionCategories.DATA_REPORTING]
  },
  {
    enum: OperationalSolutionKey.GOVDELIVERY,
    key: 'govDelivery',
    route: 'gov-delivery',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS]
  },
  {
    enum: OperationalSolutionKey.GRANT_SOLUTIONS,
    key: 'grantSolutions',
    route: 'grant-solutions',
    categories: [
      OperationalSolutionCategories.APPLICATIONS,
      OperationalSolutionCategories.COMMUNICATION_TOOLS
    ]
  },
  {
    enum: OperationalSolutionKey.HIGLAS,
    key: 'higlas',
    route: 'healthcare-integrated-general-kedger-accounting-system',
    categories: [OperationalSolutionCategories.DATA_EXCHANGE]
  },
  {
    enum: OperationalSolutionKey.NEW_CMMI_PROCESS,
    key: 'healthDataReporting',
    route: 'health-data-reporting',
    categories: [OperationalSolutionCategories.QUALITY]
  },
  {
    enum: OperationalSolutionKey.HPMS,
    key: 'healthPlanManagement',
    route: 'health-plan-management-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D]
  },
  {
    enum: OperationalSolutionKey.IPC,
    key: 'innovationPayment',
    route: 'innovation-payment-contract',
    categories: [OperationalSolutionCategories.CC_VEHICLES]
  },
  {
    enum: OperationalSolutionKey.IDR,
    key: 'integratedDataRepository',
    route: 'integrated-data-repository',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT]
  },
  {
    enum: null,
    key: 'learningAndDiffusion',
    route: 'learning-and-diffusion-group',
    categories: [OperationalSolutionCategories.LEARNING]
  },
  {
    enum: null,
    key: 'legalVertical',
    route: 'legal-vertical',
    categories: [OperationalSolutionCategories.LEGAL]
  },
  {
    enum: OperationalSolutionKey.MDM,
    key: 'masterDataManagement',
    route: 'master-data-management',
    categories: [OperationalSolutionCategories.DATABASE_MANAGEMENT]
  },
  {
    enum: null,
    key: 'measureInstrumentDS',
    route: 'measure-and-instrument-development-and-support',
    categories: [OperationalSolutionCategories.CC_VEHICLES]
  },
  {
    enum: OperationalSolutionKey.MARX,
    key: 'marx',
    route: 'medicare-advantage-prescription-drug-system',
    categories: [OperationalSolutionCategories.MEDICARE_ADVANTAGE_D]
  },
  {
    enum: OperationalSolutionKey.OUTLOOK_MAILBOX,
    key: 'outlookMailbox',
    route: 'outlook-mailbox',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS]
  },
  {
    enum: null,
    key: 'qualityVertical',
    route: 'quality-vertical',
    categories: [OperationalSolutionCategories.QUALITY]
  },
  {
    enum: OperationalSolutionKey.RMADA,
    key: 'rmada',
    route: 'research-measurement-assessment-design-and-analysis',
    categories: [OperationalSolutionCategories.CC_VEHICLES]
  },
  {
    enum: OperationalSolutionKey.ARS,
    key: 'ars',
    route: 'salesforce-application-review-and-scoring',
    categories: [OperationalSolutionCategories.APPLICATIONS]
  },
  {
    enum: OperationalSolutionKey.CONNECT,
    key: 'salesforceConnect',
    route: 'salesforce-connect',
    categories: [OperationalSolutionCategories.LEARNING]
  },
  {
    enum: null,
    key: 'salesforceLOI',
    route: 'salesforce-letter-of-intent',
    categories: [OperationalSolutionCategories.APPLICATIONS]
  },
  {
    enum: OperationalSolutionKey.SALESFORCE_PORTAL,
    key: 'salesforcePortal',
    route: 'salesforce-project-officer-support-tool-portal',
    categories: [OperationalSolutionCategories.COMMUNICATION_TOOLS]
  },
  {
    enum: OperationalSolutionKey.RFA,
    key: 'salesforceRequestApplication',
    route: 'salesforce-request-for-application',
    categories: [OperationalSolutionCategories.APPLICATIONS]
  },
  {
    enum: OperationalSolutionKey.SHARED_SYSTEMS,
    key: 'sharedSystems',
    route: 'shared-systems',
    categories: [OperationalSolutionCategories.MEDICARE_FFS]
  }
];
