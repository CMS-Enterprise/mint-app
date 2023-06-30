import { gql } from '@apollo/client';

export default gql`
  query GetMostRecentRoleSelection {
    mostRecentDiscussionRoleSelection {
      userRole
      userRoleDescription
    }
  }
`;
