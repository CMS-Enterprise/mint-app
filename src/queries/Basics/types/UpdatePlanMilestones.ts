/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanMilestoneChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanMilestones
// ====================================================

export interface UpdatePlanMilestones_updatePlanMilestones {
  __typename: "PlanMilestones";
  id: UUID;
}

export interface UpdatePlanMilestones {
  updatePlanMilestones: UpdatePlanMilestones_updatePlanMilestones;
}

export interface UpdatePlanMilestonesVariables {
  id: UUID;
  changes: PlanMilestoneChanges;
}
