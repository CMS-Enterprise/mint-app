/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, ClaimsBasedPayType, FrequencyType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetRecover
// ====================================================

export interface GetRecover_modelPlan_payments_readyForReviewByUserAccount {
  __typename: "UserAccount";
  id: UUID;
  commonName: string;
}

export interface GetRecover_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  payClaims: ClaimsBasedPayType[];
  willRecoverPayments: boolean | null;
  willRecoverPaymentsNote: string | null;
  anticipateReconcilingPaymentsRetrospectively: boolean | null;
  anticipateReconcilingPaymentsRetrospectivelyNote: string | null;
  paymentReconciliationFrequency: FrequencyType[];
  paymentReconciliationFrequencyContinually: string | null;
  paymentReconciliationFrequencyOther: string | null;
  paymentReconciliationFrequencyNote: string | null;
  paymentDemandRecoupmentFrequency: FrequencyType[];
  paymentDemandRecoupmentFrequencyContinually: string | null;
  paymentDemandRecoupmentFrequencyOther: string | null;
  paymentDemandRecoupmentFrequencyNote: string | null;
  paymentStartDate: Time | null;
  paymentStartDateNote: string | null;
  readyForReviewByUserAccount: GetRecover_modelPlan_payments_readyForReviewByUserAccount | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetRecover_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  id: UUID;
  modifiedDts: Time | null;
}

export interface GetRecover_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetRecover_modelPlan_payments;
  operationalNeeds: GetRecover_modelPlan_operationalNeeds[];
}

export interface GetRecover {
  modelPlan: GetRecover_modelPlan;
}

export interface GetRecoverVariables {
  id: UUID;
}
