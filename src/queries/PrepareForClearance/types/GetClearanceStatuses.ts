/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus, PrepareForClearanceStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetClearanceStatuses
// ====================================================

export interface GetClearanceStatuses_modelPlan_basics_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetClearanceStatuses_modelPlan_basics {
  __typename: "PlanBasics";
  id: UUID;
  readyForClearanceByUserAccount: GetClearanceStatuses_modelPlan_basics_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_generalCharacteristics_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetClearanceStatuses_modelPlan_generalCharacteristics {
  __typename: "PlanGeneralCharacteristics";
  id: UUID;
  readyForClearanceByUserAccount: GetClearanceStatuses_modelPlan_generalCharacteristics_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_participantsAndProviders_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetClearanceStatuses_modelPlan_participantsAndProviders {
  __typename: "PlanParticipantsAndProviders";
  id: UUID;
  readyForClearanceByUserAccount: GetClearanceStatuses_modelPlan_participantsAndProviders_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_beneficiaries_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetClearanceStatuses_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  readyForClearanceByUserAccount: GetClearanceStatuses_modelPlan_beneficiaries_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_opsEvalAndLearning_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetClearanceStatuses_modelPlan_opsEvalAndLearning {
  __typename: "PlanOpsEvalAndLearning";
  id: UUID;
  readyForClearanceByUserAccount: GetClearanceStatuses_modelPlan_opsEvalAndLearning_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_payments_readyForClearanceByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetClearanceStatuses_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  readyForClearanceByUserAccount: GetClearanceStatuses_modelPlan_payments_readyForClearanceByUserAccount | null;
  readyForClearanceDts: Time | null;
  status: TaskStatus;
}

export interface GetClearanceStatuses_modelPlan_prepareForClearance {
  __typename: "PrepareForClearance";
  status: PrepareForClearanceStatus;
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
  prepareForClearance: GetClearanceStatuses_modelPlan_prepareForClearance;
}

export interface GetClearanceStatuses {
  modelPlan: GetClearanceStatuses_modelPlan;
}

export interface GetClearanceStatusesVariables {
  id: UUID;
}
