import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import {
  GetNotifications_currentUser_notifications_notifications_activity as NotificationActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_ActivityMetaBaseStruct as BaseStructActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta as TaggedInDiscussionReplyActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta as TaggedInDiscussionActivityType
} from 'gql/gen/types/GetNotifications';

import IconInitial from 'components/shared/IconInitial';

type IndividualNotificationProps = {
  isRead: boolean;
  activity: NotificationActivityType;
};

const IndividualNotification = ({
  isRead,
  activity: {
    metaData,
    actorUserAccount: { commonName }
  }
}: IndividualNotificationProps) => {
  const { t: notificationsT } = useTranslation('notifications');

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
        {!isRead && (
          <div className="circle-1 bg-error position-absolute margin-top-3 margin-left-1" />
        )}

        <div className="padding-3">
          {isTaggedInDiscussion(metaData) && (
            <>
              <div className="display-flex flex-align-center margin-bottom-05">
                <IconInitial
                  className="margin-right-05"
                  user={commonName}
                  hasBoldUsername
                />
                {notificationsT('index.activityType.taggedInDiscussion', {
                  modelName: metaData.modelPlan.modelName
                })}
              </div>
              <div className="margin-left-5">{metaData.content}</div>
            </>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default IndividualNotification;
