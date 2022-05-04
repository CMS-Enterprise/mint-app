/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanInput, ModelCategory, CMSCenter, CMMIGroup, ModelStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlan
// ====================================================

export interface UpdateModelPlan_updateModelPlan {
  __typename: "ModelPlan";
  id: UUID | null;
  modelName: string | null;
  modelCategory: ModelCategory | null;
  cmsCenters: CMSCenter[] | null;
  cmmiGroups: CMMIGroup[] | null;
  modifiedBy: string | null;
  modifiedDts: Time | null;
  status: ModelStatus;
}

export interface UpdateModelPlan {
  updateModelPlan: UpdateModelPlan_updateModelPlan | null;
}

export interface UpdateModelPlanVariables {
  input: ModelPlanInput;
}
