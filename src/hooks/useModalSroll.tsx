import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

import usePrevLocation from './usePrevious';

const useModalScroll = (modalRoute: string) => {
  const location = useLocation();

  const prevLocation = usePrevLocation(location);
  const prevPathname = prevLocation?.pathname;

  // Only scroll when not opening or closing the modal
  useLayoutEffect(() => {
    if (
      !location.pathname.includes(modalRoute) &&
      !prevPathname?.includes(modalRoute)
    ) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, prevPathname, modalRoute]);
};

export default useModalScroll;
