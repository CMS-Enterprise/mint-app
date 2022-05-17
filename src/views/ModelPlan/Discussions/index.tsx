import React, { ReactNode, ReactNodeArray } from 'react';
import ReactModal from 'react-modal';
import noScroll from 'no-scroll';

import './index.scss';

type DiscussionsProps = {
  children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  openModal?: () => void;
  closeModal: () => void;
};

const Discussions = ({
  children,
  isOpen,
  openModal,
  closeModal
}: DiscussionsProps) => {
  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="mint-modal__overlay"
      className="mint-modal__content"
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

export default Discussions;
