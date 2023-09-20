import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  IconExpandLess,
  IconExpandMore
} from '@trussworks/react-uswds';

import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType
  // GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';

import DiscussionUserInfo from '../_components/DiscussionUserInfo';

const Replies = ({
  originalDiscussion
}: {
  originalDiscussion: DiscussionType;
}) => {
  const { t: discussionsT } = useTranslation('discussions');

  const [areRepliesShowing, setAreRepliesShowing] = useState(true);

  const hasReplies = originalDiscussion.replies.length > 0;

  return (
    <div className="discussion-replies margin-bottom-4">
      <div className="discussion-replies__heading display-flex flex-justify margin-bottom-1">
        <p className="margin-y-0 text-bold">
          {hasReplies ? (
            <>
              {discussionsT('replies', {
                count: originalDiscussion.replies.length
              })}
            </>
          ) : (
            <>
              {/*  https://github.com/i18next/i18next/issues/1220#issuecomment-654161038 */}
              {discussionsT('replies', { count: 0, context: '0' })}
            </>
          )}
        </p>
        {hasReplies && (
          <Button
            type="button"
            onClick={() => setAreRepliesShowing(!areRepliesShowing)}
            aria-expanded={areRepliesShowing}
            unstyled
            data-testid="collapsable-link"
          >
            {areRepliesShowing ? (
              <div className="display-flex flex-align-center">
                {discussionsT('hideReplies')}
                <IconExpandLess className="margin-left-1" />
              </div>
            ) : (
              <div className="display-flex flex-align-center">
                {discussionsT('showReplies')}
                <IconExpandMore className="margin-left-1" />
              </div>
            )}
          </Button>
        )}
      </div>
      {hasReplies && areRepliesShowing && (
        <div className="discussion-replies__content padding-top-2">
          {originalDiscussion.replies.map((reply, index) => {
            return (
              <Fragment key={reply.id}>
                <DiscussionUserInfo
                  discussionTopic={reply}
                  index={index}
                  connected={
                    index !== originalDiscussion.replies.length - 1 &&
                    hasReplies
                  }
                />
                <p
                  className={`margin-top-0 margin-bottom-105 text-pre-wrap ${
                    index !== originalDiscussion.replies.length - 1 &&
                    hasReplies
                      ? 'mint-discussions__connected'
                      : 'mint-discussions__not-connected'
                  }`}
                >
                  {reply.content}
                </p>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Replies;
