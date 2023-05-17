// Custom hook for scrolling to elements on route change
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { LocationProps } from 'components/LinkWrapper';

function useScrollElement(dataFetched: boolean) {
  const location = useLocation<LocationProps>();

  useEffect(() => {
    // TODO: setTimeout 0 is a temporary way to ensure the element is scrolled
    setTimeout(() => {
      const fieldGroup = document.querySelector(
        `[data-scroll="${location?.state?.scrollElement}"]`
      );
      if (fieldGroup) {
        fieldGroup.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }, [location?.state?.scrollElement, dataFetched]);
}

export default useScrollElement;
