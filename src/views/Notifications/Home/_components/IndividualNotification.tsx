import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Icon } from '@trussworks/react-uswds';
import {
  GetNotifications_currentUser_notifications_notifications_activity as NotificationActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_ActivityMetaBaseStruct as BaseStructActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta as TaggedInDiscussionReplyActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta as TaggedInDiscussionActivityType
} from 'gql/gen/types/GetNotifications';

import IconInitial from 'components/shared/IconInitial';
import MentionTextArea from 'components/shared/MentionTextArea';
import { getTimeElapsed } from 'utils/date';

type IndividualNotificationProps = {
  isRead: boolean;
  createdDts: string;
  activity: NotificationActivityType;
};

const IndividualNotification = ({
  isRead,
  createdDts,
  activity: {
    metaData,
    actorUserAccount: { commonName }
  }
}: IndividualNotificationProps) => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: discussionT } = useTranslation('discussions');

  // Type guard to check union type
  const isTaggedInDiscussion = (
    data:
      | TaggedInDiscussionReplyActivityType
      | TaggedInDiscussionActivityType
      | BaseStructActivityType
  ): data is TaggedInDiscussionReplyActivityType => {
    /* eslint no-underscore-dangle: 0 */
    return data.__typename === 'TaggedInPlanDiscussionActivityMeta';
  };

  return (
    <Grid row>
      <Grid desktop={{ col: 12 }} className="position-relative">
        {/* Notification Red Dot */}
        {!isRead && (
          <div className="circle-1 bg-error position-absolute margin-top-3 margin-left-1" />
        )}

        <div
          className={`padding-3 display-flex flex-justify ${
            isRead ? 'bg-gray-2' : ''
          }`}
        >
          {isTaggedInDiscussion(metaData) && (
            <div className="flex-fill">
              <div className="display-flex flex-align-center margin-bottom-05">
                <IconInitial
                  className="margin-right-05"
                  user={commonName}
                  hasBoldUsername
                />

                {notificationsT('index.activityType.taggedInDiscussion.text', {
                  modelName: metaData.modelPlan.modelName
                })}
              </div>
              <div className="margin-left-5">
                <span>
                  <MentionTextArea
                    className="text-base-darker"
                    id={`mention-${metaData.discussionID}`}
                    editable={false}
                    initialContent={`“${metaData.content}”`}
                  />
                </span>
                <Button
                  type="button"
                  unstyled
                  className="display-flex flex-align-center"
                  onClick={() => {}}
                >
                  {notificationsT('index.activityType.taggedInDiscussion.cta')}
                  <Icon.ArrowForward className="margin-left-1" aria-hidden />
                </Button>
              </div>
            </div>
          )}
          <span className="flex-auto text-base-darker text-right">
            {getTimeElapsed(createdDts)
              ? getTimeElapsed(createdDts) + discussionT('ago')
              : discussionT('justNow')}
          </span>
        </div>
      </Grid>
    </Grid>
  );
};

export default IndividualNotification;
