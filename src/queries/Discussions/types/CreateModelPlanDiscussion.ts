/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanDiscussionCreateInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlanDiscussion
// ====================================================

export interface CreateModelPlanDiscussion_createPlanDiscussion_content {
  __typename: "TaggedHTML";
  /**
   * RawContent is HTML. It is sanitized on the backend
   */
  rawContent: string;
}

export interface CreateModelPlanDiscussion_createPlanDiscussion {
  __typename: "PlanDiscussion";
  id: UUID;
  content: CreateModelPlanDiscussion_createPlanDiscussion_content | null;
  createdBy: UUID;
  createdDts: Time;
}

export interface CreateModelPlanDiscussion {
  createPlanDiscussion: CreateModelPlanDiscussion_createPlanDiscussion;
}

export interface CreateModelPlanDiscussionVariables {
  input: PlanDiscussionCreateInput;
}
