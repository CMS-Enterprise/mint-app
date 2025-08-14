/**
 * A function that wraps components with authentication protection. This is needed because @okta/okta-react deprecated <SecureRoute> with react-router v6.
 * If the enabled option is false, the user will be redirected to the NotFound page.
 * If the user is not authenticated, they will be redirected to the signin page.
 *
 * @param {React.ReactNode} component - The component to wrap with protection
 * @param {object} options - Configuration options
 * @param {boolean} options.enabled - Whether the route is enabled (defaults to true)
 * @returns {React.ReactNode} The protected component
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled } from 'utils/auth';

// Internal component that handles the protection logic
const ProtectedRoute = ({
  children,
  enabled = true
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) => {
  const { oktaAuth, authState } = useOktaAuth();
  const location = useLocation();

  // Check if local auth is being used
  const isLocalAuth =
    isLocalAuthEnabled() && window.localStorage[localAuthStorageKey];

  if (!enabled) {
    return <Navigate to="/not-found" replace />;
  }

  // If using local auth, skip Okta auth state checks
  if (isLocalAuth) {
    return <>{children}</>;
  }

  // If oktaAuth is null, something is wrong with the authentication setup
  if (!oktaAuth) {
    return <div>Authentication setup error. Please refresh the page.</div>;
  }

  // Show loading state while auth state is being determined
  if (!authState) {
    return <div>Loading authentication...</div>;
  }

  if (authState.isPending) {
    return <div>Authenticating...</div>;
  }

  if (!authState?.isAuthenticated) {
    // Store the current location so we can redirect back after login
    oktaAuth.setOriginalUri(location.pathname + location.search);
    return <Navigate to="/signin" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
