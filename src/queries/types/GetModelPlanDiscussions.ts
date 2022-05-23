/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscussionStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDiscussions
// ====================================================

export interface GetModelPlanDiscussions_modelPlan_discussions_replies {
  __typename: "DiscussionReply";
  id: UUID | null;
  discussionID: UUID;
  content: string | null;
  createdBy: string | null;
  createdDts: Time | null;
  resolution: boolean | null;
}

export interface GetModelPlanDiscussions_modelPlan_discussions {
  __typename: "PlanDiscussion";
  id: UUID | null;
  content: string | null;
  createdBy: string | null;
  createdDts: Time | null;
  status: DiscussionStatus;
  replies: GetModelPlanDiscussions_modelPlan_discussions_replies[];
}

export interface GetModelPlanDiscussions_modelPlan {
  __typename: "ModelPlan";
  discussions: GetModelPlanDiscussions_modelPlan_discussions[];
}

export interface GetModelPlanDiscussions {
  modelPlan: GetModelPlanDiscussions_modelPlan | null;
}

export interface GetModelPlanDiscussionsVariables {
  id: UUID;
}
