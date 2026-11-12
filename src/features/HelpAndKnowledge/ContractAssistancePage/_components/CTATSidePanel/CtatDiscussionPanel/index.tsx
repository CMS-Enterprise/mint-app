import React from 'react';
import { useTranslation } from 'react-i18next';

import Sidepanel from 'components/Sidepanel';

type CtatDiscussionPanelProps = {
  closeModal: () => void;
};

const CtatDiscussionPanel = ({ closeModal }: CtatDiscussionPanelProps) => {
  const { t } = useTranslation('contractAssistanceMisc');
  const discussionLabel = t('ctatViewPanel.discussionHeading');

  return (
    <Sidepanel
      isOpen
      closeModal={closeModal}
      ariaLabel={discussionLabel}
      modalHeading={t('ctatDiscussionPanel.backToTicketDetails')}
      testid="ctat-discussion-sidepanel"
      backButton
      fixed
    >
      <div className="padding-y-6 padding-x-8" />
    </Sidepanel>
  );
};

export default CtatDiscussionPanel;
