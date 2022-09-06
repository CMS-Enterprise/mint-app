import React, { ReactNode, ReactNodeArray } from 'react';
import ReactModal from 'react-modal';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

type ModalProps = {
  children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  className?: string;
  scroll?: boolean;
  openModal?: () => void;
  closeModal: () => void;
};

const Modal = ({
  children,
  isOpen,
  className,
  scroll,
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
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById('root')!}
    >
      <button
        type="button"
        className="mint-modal__x-button"
        aria-label="Close Modal"
        onClick={closeModal}
      >
        <i className="fa fa-times" />
      </button>
      <div className="mint-modal__body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
