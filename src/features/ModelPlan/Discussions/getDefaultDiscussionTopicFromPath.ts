import { DiscussionTopicType } from 'gql/generated/graphql';

const pathTopicMatchers: [string, DiscussionTopicType][] = [
  [
    '/collaboration-area/model-plan/basics',
    DiscussionTopicType.MODEL_PLAN_MODEL_BASICS
  ],
  [
    '/collaboration-area/model-plan/characteristics',
    DiscussionTopicType.MODEL_PLAN_GENERAL_CHARACTERISTICS
  ],
  [
    '/collaboration-area/model-plan/participants-and-providers',
    DiscussionTopicType.MODEL_PLAN_PARTICIPANTS_AND_PROVIDERS
  ],
  [
    '/collaboration-area/model-plan/beneficiaries',
    DiscussionTopicType.MODEL_PLAN_BENEFICIARIES
  ],
  [
    '/collaboration-area/model-plan/ops-eval-and-learning',
    DiscussionTopicType.MODEL_PLAN_OPERATIONS_EVALUATION_AND_LEARNING
  ],
  [
    '/collaboration-area/model-plan/payment',
    DiscussionTopicType.MODEL_PLAN_PAYMENT
  ],
  [
    '/collaboration-area/task-list/basics',
    DiscussionTopicType.MODEL_PLAN_MODEL_BASICS
  ],
  [
    '/collaboration-area/task-list/characteristics',
    DiscussionTopicType.MODEL_PLAN_GENERAL_CHARACTERISTICS
  ],
  [
    '/collaboration-area/task-list/participants-and-providers',
    DiscussionTopicType.MODEL_PLAN_PARTICIPANTS_AND_PROVIDERS
  ],
  [
    '/collaboration-area/task-list/beneficiaries',
    DiscussionTopicType.MODEL_PLAN_BENEFICIARIES
  ],
  [
    '/collaboration-area/task-list/ops-eval-and-learning',
    DiscussionTopicType.MODEL_PLAN_OPERATIONS_EVALUATION_AND_LEARNING
  ],
  [
    '/collaboration-area/task-list/payment',
    DiscussionTopicType.MODEL_PLAN_PAYMENT
  ],
  ['/collaboration-area/model-timeline', DiscussionTopicType.MODEL_TIMELINE],
  ['/data-exchange-approach', DiscussionTopicType.DATA_EXCHANGE_APPROACH],
  ['/iddoc-questionnaire', DiscussionTopicType.IDDOC_QUESTIONNAIRE],
  [
    '/model-to-operations',
    DiscussionTopicType.MODEL_TO_OPERATIONS_MATRIX_MTO
  ]
];

export const getDefaultDiscussionTopicFromPath = (
  pathname: string
): DiscussionTopicType | undefined => {
  const match = pathTopicMatchers.find(([segment]) =>
    pathname.includes(segment)
  );

  return match?.[1];
};
