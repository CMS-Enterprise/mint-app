import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { DiscussionStatus } from 'types/graphql-global-types';
import { sortRepliesByDate } from 'utils/modelPlan';

import SingleDiscussion from './SingleDiscussion';

type FormatDiscussionProps = {
  discussionsContent: DiscussionType[];
  status: DiscussionStatus;
  hasEditAccess?: boolean;
  setDiscussionStatusMessage: (a: string) => void;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType | ReplyType) => void;
  setIsDiscussionOpen?: (value: boolean) => void;
};

const FormatDiscussion = ({
  discussionsContent,
  status,
  hasEditAccess,
  setDiscussionStatusMessage,
  setDiscussionType,
  setReply,
  setIsDiscussionOpen
}: FormatDiscussionProps) => {
  const { t } = useTranslation('discussions');

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  if (status === 'ANSWERED') {
    discussionsContent.sort(sortRepliesByDate); // Sort discusssions by the most recent reply for answered questions
  }

  const discussionsContentList = isAccordionExpanded
    ? discussionsContent
    : discussionsContent.slice(0, 5);

  return (
    <>
      {discussionsContentList.map((discussion, index) => {
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
                    <SingleDiscussion
                      key={discussionReply.id}
                      discussion={discussionReply}
                      index={index}
                      connected={replyIndex !== discussion.replies.length}
                      hasEditAccess={hasEditAccess}
                      setDiscussionStatusMessage={setDiscussionStatusMessage}
                      setDiscussionType={setDiscussionType}
                      setReply={setReply}
                      setIsDiscussionOpen={setIsDiscussionOpen}
                      isLast={index === discussionsContentList.length - 1}
                    />
                  )
                )}
              </>
            ) : (
              // Render only question if no replies
              <SingleDiscussion
                discussion={discussion}
                index={index}
                connected={false}
                answerQuestion
                hasEditAccess={hasEditAccess}
                setDiscussionStatusMessage={setDiscussionStatusMessage}
                setDiscussionType={setDiscussionType}
                setReply={setReply}
                setIsDiscussionOpen={setIsDiscussionOpen}
                isLast={index === discussionsContentList.length - 1}
              />
            )}
            {/* Divider to separate questions if not the last question */}
            {index !== discussionsContentList.length - 1 && (
              <Divider className="margin-top-4" />
            )}
            {!isAccordionExpanded &&
              discussionsContent.length > 5 &&
              index === discussionsContentList.length - 1 && (
                <SectionWrapper className="display-flex flex-justify-center flex-align-center margin-top-4">
                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
                  >
                    {t('viewMoreQuestions')}
                  </Button>
                </SectionWrapper>
              )}
          </div>
        );
      })}
    </>
  );
};

export default FormatDiscussion;
