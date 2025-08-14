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
  fixed?: boolean;
  footer?: React.ReactNode;
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
  backButton,
  fixed = false,
  footer
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
      className={classNames('mint-sidepanel__content', classname, {
        'overflow-hidden': fixed
      })}
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
      testId="side-panel"
    >
      <div data-testid={testid}>
        <div
          className={classNames(
            'mint-sidepanel__x-button-container display-flex text-base flex-align-center',
            {
              'mint-modal__fixed-top': fixed
            }
          )}
        >
          <button
            type="button"
            data-testid="close-discussions"
            className="mint-sidepanel__x-button margin-right-1"
            aria-label="Close Modal"
            onClick={closeModal}
          >
            {backButton ? (
              <Icon.ArrowBack
                size={4}
                className="text-base"
                aria-label="back"
              />
            ) : (
              <Icon.Close size={4} className="text-base" aria-label="close" />
            )}
          </button>
          <h4 className="margin-0">{modalHeading}</h4>
        </div>

        <div
          className={classNames('mint-modal__body', {
            'overflow-y-auto': fixed,
            'padding-x-0': !fixed
          })}
        >
          {children}
        </div>

        <div className="fixed-bottom">{footer}</div>
      </div>
    </ReactModal>
  );
};

export default Sidepanel;
