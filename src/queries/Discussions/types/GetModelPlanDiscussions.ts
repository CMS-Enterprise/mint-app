/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscussionStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDiscussions
// ====================================================

export interface GetModelPlanDiscussions_modelPlan_collaborators {
  __typename: "PlanCollaborator";
  id: UUID;
  euaUserID: string;
  fullName: string;
}

export interface GetModelPlanDiscussions_modelPlan_discussions_createdByUser {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetModelPlanDiscussions_modelPlan_discussions_replies_createdByUser {
  __typename: "UserInfo";
  commonName: string;
}

export interface GetModelPlanDiscussions_modelPlan_discussions_replies {
  __typename: "DiscussionReply";
  id: UUID;
  discussionID: UUID;
  content: string | null;
  isAssessment: boolean;
  createdBy: string;
  createdDts: Time;
  resolution: boolean | null;
  createdByUser: GetModelPlanDiscussions_modelPlan_discussions_replies_createdByUser;
}

export interface GetModelPlanDiscussions_modelPlan_discussions {
  __typename: "PlanDiscussion";
  id: UUID;
  content: string | null;
  createdBy: string;
  createdDts: Time;
  status: DiscussionStatus;
  isAssessment: boolean;
  createdByUser: GetModelPlanDiscussions_modelPlan_discussions_createdByUser;
  replies: GetModelPlanDiscussions_modelPlan_discussions_replies[];
}

export interface GetModelPlanDiscussions_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  isCollaborator: boolean;
  collaborators: GetModelPlanDiscussions_modelPlan_collaborators[];
  discussions: GetModelPlanDiscussions_modelPlan_discussions[];
}

export interface GetModelPlanDiscussions {
  modelPlan: GetModelPlanDiscussions_modelPlan;
}

export interface GetModelPlanDiscussionsVariables {
  id: UUID;
}
