import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import {
  CtatDiscussionPoster,
  GetCtatDiscussionsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { AvatarCircle } from 'components/Avatar';
import PageHeading from 'components/PageHeading';
import Spinner from 'components/Spinner';

import { formatDiscussionRelativeDate } from '../../../utils';

type CtatDiscussionContentProps = {
  ticketNumber: string;
  discussions: GetCtatDiscussionsQuery['discussions'];
  discussionsLoading: boolean;
  discussionsError?: Error;
};

const CtatDiscussionContent = ({
  ticketNumber,
  discussions,
  discussionsLoading,
  discussionsError
}: CtatDiscussionContentProps) => {
  const { t } = useTranslation('contractAssistanceMisc');
  const [showEarlierMessages, setShowEarlierMessages] = useState(false);
  const discussionLabel = t('ctatViewPanel.discussionHeading');
  const messageCount = discussions.length;
  // The discussion query returns newest first, including a stable ID tie break.
  const chronologicalDiscussions = [...discussions].reverse();
  const visibleDiscussions = showEarlierMessages
    ? chronologicalDiscussions
    : chronologicalDiscussions.slice(-2);

  return (
    <div className="margin-top-8 padding-8 maxw-tablet">
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-2">
        {discussionLabel}
      </PageHeading>
      <p className="font-body-md text-base-dark margin-top-0 margin-bottom-4">
        {t('ctatDiscussionPanel.ticketNumber', { ticketNumber })}
      </p>
      {discussionsLoading && (
        <Spinner aria-label={t('ctatViewPanel.discussionLoading')} />
      )}
      {!discussionsLoading && discussionsError && (
        <p className="margin-top-0" role="alert">
          {t('ctatViewPanel.discussionError')}
        </p>
      )}
      {!discussionsLoading &&
        !discussionsError &&
        (messageCount > 0 ? (
          <>
            <p className="text-bold margin-top-0 margin-bottom-4">
              {t('ctatViewPanel.discussionMessageCount', {
                count: messageCount
              })}
            </p>
            {messageCount > 2 && (
              <div className="margin-bottom-4">
                <p className="margin-y-0">
                  {t(
                    showEarlierMessages
                      ? 'ctatDiscussionPanel.showingAllMessages'
                      : 'ctatDiscussionPanel.showingRecentMessages'
                  )}
                </p>
                <Button
                  type="button"
                  unstyled
                  aria-expanded={showEarlierMessages}
                  aria-controls="ctat-discussion-messages"
                  onClick={() => setShowEarlierMessages(!showEarlierMessages)}
                >
                  {t(
                    showEarlierMessages
                      ? 'ctatDiscussionPanel.hideEarlierMessages'
                      : 'ctatDiscussionPanel.showEarlierMessages'
                  )}
                </Button>
              </div>
            )}
            <div id="ctat-discussion-messages">
              {visibleDiscussions.map(discussion => {
                const { givenName, familyName } =
                  discussion.createdByUserAccount;
                const fullName = `${givenName} ${familyName}`.trim();
                const avatarName = `${givenName.split(' ')[0]} ${familyName.split(' ')[0]}`;

                return (
                  <article
                    key={discussion.id}
                    className="border-top-1px border-base-lighter padding-y-3"
                  >
                    <div className="display-flex flex-justify flex-align-start">
                      <div className="display-flex flex-align-start">
                        <AvatarCircle
                          user={avatarName}
                          className="margin-right-1 flex-none"
                        />
                        <div>
                          <p className="text-bold margin-y-0">{fullName}</p>
                          <p className="text-base margin-y-0">
                            {t(
                              discussion.posterRole ===
                                CtatDiscussionPoster.ADMIN
                                ? 'ctatDiscussionPanel.adminRole'
                                : 'ctatDiscussionPanel.requesterRole'
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="text-base margin-left-2 text-no-wrap">
                        {formatDiscussionRelativeDate(
                          discussion.createdDts
                        ).replace(/^Today at /, 'Today, ')}
                      </span>
                    </div>
                    <p className="margin-bottom-0 margin-left-5">
                      {discussion.content}
                    </p>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <Alert type="info" slim className="margin-top-0 margin-bottom-4">
            {t('ctatDiscussionPanel.empty')}
          </Alert>
        ))}
    </div>
  );
};

export default CtatDiscussionContent;
