/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanFilter, ModelStatus, ModelCategory, DiscussionStatus, TeamRole } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAllModelPlans
// ====================================================

export interface GetAllModelPlans_modelPlanCollection_basics {
  __typename: "PlanBasics";
  demoCode: string | null;
  amsModelID: string | null;
  modelCategory: ModelCategory | null;
  clearanceStarts: Time | null;
  performancePeriodStarts: Time | null;
  additionalModelCategories: ModelCategory[];
  goal: string | null;
}

export interface GetAllModelPlans_modelPlanCollection_discussions_replies {
  __typename: "DiscussionReply";
  id: UUID;
  resolution: boolean | null;
}

export interface GetAllModelPlans_modelPlanCollection_discussions {
  __typename: "PlanDiscussion";
  id: UUID;
  status: DiscussionStatus;
  replies: GetAllModelPlans_modelPlanCollection_discussions_replies[];
}

export interface GetAllModelPlans_modelPlanCollection_collaborators_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface GetAllModelPlans_modelPlanCollection_collaborators {
  __typename: "PlanCollaborator";
  userAccount: GetAllModelPlans_modelPlanCollection_collaborators_userAccount;
  userID: UUID;
  teamRole: TeamRole;
}

export interface GetAllModelPlans_modelPlanCollection_crTdls {
  __typename: "PlanCrTdl";
  id: UUID;
  idNumber: string;
}

export interface GetAllModelPlans_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  status: ModelStatus;
  abbreviation: string | null;
  nameHistory: string[];
  isFavorite: boolean;
  isCollaborator: boolean;
  modifiedDts: Time | null;
  createdDts: Time;
  basics: GetAllModelPlans_modelPlanCollection_basics;
  discussions: GetAllModelPlans_modelPlanCollection_discussions[];
  collaborators: GetAllModelPlans_modelPlanCollection_collaborators[];
  crTdls: GetAllModelPlans_modelPlanCollection_crTdls[];
}

export interface GetAllModelPlans {
  modelPlanCollection: GetAllModelPlans_modelPlanCollection[];
}

export interface GetAllModelPlansVariables {
  filter: ModelPlanFilter;
}
