import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconAnnouncement } from '@trussworks/react-uswds';
import classNames from 'classnames';

import AssessmentIcon from 'components/shared/AssessmentIcon';
import IconInitial from 'components/shared/IconInitial';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { getTimeElapsed } from 'utils/date';

type SingleDiscussionProps = {
  discussion: DiscussionType | ReplyType;
  index: number;
  connected?: boolean;
  answerQuestion?: boolean;
  hasEditAccess?: boolean;
  setDiscussionStatusMessage: (a: string) => void;
  setDiscussionType: (a: 'question' | 'reply' | 'discussion') => void;
  setReply: (discussion: DiscussionType | ReplyType) => void;
};

const SingleDiscussion = ({
  discussion,
  index,
  connected,
  answerQuestion,
  hasEditAccess,
  setDiscussionStatusMessage,
  setDiscussionType,
  setReply
}: SingleDiscussionProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div className="mint-discussions__single-discussion">
      <div className="display-flex flex-wrap flex-justify">
        {discussion.isAssessment ? (
          <div className="display-flex flex-align-center">
            <AssessmentIcon size={3} />{' '}
            <span>
              {t('assessment')} | {discussion.createdByUserAccount.commonName}
            </span>
          </div>
        ) : (
          <IconInitial
            user={discussion.createdByUserAccount.commonName}
            index={index}
          />
        )}
        <span className="margin-left-5 margin-top-05 text-base">
          {getTimeElapsed(discussion.createdDts)
            ? getTimeElapsed(discussion.createdDts) + t('ago')
            : t('justNow')}
        </span>
      </div>

      <div
        className={classNames({
          'margin-bottom-4': answerQuestion,
          'mint-discussions__connected': connected,
          'mint-discussions__not-connected': !connected
        })}
      >
        <p className="margin-y-0 padding-y-1">{discussion.content}</p>
        <div className="display-flex margin-bottom-2">
          {/* Rendered a link to answer a question if there are no replies/answers only for Collaborator and Assessment Users */}
          {hasEditAccess && answerQuestion && (
            <>
              <IconAnnouncement className="text-primary margin-right-1" />
              <Button
                type="button"
                unstyled
                role="button"
                onClick={() => {
                  setDiscussionStatusMessage('');
                  setDiscussionType('reply');
                  setReply(discussion);
                }}
              >
                {t('answer')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleDiscussion;
