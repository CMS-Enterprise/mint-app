/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscussionUserRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlanDiscussions
// ====================================================

export interface GetModelPlanDiscussions_modelPlan_discussions_content {
  __typename: "TaggedHTML";
  /**
   * RawContent is HTML. It is sanitized on the backend
   */
  rawContent: string;
}

export interface GetModelPlanDiscussions_modelPlan_discussions_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetModelPlanDiscussions_modelPlan_discussions_replies_content {
  __typename: "TaggedHTML";
  /**
   * RawContent is HTML. It is sanitized on the backend
   */
  rawContent: string;
}

export interface GetModelPlanDiscussions_modelPlan_discussions_replies_createdByUserAccount {
  __typename: "UserAccount";
  commonName: string;
}

export interface GetModelPlanDiscussions_modelPlan_discussions_replies {
  __typename: "DiscussionReply";
  id: UUID;
  discussionID: UUID;
  content: GetModelPlanDiscussions_modelPlan_discussions_replies_content | null;
  userRole: DiscussionUserRole | null;
  userRoleDescription: string | null;
  isAssessment: boolean;
  createdBy: UUID;
  createdDts: Time;
  createdByUserAccount: GetModelPlanDiscussions_modelPlan_discussions_replies_createdByUserAccount;
}

export interface GetModelPlanDiscussions_modelPlan_discussions {
  __typename: "PlanDiscussion";
  id: UUID;
  content: GetModelPlanDiscussions_modelPlan_discussions_content | null;
  createdBy: UUID;
  createdDts: Time;
  userRole: DiscussionUserRole | null;
  userRoleDescription: string | null;
  isAssessment: boolean;
  createdByUserAccount: GetModelPlanDiscussions_modelPlan_discussions_createdByUserAccount;
  replies: GetModelPlanDiscussions_modelPlan_discussions_replies[];
}

export interface GetModelPlanDiscussions_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  isCollaborator: boolean;
  discussions: GetModelPlanDiscussions_modelPlan_discussions[];
}

export interface GetModelPlanDiscussions {
  modelPlan: GetModelPlanDiscussions_modelPlan;
}

export interface GetModelPlanDiscussionsVariables {
  id: UUID;
}
