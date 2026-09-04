import { DiscussionTopicType } from 'gql/generated/graphql';

const modelPlanSectionTopics: Record<string, DiscussionTopicType> = {
  basics: DiscussionTopicType.MODEL_PLAN_MODEL_BASICS,
  characteristics: DiscussionTopicType.MODEL_PLAN_GENERAL_CHARACTERISTICS,
  'participants-and-providers':
    DiscussionTopicType.MODEL_PLAN_PARTICIPANTS_AND_PROVIDERS,
  beneficiaries: DiscussionTopicType.MODEL_PLAN_BENEFICIARIES,
  'ops-eval-and-learning':
    DiscussionTopicType.MODEL_PLAN_OPERATIONS_EVALUATION_AND_LEARNING,
  payment: DiscussionTopicType.MODEL_PLAN_PAYMENT
};

const collaborationAreaPathTopics: [RegExp, DiscussionTopicType][] = [
  [
    /\/collaboration-area\/model-timeline(?:\/|$)/,
    DiscussionTopicType.MODEL_TIMELINE
  ],
  [
    /\/collaboration-area\/additional-questionnaires\/data-exchange-approach(?:\/|$)/,
    DiscussionTopicType.DATA_EXCHANGE_APPROACH
  ],
  [
    /\/collaboration-area\/additional-questionnaires\/iddoc-questionnaire(?:\/|$)/,
    DiscussionTopicType.IDDOC_QUESTIONNAIRE
  ],
  [
    /\/collaboration-area\/model-to-operations(?:\/|$)/,
    DiscussionTopicType.MODEL_TO_OPERATIONS_MATRIX_MTO
  ]
];

const getDefaultDiscussionTopicFromPath = (
  pathname: string
): DiscussionTopicType | undefined => {
  const modelPlanSection = pathname.match(
    /\/collaboration-area\/(?:model-plan|task-list)\/([^/]+)/
  )?.[1];

  if (modelPlanSection && modelPlanSectionTopics[modelPlanSection]) {
    return modelPlanSectionTopics[modelPlanSection];
  }

  const match = collaborationAreaPathTopics.find(([pattern]) =>
    pattern.test(pathname)
  );

  return match?.[1];
};

export default getDefaultDiscussionTopicFromPath;
