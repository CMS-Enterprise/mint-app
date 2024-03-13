/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserNotificationPreferenceFlag } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: currentUser
// ====================================================

export interface currentUser_currentUser_notificationPreferences {
  __typename: "UserNotificationPreferences";
  id: UUID;
  dailyDigestComplete: UserNotificationPreferenceFlag;
  addedAsCollaborator: UserNotificationPreferenceFlag;
  taggedInDiscussion: UserNotificationPreferenceFlag;
  taggedInDiscussionReply: UserNotificationPreferenceFlag;
  newDiscussionReply: UserNotificationPreferenceFlag;
  modelPlanShared: UserNotificationPreferenceFlag;
}

export interface currentUser_currentUser {
  __typename: "CurrentUser";
  notificationPreferences: currentUser_currentUser_notificationPreferences;
}

export interface currentUser {
  currentUser: currentUser_currentUser;
}
