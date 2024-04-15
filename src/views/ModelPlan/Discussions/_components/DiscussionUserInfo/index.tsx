import React from 'react';
import { useTranslation } from 'react-i18next';
import { DiscussionUserRole } from 'gql/gen/graphql';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'gql/gen/types/GetModelPlanDiscussions';

import AssessmentIcon from 'components/shared/AssessmentIcon';
import { Avatar } from 'components/shared/Avatar';
import { getTimeElapsed } from 'utils/date';

import './index.scss';

type DiscussionUserInfoProps = {
  connected?: boolean;
  discussionTopic: DiscussionType | ReplyType;
};

const DiscussionUserInfo = ({
  connected,
  discussionTopic
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
          <Avatar
            className="margin-bottom-05"
            user={discussionTopic.createdByUserAccount.commonName}
          />
        )}
        {discussionTopic.userRole && (
          <div
            className={`dui__userRole ${
              connected ? 'dui__userRole--connected' : ''
            }`}
          >
            <p className="margin-y-0 padding-bottom-1 text-base position-relative">
              {discussionTopic.userRole === DiscussionUserRole.NONE_OF_THE_ABOVE
                ? discussionTopic.userRoleDescription
                : discussionT(`userRole.${discussionTopic.userRole}`)}
            </p>
          </div>
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
