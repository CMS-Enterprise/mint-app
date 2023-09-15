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

type DiscussionUserInfoProps = {
  discussionTopic: DiscussionType | ReplyType;
  index?: number;
};

const DiscussionUserInfo = ({
  discussionTopic,
  index
}: DiscussionUserInfoProps) => {
  const { t: discussionT } = useTranslation('discussions');
  return (
    <div className="display-flex flex-wrap flex-justify margin-bottom-1">
      <div>
        {discussionTopic.isAssessment ? (
          <div className="display-flex flex-align-center">
            <AssessmentIcon size={3} />{' '}
            <span>
              {discussionT('assessment')} |{' '}
              {discussionTopic.createdByUserAccount.commonName}
            </span>
          </div>
        ) : (
          <IconInitial
            className="margin-bottom-1"
            user={discussionTopic.createdByUserAccount.commonName}
            index={index ?? 0}
          />
        )}
        {discussionTopic.userRole && (
          <p className="text-base margin-left-5 margin-y-0">
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
