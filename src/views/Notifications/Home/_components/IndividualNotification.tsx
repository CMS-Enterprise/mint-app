import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Grid } from '@trussworks/react-uswds';
import { Activity, useMarkNotificationAsReadMutation } from 'gql/gen/graphql';

import { AvatarCircle } from 'components/shared/Avatar';
import MentionTextArea from 'components/shared/MentionTextArea';
import { getTimeElapsed } from 'utils/date';

import {
  ActivityCTA,
  activityText,
  isAddingCollaborator,
  isDailyDigest,
  isDatesChanged,
  isNewDiscussionReply,
  isSharedActivity,
  isTaggedInDiscussion,
  isTaggedInDiscussionReply
} from './_utils';
import DailyDigest from './DailyDigest';

type NotificationActivityType = Activity;

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
  const { t: discussionT } = useTranslation('discussionsMisc');

  const [isDailyDigestExpanded, setIsDailyDigestExpanded] = useState(false);
  const [isDatesChangedExpanded, setIsDatesChangedExpanded] = useState(false);

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

  const handleClick = () => {
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
      handleMarkAsRead(() => setIsDailyDigestExpanded(!isDailyDigestExpanded));
    }
    if (isDatesChanged(metaData)) {
      handleMarkAsRead(() =>
        setIsDatesChangedExpanded(!isDatesChangedExpanded)
      );
    }
    if (isAddingCollaborator(metaData)) {
      handleMarkAsRead(() => {
        history.push(`/models/${metaData.modelPlanID}/task-list`);
      });
    }
    if (isSharedActivity(metaData)) {
      handleMarkAsRead(() => {
        history.push(`/models/${metaData.modelPlanID}/read-only`);
      });
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
              <AvatarCircle user={name} />

              <div className="margin-top-05 padding-left-1">
                <p className="line-height-sans-4 margin-bottom-1 margin-top-0 ">
                  <strong>{name}</strong>
                  {activityText(metaData)}
                </p>
                {!isDailyDigest(metaData) &&
                  !isSharedActivity(metaData) &&
                  !isDatesChanged(metaData) &&
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
                  onClick={() => handleClick()}
                >
                  <ActivityCTA
                    data={metaData}
                    isExpanded={isDailyDigestExpanded}
                  />
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
      {isDailyDigestExpanded && isDailyDigest(metaData) && (
        <DailyDigest {...metaData} />
      )}
    </Grid>
  );
};

export default IndividualNotification;
