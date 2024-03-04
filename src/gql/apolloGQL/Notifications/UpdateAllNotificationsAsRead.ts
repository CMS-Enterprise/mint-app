import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateAllNotificationsAsRead {
    markAllNotificationsAsRead {
      id
    }
  }
`);
