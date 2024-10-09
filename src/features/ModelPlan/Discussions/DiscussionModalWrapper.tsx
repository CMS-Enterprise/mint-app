import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import Sidepanel from 'components/Sidepanel';

type DiscussionModalWrapperProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode | React.ReactNodeArray;
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
      classname="desktop:width-50"
      closeModal={closeModal}
      isOpen={isOpen}
      modalHeading={discussionsMiscT('modalHeading')}
      testid="discussion-modal"
    >
      <GridContainer className="padding-y-6">
        <Grid desktop={{ col: 12 }}>{children}</Grid>
      </GridContainer>
    </Sidepanel>
  );
};

export default DiscussionModalWrapper;
