/*
Hook used to preserve the underlying component route while navigating modal routes
*/

import { useEffect, useRef } from 'react';

interface LocationType {
  pathname: string;
  search?: string;
}

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
