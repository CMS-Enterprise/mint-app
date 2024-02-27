import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetPollNotifications {
    currentUser {
      notifications {
        numUnreadNotifications
      }
    }
  }
`);
