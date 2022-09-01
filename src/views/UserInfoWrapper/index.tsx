import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
// import { useHistory, useLocation } from 'react-router-dom';
// import { useLazyQuery } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';

import { localAuthStorageKey } from 'constants/localAuth';
// import GetNDA from 'queries/NDA/GetNDA';
import { setUser } from 'reducers/authReducer';
import { isLocalAuthEnabled } from 'utils/auth';

type UserInfoWrapperProps = {
  children: React.ReactNode;
};

type oktaUserProps = {
  name?: string;
  euaId?: string;
  groups?: string[];
};

const UserInfoWrapper = ({ children }: UserInfoWrapperProps) => {
  const dispatch = useDispatch();
  // const { pathname } = useLocation();
  const { authState, oktaAuth } = useOktaAuth();
  // const history = useHistory();

  // const [ndaInfo, { data }] = useLazyQuery(GetNDA);
  // console.log('hdsfs');

  // const userStore = useSelector((state: RootStateOrAny) => state.auth);

  const storeUserInfo = async () => {
    if (
      isLocalAuthEnabled() &&
      window.localStorage[localAuthStorageKey] &&
      JSON.parse(window.localStorage[localAuthStorageKey]).favorLocalAuth
    ) {
      const oktaUser: oktaUserProps = await oktaAuth.getUser();
      // ndaInfo();
      const user = {
        name: oktaUser.name,
        euaId: oktaUser.euaId || '',
        groups: oktaUser.groups || []
        // accepetedNDA: data?.ndaInfo
      };
      dispatch(setUser(user));
    } else {
      const user = {
        name: authState?.idToken?.claims.name,
        euaId: authState?.idToken?.claims.preferred_username,
        // @ts-ignore
        groups: authState?.accessToken?.claims.groups || []
        // accepetedNDA: data?.ndaInfo
      };
      dispatch(setUser(user));
    }
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      storeUserInfo();
      // if (!userStore?.acceptedNDA) {
      //   history.push('/pre-decisional-notice');
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated]);

  return <>{children}</>;
};

export default UserInfoWrapper;
