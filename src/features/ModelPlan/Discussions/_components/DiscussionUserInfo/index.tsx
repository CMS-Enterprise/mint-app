import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DiscussionUserRole,
  GetModelPlanDiscussionsQuery
} from 'gql/gen/graphql';

import { Avatar } from 'components/Avatar';
import { getTimeElapsed } from 'utils/date';

import './index.scss';

type DiscussionType =
  GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0];
type ReplyType =
  GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0]['replies'][0];

type DiscussionUserInfoProps = {
  connected?: boolean;
  discussionTopic: DiscussionType | ReplyType;
};

const DiscussionUserInfo = ({
  connected,
  discussionTopic
}: DiscussionUserInfoProps) => {
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  return (
    <div className="discussion-user-info display-flex flex-wrap flex-justify">
      <div>
        <Avatar
          className="margin-bottom-05"
          user={discussionTopic.createdByUserAccount.commonName}
          isAssessment={discussionTopic.isAssessment}
        />
        {discussionTopic.userRole && (
          <div
            className={`dui__userRole ${
              connected ? 'dui__userRole--connected' : ''
            }`}
          >
            <p className="margin-y-0 padding-bottom-1 text-base position-relative">
              {discussionTopic.userRole === DiscussionUserRole.NONE_OF_THE_ABOVE
                ? discussionTopic.userRoleDescription
                : discussionsMiscT(`userRole.${discussionTopic.userRole}`)}
            </p>
          </div>
        )}
      </div>
      <span className="text-base margin-top-05">
        {getTimeElapsed(discussionTopic.createdDts)
          ? getTimeElapsed(discussionTopic.createdDts) + discussionsMiscT('ago')
          : discussionsMiscT('justNow')}
      </span>
    </div>
  );
};

export default DiscussionUserInfo;
