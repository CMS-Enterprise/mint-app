/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkNotificationAsRead
// ====================================================

export interface MarkNotificationAsRead_markNotificationAsRead {
  __typename: "UserNotification";
  id: UUID;
  isRead: boolean;
}

export interface MarkNotificationAsRead {
  /**
   * Marks a single notification as read. It requires that the notification be owned by the context of the user sending this request, or it will fail
   */
  markNotificationAsRead: MarkNotificationAsRead_markNotificationAsRead;
}

export interface MarkNotificationAsReadVariables {
  notificationID: UUID;
}
