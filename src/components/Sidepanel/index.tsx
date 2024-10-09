import React from 'react';
import ReactModal from 'react-modal';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import noScroll from 'no-scroll';

type SidepanelProps = {
  ariaLabel: string;
  children: React.ReactNode | React.ReactNodeArray;
  closeModal: () => void;
  isOpen: boolean;
  openModal?: () => void;
  testid: string;
  modalHeading: string;
};

const Sidepanel = ({
  ariaLabel,
  children,
  modalHeading,
  closeModal,
  isOpen,
  openModal,
  testid
}: SidepanelProps) => {
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
      contentLabel={ariaLabel}
      appElement={document.getElementById('root')! as HTMLElement}
    >
      <div data-testid={testid}>
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
          <h4 className="margin-0">{modalHeading}</h4>
        </div>
        <GridContainer className="padding-y-6">
          <Grid desktop={{ col: 12 }}>{children}</Grid>
        </GridContainer>
      </div>
    </ReactModal>
  );
};

export default Sidepanel;
