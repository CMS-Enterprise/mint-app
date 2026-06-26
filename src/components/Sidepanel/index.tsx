import React, { useCallback, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

type SidepanelProps = {
  ariaLabel: string;
  children: React.ReactNode;
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
  wideContent?: boolean;
  /** Resets fixed panel scroll position when this value changes while open. */
  contentScrollKey?: string;
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
  footer,
  wideContent = false,
  contentScrollKey
}: SidepanelProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const resetScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  const handleOpenModal = () => {
    noScroll.on();
    resetScrollPosition();
    if (openModal) {
      openModal();
    }
  };

  useEffect(() => {
    if (!isOpen || !fixed || contentScrollKey === undefined) {
      return;
    }

    resetScrollPosition();
  }, [contentScrollKey, fixed, isOpen, resetScrollPosition]);

  return React.createElement(
    ReactModal as any,
    {
      isOpen,
      overlayClassName: classNames(
        'mint-sidepanel__overlay',
        {
          'overflow-y-auto': !showScroll && !fixed,
          'overflow-y-scroll': showScroll,
          'overflow-hidden': fixed && !showScroll
        },
        overlayClassName
      ),
      className: classNames('mint-sidepanel__content', classname, {
        'overflow-hidden': fixed,
        'mint-sidepanel__content--fixed': fixed,
        'mint-sidepanel__wide-content': wideContent
      }),
      onAfterOpen: handleOpenModal,
      onAfterClose: () => {
        if (noScrollable) {
          noScroll.off();
        }
      },
      onRequestClose: closeModal,
      shouldCloseOnOverlayClick: true,
      contentLabel: ariaLabel,
      appElement: document.getElementById('root')! as HTMLElement,
      testId: 'side-panel'
    },
    <div
      data-testid={testid}
      className={classNames({
        'mint-sidepanel__fixed-layout': fixed
      })}
    >
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
            <Icon.ArrowBack size={4} className="text-base" aria-label="back" />
          ) : (
            <Icon.Close size={4} className="text-base" aria-label="close" />
          )}
        </button>
        <h4 className="margin-0">{modalHeading}</h4>
      </div>

      <div
        ref={scrollContainerRef}
        className={classNames({
          'mint-sidepanel__scroll-container': fixed,
          'padding-x-0': !fixed
        })}
      >
        {children}
      </div>

      <div className="fixed-bottom">{footer}</div>
    </div>
  );
};

export default Sidepanel;
