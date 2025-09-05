import React, { useEffect, useRef, useState } from 'react';

import './index.scss';

interface TopScrollContainerProps {
  children: React.ReactNode;
}

/**
 * TopScrollContainer Component
 *
 * This container component adds a horizontal scrollbar to the top of the content.
 * The scrollbar is hidden by default and is shown when the content is too wide,
 * depending on the width of the child content.
 *
 * Usage:
 * If using USWDS Table, `scrollable` prop must not be set
 */

const TopScrollContainer: React.FC<TopScrollContainerProps> = ({
  children
}) => {
  // Refs to access the DOM elements for scroll synchronization
  const topScrollRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // State to control scrollbar visibility and width
  const [showTopScrollbar, setShowTopScrollbar] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  /**
   * Sets up bidirectional scroll synchronization between top scrollbar and content
   * @returns cleanup function to remove event listeners
   */
  const setupScrollSync = () => {
    const topScroll = topScrollRef.current;
    const contentScroll = contentScrollRef.current;

    if (!topScroll || !contentScroll) return undefined;

    // When user scrolls the top scrollbar, sync to content
    const syncFromTop = () => {
      contentScroll.scrollLeft = topScroll.scrollLeft;
    };

    // When user scrolls the content, sync to top scrollbar
    const syncFromContent = () => {
      const currentTopScroll = topScrollRef.current;
      if (currentTopScroll) {
        currentTopScroll.scrollLeft = contentScroll.scrollLeft;
      }
    };

    // Attach scroll event listeners for bidirectional sync
    topScroll.addEventListener('scroll', syncFromTop);
    contentScroll.addEventListener('scroll', syncFromContent);

    // Return cleanup function to remove event listeners
    return () => {
      topScroll.removeEventListener('scroll', syncFromTop);
      contentScroll.removeEventListener('scroll', syncFromContent);
    };
  };

  /**
   * Effect: Detect horizontal overflow and show/hide top scrollbar
   * Runs once on mount and checks multiple times to handle async content loading
   */
  useEffect(() => {
    const contentScroll = contentScrollRef.current;
    if (!contentScroll) return undefined;

    /**
     * Checks if content overflows horizontally and updates scrollbar state
     */
    const checkAndSetupScrollbar = () => {
      const { scrollWidth, clientWidth } = contentScroll;

      // Show scrollbar if content is wider than container
      if (scrollWidth > clientWidth) {
        setContentWidth(scrollWidth);
        setShowTopScrollbar(true);
      } else {
        setShowTopScrollbar(false);
      }
    };

    // Try multiple times to detect overflow as content may load asynchronously
    checkAndSetupScrollbar(); // Immediate check
    setTimeout(checkAndSetupScrollbar, 100); // After 100ms
    setTimeout(checkAndSetupScrollbar, 500); // After 500ms
    setTimeout(checkAndSetupScrollbar, 1000); // After 1s

    return undefined;
  }, []); // Run once on mount

  /**
   * Effect: Setup scroll synchronization when scrollbar becomes visible
   * Runs whenever showTopScrollbar state changes
   */
  useEffect(() => {
    if (showTopScrollbar) {
      // Small delay to ensure DOM elements are fully rendered
      const timer = setTimeout(() => {
        const cleanup = setupScrollSync();
        return cleanup; // This cleanup function will be called when effect re-runs
      }, 50);

      // Cleanup timer if effect re-runs before timeout
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [showTopScrollbar]); // Re-run when scrollbar visibility changes

  return (
    <div>
      {/* 
        Top scrollbar: Only rendered when content overflows horizontally
        - Uses CSS class for styling (height, overflow, margins)
        - Inner div width matches content width to create scrollable area
        - Ref allows scroll synchronization with content below
      */}
      {showTopScrollbar && (
        <div ref={topScrollRef} className="top-scroll-container">
          <div style={{ width: contentWidth }} />
        </div>
      )}

      {/* 
        Content container: Wraps the child content
        - Allows horizontal scrolling when content overflows
        - Ref enables scroll synchronization with top scrollbar
        - Renders any child components passed to this container
      */}
      <div ref={contentScrollRef} className="top-scroll-content">
        {children}
      </div>
    </div>
  );
};

export default TopScrollContainer;
