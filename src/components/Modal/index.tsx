import React, { ReactNode, ReactNodeArray } from 'react';
import ReactModal from 'react-modal';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

type ModalProps = {
  children: ReactNode | ReactNodeArray;
  navigation?: boolean;
  isOpen: boolean;
  className?: string;
  scroll?: boolean;
  shouldCloseOnOverlayClick?: boolean;
  modalHeading?: string;
  openModal?: () => void;
  closeModal: () => void;
  noScrollable?: boolean;
};

const Modal = ({
  children,
  navigation,
  isOpen,
  className,
  scroll,
  shouldCloseOnOverlayClick = false,
  modalHeading,
  openModal,
  closeModal,
  noScrollable = true
}: ModalProps) => {
  const handleOpenModal = () => {
    if (!scroll) noScroll.on();

    if (openModal) {
      openModal();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="mint-modal__overlay overflow-y-scroll"
      className={classNames('mint-modal__content', className)}
      onAfterOpen={handleOpenModal}
      onAfterClose={() => {
        if (noScrollable) {
          noScroll.off();
        }
      }}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      appElement={document.getElementById('root')!}
    >
      {!navigation ? (
        <>
          <div
            className={`mint-modal__top-section display-flex text-base ${
              modalHeading ? 'border-bottom-1px border-base-lighter' : ''
            }`}
          >
            {modalHeading && (
              <h4 className="margin-0 padding-left-4 padding-top-2">
                {modalHeading}
              </h4>
            )}
            <button
              type="button"
              className="mint-modal__x-button text-base"
              aria-label="Close Modal"
              onClick={closeModal}
            >
              <Icon.Close size={4} />
            </button>
          </div>

          <div className="mint-modal__body">{children}</div>
        </>
      ) : (
        <>{children}</>
      )}
    </ReactModal>
  );
};

export default Modal;
