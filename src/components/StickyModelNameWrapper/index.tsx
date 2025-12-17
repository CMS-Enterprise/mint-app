import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

/**
 * StickyModelNameWrapper - A component that displays a sticky header when scrolling past a trigger element.
 *
 * How it works:
 * - Monitors scroll position relative to a trigger element (typically a PageHeading)
 * - Shows the sticky header when the trigger element scrolls past the sticky positioning threshold
 * - The sticky header fades in/out smoothly using CSS transitions
 * - Includes a "back to top" button for easy navigation
 * - The header becomes visible when the bottom of the trigger element reaches the sticky threshold
 *   (48px on mobile, 55px on desktop) to prevent overlap and ensure smooth visual transition
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
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();

      // Get the sticky positioning threshold from CSS
      // Mobile: 48px, Desktop: 55px (matches index.scss)
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      const stickyThreshold = isDesktop ? 55 : 48;

      // Show sticky header when the bottom of the trigger element reaches
      // the sticky positioning threshold from the top of viewport
      // This ensures smooth transition without overlap
      setIsStickyHeaderVisible(triggerRect.bottom <= stickyThreshold);
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
