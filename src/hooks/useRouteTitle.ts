// Hook to map react-touter-dom routes to translation titles
import { useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const useRouteTitle = ({ sendGA = false }: { sendGA: boolean }): string => {
  const location = useLocation();

  const { t } = useTranslation('routes');

  const routeTitles = t('titles', { returnObjects: true });

  const title = useRef<string>('');

  useEffect(() => {
    if (location.pathname) {
      const { pathname, search } = location;

      const params = new URLSearchParams(search);

      const category = params.get('category');
      const solution = params.get('solution');

      const currentRouteParams = pathname.replace(/\/+$/, '').split('/');

      const currentRoute = currentRouteParams[currentRouteParams.length - 1];
      const secondaryRoute = currentRouteParams[currentRouteParams.length - 2];

      // Redirect, don't need to track
      if (secondaryRoute === 'read-only') {
        return;
      }

      title.current = pathname;

      // If help and knolwedge center solution article
      if (solution && routeTitles[solution]) {
        title.current = routeTitles[solution];
        // If help and knowledge center category
      } else if (category && routeTitles[category]) {
        title.current = routeTitles[category];
        // If normal route
      } else if (
        secondaryRoute !== 'read-view' &&
        secondaryRoute !== 'sample-model-plan' &&
        routeTitles[`/${currentRoute}`]
      ) {
        title.current = routeTitles[`/${currentRoute}`];
        // Secondary route - read-view or sample-model-plan
      } else if (routeTitles[`/${secondaryRoute}/${currentRoute}`]) {
        title.current = routeTitles[`/${secondaryRoute}/${currentRoute}`];
      }

      if (sendGA) {
        ReactGA.send({
          hitType: 'pageview',
          page: location.pathname,
          title: title.current
        });
      }
    }
  }, [location, routeTitles, sendGA]);

  return title.current;
};

export default useRouteTitle;