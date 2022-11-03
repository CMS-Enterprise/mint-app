import React from 'react';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import {
  GetModelPlanDiscussions_modelPlan_collaborators as CollaboratorsType,
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { DiscussionStatus } from 'types/graphql-global-types';
import { sortRepliesByDate } from 'utils/modelPlan';

import SingleDiscussion from './SingleDiscussion';

type FormatDiscussionProps = {
  discussionsContent: DiscussionType[];
  status: DiscussionStatus;
  collaborators: CollaboratorsType[];
  hasEditAccess?: boolean;
  setDiscussionStatusMessage: (a: string) => void;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType | ReplyType) => void;
};

const FormatDiscussion = ({
  discussionsContent,
  status,
  hasEditAccess,
  collaborators,
  setDiscussionStatusMessage,
  setDiscussionType,
  setReply
}: FormatDiscussionProps) => {
  if (status === 'ANSWERED') {
    discussionsContent.sort(sortRepliesByDate); // Sort discusssions by the most recent reply for answered questions
  }

  return discussionsContent.map((discussion, index) => {
    return (
      <div
        key={discussion.id}
        className={classNames({
          'margin-top-4': index > 0,
          'margin-top-2': index === 0
        })}
      >
        {discussion.replies.length > 0 ? (
          // If discussions has replies, join together in array for rendering as a connected discussion
          <>
            {[discussion, ...discussion.replies].map(
              (discussionReply: ReplyType | DiscussionType, replyIndex) => (
                // discussionComponent(
                //   discussionReply,
                //   index,
                //   replyIndex !== discussion.replies.length
                // )
                <SingleDiscussion
                  discussion={discussionReply}
                  index={index}
                  connected={replyIndex !== discussion.replies.length}
                  hasEditAccess={hasEditAccess}
                  collaborators={collaborators}
                  setDiscussionStatusMessage={setDiscussionStatusMessage}
                  setDiscussionType={setDiscussionType}
                  setReply={setReply}
                />
              )
            )}
          </>
        ) : (
          // Render only question if no replies
          // discussionComponent(discussion, index, undefined, true)
          <SingleDiscussion
            discussion={discussion}
            index={index}
            connected={false}
            answerQuestion
            hasEditAccess={hasEditAccess}
            collaborators={collaborators}
            setDiscussionStatusMessage={setDiscussionStatusMessage}
            setDiscussionType={setDiscussionType}
            setReply={setReply}
          />
        )}
        {/* Divider to separate questions if not the last question */}
        {index !== discussionsContent.length - 1 && (
          <Divider className="margin-top-4" />
        )}
      </div>
    );
  });
};

export default FormatDiscussion;
