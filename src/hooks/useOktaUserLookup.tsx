import { useMemo, useState } from 'react';
import { useSearchOktaUsersQuery } from 'gql/gen/graphql';

/** Cedar contact properties */
export type OktaUserType = {
  username: string;
  displayName: string;
  email: string;
};

type OktaHookProps = {
  contacts: OktaUserType[];
  queryOktaUsers: (searchTerm: string) => void;
  loading: boolean;
};

/**
 * Custom hook for retrieving contacts from Cedar by common name
 * */
function useOktaUserLookup(
  query?: string | null,
  userSelected?: boolean
): OktaHookProps {
  const [searchTerm, setSearchTerm] = useState<string | null | undefined>(
    query
  );

  const { data, previousData, loading } = useSearchOktaUsersQuery(
    searchTerm
      ? {
          variables: { searchTerm }
        }
      : {
          skip: !searchTerm || searchTerm.length < 3 || userSelected
        }
  );

  /**
   * Update search term if query is more than 2 characters long
   */
  const updateQuery = (nameQuery: string) => {
    if (nameQuery.length > 1) setSearchTerm(nameQuery);
  };

  /**
   * Sorted list of contacts from CEDAR
   * */
  const contacts = useMemo<OktaUserType[]>(() => {
    // Prevent 'no results' message when loading
    if (loading) return previousData?.searchOktaUsers || [];
    // Sort and return contacts from query results
    return sortCedarContacts(data?.searchOktaUsers || [], searchTerm || '');
  }, [searchTerm, previousData, data?.searchOktaUsers, loading]);

  return { contacts, queryOktaUsers: updateQuery, loading };
}

/**
 * Sort contacts based on query
 * */
const sortCedarContacts = (
  contacts: OktaUserType[],
  query: string
): OktaUserType[] => {
  return [...contacts].sort((a, b) => {
    const result =
      a.displayName.toLowerCase().search(query) -
      b.displayName.toLowerCase().search(query);
    if (result > 0) return 1;
    if (result < 0) return -1;
    return 0;
  });
};

export default useOktaUserLookup;
