/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChangeType, TaskListSection } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL subscription operation: TaskListSubscription
// ====================================================

export interface TaskListSubscription_onTaskListSectionLocksChanged_lockStatus {
  __typename: "TaskListSectionLockStatus";
  modelPlanID: UUID;
  section: TaskListSection;
  lockedBy: string;
  refCount: number;
}

export interface TaskListSubscription_onTaskListSectionLocksChanged {
  __typename: "TaskListSectionLockStatusChanged";
  changeType: ChangeType;
  lockStatus: TaskListSubscription_onTaskListSectionLocksChanged_lockStatus;
}

export interface TaskListSubscription {
  onTaskListSectionLocksChanged: TaskListSubscription_onTaskListSectionLocksChanged;
}

export interface TaskListSubscriptionVariables {
  modelPlanID: UUID;
}
