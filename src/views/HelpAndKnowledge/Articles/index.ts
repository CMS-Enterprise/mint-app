export type ArticleProps = {
  name: string;
  route: string;
  translation: string;
};

// Help and Knowledge Articles
const helpAndKnowledgeArticles: ArticleProps[] = [
  {
    name: 'Model Plan Overview',
    route: '/model-plan-overview', // route for hitting rendered article component
    translation: 'modelPlanOverview' // Should reference the translation used to index the title and description for cards
  },
  {
    name: 'Sample Model Plan',
    route: '/sample-model-plan',
    translation: 'sampleModelPlan'
  }
];

export default helpAndKnowledgeArticles;
