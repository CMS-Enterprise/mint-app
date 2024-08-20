import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';
import GetNDA from 'gql/apolloGQL/Miscellaneous/GetNDA';

import { localAuthStorageKey } from 'constants/localAuth';
import { setUser } from 'reducers/authReducer';
import { isLocalAuthEnabled } from 'utils/auth';

type UserInfoWrapperProps = {
  children: React.ReactNode;
};

type oktaUserProps = {
  name?: string;
  euaId?: string;
  groups?: string[];
  email?: string;
};

const UserInfoWrapper = ({ children }: UserInfoWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, oktaAuth } = useOktaAuth();

  const { data } = useQuery(GetNDA, {
    skip: !authState?.isAuthenticated
  });

  const storeUserInfo = async () => {
    if (
      isLocalAuthEnabled() &&
      window.localStorage[localAuthStorageKey] &&
      JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
    ) {
      const oktaUser: oktaUserProps = await oktaAuth.getUser();

      const user = {
        name: oktaUser.name,
        euaId: oktaUser.euaId || '',
        groups: oktaUser.groups || [],
        acceptedNDA: data?.ndaInfo
      };

      if (oktaUser.euaId) {
        ReactGA.gtag('set', 'user_properties', {
          user_group: (oktaUser.groups || []).join(', '),
          domain: oktaUser.email?.replace(/.*@/, '')
        });
      }

      dispatch(setUser(user));
    } else {
      const user = {
        name: authState?.idToken?.claims.name,
        euaId: authState?.idToken?.claims.preferred_username,
        // @ts-ignore
        groups: authState?.accessToken?.claims['mint-groups'] || [],
        acceptedNDA: data?.ndaInfo
      };

      if (authState?.idToken?.claims.preferred_username) {
        ReactGA.gtag('set', 'user_properties', {
          user_group:
            // @ts-ignore
            (authState?.idToken?.claims['mint-groups'] || []).join(', '),
          domain: authState?.idToken?.claims.email?.replace(/.*@/, '')
        });
      }

      dispatch(setUser(user));
    }
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      storeUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated, data]);

  return <>{children}</>;
};

export default UserInfoWrapper;
