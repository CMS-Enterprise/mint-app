/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanMilestoneChanges } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdatePlanMilestones
// ====================================================

export interface UpdatePlanMilestones_updatePlanMilestones {
  __typename: "PlanMilestones";
  id: UUID;
  modelPlanID: UUID;
  completeICIP: Time | null;
  clearanceStarts: Time | null;
  clearanceEnds: Time | null;
  announced: Time | null;
  applicationsStart: Time | null;
  applicationsEnd: Time | null;
  performancePeriodStarts: Time | null;
  performancePeriodEnds: Time | null;
  wrapUpEnds: Time | null;
  highLevelNote: string | null;
  phasedIn: boolean | null;
  phasedInNote: string | null;
}

export interface UpdatePlanMilestones {
  updatePlanMilestones: UpdatePlanMilestones_updatePlanMilestones | null;
}

export interface UpdatePlanMilestonesVariables {
  id: UUID;
  changes: PlanMilestoneChanges;
}
