import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

interface StickyModelNameWrapperProps {
  /**
   * Ref to the trigger element (typically a PageHeading) that controls when the sticky header appears
   */
  triggerRef: React.RefObject<HTMLElement | null>;
  /**
   * Optional className to apply to the sticky header wrapper
   */
  className?: string;
  /**
   * Custom content to render in the sticky header.
   * If sectionHeading is provided, this will be ignored in favor of the standardized format.
   */
  children?: React.ReactNode;
  /**
   * Optional: Section heading text for standardized format.
   * When provided along with modelName, renders the standardized header format.
   */
  sectionHeading?: string;
  /**
   * Optional: Model name for standardized format.
   * When provided with sectionHeading, renders the standardized header format.
   */
  modelName?: string;
  /**
   * Optional: Model abbreviation for standardized format.
   * Displayed in parentheses after the model name if provided.
   */
  abbreviation?: string | null;
}

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
 *
 * Usage:
 * - With custom content:
 *   <StickyModelNameWrapper triggerRef={ref}>
 *     <div>Custom content</div>
 *   </StickyModelNameWrapper>
 *
 * - With standardized format:
 *   <StickyModelNameWrapper
 *     triggerRef={ref}
 *     sectionHeading="Section Title"
 *     modelName="Model Name"
 *     abbreviation="MN"
 *   />
 */
const StickyModelNameWrapper = ({
  children,
  triggerRef,
  className,
  sectionHeading,
  modelName,
  abbreviation
}: StickyModelNameWrapperProps) => {
  const { t: h } = useTranslation('generalReadOnly');
  const { t: miscellaneousT } = useTranslation('miscellaneous');
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

  // Determine content to render: standardized format if sectionHeading is provided, otherwise use children
  const renderContent = () => {
    if (sectionHeading && modelName) {
      return (
        <div className="padding-top-2 padding-bottom-1">
          <h3 className="margin-y-0">
            {miscellaneousT('modelPlanHeading', {
              heading: sectionHeading
            })}
          </h3>
          <p className="margin-y-0 font-body-lg line-height-sans-3">
            {miscellaneousT('for')} {modelName}
            {abbreviation && ` (${abbreviation})`}
          </p>
        </div>
      );
    }
    return children;
  };

  // Render the sticky header content once for reuse
  const stickyContent = (
    <GridContainer>
      <div className="display-flex flex-justify show-when-sticky">
        {renderContent()}

        <button
          type="button"
          className="usa-button usa-button--unstyled font-sans-sm display-flex flex-align-center show-when-sticky deep-underline"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={h('backToTop')}
        >
          <Icon.ArrowUpward aria-hidden="true" />
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
