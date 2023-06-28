/*
Hook for implementing USWDS in-page navigation with react components
Optional parameter to set custom anchor element/tag/class

Tailored from https://stackoverflow.com/questions/63713790/how-to-update-url-hash-when-scrolling-through-sections-in-reactjs
*/

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useHashScroll(anchorElement?: string) {
  const { hash } = useLocation();

  // Used to set current hash directly from links outside the hook
  const [currentHash, setCurrenHash] = useState<string>(hash);

  // Stores state to buffer scrolling
  const isScrolling = useRef<boolean>(false);

  // Buffer to alleviate flicker while smooth-scrolling is happening
  if (isScrolling.current === true) {
    setTimeout(() => {
      isScrolling.current = false;
    }, 525);
  }

  // Used to set smooth scroll for entire html and cleanup/return to auto on unmount
  useEffect(() => {
    const html = document.querySelector('html')!;
    html.style.scrollBehavior = 'smooth';

    return () => {
      html.style.scrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;

      // Get all anchor elements
      const sections = document.querySelectorAll<HTMLElement>(
        anchorElement || 'div.nav-anchor'
      );

      const bottomOfPage =
        window.innerHeight + Math.round(window.scrollY) >=
        document.body.offsetHeight;

      const topOfPage = window.scrollY === 0;

      if (topOfPage) {
        setCurrenHash('');
        window.history.replaceState(null, '', ' ');
      }

      // Checks if the scroll position to set the corresponding hash
      // Set current navigation side panel render as well as updates url hash
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionBottom &&
          isScrolling.current === false
        ) {
          window.history.replaceState(
            null,
            '',
            bottomOfPage
              ? `#${sections[sections.length - 1].id}`
              : `#${section.id}`
          );

          setCurrenHash(
            bottomOfPage
              ? `#${sections[sections.length - 1].id}`
              : `#${section.id}`
          );
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolling, anchorElement]);

  return { currentHash, setCurrenHash, isScrolling };
}

export default useHashScroll;
