import { useEffect, useState } from 'react';

import deviceBreakpoints from '../stylesheets/_variables.module.scss';

type deviceProps = 'mobile' | 'tablet' | 'desktop' | 'xl';

type comparisonProps = 'larger' | 'smaller';

export const mobile: number = parseInt(deviceBreakpoints.tablet, 10);
export const tablet: number = parseInt(deviceBreakpoints.desktop, 10);
export const desktop: number = parseInt(deviceBreakpoints.xl, 10);
export const xl: number = parseInt(deviceBreakpoints.xxl, 10);

const useCheckResponsiveScreen = (
  device: deviceProps,
  comparison?: comparisonProps
) => {
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

  if (comparison) {
    switch (device) {
      case 'mobile':
        return comparison === 'larger' ? width >= mobile : width <= mobile;
      case 'tablet':
        return comparison === 'larger' ? width >= tablet : width <= tablet;
      case 'desktop':
        return comparison === 'larger' ? width >= desktop : width <= desktop;
      case 'xl':
        return comparison === 'larger' ? width >= xl : width <= xl;
      default:
        return true;
    }
  } else {
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
  }
};

export default useCheckResponsiveScreen;
