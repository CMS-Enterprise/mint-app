/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskListSection } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetTaskListSubscriptions
// ====================================================

export interface GetTaskListSubscriptions_taskListSectionLocks {
  __typename: "TaskListSectionLockStatus";
  modelPlanID: UUID;
  section: TaskListSection;
  lockedBy: string;
}

export interface GetTaskListSubscriptions {
  taskListSectionLocks: GetTaskListSubscriptions_taskListSectionLocks[];
}

export interface GetTaskListSubscriptionsVariables {
  modelPlanID: UUID;
}
