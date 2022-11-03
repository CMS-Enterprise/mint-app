import React from 'react';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { DiscussionStatus } from 'types/graphql-global-types';
import { sortRepliesByDate } from 'utils/modelPlan';

const DiscussionEntry = ({
  discussionsContent,
  status
}: {
  discussionsContent: DiscussionType[];
  status: DiscussionStatus;
}) => {
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
          <div>
            {[
              discussion,
              ...discussion.replies
            ].map((discussionReply: ReplyType | DiscussionType, replyIndex) =>
              discussionComponent(
                discussionReply,
                index,
                replyIndex !== discussion.replies.length
              )
            )}
          </div>
        ) : (
          // Render only question if no replies
          discussionComponent(discussion, index, undefined, true)
        )}
        {/* Divider to separate questions if not the last question */}
        {index !== discussionsContent.length - 1 && (
          <Divider className="margin-top-4" />
        )}
      </div>
    );
  });
};

export default DiscussionEntry;

// const [truncated, setTruncated] = useState(true);
// 1. if discussionsContent.length is less than five, then continue what we have right now.
// 2. if discussionsContent.length is greather than five, then truncate and render the "View More" button
