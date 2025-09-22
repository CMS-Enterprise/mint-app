import React from 'react';
import { useTranslation } from 'react-i18next';

import Sidepanel from 'components/Sidepanel';

type DiscussionModalWrapperProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

const DiscussionModalWrapper = ({
  isOpen,
  closeModal,
  children
}: DiscussionModalWrapperProps) => {
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');

  return (
    <Sidepanel
      ariaLabel={discussionsMiscT('ariaLabel')}
      closeModal={closeModal}
      isOpen={isOpen}
      modalHeading={discussionsMiscT('modalHeading')}
      testid="discussion-modal"
      noScrollable
    >
      <div className="padding-y-6 padding-x-8 maxw-tablet">{children}</div>
    </Sidepanel>
  );
};

export default DiscussionModalWrapper;
