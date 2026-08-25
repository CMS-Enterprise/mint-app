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

const otherPathTopics: Record<string, DiscussionTopicType> = {
  '/collaboration-area/model-timeline': DiscussionTopicType.MODEL_TIMELINE,
  '/data-exchange-approach': DiscussionTopicType.DATA_EXCHANGE_APPROACH,
  '/iddoc-questionnaire': DiscussionTopicType.IDDOC_QUESTIONNAIRE,
  '/model-to-operations': DiscussionTopicType.MODEL_TO_OPERATIONS_MATRIX_MTO
};

const getDefaultDiscussionTopicFromPath = (
  pathname: string
): DiscussionTopicType | undefined => {
  const modelPlanSection = pathname.match(
    /\/collaboration-area\/(?:model-plan|task-list)\/([^/]+)/
  )?.[1];

  if (modelPlanSection && modelPlanSectionTopics[modelPlanSection]) {
    return modelPlanSectionTopics[modelPlanSection];
  }

  const otherPath = Object.keys(otherPathTopics).find(segment =>
    pathname.includes(segment)
  );

  return otherPath ? otherPathTopics[otherPath] : undefined;
};

export default getDefaultDiscussionTopicFromPath;
