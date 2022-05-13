/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanChanges, ModelCategory, CMSCenter, CMMIGroup, ModelStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlan
// ====================================================

export interface UpdateModelPlan_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  modelName: string;
  modelCategory: ModelCategory | null;
  cmsCenters: CMSCenter[];
  cmsOther: string | null;
  cmmiGroups: CMMIGroup[];
  archived: boolean;
  status: ModelStatus;
}

export interface UpdateModelPlan {
  updateModelPlan: UpdateModelPlan_updateModelPlan | null;
}

export interface UpdateModelPlanVariables {
  id: UUID;
  changes: ModelPlanChanges;
}
