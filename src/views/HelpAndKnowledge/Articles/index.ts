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
  },
  {
    name: 'How to have a successful 2-pager meeting',
    route: '/how-to-have-a-successful-2-pager-meeting',
    translation: 'twoPageMeeting',
    type: 'gettingStarted'
  }
];

export default helpAndKnowledgeArticles;
