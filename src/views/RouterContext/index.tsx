/*
Context Wrapper for providing previous location
*/

import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type RouterProviderProps = {
  children: React.ReactNode;
};

// Create the inital properties of router/location context
export const RouterContext = createContext<any>({
  to: '',
  from: '',
  setRoute: () => null
});

const RouterProvider = ({ children }: RouterProviderProps) => {
  const location = useLocation();
  const [route, setRoute] = useState({
    to: '',
    from: ''
  });

  useEffect(() => {
    // If new location is different that prev, update state
    setRoute(prev => {
      if (prev.to !== location.pathname + location.search) {
        return { to: location.pathname + location.search, from: prev.to };
      }
      return route;
    });
    return () => {
      setRoute({
        to: location.pathname + location.search,
        from: location.pathname + location.search
      });
    };
  }, [location, route]);

  return (
    <RouterContext.Provider value={{ ...route, setRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export default RouterProvider;
