/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetMilestones
// ====================================================

export interface GetMilestones_modelPlan_basics_readyForReviewByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetMilestones_modelPlan_basics {
  __typename: "PlanBasics";
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
  readyForReviewByUserAccount: GetMilestones_modelPlan_basics_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetMilestones_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  basics: GetMilestones_modelPlan_basics;
}

export interface GetMilestones {
  modelPlan: GetMilestones_modelPlan;
}

export interface GetMilestonesVariables {
  id: UUID;
}
