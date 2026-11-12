import React from 'react';
import { useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';

type CtatDiscussionContentProps = {
  ticketNumber: string;
};

const CtatDiscussionContent = ({
  ticketNumber
}: CtatDiscussionContentProps) => {
  const { t } = useTranslation('contractAssistanceMisc');
  const discussionLabel = t('ctatViewPanel.discussionHeading');

  return (
    <div className="margin-top-8 padding-8 maxw-tablet">
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-1">
        {discussionLabel}
      </PageHeading>
      <p className="font-body-md text-base-dark margin-top-0 margin-bottom-4">
        {t('ctatDiscussionPanel.ticketNumber', { ticketNumber })}
      </p>
    </div>
  );
};

export default CtatDiscussionContent;
