/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelStatus, ModelCategory } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllModelPlans
// ====================================================

export interface GetAllModelPlans_modelPlanCollection_basics {
  __typename: "PlanBasics";
  applicationsStart: Time | null;
  modelCategory: ModelCategory | null;
}

export interface GetAllModelPlans_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  status: ModelStatus;
  basics: GetAllModelPlans_modelPlanCollection_basics;
}

export interface GetAllModelPlans {
  modelPlanCollection: GetAllModelPlans_modelPlanCollection[];
}
