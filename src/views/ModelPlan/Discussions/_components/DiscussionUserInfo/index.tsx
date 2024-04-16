import React from 'react';
import { useTranslation } from 'react-i18next';
import { DiscussionUserRole } from 'gql/gen/graphql';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'gql/gen/types/GetModelPlanDiscussions';

import AssessmentIcon from 'components/shared/AssessmentIcon';
import IconInitial from 'components/shared/IconInitial';
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
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  return (
    <div className="discussion-user-info display-flex flex-wrap flex-justify">
      <div>
        {discussionTopic.isAssessment ? (
          <div className="display-flex flex-align-center margin-bottom-05">
            <AssessmentIcon size={3} />{' '}
            <span>
              {discussionsMiscT('assessment')} |{' '}
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
