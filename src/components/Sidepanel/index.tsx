import React from 'react';
import ReactModal from 'react-modal';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

type SidepanelProps = {
  ariaLabel: string;
  children: React.ReactNode | React.ReactNodeArray;
  classname?: string;
  overlayClassName?: string;
  closeModal: () => void;
  isOpen: boolean;
  modalHeading: string;
  openModal?: () => void;
  testid: string;
  noScrollable?: boolean;
  showScroll?: boolean;
  backButton?: boolean;
};

const Sidepanel = ({
  ariaLabel,
  children,
  classname,
  overlayClassName,
  closeModal,
  isOpen,
  modalHeading,
  openModal,
  testid,
  noScrollable = true,
  showScroll,
  backButton
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
      overlayClassName={classNames(
        'mint-sidepanel__overlay',
        {
          'overflow-y-auto': !showScroll,
          'overflow-y-scroll': showScroll
        },
        overlayClassName
      )}
      className={classNames('mint-sidepanel__content', classname)}
      onAfterOpen={handleOpenModal}
      onAfterClose={() => {
        if (noScrollable) {
          noScroll.off();
        }
      }}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick
      contentLabel={ariaLabel}
      appElement={document.getElementById('root')! as HTMLElement}
    >
      <div data-testid={testid}>
        <div className="mint-sidepanel__x-button-container display-flex text-base flex-align-center">
          <button
            type="button"
            data-testid="close-discussions"
            className="mint-sidepanel__x-button margin-right-1"
            aria-label="Close Modal"
            onClick={closeModal}
          >
            {backButton ? (
              <Icon.ArrowBack size={4} className="text-base" />
            ) : (
              <Icon.Close size={4} className="text-base" />
            )}
          </button>
          <h4 className="margin-0">{modalHeading}</h4>
        </div>

        {children}
      </div>
    </ReactModal>
  );
};

export default Sidepanel;
