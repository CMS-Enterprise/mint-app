import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Grid } from '@trussworks/react-uswds';
import { useMarkNotificationAsReadMutation } from 'gql/gen/graphql';
import { GetNotifications_currentUser_notifications_notifications_activity as NotificationActivityType } from 'gql/gen/types/GetNotifications';

import { arrayOfColors } from 'components/shared/IconInitial';
import MentionTextArea from 'components/shared/MentionTextArea';
import { getTimeElapsed } from 'utils/date';
import { getUserInitials } from 'utils/modelPlan';

import {
  ActivityCTA,
  activityText,
  isAddingCollaborator,
  isDailyDigest,
  isNewDiscussionReply,
  isSharedActivity,
  isTaggedInDiscussion,
  isTaggedInDiscussionReply
} from './_utils';
import DailyDigest from './DailyDigest';

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
  const { t: discussionT } = useTranslation('discussions');

  const [isExpanded, setIsExpanded] = useState(false);

  const history = useHistory();

  const [markAsRead] = useMarkNotificationAsReadMutation();

  const handleMarkAsRead = (action: () => void) => {
    if (!isRead) {
      markAsRead({
        variables: {
          notificationID: id
        }
      }).then(response => {
        if (!response?.errors) {
          action();
        }
      });
    } else {
      action();
    }
  };

  // Mint System Account -> MINT
  const name = commonName === 'Mint System Account' ? 'MINT' : commonName;

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
                {getUserInitials(name)}
              </div>

              <div className="margin-top-05 padding-left-1">
                <p className="line-height-sans-4 margin-bottom-1 margin-top-0 ">
                  <strong>{name}</strong>
                  {activityText(metaData)}
                </p>
                {!isDailyDigest(metaData) &&
                  !isSharedActivity(metaData) &&
                  !isAddingCollaborator(metaData) && (
                    <MentionTextArea
                      className="notification__content text-base-darker margin-bottom-1"
                      id={`mention-${metaData.discussionID}`}
                      editable={false}
                      initialContent={metaData.content}
                    />
                  )}
                {isSharedActivity(metaData) && metaData.optionalMessage && (
                  <p className="margin-bottom-1 margin-top-0 text-base-darker">
                    “{metaData.optionalMessage}”
                  </p>
                )}

                <Button
                  type="button"
                  unstyled
                  className="display-flex flex-align-center"
                  onClick={() => {
                    if (
                      isTaggedInDiscussion(metaData) ||
                      isTaggedInDiscussionReply(metaData) ||
                      isNewDiscussionReply(metaData)
                    ) {
                      handleMarkAsRead(() =>
                        history.push(
                          `/models/${metaData.modelPlanID}/read-only/discussions?discussionID=${metaData.discussionID}`
                        )
                      );
                    }
                    if (isDailyDigest(metaData)) {
                      handleMarkAsRead(() => setIsExpanded(!isExpanded));
                    }
                    if (isAddingCollaborator(metaData)) {
                      handleMarkAsRead(() => {
                        history.push(
                          `/models/${metaData.modelPlanID}/task-list`
                        );
                      });
                    }
                    if (isSharedActivity(metaData)) {
                      handleMarkAsRead(() => {
                        history.push(
                          `/models/${metaData.modelPlanID}/read-only`
                        );
                      });
                    }
                  }}
                >
                  <ActivityCTA data={metaData} isExpanded={isExpanded} />
                </Button>
              </div>
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
      {isExpanded && isDailyDigest(metaData) && <DailyDigest {...metaData} />}
    </Grid>
  );
};

export default IndividualNotification;
