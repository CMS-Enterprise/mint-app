import { useEffect, useRef } from 'react';

const usePrevLocation = (location: any) => {
  const prevLocRef = useRef(location);

  useEffect(() => {
    prevLocRef.current = location;
  }, [location]);

  return prevLocRef.current;
};

export default usePrevLocation;
