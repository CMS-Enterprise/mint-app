/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskListSection } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UnlockTaskListSection
// ====================================================

export interface UnlockTaskListSection {
  unlockTaskListSection: boolean;
}

export interface UnlockTaskListSectionVariables {
  modelPlanID: UUID;
  section: TaskListSection;
}
