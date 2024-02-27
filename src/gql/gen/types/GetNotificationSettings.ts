/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserNotificationPreferenceFlag } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetNotificationSettings
// ====================================================

export interface GetNotificationSettings_currentUser_notificationPreferences {
  __typename: "UserNotificationPreferences";
  id: UUID;
  dailyDigestComplete: UserNotificationPreferenceFlag;
  addedAsCollaborator: UserNotificationPreferenceFlag;
  taggedInDiscussion: UserNotificationPreferenceFlag;
  taggedInDiscussionReply: UserNotificationPreferenceFlag;
  newDiscussionReply: UserNotificationPreferenceFlag;
  modelPlanShared: UserNotificationPreferenceFlag;
}

export interface GetNotificationSettings_currentUser {
  __typename: "CurrentUser";
  notificationPreferences: GetNotificationSettings_currentUser_notificationPreferences;
}

export interface GetNotificationSettings {
  currentUser: GetNotificationSettings_currentUser;
}
