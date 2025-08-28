import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import '../Modal/index.scss';

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  className?: string;
  shouldCloseOnOverlayClick?: boolean;
  modalHeading?: string;
  closeModal: () => void;
  submitAction?: () => void;
  clearAction?: () => void;
};

const ModalForm = ({
  children,
  isOpen,
  className,
  shouldCloseOnOverlayClick = false,
  modalHeading,
  closeModal,
  submitAction,
  clearAction
}: ModalProps) => {
  // Cast to any to avoid type errors. This is a common pattern for resolving React 19 compatibility issues with third-party libraries that haven't been updated yet.
  const ModalComponent = ReactModal as any;

  return (
    <ModalComponent
      isOpen={isOpen}
      overlayClassName={classNames('mint-modal__overlay')}
      className={classNames('mint-modal__content', className)}
      onAfterClose={() => {
        noScroll.off();
      }}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      appElement={document.getElementById('root')!}
    >
      {/* HEADING */}
      <div
        className={classNames(
          'display-flex flex-align-center text-base padding-y-1 padding-left-4 padding-right-2 border-bottom-1px border-base-lighter'
        )}
      >
        {modalHeading && <h4 className="margin-0 flex-1">{modalHeading}</h4>}

        <button
          type="button"
          className="mint-modal__x-button text-base"
          aria-label="Close Modal"
          onClick={closeModal}
        >
          <Icon.Close size={4} aria-label="close" />
        </button>
      </div>

      {/* BODY */}
      <div className={classNames('mint-modal__body margin-y-2')}>
        {children}
      </div>

      {/* FOOTER */}
      <div className="border-top-1px border-base-lighter padding-y-2 padding-x-4 display-flex flex-justify">
        <Button
          type="button"
          unstyled
          onClick={() => {
            if (clearAction) {
              clearAction();
            } else {
              closeModal();
            }
          }}
        >
          Clear all
        </Button>

        <Button
          type="button"
          onClick={() => {
            if (submitAction) {
              submitAction();
            } else {
              closeModal();
            }
          }}
        >
          Apply filter
        </Button>
      </div>
    </ModalComponent>
  );
};

export default ModalForm;
