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
            actorUserAccount {
              commonName
            }
            metaData {
              __typename
              ... on TaggedInPlanDiscussionActivityMeta {
                version
                type
                modelPlanID
                modelPlan {
                  modelName
                }
                discussionID
                content
              }
              ... on TaggedInDiscussionReplyActivityMeta {
                version
                type
                modelPlanID
                modelPlan {
                  modelName
                }
                discussionID
                replyID
                content
              }
            }
            createdByUserAccount {
              commonName
            }
          }
        }
      }
    }
  }
`);
