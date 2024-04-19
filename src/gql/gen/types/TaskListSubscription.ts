/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChangeType, TaskListSection, ActionType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL subscription operation: TaskListSubscription
// ====================================================

export interface TaskListSubscription_onLockTaskListSectionContext_lockStatus_lockedByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  username: string;
  commonName: string;
}

export interface TaskListSubscription_onLockTaskListSectionContext_lockStatus {
  __typename: "TaskListSectionLockStatus";
  modelPlanID: UUID;
  section: TaskListSection;
  lockedByUserAccount: TaskListSubscription_onLockTaskListSectionContext_lockStatus_lockedByUserAccount;
  isAssessment: boolean;
}

export interface TaskListSubscription_onLockTaskListSectionContext {
  __typename: "TaskListSectionLockStatusChanged";
  changeType: ChangeType;
  lockStatus: TaskListSubscription_onLockTaskListSectionContext_lockStatus;
  actionType: ActionType;
}

export interface TaskListSubscription {
  onLockTaskListSectionContext: TaskListSubscription_onLockTaskListSectionContext;
}

export interface TaskListSubscriptionVariables {
  modelPlanID: UUID;
}
