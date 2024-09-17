import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMostRecentRoleSelection {
    mostRecentDiscussionRoleSelection {
      userRole
      userRoleDescription
    }
  }
`);
