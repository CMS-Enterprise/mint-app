import React, { ReactNode, ReactNodeArray } from 'react';
import ReactModal from 'react-modal';
import { IconClose } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

type ModalProps = {
  children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  className?: string;
  scroll?: boolean;
  shouldCloseOnOverlayClick?: boolean;
  modalHeading?: string;
  openModal?: () => void;
  closeModal: () => void;
};

const Modal = ({
  children,
  isOpen,
  className,
  scroll,
  shouldCloseOnOverlayClick = false,
  modalHeading,
  openModal,
  closeModal
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
      overlayClassName="mint-modal__overlay"
      className={classNames('mint-modal__content', className)}
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      appElement={document.getElementById('root')!}
    >
      <div
        className={`mint-modal__top-section display-flex text-base ${
          modalHeading ? 'border-bottom-1px border-base-lighter' : ''
        }`}
      >
        <h4 className="margin-0 padding-left-4 padding-top-2">
          {modalHeading}
        </h4>
        <button
          type="button"
          className="mint-modal__x-button text-base"
          aria-label="Close Modal"
          onClick={closeModal}
        >
          <IconClose />
        </button>
      </div>

      <div className="mint-modal__body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
