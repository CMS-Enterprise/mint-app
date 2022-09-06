/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup, ModelType, TaskStatus, ModelStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllModelPlans
// ====================================================

export interface GetAllModelPlans_modelPlanCollection_basics {
  __typename: "PlanBasics";
  id: UUID;
  modelCategory: ModelCategory | null;
  cmsCenters: CMSCenter[];
  cmsOther: string | null;
  cmmiGroups: CMMIGroup[];
  modelType: ModelType | null;
  problem: string | null;
  goal: string | null;
  testInterventions: string | null;
  note: string | null;
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
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  readyForReviewBy: string | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetAllModelPlans_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  archived: boolean;
  createdBy: string;
  createdDts: Time;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  basics: GetAllModelPlans_modelPlanCollection_basics;
  status: ModelStatus;
}

export interface GetAllModelPlans {
  modelPlanCollection: GetAllModelPlans_modelPlanCollection[];
}
