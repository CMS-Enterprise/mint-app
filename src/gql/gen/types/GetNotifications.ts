/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetNotifications
// ====================================================

export interface GetNotifications_currentUser_notifications_notifications_activity_actorUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_NewDiscussionRepliedActivityMeta_modelPlan {
  __typename: "ModelPlan";
  modelName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_NewDiscussionRepliedActivityMeta {
  __typename: "NewDiscussionRepliedActivityMeta";
  version: number;
  type: ActivityType;
  discussionID: UUID;
  replyID: UUID;
  modelPlanID: UUID;
  modelPlan: GetNotifications_currentUser_notifications_notifications_activity_metaData_NewDiscussionRepliedActivityMeta_modelPlan;
  content: string;
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

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_AddedAsCollaboratorMeta_modelPlan {
  __typename: "ModelPlan";
  modelName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_AddedAsCollaboratorMeta {
  __typename: "AddedAsCollaboratorMeta";
  version: number;
  type: ActivityType;
  modelPlanID: UUID;
  modelPlan: GetNotifications_currentUser_notifications_notifications_activity_metaData_AddedAsCollaboratorMeta_modelPlan;
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

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_ModelPlanSharedActivityMeta_modelPlan {
  __typename: "ModelPlan";
  modelName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_ModelPlanSharedActivityMeta {
  __typename: "ModelPlanSharedActivityMeta";
  version: number;
  type: ActivityType;
  modelPlanID: UUID;
  modelPlan: GetNotifications_currentUser_notifications_notifications_activity_metaData_ModelPlanSharedActivityMeta_modelPlan;
  optionalMessage: string | null;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_modelPlan {
  __typename: "AnalyzedModelPlan";
  /**
   * This represents the oldName
   */
  oldName: string | null;
  statusChanges: (string | null)[] | null;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_documents {
  __typename: "AnalyzedDocuments";
  count: number | null;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_crTdls {
  __typename: "AnalyzedCrTdls";
  activity: boolean | null;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_planSections {
  __typename: "AnalyzedPlanSections";
  updated: string[];
  readyForReview: string[];
  readyForClearance: string[];
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_modelLeads_added {
  __typename: "AnalyzedModelLeadInfo";
  id: UUID;
  commonName: string;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_modelLeads {
  __typename: "AnalyzedModelLeads";
  added: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_modelLeads_added[];
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_planDiscussions {
  __typename: "AnalyzedPlanDiscussions";
  activity: boolean | null;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes {
  __typename: "AnalyzedAuditChange";
  modelPlan: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_modelPlan | null;
  documents: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_documents | null;
  crTdls: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_crTdls | null;
  planSections: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_planSections | null;
  modelLeads: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_modelLeads | null;
  planDiscussions: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes_planDiscussions | null;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits {
  __typename: "AnalyzedAudit";
  id: UUID;
  modelPlanID: UUID;
  modelName: string;
  date: Time;
  changes: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits_changes;
}

export interface GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta {
  __typename: "DailyDigestCompleteActivityMeta";
  version: number;
  type: ActivityType;
  modelPlanIDs: UUID[];
  date: Time;
  analyzedAudits: GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta_analyzedAudits[];
}

export type GetNotifications_currentUser_notifications_notifications_activity_metaData = GetNotifications_currentUser_notifications_notifications_activity_metaData_NewDiscussionRepliedActivityMeta | GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInPlanDiscussionActivityMeta | GetNotifications_currentUser_notifications_notifications_activity_metaData_AddedAsCollaboratorMeta | GetNotifications_currentUser_notifications_notifications_activity_metaData_TaggedInDiscussionReplyActivityMeta | GetNotifications_currentUser_notifications_notifications_activity_metaData_ModelPlanSharedActivityMeta | GetNotifications_currentUser_notifications_notifications_activity_metaData_DailyDigestCompleteActivityMeta;

export interface GetNotifications_currentUser_notifications_notifications_activity {
  __typename: "Activity";
  activityType: ActivityType;
  entityID: UUID;
  actorID: UUID;
  actorUserAccount: GetNotifications_currentUser_notifications_notifications_activity_actorUserAccount;
  metaData: GetNotifications_currentUser_notifications_notifications_activity_metaData;
}

export interface GetNotifications_currentUser_notifications_notifications {
  __typename: "UserNotification";
  id: UUID;
  isRead: boolean;
  inAppSent: boolean;
  emailSent: boolean;
  createdDts: Time;
  activity: GetNotifications_currentUser_notifications_notifications_activity;
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
