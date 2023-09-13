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
  id: UUID;
  discussionID: UUID;
  content: TaggedString | null;
  resolution: boolean | null;
  createdBy: UUID;
  createdDts: Time;
}

export interface CreateModelPlanReply {
  createDiscussionReply: CreateModelPlanReply_createDiscussionReply;
}

export interface CreateModelPlanReplyVariables {
  input: DiscussionReplyCreateInput;
}
