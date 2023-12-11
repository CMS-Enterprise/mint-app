/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetBasics
// ====================================================

export interface GetBasics_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  demoCode: string | null;
  amsModelID: string | null;
  modelCategory: ModelCategory | null;
  additionalModelCategories: ModelCategory[];
  cmsCenters: CMSCenter[];
  cmmiGroups: CMMIGroup[];
}

export interface GetBasics_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  abbreviation: string | null;
  nameHistory: string[];
  basics: GetBasics_modelPlan_basics;
}

export interface GetBasics {
  modelPlan: GetBasics_modelPlan;
}

export interface GetBasicsVariables {
  id: UUID;
}
