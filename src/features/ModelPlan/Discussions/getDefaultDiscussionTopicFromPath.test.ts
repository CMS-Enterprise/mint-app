import { DiscussionTopicType } from 'gql/generated/graphql';

import { getDefaultDiscussionTopicFromPath } from './getDefaultDiscussionTopicFromPath';

describe('getDefaultDiscussionTopicFromPath', () => {
  it('returns undefined for collaboration area and model plan overview', () => {
    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area'
      )
    ).toBeUndefined();
    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/model-plan'
      )
    ).toBeUndefined();
  });

  it('maps task list and model plan sections to topics', () => {
    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/model-plan/characteristics/authority'
      )
    ).toBe(DiscussionTopicType.MODEL_PLAN_GENERAL_CHARACTERISTICS);

    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/model-plan/basics'
      )
    ).toBe(DiscussionTopicType.MODEL_PLAN_MODEL_BASICS);

    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/model-plan/payment/recover-payment'
      )
    ).toBe(DiscussionTopicType.MODEL_PLAN_PAYMENT);
  });

  it('maps timeline, data exchange, iddoc, and MTO', () => {
    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/model-timeline'
      )
    ).toBe(DiscussionTopicType.MODEL_TIMELINE);

    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/additional-questionnaires/data-exchange-approach/collecting-and-sending-data'
      )
    ).toBe(DiscussionTopicType.DATA_EXCHANGE_APPROACH);

    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/additional-questionnaires/iddoc-questionnaire/operations'
      )
    ).toBe(DiscussionTopicType.IDDOC_QUESTIONNAIRE);

    expect(
      getDefaultDiscussionTopicFromPath(
        '/models/abc/collaboration-area/model-to-operations/matrix'
      )
    ).toBe(DiscussionTopicType.MODEL_TO_OPERATIONS_MATRIX_MTO);
  });
});
