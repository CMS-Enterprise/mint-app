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
  // {
  //   name: 'IT Implementation Placeholder',
  //   route: '#',
  //   translation: '',
  //   type: 'itImplementation'
  // }
];

export default helpAndKnowledgeArticles;

type CategoryProps = {
  key: string;
  route: string; // route for hitting rendered article component
};

// Operational Solution categories
export const operationalSolutionCategories: CategoryProps[] = [
  {
    key: 'applications',
    route: 'applications'
  },
  {
    key: 'communicationTools',
    route: 'communication-tools'
  },
  {
    key: 'contractorsContractVehicles',
    route: 'contractors-and-contract-vehicles'
  },
  {
    key: 'databaseDataManagement',
    route: 'database-and-data-management'
  },
  {
    key: 'dataExchange',
    route: 'data-exchange'
  },
  {
    key: 'dataReporting',
    route: 'data-reporting'
  },
  {
    key: 'helpDesks',
    route: 'help-desks'
  },
  {
    key: 'learning',
    route: 'learning'
  },
  {
    key: 'legal',
    route: 'legal'
  },
  {
    key: 'medicareAdvantagePartD',
    route: 'medicare-advantage-and-part-d'
  },
  {
    key: 'medicareFeeForService',
    route: 'medicare-fee-for-service'
  },
  {
    key: 'quality',
    route: 'quality'
  }
];
