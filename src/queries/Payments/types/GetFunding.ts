/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FundingSource, PayRecipient, PayType, ClaimsBasedPayType, TaskStatus } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetFunding
// ====================================================

export interface GetFunding_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  fundingSource: FundingSource[];
  fundingSourceTrustFund: string | null;
  fundingSourceOther: string | null;
  fundingSourceNote: string | null;
  fundingSourceR: FundingSource[];
  fundingSourceRTrustFund: string | null;
  fundingSourceROther: string | null;
  fundingSourceRNote: string | null;
  payRecipients: PayRecipient[];
  payRecipientsOtherSpecification: string | null;
  payRecipientsNote: string | null;
  payType: PayType[];
  payTypeNote: string | null;
  payClaims: ClaimsBasedPayType[];
}

export interface GetFunding_modelPlan_itTools {
  __typename: "PlanITTools";
  status: TaskStatus;
}

export interface GetFunding_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetFunding_modelPlan_payments;
  itTools: GetFunding_modelPlan_itTools;
}

export interface GetFunding {
  modelPlan: GetFunding_modelPlan;
}

export interface GetFundingVariables {
  id: UUID;
}
