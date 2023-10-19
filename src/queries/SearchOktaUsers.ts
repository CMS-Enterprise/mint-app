import { gql } from '@apollo/client';

export default gql`
  query SearchOktaUsers($searchTerm: String!) {
    searchOktaUsers(searchTerm: $searchTerm) {
      displayName
      username
      email
    }
  }
`;
