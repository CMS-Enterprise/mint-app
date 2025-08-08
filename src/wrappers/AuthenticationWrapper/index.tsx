import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled } from 'utils/auth';

import DevSecurity from './DevSecurity';

type ParentComponentProps = {
  children: React.ReactNode;
};

const AuthenticationWrapper = ({ children }: ParentComponentProps) => {
  const navigate = useNavigate();

  const authClient = new OktaAuth({
    issuer: import.meta.env.VITE_OKTA_ISSUER,
    clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
    redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI,
    tokenManager: {
      autoRenew: false
    }
  });

  const handleAuthRequiredRedirect = () => {
    navigate('/signin');
  };

  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string
  ) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), {
      replace: true
    });
  };

  return isLocalAuthEnabled() &&
    window.localStorage[localAuthStorageKey] &&
    JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth ? (
    <DevSecurity>{children}</DevSecurity>
  ) : (
    <Security
      oktaAuth={authClient}
      onAuthRequired={handleAuthRequiredRedirect}
      restoreOriginalUri={restoreOriginalUri}
    >
      {children}
    </Security>
  );
};

export default AuthenticationWrapper;
