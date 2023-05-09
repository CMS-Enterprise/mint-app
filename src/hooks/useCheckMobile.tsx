import { useEffect, useState } from 'react';

import deviceBreakpoints from '../stylesheets/_variables.module.scss';

type deviceProps = 'mobile' | 'tablet' | 'desktop' | 'xl';

export const mobile: number = parseInt(deviceBreakpoints.tablet, 10);
export const tablet: number = parseInt(deviceBreakpoints.desktop, 10);
export const desktop: number = parseInt(deviceBreakpoints.xl, 10);

const useCheckResponsiveScreen = (device: deviceProps) => {
  const [width, setWidth] = useState(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  switch (device) {
    case 'mobile':
      return width <= mobile;
    case 'tablet':
      return width <= tablet && width >= mobile;
    case 'desktop':
      return width <= desktop && width >= tablet;
    case 'xl':
      return width > desktop;
    default:
      return true;
  }
};

export default useCheckResponsiveScreen;
