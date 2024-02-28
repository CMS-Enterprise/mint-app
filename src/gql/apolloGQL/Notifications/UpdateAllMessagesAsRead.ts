import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateAllMessagesAsRead {
    markAllNotificationsAsRead {
      id
      isRead
      activity {
        activityType
        entityID
        actorID
        createdByUserAccount {
          commonName
        }
      }
      createdByUserAccount {
        commonName
      }
    }
  }
`);
