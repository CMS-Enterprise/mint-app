import React from 'react';
import { useTranslation } from 'react-i18next';

import AssessmentIcon from 'components/shared/AssessmentIcon';
import IconInitial from 'components/shared/IconInitial';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { DiscussionUserRole } from 'types/graphql-global-types';
import { getTimeElapsed } from 'utils/date';

import './index.scss';

type DiscussionUserInfoProps = {
  connected?: boolean;
  discussionTopic: DiscussionType | ReplyType;
  index?: number;
};

const DiscussionUserInfo = ({
  connected,
  discussionTopic,
  index
}: DiscussionUserInfoProps) => {
  const { t: discussionT } = useTranslation('discussions');
  return (
    <div className="discussion-user-info display-flex flex-wrap flex-justify">
      <div>
        {discussionTopic.isAssessment ? (
          <div className="display-flex flex-align-center margin-bottom-05">
            <AssessmentIcon size={3} />{' '}
            <span>
              {discussionT('assessment')} |{' '}
              {discussionTopic.createdByUserAccount.commonName}
            </span>
          </div>
        ) : (
          <IconInitial
            className="margin-bottom-05"
            user={discussionTopic.createdByUserAccount.commonName}
            index={index ?? 0}
          />
        )}
        {discussionTopic.userRole && (
          <p
            className={`dui__userRole text-base ${
              connected ? 'dui__userRole--connected' : ''
            }`}
          >
            {discussionTopic.userRole === DiscussionUserRole.NONE_OF_THE_ABOVE
              ? discussionTopic.userRoleDescription
              : discussionT(`userRole.${discussionTopic.userRole}`)}
          </p>
        )}
      </div>
      <span className="text-base margin-top-05">
        {getTimeElapsed(discussionTopic.createdDts)
          ? getTimeElapsed(discussionTopic.createdDts) + discussionT('ago')
          : discussionT('justNow')}
      </span>
    </div>
  );
};

export default DiscussionUserInfo;
