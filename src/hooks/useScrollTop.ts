// Custom hook for scrolling to top of page
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

import usePrevLocation from 'hooks/usePrevious';

interface ToStateProps {
  [key: string]: string | number | null | boolean;
}

export interface LocationProps {
  pathname: string;
  state: ToStateProps;
  scroll?: boolean;
}

const scrollBypass: string[] = [
  'read-only',
  'sample-model-plan',
  '/how-to-get-access',
  '/help-and-knowledge/operational-solutions',
  '?solution=',
  '&solution=',
  '&scroll-to-bottom',
  '/collaboration-area/model-to-operations',
  // Read view bypasses for MTO panels
  '?view-milestone=',
  '?view-solution=',
  '&view-milestone=',
  '&view-solution='
];

const shouldScroll = (path: string, prevPath: string | undefined) => {
  // console.log('/how-to-get-access#'.includes('/how-to-get-access'));
  return (
    !scrollBypass.some(r => path.includes(r)) &&
    !scrollBypass.some(r => prevPath?.includes(r))
  );
};

// Check if we should bypass scroll based on location state
const bypassScroll = (
  state: LocationProps,
  prevState: LocationProps | undefined
) => {
  return state?.scroll === true || prevState?.scroll === true;
};

function useScrollTop() {
  const location = useLocation();
  const prevLocation = usePrevLocation(location);
  // console.log('location', location);
  useLayoutEffect(() => {
    if (
      shouldScroll(
        location.pathname + location.search,
        (prevLocation?.pathname || '') + (prevLocation?.search || '')
      ) ||
      bypassScroll(location.state, prevLocation?.state)
    ) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, [location, prevLocation]);
}

export default useScrollTop;
