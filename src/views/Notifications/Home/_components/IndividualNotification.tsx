import React from 'react';
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
  return (
    <>
      <Grid row>
        <Grid desktop={{ col: 12 }} className="position-relative">
          {!isRead && (
            <div className="circle-1 bg-error position-absolute margin-top-3 margin-left-1" />
          )}

          <div className="padding-3">
            <IconInitial
              user={activity.createdByUserAccount.commonName}
              hasBoldUsername
            />
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
