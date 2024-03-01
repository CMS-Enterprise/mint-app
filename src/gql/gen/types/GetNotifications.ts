/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetNotifications
// ====================================================

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_ActivityMetaBaseStruct {
  __typename: "ActivityMetaBaseStruct";
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta_modelPlan {
  __typename: "ModelPlan";
  modelName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta {
  __typename: "TaggedInPlanDiscussionActivityMeta";
  version: number;
  type: ActivityType;
  modelPlanID: UUID;
  modelPlan: GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta_modelPlan;
  discussionID: UUID;
  content: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta_modelPlan {
  __typename: "ModelPlan";
  modelName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta {
  __typename: "TaggedInDiscussionReplyActivityMeta";
  version: number;
  type: ActivityType;
  modelPlanID: UUID;
  modelPlan: GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta_modelPlan;
  discussionID: UUID;
  replyID: UUID;
  content: string;
}

export type GetNotifications_currentUser_notifications_notifications_activity_metaData = GetNotifications_currentUser_notifications_notifications_activity_metaData_ActivityMetaBaseStruct | GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta | GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta;

export interface GetNotifications_currentUser_notifications_notifications_activity_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity {
  __typename: "Activity";
  activityType: ActivityType;
  entityID: UUID;
  actorID: UUID;
  metaData: GetNotifications_currentUser_notifications_notifications_activity_metaData;
  createdByUserAccount: GetNotifications_currentUser_notifications_notifications_activity_createdByUserAccount;
}

export interface GetNotifications_currentUser_notifications_notifications_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetNotifications_currentUser_notifications_notifications {
  __typename: "UserNotification";
  id: UUID;
  isRead: boolean;
  inAppSent: boolean;
  emailSent: boolean;
  activity: GetNotifications_currentUser_notifications_notifications_activity;
  createdByUserAccount: GetNotifications_currentUser_notifications_notifications_createdByUserAccount;
}

export interface GetNotifications_currentUser_notifications {
  __typename: "UserNotifications";
  /**
   * This returns the number of unread notifications
   */
  numUnreadNotifications: number;
  /**
   * This includes all notifications
   */
  notifications: GetNotifications_currentUser_notifications_notifications[];
}

export interface GetNotifications_currentUser {
  __typename: "CurrentUser";
  notifications: GetNotifications_currentUser_notifications;
}

export interface GetNotifications {
  currentUser: GetNotifications_currentUser;
}
