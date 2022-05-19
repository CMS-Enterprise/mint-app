/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanMilestonesInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreatePlanMilestones
// ====================================================

export interface CreatePlanMilestones_createPlanMilestones {
  __typename: "PlanMilestones";
  id: UUID | null;
  modelPlanID: UUID | null;
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

export interface CreatePlanMilestones {
  createPlanMilestones: CreatePlanMilestones_createPlanMilestones | null;
}

export interface CreatePlanMilestonesVariables {
  input: PlanMilestonesInput;
}
