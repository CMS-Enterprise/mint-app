/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAllNotificationsAsRead
// ====================================================

export interface UpdateAllNotificationsAsRead_markAllNotificationsAsRead {
  __typename: "UserNotification";
  id: UUID;
}

export interface UpdateAllNotificationsAsRead {
  /**
   * Marks all notifications for the current user as read, and returns the updated notifications
   */
  markAllNotificationsAsRead: UpdateAllNotificationsAsRead_markAllNotificationsAsRead[];
}
