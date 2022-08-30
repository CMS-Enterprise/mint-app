/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanITToolsChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanItTools
// ====================================================

export interface UpdatePlanItTools_updatePlanItTools {
  __typename: "PlanITTools";
  id: UUID;
}

export interface UpdatePlanItTools {
  updatePlanItTools: UpdatePlanItTools_updatePlanItTools;
}

export interface UpdatePlanItToolsVariables {
  id: UUID;
  changes: PlanITToolsChanges;
}
