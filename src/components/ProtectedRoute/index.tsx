/*!
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled } from 'utils/auth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  element?: React.ReactNode;
  enabled?: boolean;
}

// Main component that handles the protection logic
const ProtectedRouteComponent: React.FC<ProtectedRouteProps> = ({
  children,
  element,
  enabled = true
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
    return <>{children || element}</>;
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
  return <>{children || element}</>;
};

// Function version that can wrap components - for cleaner route syntax
const ProtectedRoute = (
  component: React.ReactNode,
  options: { enabled?: boolean } = {}
): React.ReactNode => {
  return <ProtectedRouteComponent element={component} {...options} />;
};

// Attach the component to the function so it can be used as both
(ProtectedRoute as any).Component = ProtectedRouteComponent;

// For TypeScript, we need to extend the function interface
interface ProtectedRouteFunction {
  (
    component: React.ReactNode,
    options?: { enabled?: boolean }
  ): React.ReactNode;
  Component: React.FC<ProtectedRouteProps>;
  (props: ProtectedRouteProps): JSX.Element;
}

// Cast and export as both function and component
const ProtectedRouteExport = ProtectedRoute as ProtectedRouteFunction;

// Make it work as a React component too
Object.setPrototypeOf(ProtectedRouteExport, ProtectedRouteComponent);
Object.assign(ProtectedRouteExport, ProtectedRouteComponent);

export { ProtectedRouteComponent };
export default ProtectedRouteExport;
