import React from 'react';
import { useTranslation } from 'react-i18next';

import Alert from 'components/Alert';
import PageHeading from 'components/PageHeading';
import Spinner from 'components/Spinner';

type CtatDiscussionContentProps = {
  ticketNumber: string;
  messageCount: number;
  discussionsLoading: boolean;
  discussionsError?: Error;
};

const CtatDiscussionContent = ({
  ticketNumber,
  messageCount,
  discussionsLoading,
  discussionsError
}: CtatDiscussionContentProps) => {
  const { t } = useTranslation('contractAssistanceMisc');
  const discussionLabel = t('ctatViewPanel.discussionHeading');

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
          <p className="text-bold margin-top-0 margin-bottom-4">
            {t('ctatViewPanel.discussionMessageCount', {
              count: messageCount
            })}
          </p>
        ) : (
          <Alert type="info" slim className="margin-top-0 margin-bottom-4">
            {t('ctatDiscussionPanel.empty')}
          </Alert>
        ))}
    </div>
  );
};

export default CtatDiscussionContent;
