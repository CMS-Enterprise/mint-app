/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelCategory, CMSCenter, CMMIGroup } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlans
// ====================================================

export interface GetModelPlans_modelPlanCollection_collaborators {
  __typename: "PlanCollaborator";
  id: UUID;
  fullName: string;
}

export interface GetModelPlans_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID | null;
  modelName: string | null;
  modelCategory: ModelCategory | null;
  cmsCenter: CMSCenter | null;
  cmmiGroups: CMMIGroup[] | null;
  createdBy: string | null;
  createdDts: Time | null;
  modifiedDts: Time | null;
  collaborators: GetModelPlans_modelPlanCollection_collaborators[];
}

export interface GetModelPlans {
  modelPlanCollection: (GetModelPlans_modelPlanCollection | null)[] | null;
}
