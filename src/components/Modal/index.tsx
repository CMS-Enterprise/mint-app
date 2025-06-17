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
  fixed?: boolean;
  zTop?: boolean;
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
  noScrollable = true,
  fixed = false,
  zTop
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
      overlayClassName={classNames('mint-modal__overlay', {
        'overflow-y-scroll': !fixed,
        'z-top': zTop
      })}
      className={classNames('mint-modal__content', className, {
        'overflow-hidden': fixed
      })}
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
            className={classNames(
              'mint-modal__top-section display-flex text-base',
              {
                'mint-modal__fixed-top': fixed,
                'border-bottom-1px border-base-lighter': modalHeading
              }
            )}
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
              <Icon.Close size={4} aria-label="close" />
            </button>
          </div>

          <div
            className={classNames('mint-modal__body', {
              'margin-top-6 mint-modal__height overflow-y-auto': fixed
            })}
          >
            {children}
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </ReactModal>
  );
};

export default Modal;
