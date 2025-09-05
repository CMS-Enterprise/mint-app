import React, { useEffect, useRef, useState } from 'react';

import './index.scss';

interface TopScrollContainerProps {
  children: React.ReactNode;
}

/*
  This container component adds a horizontal scrollbar to the top of the content.
  The scrollbar is hidden by default and is shown when the content is too wide, depending on the width of the child content.
*/

const TopScrollContainer: React.FC<TopScrollContainerProps> = ({
  children
}) => {
  const topScrollRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const [showTopScrollbar, setShowTopScrollbar] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  const setupScrollSync = () => {
    const topScroll = topScrollRef.current;
    const contentScroll = contentScrollRef.current;

    if (!topScroll || !contentScroll) return undefined;

    const syncFromTop = () => {
      contentScroll.scrollLeft = topScroll.scrollLeft;
    };

    const syncFromContent = () => {
      const currentTopScroll = topScrollRef.current;
      if (currentTopScroll) {
        currentTopScroll.scrollLeft = contentScroll.scrollLeft;
      }
    };

    // Add event listeners
    topScroll.addEventListener('scroll', syncFromTop);
    contentScroll.addEventListener('scroll', syncFromContent);

    // Return cleanup function
    return () => {
      topScroll.removeEventListener('scroll', syncFromTop);
      contentScroll.removeEventListener('scroll', syncFromContent);
    };
  };

  useEffect(() => {
    const contentScroll = contentScrollRef.current;
    if (!contentScroll) return undefined;

    const checkAndSetupScrollbar = () => {
      const { scrollWidth, clientWidth } = contentScroll;

      if (scrollWidth > clientWidth) {
        setContentWidth(scrollWidth);
        setShowTopScrollbar(true);
      } else {
        setShowTopScrollbar(false);
      }
    };

    // Try multiple times to detect overflow
    checkAndSetupScrollbar();
    setTimeout(checkAndSetupScrollbar, 100);
    setTimeout(checkAndSetupScrollbar, 500);
    setTimeout(checkAndSetupScrollbar, 1000);

    return undefined;
  }, []);

  // Setup scroll sync when scrollbar becomes visible
  useEffect(() => {
    if (showTopScrollbar) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const cleanup = setupScrollSync();
        return cleanup;
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [showTopScrollbar]);

  return (
    <div>
      {/* Top scrollbar */}
      {showTopScrollbar && (
        <div ref={topScrollRef} className="top-scroll-container">
          <div style={{ width: contentWidth }} />
        </div>
      )}

      {/* Content container */}
      <div ref={contentScrollRef} className="top-scroll-content">
        {children}
      </div>
    </div>
  );
};

export default TopScrollContainer;
