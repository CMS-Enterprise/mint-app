/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscussionReplyCreateInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateModelPlanReply
// ====================================================

export interface CreateModelPlanReply_createDiscussionReply_content {
  __typename: "TaggedContent";
  /**
   * RawContent is HTML. It is sanitized on the backend
   */
  rawContent: string;
}

export interface CreateModelPlanReply_createDiscussionReply {
  __typename: "DiscussionReply";
  id: UUID;
  discussionID: UUID;
  content: CreateModelPlanReply_createDiscussionReply_content | null;
  createdBy: UUID;
  createdDts: Time;
}

export interface CreateModelPlanReply {
  createDiscussionReply: CreateModelPlanReply_createDiscussionReply;
}

export interface CreateModelPlanReplyVariables {
  input: DiscussionReplyCreateInput;
}
