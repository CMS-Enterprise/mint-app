import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation MarkNotificationAsRead($notificationID: UUID!) {
    markNotificationAsRead(notificationID: $notificationID) {
      id
      isRead
    }
  }
`);
