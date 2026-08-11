import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
import { isLocalAuthEnabled, isOktaRedirectLoginEnabled } from 'utils/auth';

import DevSecurity from './DevSecurity';

type ParentComponentProps = {
  children: React.ReactNode;
};

const AuthenticationWrapper = ({ children }: ParentComponentProps) => {
  const navigate = useNavigate();

  // Memoize the authClient to prevent recreation on every render
  const authClient = useMemo(
    () =>
      new OktaAuth({
        issuer: import.meta.env.VITE_OKTA_ISSUER,
        clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
        redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI,
        scopes: ['openid', 'profile', 'email'],
        tokenManager: {
          autoRenew: false
        }
      }),
    []
  );

  const handleAuthRequiredRedirect = () => {
    navigate('/signin');
  };

  const restoreOriginalUri = async (
    _oktaAuth: OktaAuth,
    originalUri: string
  ) => {
    const relativeUri = toRelativeUrl(
      originalUri || '/',
      window.location.origin
    );

    // Redirect-login path: always land on the NDA/pre-decisional notice, and
    // carry the intended post-login destination in location state (same shape
    // the embedded-widget Login success handler used).
    // TODO(MINT-3761): remove the isOktaRedirectLoginEnabled() branch guard once redirect
    // login is permanent (keep the /pre-decisional-notice + nextState behavior).
    if (isOktaRedirectLoginEnabled()) {
      const nextState =
        !originalUri ||
        relativeUri === '/pre-decisional-notice' ||
        relativeUri.startsWith('/pre-decisional-notice')
          ? '/'
          : relativeUri;

      navigate('/pre-decisional-notice', {
        replace: true,
        state: {
          nextState
        }
      });
      return;
    }

    navigate(relativeUri, {
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
