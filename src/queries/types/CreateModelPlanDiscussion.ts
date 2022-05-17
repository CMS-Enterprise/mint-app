/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanDiscussionCreateInput, DiscussionStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlanDiscussion
// ====================================================

export interface CreateModelPlanDiscussion_createPlanDiscussion {
  __typename: "PlanDiscussion";
  id: UUID | null;
  content: string | null;
  status: DiscussionStatus;
  createdBy: string | null;
  createdDts: Time | null;
}

export interface CreateModelPlanDiscussion {
  createPlanDiscussion: CreateModelPlanDiscussion_createPlanDiscussion | null;
}

export interface CreateModelPlanDiscussionVariables {
  input: PlanDiscussionCreateInput;
}
