import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconAnnouncement } from '@trussworks/react-uswds';
import classNames from 'classnames';

import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';

import DiscussionUserInfo from './_components/DiscussionUserInfo';

type SingleDiscussionProps = {
  discussion: DiscussionType | ReplyType;
  index: number;
  connected?: boolean;
  setDiscussionStatusMessage: (a: string) => void;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType | ReplyType) => void;
  setIsDiscussionOpen?: (value: boolean) => void;
  isLast: boolean;
  replyCount: number;
};

const SingleDiscussion = ({
  discussion,
  index,
  connected,
  setDiscussionStatusMessage,
  setDiscussionType,
  setReply,
  setIsDiscussionOpen,
  isLast,
  replyCount
}: SingleDiscussionProps) => {
  const { t: discussionT } = useTranslation('discussions');

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
          className={classNames(
            'margin-top-0 margin-bottom-105 text-pre-wrap',
            {
              // 'padding-top-5': !!discussion.userRole,
              'margin-bottom-2': isLast
            }
          )}
        >
          {discussion.content}
        </p>

        <div className="display-flex flex-align-center">
          <IconAnnouncement className="text-primary margin-right-1" />
          <Button
            type="button"
            unstyled
            onClick={() => {
              if (setIsDiscussionOpen) {
                setIsDiscussionOpen(true);
              }
              setDiscussionStatusMessage('');
              setDiscussionType('reply');
              setReply(discussion);
            }}
          >
            {replyCount === 0
              ? discussionT('reply')
              : discussionT('replies', { count: replyCount })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleDiscussion;
