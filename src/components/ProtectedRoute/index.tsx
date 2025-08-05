import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

/**
 * ProtectedRoute is a higher-order component that wraps a component with authentication protection.
 * Usage: <Route element={<ProtectedRoute><Component /></ProtectedRoute>} />
 * Or: <Route element={<ProtectedRoute element={<Component />} />} />
 */
interface ProtectedRouteProps {
  children?: React.ReactNode;
  element?: React.ReactNode;
  enabled?: boolean;
}

function ProtectedRoute({
  children,
  element,
  enabled = true
}: ProtectedRouteProps) {
  const { authState } = useOktaAuth();

  if (!enabled) {
    return <Navigate to="/not-found" replace />;
  }

  if (!authState?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children || element}</>;
}

export default ProtectedRoute;
