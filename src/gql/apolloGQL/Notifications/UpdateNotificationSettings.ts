import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateNotificationSettings(
    $changes: UserNotificationPreferencesChanges!
  ) {
    updateUserNotificationPreferences(changes: $changes) {
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
`);
