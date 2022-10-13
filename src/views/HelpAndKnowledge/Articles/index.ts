export type ArticleProps = {
  route: string;
  translation: string;
};

// Help and Knowledge Articles
const helpAndKnowledgeArticles: ArticleProps[] = [
  {
    route: '/model-plan-overview', // route for hitting rendered article component
    translation: 'modelPlanOverview' // Should reference the translation used to index the title and description for cards
  },
  {
    route: '/sample-model-plan',
    translation: 'sampleModelPlan'
  }
];

export default helpAndKnowledgeArticles;
