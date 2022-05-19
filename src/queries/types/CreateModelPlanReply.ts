/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscussionReplyCreateInput } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlanReply
// ====================================================

export interface CreateModelPlanReply_createDiscussionReply {
  __typename: "DiscussionReply";
  id: UUID | null;
  discussionID: UUID;
  content: string | null;
  resolution: boolean | null;
  createdBy: string | null;
  createdDts: Time | null;
}

export interface CreateModelPlanReply {
  createDiscussionReply: CreateModelPlanReply_createDiscussionReply | null;
}

export interface CreateModelPlanReplyVariables {
  input: DiscussionReplyCreateInput;
}
