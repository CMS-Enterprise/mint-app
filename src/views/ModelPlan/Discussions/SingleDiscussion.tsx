import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { getDaysElapsed } from 'utils/date';

import DiscussionUserInfo from './_components/DiscussionUserInfo';

type SingleDiscussionProps = {
  discussion: DiscussionType | ReplyType;
  index: number;
  connected?: boolean;
  answerQuestion?: boolean;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType | ReplyType) => void;
  setIsDiscussionOpen?: (value: boolean) => void;
  isLast: boolean;
  replies: ReplyType[];
};

const SingleDiscussion = ({
  discussion,
  index,
  connected,
  answerQuestion,
  setDiscussionType,
  setReply,
  setIsDiscussionOpen,
  isLast,
  replies
}: SingleDiscussionProps) => {
  const { t: discussionT } = useTranslation('discussions');

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
      <DiscussionUserInfo discussionTopic={discussion} index={index} />

      <div
        className={classNames({
          // 'margin-bottom-4': answerQuestion,
          'mint-discussions__connected': connected,
          'mint-discussions__not-connected': !connected
        })}
      >
        <p
          className={classNames('margin-top-0 margin-bottom-105', {
            // 'padding-top-5': !!discussion.userRole,
            'margin-bottom-2': isLast
          })}
        >
          {discussion.content}
        </p>

        <div
          className="display-flex flex-align-center"
          style={{ gap: '0.5rem' }}
        >
          <Icon.Announcement className="text-primary" />
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
              ? discussionT('reply')
              : discussionT('replies', { count: replies.length })}
          </Button>
          {replies.length > 0 && (
            <p className="margin-y-0 text-base">
              {discussionT('lastReply', {
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
