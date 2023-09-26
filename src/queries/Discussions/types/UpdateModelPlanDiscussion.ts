/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanDiscussionChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanDiscussion
// ====================================================

export interface UpdateModelPlanDiscussion_updatePlanDiscussion {
  __typename: "PlanDiscussion";
  id: UUID;
}

export interface UpdateModelPlanDiscussion {
  updatePlanDiscussion: UpdateModelPlanDiscussion_updatePlanDiscussion;
}

export interface UpdateModelPlanDiscussionVariables {
  id: UUID;
  changes: PlanDiscussionChanges;
}
