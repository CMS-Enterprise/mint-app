/*
Tailored from https://stackoverflow.com/questions/63713790/how-to-update-url-hash-when-scrolling-through-sections-in-reactjs
Optional parameter to set custom anchor element/tag/class
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>(
        anchorElement || 'div.nav-anchor'
      );
      const scrollPosition = window.pageYOffset;

      const bottomOfPage =
        window.innerHeight + Math.round(window.scrollY) >=
        document.body.offsetHeight;

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
