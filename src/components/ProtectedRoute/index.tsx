import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

/**
 * ProtectedRoute is a function that returns the protected element if enabled and authenticated,
 * otherwise returns a <Navigate /> to the not found or login page.
 * Usage: <Route element={ProtectedRoute({ element: <Component />, enabled })} />
 */
function ProtectedRoute({
  element,
  enabled = true
}: {
  element: React.ReactNode;
  enabled?: boolean;
}) {
  const { authState } = useOktaAuth();
  if (!enabled) {
    return <Navigate to="/not-found" replace />;
  }
  if (!authState?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
}

export default ProtectedRoute;
