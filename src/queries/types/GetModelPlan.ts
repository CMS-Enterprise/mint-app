/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup, TaskStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlan
// ====================================================

export interface GetModelPlan_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID | null;
  status: TaskStatus;
}

export interface GetModelPlan_modelPlan_milestones {
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
  highLevelNote: string | null;
  wrapUpEnds: Time | null;
  phasedIn: boolean | null;
  phasedInNote: string | null;
  status: TaskStatus | null;
}

export interface GetModelPlan_modelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  modelName: string | null;
  modelCategory: ModelCategory | null;
  cmsCenters: CMSCenter[] | null;
  cmmiGroups: CMMIGroup[] | null;
  cmsOther: string | null;
  modifiedDts: Time | null;
  basics: GetModelPlan_modelPlan_basics | null;
  milestones: GetModelPlan_modelPlan_milestones | null;
}

export interface GetModelPlan {
  modelPlan: GetModelPlan_modelPlan | null;
}

export interface GetModelPlanVariables {
  id: UUID;
}
