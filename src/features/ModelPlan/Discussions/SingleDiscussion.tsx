import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { GetModelPlanDiscussionsQuery } from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import MentionTextArea from 'components/MentionTextArea';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getDaysElapsed } from 'utils/date';

import DiscussionUserInfo from './_components/DiscussionUserInfo';

type DiscussionType =
  GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0];
type ReplyType =
  GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0]['replies'][0];

type SingleDiscussionProps = {
  discussion: DiscussionType;
  index: number;
  connected?: boolean;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType) => void;
  setIsDiscussionOpen?: (value: boolean) => void;
  replies: ReplyType[];
};

const SingleDiscussion = ({
  discussion,
  index,
  connected,
  setDiscussionType,
  setReply,
  setIsDiscussionOpen,
  replies
}: SingleDiscussionProps) => {
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  const { topic: topicConfig } = usePlanTranslation('discussions');

  const latestDate = [...replies].reduce(
    (pre: any, cur: any) => (Date.parse(pre) > Date.parse(cur) ? pre : cur),
    0
  );
  const timeLastUpdated = DateTime.fromISO(
    latestDate.createdDts
  ).toLocaleString(DateTime.TIME_SIMPLE);
  const daysLastUpdated = getDaysElapsed(latestDate.createdDts);

  return (
    <div className="mint-discussions__single-discussion margin-bottom-4">
      <DiscussionUserInfo discussionTopic={discussion} />

      <div
        className={classNames({
          'mint-discussions__connected': connected,
          'mint-discussions__not-connected': !connected
        })}
      >
        {discussion.topic && (
          <p className="margin-top-1 margin-bottom-0 text-base">
            {discussionsMiscT('topicReadOnly', {
              topic: topicConfig.options[discussion.topic]
            })}
          </p>
        )}

        <MentionTextArea
          id={`mention-editor-${index}`}
          editable={false}
          initialContent={discussion.content?.rawContent}
        />

        <div
          className="display-flex flex-align-center"
          style={{ gap: '0.5rem' }}
        >
          <Icon.Announcement
            className="text-primary"
            aria-label="announcement"
          />
          <Button
            type="button"
            unstyled
            onClick={() => {
              if (setIsDiscussionOpen) {
                setIsDiscussionOpen(true);
              }
              setDiscussionType('reply');
              setReply(discussion);
            }}
          >
            {replies.length === 0
              ? discussionsMiscT('reply')
              : discussionsMiscT('replies', { count: replies.length })}
          </Button>
          {replies.length > 0 && (
            <p className="margin-y-0 text-base">
              {discussionsMiscT('lastReply', {
                date: daysLastUpdated,
                time: timeLastUpdated
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleDiscussion;
