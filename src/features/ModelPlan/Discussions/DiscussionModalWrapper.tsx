import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import noScroll from 'no-scroll';

type DiscussionModalWrapperProps = {
  isOpen: boolean;
  openModal?: () => void;
  closeModal: () => void;
  children: React.ReactNode | React.ReactNodeArray;
};

const DiscussionModalWrapper = ({
  isOpen,
  openModal,
  closeModal,
  children
}: DiscussionModalWrapperProps) => {
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');

  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="mint-discussions__overlay overflow-y-scroll"
      className="mint-discussions__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick
      contentLabel={discussionsMiscT('ariaLabel')}
      appElement={document.getElementById('root')! as HTMLElement}
    >
      <div data-testid="discussion-modal">
        <div className="mint-discussions__x-button-container display-flex text-base flex-align-center">
          <button
            type="button"
            data-testid="close-discussions"
            className="mint-discussions__x-button margin-right-2"
            aria-label="Close Modal"
            onClick={closeModal}
          >
            <Icon.Close size={4} className="text-base" />
          </button>
          <h4 className="margin-0">{discussionsMiscT('modalHeading')}</h4>
        </div>
        <GridContainer className="padding-y-6">
          <Grid desktop={{ col: 12 }}>{children}</Grid>
        </GridContainer>
      </div>
    </ReactModal>
  );
};

export default DiscussionModalWrapper;
