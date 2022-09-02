/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskListSection } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: LockTaskListSection
// ====================================================

export interface LockTaskListSection {
  lockTaskListSection: boolean;
}

export interface LockTaskListSectionVariables {
  modelPlanID: UUID;
  section: TaskListSection;
}
