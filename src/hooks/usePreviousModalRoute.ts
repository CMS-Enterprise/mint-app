/*
Hook used to preserve the underlying component route while navigating modal routes
*/

import { useEffect, useRef } from 'react';

interface LocationType {
  pathname: string;
  search?: string;
}

/* location param is reference from useLocation() hook to store it's as prev state
   route param is a string route where it's location state is NOT to be stored (modal parent route)
   This allows components to return to previous states while navigating through modal routes
*/
const usePreviousModalRoute = (location: LocationType, route: string) => {
  const ref = useRef<LocationType>();

  useEffect(() => {
    if (!location.pathname.includes(route)) {
      ref.current = location;
    }
  }, [location, route]);
  return ref.current;
};

export default usePreviousModalRoute;
