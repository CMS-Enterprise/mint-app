import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { useOktaAuth } from '@okta/okta-react';
import { DateTime } from 'luxon';
import getDateQuery from 'queriesCodegen/getDate';
import getNDAQuery from 'queriesCodegen/getNDA';
import getWeekFromNowMutation from 'queriesCodegen/getWeekFromNow';

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
};

const UserInfoWrapper = ({ children }: UserInfoWrapperProps) => {
  const dispatch = useDispatch();
  const { authState, oktaAuth } = useOktaAuth();

  const { data } = useQuery(getNDAQuery, {
    skip: !authState?.isAuthenticated
  });

  const { data: dateData } = useQuery(getDateQuery);
  console.log('DATE DATA:', dateData);

  const [createWeekData] = useMutation(getWeekFromNowMutation);

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
      dispatch(setUser(user));
    } else {
      const user = {
        name: authState?.idToken?.claims.name,
        euaId: authState?.idToken?.claims.preferred_username,
        // @ts-ignore
        groups: authState?.accessToken?.claims['mint-groups'] || [],
        acceptedNDA: data?.ndaInfo
      };
      dispatch(setUser(user));
    }
  };

  useEffect(() => {
    if (authState?.isAuthenticated) {
      storeUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.isAuthenticated, data]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const someDate = DateTime.fromISO('2016-05-25T09:08:34.123');
          createWeekData({
            variables: {
              date: someDate
            }
          }).then(weekData => {
            console.log('WEEK DATA:', weekData);
          });
        }}
      >
        CLICK MEEEE
      </button>
      {children}
    </>
  );
};

export default UserInfoWrapper;
