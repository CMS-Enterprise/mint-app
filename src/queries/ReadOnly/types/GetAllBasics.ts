/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup, ModelType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllBasics
// ====================================================

export interface GetAllBasics_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  demoCode: string | null;
  amsModelID: string | null;
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
  status: TaskStatus;
}

export interface GetAllBasics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  nameHistory: string[];
  basics: GetAllBasics_modelPlan_basics;
}

export interface GetAllBasics {
  modelPlan: GetAllBasics_modelPlan;
}

export interface GetAllBasicsVariables {
  id: UUID;
}
