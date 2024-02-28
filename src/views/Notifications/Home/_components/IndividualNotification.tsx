import React from 'react';
import { GetNotifications_currentUser_notifications_notifications_activity as NotificationActivityType } from 'gql/gen/types/GetNotifications';

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
    <ul>
      <li>isRead: {isRead.toString()}</li>
      <li>inAppSent: {inAppSent.toString()}</li>
      <li>emailSent: {emailSent.toString()}</li>
      <li>activityType: {activity.activityType}</li>
      <li>entityID: {activity.entityID}</li>
      <li>actorID: {activity.actorID}</li>
      {/* <li>metaData: {activity.metaData.}</li> */}
      <li>createdByUserAccount: {activity.createdByUserAccount.commonName}</li>
    </ul>
  );
};

export default IndividualNotification;
