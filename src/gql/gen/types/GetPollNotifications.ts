/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPollNotifications
// ====================================================

export interface GetPollNotifications_currentUser_notifications {
  __typename: "UserNotifications";
  /**
   * This returns the number of unread notifications
   */
  numUnreadNotifications: number;
}

export interface GetPollNotifications_currentUser {
  __typename: "CurrentUser";
  notifications: GetPollNotifications_currentUser_notifications;
}

export interface GetPollNotifications {
  currentUser: GetPollNotifications_currentUser;
}
