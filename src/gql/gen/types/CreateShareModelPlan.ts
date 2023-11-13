/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelViewFilter } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateShareModelPlan
// ====================================================

export interface CreateShareModelPlan {
  shareModelPlan: boolean;
}

export interface CreateShareModelPlanVariables {
  modelPlanID: UUID;
  viewFilter?: ModelViewFilter | null;
  usernames: string[];
  optionalMessage?: string | null;
}
