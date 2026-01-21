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
        newDiscussionAdded
        newDiscussionReply
        modelPlanShared
        newModelPlan
        datesChanged
        newDiscussionAddedNotificationType
        datesChangedNotificationType
        dataExchangeApproachMarkedComplete
        dataExchangeApproachMarkedCompleteNotificationType
        iddocQuestionnaireComplete
        iddocQuestionnaireCompletedNotificationType
        incorrectModelStatus
      }
      leadModelPlanCount
    }
  }
`);
