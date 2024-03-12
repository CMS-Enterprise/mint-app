import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Grid, Icon } from '@trussworks/react-uswds';
import { useMarkNotificationAsReadMutation } from 'gql/gen/graphql';
import {
  GetNotifications_currentUser_notifications_notifications_activity as NotificationActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_ActivityMetaBaseStruct as BaseStructActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta as TaggedInDiscussionReplyActivityType,
  GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta as TaggedInDiscussionActivityType
} from 'gql/gen/types/GetNotifications';

import { arrayOfColors } from 'components/shared/IconInitial';
import MentionTextArea from 'components/shared/MentionTextArea';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { getTimeElapsed } from 'utils/date';
import { getUserInitials } from 'utils/modelPlan';

export type IndividualNotificationProps = {
  index?: number;
  id: string;
  isRead: boolean;
  createdDts: string;
  activity: NotificationActivityType;
};

const IndividualNotification = ({
  index = 0,
  id,
  isRead,
  createdDts,
  activity: {
    metaData,
    actorUserAccount: { commonName }
  }
}: IndividualNotificationProps) => {
  const { t: notificationsT } = useTranslation('notifications');
  const { t: discussionT } = useTranslation('discussions');

  const history = useHistory();
  const isMobile = useCheckResponsiveScreen('mobile');

  const [markAsRead] = useMarkNotificationAsReadMutation();

  const handleMarkAsRead = (
    notificationID: string,
    modelPlanID: string,
    discussionID: string
  ) => {
    markAsRead({
      variables: {
        notificationID
      }
    }).then(response => {
      if (!response?.errors) {
        history.push(
          `/models/${modelPlanID}/read-only/discussions?discussionID=${discussionID}`
        );
      }
    });
  };

  // Type guard to check union type
  const isTaggedInDiscussion = (
    data:
      | TaggedInDiscussionReplyActivityType
      | TaggedInDiscussionActivityType
      | BaseStructActivityType
  ): data is TaggedInDiscussionActivityType => {
    /* eslint no-underscore-dangle: 0 */
    return data.__typename === 'TaggedInPlanDiscussionActivityMeta';
  };

  const isTaggedInDiscussionReply = (
    data:
      | TaggedInDiscussionReplyActivityType
      | TaggedInDiscussionActivityType
      | BaseStructActivityType
  ): data is TaggedInDiscussionReplyActivityType => {
    /* eslint no-underscore-dangle: 0 */
    return data.__typename === 'TaggedInDiscussionReplyActivityMeta';
  };

  return (
    <Grid row data-testid="individual-notification">
      <Grid desktop={{ col: 12 }} className="position-relative">
        {/* Notification Red Dot */}
        {!isRead && (
          <div
            className="circle-1 bg-error position-absolute margin-top-3 margin-left-1"
            data-testid="notification-red-dot"
          />
        )}

        <Grid
          gap={6}
          className={`padding-3 display-flex flex-justify ${
            isRead ? 'bg-gray-2' : ''
          }`}
        >
          <Grid col="fill">
            <div className="display-flex">
              {/* Circle of Name */}
              <div
                className={`display-flex flex-align-center flex-justify-center minw-4 circle-4 ${
                  arrayOfColors[index % arrayOfColors.length]
                }`}
              >
                {getUserInitials(commonName)}
              </div>
              {isTaggedInDiscussion(metaData) && (
                <div className="margin-top-05">
                  <p className="line-height-sans-4 margin-left-1 margin-bottom-1 margin-top-0 ">
                    <strong>{commonName}</strong>
                    {notificationsT(
                      'index.activityType.taggedInDiscussion.text',
                      {
                        modelName: metaData.modelPlan.modelName
                      }
                    )}
                  </p>
                  {!isMobile && (
                    <MentionTextArea
                      className="notification__content text-base-darker"
                      id={`mention-${metaData.discussionID}`}
                      editable={false}
                      initialContent={`“${metaData.content}”`}
                    />
                  )}

                  <Button
                    type="button"
                    unstyled
                    className="display-flex flex-align-center"
                    onClick={() => {
                      handleMarkAsRead(
                        id,
                        metaData.modelPlanID,
                        metaData.discussionID
                      );
                    }}
                  >
                    {notificationsT(
                      'index.activityType.taggedInDiscussion.cta'
                    )}
                    <Icon.ArrowForward className="margin-left-1" aria-hidden />
                  </Button>
                </div>
              )}
              {isTaggedInDiscussionReply(metaData) && (
                <div className="margin-top-05">
                  <p className="line-height-sans-4 margin-left-1 margin-bottom-1 margin-top-0 ">
                    <strong>{commonName}</strong>
                    {notificationsT(
                      'index.activityType.taggedInDiscussionReply.text',
                      {
                        modelName: metaData.modelPlan.modelName
                      }
                    )}
                  </p>
                  {!isMobile && (
                    <MentionTextArea
                      className="notification__content text-base-darker"
                      id={`mention-${metaData.discussionID}`}
                      editable={false}
                      initialContent={`“${metaData.content}”`}
                    />
                  )}

                  <Button
                    type="button"
                    unstyled
                    className="display-flex flex-align-center"
                    onClick={() => {
                      handleMarkAsRead(
                        id,
                        metaData.modelPlanID,
                        metaData.discussionID
                      );
                    }}
                  >
                    {notificationsT(
                      'index.activityType.taggedInDiscussionReply.cta'
                    )}
                    <Icon.ArrowForward className="margin-left-1" aria-hidden />
                  </Button>
                </div>
              )}
            </div>
          </Grid>
          <Grid col="auto">
            <p className="text-base-darker text-right margin-top-05 margin-bottom-0">
              {getTimeElapsed(createdDts)
                ? getTimeElapsed(createdDts) + discussionT('ago')
                : discussionT('justNow')}
            </p>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default IndividualNotification;
