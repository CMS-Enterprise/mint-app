import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

const StickyModelNameWrapper = ({
  children,
  triggerRef,
  className
}: {
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}) => {
  const { t: h } = useTranslation('generalReadOnly');
  // Ref for measuring the height of the sticky header (hidden, off-screen)
  const measurementRef = useRef<HTMLDivElement>(null);
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!triggerRef.current || !measurementRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      // Use the hidden measurement element to get the height
      const stickyHeaderHeight = measurementRef.current.offsetHeight;

      // Show sticky header when the bottom of the trigger element reaches
      // the sticky header's height from the top of viewport
      // This ensures smooth transition as the trigger scrolls past
      setIsStickyHeaderVisible(triggerRect.bottom <= stickyHeaderHeight);
    };

    // Check on initial load and after a short delay to ensure elements are rendered
    handleScroll();
    const timeoutId = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [triggerRef]);

  // Render the sticky header content once for reuse
  const stickyContent = (
    <GridContainer>
      <div className="display-flex flex-justify show-when-sticky">
        {children}

        <button
          type="button"
          className="usa-button usa-button--unstyled font-sans-sm display-flex flex-align-center show-when-sticky"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Icon.ArrowUpward size={3} aria-label="arrow up" />
          {h('backToTop')}
        </button>
      </div>
    </GridContainer>
  );

  return (
    <>
      {/* Hidden measurement element - always rendered but off-screen for height calculation */}
      <div
        ref={measurementRef}
        className={classNames('sticky-header-wrapper', className)}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          top: '-9999px',
          left: '-9999px',
          width: '100%'
        }}
        aria-hidden="true"
      >
        {stickyContent}
      </div>

      {/* Sticky header - always rendered but faded in/out smoothly */}
      <div
        className={classNames(
          'sticky-header-wrapper z-300 shadow-2 bg-white',
          className,
          {
            'sticky-header-wrapper--visible': isStickyHeaderVisible
          }
        )}
        aria-hidden="true"
      >
        {stickyContent}
      </div>
    </>
  );
};

export default StickyModelNameWrapper;
