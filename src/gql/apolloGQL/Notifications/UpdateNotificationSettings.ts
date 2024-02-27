import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateNotificationSettings {
    updateUserNotificationPreferences(
      changes: {
        dailyDigestComplete: ALL
        addedAsCollaborator: ALL
        taggedInDiscussion: ALL
        taggedInDiscussionReply: ALL
        newDiscussionReply: ALL
        modelPlanShared: ALL
      }
    ) {
      id
      dailyDigestComplete
      addedAsCollaborator
      taggedInDiscussion
      taggedInDiscussionReply
      newDiscussionReply
      modelPlanShared
    }
  }
`);
