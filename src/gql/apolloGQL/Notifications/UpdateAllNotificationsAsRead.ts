import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateAllNotificationsAsRead {
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
