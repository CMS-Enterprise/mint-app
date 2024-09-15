import React, { ComponentProps } from 'react';
import { Route } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';

import NotFound from 'features/NotFound';

// Prop used to pass Launch Darkly flag support to the component or disabled the route completely
type ShouldBeEnabled = { enabled?: boolean };

type ProtectedRouteProps = ComponentProps<typeof SecureRoute> & {
  children?: React.ReactNode;
} & ShouldBeEnabled;

/**
 * This component is a wrapper around Okta's SecureRoute component that adds support for Launch Darkly flags.
 * If the flag/enabled prop is false, the user will be redirected to the NotFound page.
 *
 * @param {boolean} enabled used to pass Launch Darkly flag support to the component
 * @param {RouteProps} routeProps {...routeProps} the react-router-dom route props
 * @param {OnAuthRequiredFunction} onAuthRequired the onAuthRequired function for Okta
 * @param {React.ComponentType<{ error: Error }>} errorComponent the error component for Okta
 * @returns JSX.Element
 */
const ProtectedRoute = (props: ProtectedRouteProps): JSX.Element => {
  const { enabled = true, children, ...routeProps } = props;

  // If the flag is disabled, redirect to the NotFound page
  if (!enabled) {
    return <Route component={NotFound} />;
  }

  return <SecureRoute {...routeProps}>{children}</SecureRoute>;
};

export default ProtectedRoute;
