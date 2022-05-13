// Custom hook for live fetching users for combobox
import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import GetCedarUser from 'queries/GetCedarUser';
import { GetCedarUser_cedarPersonsByCommonName as GetCedarUserType } from 'queries/types/GetCedarUser';

// Custom hook for live fetching users based on text input
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

// GQL CEDAR API fetch of users based on first/last name text search
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

// Formatting of user obj to reference when selecting user from dropdown
const formatCedarUsers = (users: GetCedarUserType[]) => {
  const userObj: { [id: string]: GetCedarUserType } = {};

  users.forEach((user: GetCedarUserType) => {
    userObj[`${user.commonName}, ${user.euaUserId}`] = user;
  });

  return userObj;
};

export default useUserSearch;
