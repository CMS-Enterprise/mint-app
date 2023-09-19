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
import { DiscussionUserRole } from 'types/graphql-global-types';
import { getTimeElapsed } from 'utils/date';

type SingleDiscussionProps = {
  discussion: DiscussionType | ReplyType;
  index: number;
  connected?: boolean;
  answerQuestion?: boolean;
  hasEditAccess?: boolean;
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
  setDiscussionType,
  setReply,
  setIsDiscussionOpen,
  isLast
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

      {discussion.userRole && (
        <p
          className={classNames(
            'text-base margin-top-0 position-absolute margin-left-5'
          )}
        >
          {discussion.userRole === DiscussionUserRole.NONE_OF_THE_ABOVE
            ? discussion.userRoleDescription
            : t(`userRole.${discussion.userRole}`)}
        </p>
      )}

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
                setDiscussionType('reply');
                setReply(discussion);
              }}
            >
              {t('answer')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleDiscussion;
