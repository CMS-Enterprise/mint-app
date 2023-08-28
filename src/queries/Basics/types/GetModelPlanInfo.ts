/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanInfo
// ====================================================

export interface GetModelPlanInfo_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  demoCode: string | null;
  amsModelID: string | null;
  modelCategory: ModelCategory | null;
  additionalModelCategories: ModelCategory[];
  cmsCenters: CMSCenter[];
  cmsOther: string | null;
  cmmiGroups: CMMIGroup[];
}

export interface GetModelPlanInfo_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  abbreviation: string | null;
  nameHistory: string[];
  basics: GetModelPlanInfo_modelPlan_basics;
}

export interface GetModelPlanInfo {
  modelPlan: GetModelPlanInfo_modelPlan;
}

export interface GetModelPlanInfoVariables {
  id: UUID;
}
