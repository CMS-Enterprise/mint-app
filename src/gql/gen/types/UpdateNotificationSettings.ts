/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserNotificationPreferencesChanges, UserNotificationPreferenceFlag } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateNotificationSettings
// ====================================================

export interface UpdateNotificationSettings_updateUserNotificationPreferences {
  __typename: "UserNotificationPreferences";
  id: UUID;
  dailyDigestComplete: UserNotificationPreferenceFlag;
  addedAsCollaborator: UserNotificationPreferenceFlag;
  taggedInDiscussion: UserNotificationPreferenceFlag;
  taggedInDiscussionReply: UserNotificationPreferenceFlag;
  newDiscussionReply: UserNotificationPreferenceFlag;
  modelPlanShared: UserNotificationPreferenceFlag;
}

export interface UpdateNotificationSettings {
  /**
   * Sets the notification preferences of a user.
   */
  updateUserNotificationPreferences: UpdateNotificationSettings_updateUserNotificationPreferences;
}

export interface UpdateNotificationSettingsVariables {
  changes: UserNotificationPreferencesChanges;
}
