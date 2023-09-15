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
  answerQuestion?: boolean;
  hasEditAccess?: boolean;
  setDiscussionStatusMessage: (a: string) => void;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType | ReplyType) => void;
  setIsDiscussionOpen?: (value: boolean) => void;
  isLast: boolean;
};

const SingleDiscussion = ({
  discussion,
  index,
  connected,
  answerQuestion,
  hasEditAccess,
  setDiscussionStatusMessage,
  setDiscussionType,
  setReply,
  setIsDiscussionOpen,
  isLast
}: SingleDiscussionProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div className="mint-discussions__single-discussion">
      <DiscussionUserInfo discussionTopic={discussion} index={index} />

      <div
        className={classNames({
          'margin-bottom-4': answerQuestion,
          'mint-discussions__connected': connected,
          'mint-discussions__not-connected': !connected
        })}
      >
        <p
          className={classNames(
            'margin-top-0 margin-bottom-1 padding-top-1 padding-bottom-2 text-pre-wrap',
            {
              'padding-top-5': !!discussion.userRole,
              'margin-bottom-2': isLast
            }
          )}
        >
          {discussion.content}
        </p>

        {/* Rendered a link to answer a question if there are no replies/answers only for Collaborator and Assessment Users */}
        {/* TODO: figure out how to conditionally render this reply link */}
        {hasEditAccess && answerQuestion && (
          <div className="display-flex margin-bottom-2">
            <IconAnnouncement className="text-primary margin-right-1" />
            <Button
              type="button"
              unstyled
              role="button"
              onClick={() => {
                if (setIsDiscussionOpen) {
                  setIsDiscussionOpen(true);
                }
                setDiscussionStatusMessage('');
                setDiscussionType('reply');
                setReply(discussion);
              }}
            >
              {t('reply')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleDiscussion;
