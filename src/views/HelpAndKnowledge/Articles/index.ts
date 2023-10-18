type ArticleProps = {
  name: string;
  route: string;
  translation: string;
};

export type ArticleTypeProps = 'getting-started' | 'it-implementation';

export const articleCategories: ArticleTypeProps[] = [
  'getting-started',
  'it-implementation'
];

// Help and Knowledge Articles
const helpAndKnowledgeArticles: (ArticleProps & {
  type: ArticleTypeProps;
})[] = [
  {
    name: 'Model Plan Overview',
    route: '/model-plan-overview', // route for hitting rendered article component
    translation: 'modelPlanOverview', // Should reference the translation used to index the title and description for cards
    type: 'getting-started'
  },
  {
    name: 'Sample Model Plan',
    route: '/sample-model-plan',
    translation: 'sampleModelPlan',
    type: 'getting-started'
  },
  {
    name: 'How to have a successful 2-pager meeting',
    route: '/how-to-have-a-successful-2-pager-meeting',
    translation: 'twoPageMeeting',
    type: 'getting-started'
  },
  {
    name: 'How to have a successful 6-pager meeting',
    route: '/how-to-have-a-successful-6-pager-meeting',
    translation: 'sixPageMeeting',
    type: 'getting-started'
  },
  {
    name: 'High-level project plans',
    route: '/high-level-project-plan',
    translation: 'highLevelProjectPlans',
    type: 'getting-started'
  }
];

export default helpAndKnowledgeArticles;
