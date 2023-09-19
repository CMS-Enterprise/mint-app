/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ModelPlanFilter, ModelStatus, ModelCategory, KeyCharacteristic, TeamRole, DiscussionStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetModelPlans
// ====================================================

export interface GetModelPlans_modelPlanCollection_basics {
  __typename: "PlanBasics";
  id: UUID;
  demoCode: string | null;
  amsModelID: string | null;
  modelCategory: ModelCategory | null;
  clearanceStarts: Time | null;
  performancePeriodStarts: Time | null;
  additionalModelCategories: ModelCategory[];
  applicationsStart: Time | null;
}

export interface GetModelPlans_modelPlanCollection_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  keyCharacteristics: KeyCharacteristic[];
}

export interface GetModelPlans_modelPlanCollection_payments {
  __typename: "PlanPayments";
  id: UUID;
  paymentStartDate: Time | null;
}

export interface GetModelPlans_modelPlanCollection_collaborators_userAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
  email: string;
  username: string;
}

export interface GetModelPlans_modelPlanCollection_collaborators {
  __typename: "PlanCollaborator";
  id: UUID;
  userID: UUID;
  userAccount: GetModelPlans_modelPlanCollection_collaborators_userAccount;
  teamRole: TeamRole;
}

export interface GetModelPlans_modelPlanCollection_discussions_replies {
  __typename: "DiscussionReply";
  id: UUID;
  resolution: boolean | null;
}

export interface GetModelPlans_modelPlanCollection_discussions {
  __typename: "PlanDiscussion";
  id: UUID;
  status: DiscussionStatus;
  replies: GetModelPlans_modelPlanCollection_discussions_replies[];
}

export interface GetModelPlans_modelPlanCollection_crTdls {
  __typename: "PlanCrTdl";
  idNumber: string;
}

export interface GetModelPlans_modelPlanCollection {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  status: ModelStatus;
  abbreviation: string | null;
  nameHistory: string[];
  createdBy: UUID;
  createdDts: Time;
  modifiedDts: Time | null;
  isFavorite: boolean;
  isCollaborator: boolean;
  basics: GetModelPlans_modelPlanCollection_basics;
  generalCharacteristics: GetModelPlans_modelPlanCollection_generalCharacteristics;
  payments: GetModelPlans_modelPlanCollection_payments;
  collaborators: GetModelPlans_modelPlanCollection_collaborators[];
  discussions: GetModelPlans_modelPlanCollection_discussions[];
  crTdls: GetModelPlans_modelPlanCollection_crTdls[];
}

export interface GetModelPlans {
  modelPlanCollection: GetModelPlans_modelPlanCollection[];
}

export interface GetModelPlansVariables {
  filter: ModelPlanFilter;
  isMAC: boolean;
}
