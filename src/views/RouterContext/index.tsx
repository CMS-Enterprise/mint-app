/*
Context Wrapper for providing previous location
*/

import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type RouterProviderProps = {
  children: React.ReactNode;
};

// Create the model Info context - can be used anywhere in a model plan
export const RouterContext = createContext({ to: '', from: '' });

const RouterProvider = ({ children }: RouterProviderProps) => {
  const location = useLocation();
  const [route, setRoute] = useState({
    to: '',
    from: '' // --> previous pathname
  });

  useEffect(() => {
    setRoute(prev => {
      if (prev.to !== location.pathname) {
        return { to: location.pathname, from: prev.to };
      }
      return route;
    });
    return () => {
      setRoute(prev => ({ to: location.pathname, from: location.pathname }));
    };
  }, [location, route]);

  return (
    <RouterContext.Provider value={route}>{children}</RouterContext.Provider>
  );
};

export default RouterProvider;
