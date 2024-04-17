import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'gql/gen/types/GetModelPlanDiscussions';
import { DateTime } from 'luxon';

import MentionTextArea from 'components/shared/MentionTextArea';
import { getDaysElapsed } from 'utils/date';

import DiscussionUserInfo from './_components/DiscussionUserInfo';

type SingleDiscussionProps = {
  discussion: DiscussionType | ReplyType;
  index: number;
  connected?: boolean;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType | ReplyType) => void;
  setIsDiscussionOpen?: (value: boolean) => void;
  setDiscussionStatusMessage: (value: string) => void;
  replies: ReplyType[];
};

const SingleDiscussion = ({
  discussion,
  index,
  connected,
  setDiscussionType,
  setReply,
  setIsDiscussionOpen,
  setDiscussionStatusMessage,
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
      <DiscussionUserInfo discussionTopic={discussion} />

      <div
        className={classNames({
          'mint-discussions__connected': connected,
          'mint-discussions__not-connected': !connected
        })}
      >
        <MentionTextArea
          id={`mention-editor-${index}`}
          editable={false}
          initialContent={discussion.content?.rawContent}
        />

        <div
          className="display-flex flex-align-center"
          style={{ gap: '0.5rem' }}
        >
          <Icon.Announcement className="text-primary" />
          <Button
            type="button"
            unstyled
            onClick={() => {
              setDiscussionStatusMessage('');
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
