import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetNotificationSettings {
    currentUser {
      notificationPreferences {
        id
        dailyDigestComplete
        addedAsCollaborator
        taggedInDiscussion
        taggedInDiscussionReply
        newDiscussionReply
        modelPlanShared
        newModelPlan
      }
    }
  }
`);
