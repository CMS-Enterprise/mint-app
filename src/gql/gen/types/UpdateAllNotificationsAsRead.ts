/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateAllNotificationsAsRead
// ====================================================

export interface UpdateAllNotificationsAsRead_markAllNotificationsAsRead_activity_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface UpdateAllNotificationsAsRead_markAllNotificationsAsRead_activity {
  __typename: "Activity";
  activityType: ActivityType;
  entityID: UUID;
  actorID: UUID;
  createdByUserAccount: UpdateAllNotificationsAsRead_markAllNotificationsAsRead_activity_createdByUserAccount;
}

export interface UpdateAllNotificationsAsRead_markAllNotificationsAsRead_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface UpdateAllNotificationsAsRead_markAllNotificationsAsRead {
  __typename: "UserNotification";
  id: UUID;
  isRead: boolean;
  activity: UpdateAllNotificationsAsRead_markAllNotificationsAsRead_activity;
  createdByUserAccount: UpdateAllNotificationsAsRead_markAllNotificationsAsRead_createdByUserAccount;
}

export interface UpdateAllNotificationsAsRead {
  /**
   * Marks all notifications for the current user as read, and returns the updated notifications
   */
  markAllNotificationsAsRead: UpdateAllNotificationsAsRead_markAllNotificationsAsRead[];
}
