import React, { useEffect, useMemo, useState } from 'react';
import { AuthTransaction, OktaAuth } from '@okta/okta-auth-js';
import { OktaContext } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';

const initialAuthState = {
  isAuthenticated: false,
  name: '',
  euaId: '',
  groups: [] as string[]
};

type ParentComponentProps = {
  children: React.ReactNode;
};

const DevSecurity = ({ children }: ParentComponentProps) => {
  const getStateFromLocalStorage = () => {
    if (window.localStorage[localAuthStorageKey]) {
      const state = JSON.parse(window.localStorage[localAuthStorageKey]);
      return {
        name: `User ${state.euaId}`,
        isAuthenticated: true,
        euaId: state.euaId,
        groups: state.jobCodes
      };
    }
    return initialAuthState;
  };

  const [authState, setAuthState] = useState(getStateFromLocalStorage);

  // Memoize the mock oktaAuth instance to prevent recreation on every render
  const oktaAuth = useMemo(() => {
    const mockAuth = new OktaAuth({
      // to appease the OktaAuth constructor
      issuer: 'https://fakewebsite.pqr',
      tokenManager: {
        autoRenew: false
      }
    });

    mockAuth.signInWithCredentials = (): Promise<AuthTransaction> => {
      setAuthState(getStateFromLocalStorage);
      return new Promise(() => {});
    };

    mockAuth.signOut = (): Promise<void> => {
      window.localStorage.removeItem(localAuthStorageKey);
      sessionStorage.clear();
      window.location.href = '/';
      return new Promise(() => {});
    };

    mockAuth.getUser = () => {
      const currentState = getStateFromLocalStorage();
      return Promise.resolve({
        name: currentState.name,
        sub: '',
        euaId: currentState.euaId,
        groups: currentState.groups
      });
    };

    mockAuth.tokenManager.off = () => {};
    mockAuth.tokenManager.on = () => {};

    return mockAuth;
  }, []); // Empty dependency array since this should only be created once

  useEffect(() => {
    setAuthState(getStateFromLocalStorage);
  }, []);

  return (
    <OktaContext.Provider
      value={{ oktaAuth, authState, _onAuthRequired: () => {} }}
    >
      {children}
    </OktaContext.Provider>
  );
};

export default DevSecurity;
