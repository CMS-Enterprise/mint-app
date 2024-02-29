import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import { GetNotifications_currentUser_notifications_notifications_activity as NotificationActivityType } from 'gql/gen/types/GetNotifications';

import IconInitial from 'components/shared/IconInitial';

type IndividualNotificationProps = {
  isRead: boolean;
  inAppSent: boolean;
  emailSent: boolean;
  activity: NotificationActivityType;
};

const IndividualNotification = ({
  isRead,
  inAppSent,
  emailSent,
  activity
}: IndividualNotificationProps) => {
  const { t: notificationsT } = useTranslation('notifications');

  return (
    <>
      <Grid row>
        <Grid desktop={{ col: 12 }} className="position-relative">
          {!isRead && (
            <div className="circle-1 bg-error position-absolute margin-top-3 margin-left-1" />
          )}

          <div className="padding-3">
            <span>
              <IconInitial
                user={activity.createdByUserAccount.commonName}
                hasBoldUsername
              />
              {notificationsT('index.activityType.taggedInDiscussion')}
              {/* {t('withdraw_modal.header', {
                requestName: modelPlan.modelName
              })} */}
            </span>
          </div>
        </Grid>
      </Grid>
      <ul>
        <li>activityType: {activity.activityType}</li>
        <li>entityID: {activity.entityID}</li>
        <li>actorID: {activity.actorID}</li>
        {/* <li>metaData: {activity.metaData.}</li> */}
        <li>
          createdByUserAccount: {activity.createdByUserAccount.commonName}
        </li>
      </ul>
    </>
  );
};

export default IndividualNotification;
