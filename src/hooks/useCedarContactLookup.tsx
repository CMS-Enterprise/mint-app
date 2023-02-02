import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import GetCedarUser from 'queries/GetCedarUser';
import { GetCedarUser as GetCedarUserType } from 'queries/types/GetCedarUser';

/** Cedar contact properties */
export type CedarContactProps = {
  euaUserId: string;
  commonName: string;
  email?: string;
};

type CedarHookProps = {
  contacts: CedarContactProps[];
  queryCedarContacts: (commonName: string) => void;
  loading: boolean;
};

/**
 * Custom hook for retrieving contacts from Cedar by common name
 * */
function useCedarContactLookup(
  query?: string | null,
  userSelected?: boolean
): CedarHookProps {
  const [searchTerm, setSearchTerm] = useState<string | null | undefined>(
    query
  );

  const { data, previousData, loading } = useQuery<GetCedarUserType>(
    GetCedarUser,
    {
      variables: { commonName: searchTerm },
      skip: !query || query.length < 3 || userSelected
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
  const contacts = useMemo<CedarContactProps[]>(() => {
    // Prevent 'no results' message when loading
    if (loading) return previousData?.cedarPersonsByCommonName || [];
    // Sort and return contacts from query results
    return sortCedarContacts(
      data?.cedarPersonsByCommonName || [],
      searchTerm || ''
    );
  }, [searchTerm, previousData, data?.cedarPersonsByCommonName, loading]);

  return { contacts, queryCedarContacts: updateQuery, loading };
}

/**
 * Sort contacts based on query
 * */
const sortCedarContacts = (
  contacts: CedarContactProps[],
  query: string
): CedarContactProps[] => {
  return [...contacts].sort((a, b) => {
    const result =
      a.commonName.toLowerCase().search(query) -
      b.commonName.toLowerCase().search(query);
    if (result > 0) return 1;
    if (result < 0) return -1;
    return 0;
  });
};

export default useCedarContactLookup;
