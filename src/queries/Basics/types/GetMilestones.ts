/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetMilestones
// ====================================================

export interface GetMilestones_modelPlan_milestones {
  __typename: "PlanMilestones";
  id: UUID;
  completeICIP: Time | null;
  clearanceStarts: Time | null;
  clearanceEnds: Time | null;
  announced: Time | null;
  applicationsStart: Time | null;
  applicationsEnd: Time | null;
  performancePeriodStarts: Time | null;
  performancePeriodEnds: Time | null;
  highLevelNote: string | null;
  wrapUpEnds: Time | null;
  phasedIn: boolean | null;
  phasedInNote: string | null;
  readyForReviewBy: string | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetMilestones_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  milestones: GetMilestones_modelPlan_milestones;
}

export interface GetMilestones {
  modelPlan: GetMilestones_modelPlan;
}

export interface GetMilestonesVariables {
  id: UUID;
}
