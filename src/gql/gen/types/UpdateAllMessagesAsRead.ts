/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateAllMessagesAsRead
// ====================================================

export interface UpdateAllMessagesAsRead_markAllNotificationsAsRead_activity_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface UpdateAllMessagesAsRead_markAllNotificationsAsRead_activity {
  __typename: "Activity";
  activityType: ActivityType;
  entityID: UUID;
  actorID: UUID;
  createdByUserAccount: UpdateAllMessagesAsRead_markAllNotificationsAsRead_activity_createdByUserAccount;
}

export interface UpdateAllMessagesAsRead_markAllNotificationsAsRead_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface UpdateAllMessagesAsRead_markAllNotificationsAsRead {
  __typename: "UserNotification";
  id: UUID;
  isRead: boolean;
  activity: UpdateAllMessagesAsRead_markAllNotificationsAsRead_activity;
  createdByUserAccount: UpdateAllMessagesAsRead_markAllNotificationsAsRead_createdByUserAccount;
}

export interface UpdateAllMessagesAsRead {
  /**
   * Marks all notifications for the current user as read, and returns the updated notifications
   */
  markAllNotificationsAsRead: UpdateAllMessagesAsRead_markAllNotificationsAsRead[];
}
