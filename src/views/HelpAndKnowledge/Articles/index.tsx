import React from 'react';
import { Icon } from '@trussworks/react-uswds';

export type ArticleTypeProps = 'getting-started' | 'it-implementation';

export type ArticleProps = {
  name: string;
  route: string;
  translation: string;
  type: ArticleTypeProps;
};

export const articleCategories: ArticleTypeProps[] = [
  'getting-started',
  'it-implementation'
];

// Help and Knowledge Articles
const helpAndKnowledgeArticles: ArticleProps[] = [
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
  },
  {
    name: 'Utilizing available operational solutions',
    route: '/utilizing-solutions',
    translation: 'utilizingSolutions',
    type: 'it-implementation'
  },
  {
    name: 'Model implementation and solution implementation',
    route: '/model-and-solution-implementation',
    translation: 'modelSolutionImplementation',
    type: 'it-implementation'
  },
  {
    name: 'Model design and solution design',
    route: '/model-and-solution-design',
    translation: 'modelSolutionDesign',
    type: 'it-implementation'
  },
  {
    name: 'Phases Involved',
    route: '/phases-involved',
    translation: 'phasesInvolved',
    type: 'it-implementation'
  }
];

export const covertToLowercaseAndDashes = (string: string) =>
  string.toLowerCase().replace(/\s+/g, '-');

export const ScrollLink = ({ scrollTo }: { scrollTo: string }) => {
  return (
    <a
      href={`#${covertToLowercaseAndDashes(scrollTo)}`}
      className="display-flex flex-align-center"
    >
      {scrollTo}
      <Icon.ArrowForward />
    </a>
  );
};

export default helpAndKnowledgeArticles;
