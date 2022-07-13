/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FundingSource, PayRecipient, PayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetFunding
// ====================================================

export interface GetFunding_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  fundingSource: FundingSource[] | null;
  fundingSourceTrustFund: string | null;
  fundingSourceNote: string | null;
  fundingSourceR: FundingSource[] | null;
  fundingSourceRTrustFund: string | null;
  fundingSourceROther: string | null;
  fundingSourceRNote: string | null;
  payRecipients: PayRecipient[] | null;
  payRecipientsOtherSpecification: string | null;
  payRecipientsNote: string | null;
  payType: PayType[] | null;
  payTypeNote: string | null;
}

export interface GetFunding_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetFunding_modelPlan_payments;
}

export interface GetFunding {
  modelPlan: GetFunding_modelPlan;
}

export interface GetFundingVariables {
  id: UUID;
}
