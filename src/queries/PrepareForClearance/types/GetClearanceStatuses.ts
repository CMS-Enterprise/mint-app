/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetClearanceStatuses
// ====================================================

export interface GetClearanceStatuses_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  readyForClearanceBy: UUID | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  readyForClearanceBy: string | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  basics: GetClearanceStatuses_modelPlan_basics;
  generalCharacteristics: GetClearanceStatuses_modelPlan_generalCharacteristics;
  participantsAndProviders: GetClearanceStatuses_modelPlan_participantsAndProviders;
  beneficiaries: GetClearanceStatuses_modelPlan_beneficiaries;
  opsEvalAndLearning: GetClearanceStatuses_modelPlan_opsEvalAndLearning;
  payments: GetClearanceStatuses_modelPlan_payments;
}

export interface GetClearanceStatuses {
  modelPlan: GetClearanceStatuses_modelPlan;
}

export interface GetClearanceStatusesVariables {
  id: UUID;
}
