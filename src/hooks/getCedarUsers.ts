// Custom hook for live fetching users for combobox
import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import GetCedarUser from 'queries/GetCedarUser';
import { GetCedarUser_cedarPersonsByCommonName as GetCedarUserType } from 'queries/types/GetCedarUser';

function useUserSearch(query: string) {
  const client = useApolloClient();
  const [cedarUsers, setCedarUsers] = useState<GetCedarUserType[]>([]);

  useEffect(() => {
    fetchCedarUsers(client, query).then((users: GetCedarUserType[]) => {
      setCedarUsers(users);
    });
  }, [query, client]);

  return {
    formattedUsers: cedarUsers.map(item => ({
      value: item.euaUserId,
      label: item.commonName
    })),
    userObj: formatCedarUsers(cedarUsers)
  };
}

//
const fetchCedarUsers = (client: any, value: string) => {
  return client
    .query({
      query: GetCedarUser,
      variables: { commonName: value }
    })
    .then((result: any) => {
      return result.data.cedarPersonsByCommonName;
    })
    .catch((err: any) => {
      return [];
    });
};

const formatCedarUsers = (users: GetCedarUserType[]) => {
  const userObj: { [id: string]: GetCedarUserType } = {};

  users.forEach((user: GetCedarUserType) => {
    userObj[`${user.commonName}, ${user.euaUserId}`] = user;
  });

  return userObj;
};

export default useUserSearch;
