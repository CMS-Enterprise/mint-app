/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserNotificationPreferenceFlag } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: NotificationUpdate
// ====================================================

export interface NotificationUpdate_updateUserNotificationPreferences {
  __typename: "UserNotificationPreferences";
  id: UUID;
  dailyDigestComplete: UserNotificationPreferenceFlag;
  addedAsCollaborator: UserNotificationPreferenceFlag;
  taggedInDiscussion: UserNotificationPreferenceFlag;
  taggedInDiscussionReply: UserNotificationPreferenceFlag;
  newDiscussionReply: UserNotificationPreferenceFlag;
  modelPlanShared: UserNotificationPreferenceFlag;
}

export interface NotificationUpdate {
  /**
   * Sets the notification preferences of a user.
   */
  updateUserNotificationPreferences: NotificationUpdate_updateUserNotificationPreferences;
}
