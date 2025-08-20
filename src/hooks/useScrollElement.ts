// Custom hook for scrolling to elements on route change
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useScrollElement(dataFetched: boolean) {
  const location = useLocation();

  useEffect(() => {
    // TODO: setTimeout 0 is a temporary way to ensure the element is scrolled
    setTimeout(() => {
      const fieldGroup = document.querySelector(
        `[data-scroll="${location?.state?.scrollElement}"]`
      );
      if (fieldGroup) {
        const elementPosition =
          fieldGroup.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          behavior: 'smooth',
          top: elementPosition - 75
        });
      }
    }, 0);
  }, [location?.state?.scrollElement, dataFetched]);
}

export default useScrollElement;
