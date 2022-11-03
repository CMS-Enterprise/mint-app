/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, ClaimsBasedPayType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetRecover
// ====================================================

export interface GetRecover_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  payClaims: ClaimsBasedPayType[];
  willRecoverPayments: boolean | null;
  willRecoverPaymentsNote: string | null;
  anticipateReconcilingPaymentsRetrospectively: boolean | null;
  anticipateReconcilingPaymentsRetrospectivelyNote: string | null;
  paymentStartDate: Time | null;
  paymentStartDateNote: string | null;
  readyForReviewBy: string | null;
  readyForReviewDts: Time | null;
  status: TaskStatus;
}

export interface GetRecover_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
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
