import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

/**
 * StickyModelNameWrapper - A component that displays a sticky header when scrolling past a trigger element.
 *
 * How it works:
 * - Monitors scroll position relative to a trigger element (typically a PageHeading)
 * - Uses a hidden measurement element to calculate the sticky header's height
 * - Shows the sticky header when the trigger element scrolls past the top of the viewport
 * - The sticky header fades in/out smoothly using CSS transitions
 * - Includes a "back to top" button for easy navigation
 * - The header becomes visible when the bottom of the trigger element reaches the sticky header's height from the top
 */
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
    let rafId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

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

    // Optimized scroll handler using requestAnimationFrame for smoother performance
    const optimizedScrollHandler = () => {
      if (rafId !== null) return; // Skip if already scheduled

      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    // Check on initial load and after a short delay to ensure elements are rendered
    handleScroll();
    timeoutId = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', optimizedScrollHandler, {
      passive: true
    });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', optimizedScrollHandler);
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
          aria-label={h('backToTop')}
        >
          <Icon.ArrowUpward size={3} aria-hidden="true" />
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
        aria-hidden={!isStickyHeaderVisible}
        role="banner"
      >
        {stickyContent}
      </div>
    </>
  );
};

export default StickyModelNameWrapper;
