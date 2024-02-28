import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetNotifications {
    currentUser {
      notifications {
        numUnreadNotifications
        notifications {
          __typename
          id
          isRead
          inAppSent
          emailSent
          activity {
            activityType
            entityID
            actorID
            metaData {
              __typename
              ... on TaggedInPlanDiscussionActivityMeta {
                version
                type
                discussionID
                content
              }
              ... on TaggedInDiscussionReplyActivityMeta {
                version
                type
                discussionID
                replyID
                content
              }
            }
            createdByUserAccount {
              commonName
            }
          }
          createdByUserAccount {
            commonName
          }
        }
      }
    }
  }
`);
