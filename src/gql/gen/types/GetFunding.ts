/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FundingSource, TrustFundType, PayRecipient, PayType, ClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetFunding
// ====================================================

export interface GetFunding_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  fundingSource: FundingSource[];
  fundingSourceTrustFundType: TrustFundType[];
  fundingSourceOther: string | null;
  fundingSourceNote: string | null;
  fundingSourceR: FundingSource[];
  fundingSourceRTrustFundType: TrustFundType[];
  fundingSourceROther: string | null;
  fundingSourceRNote: string | null;
  payRecipients: PayRecipient[];
  payRecipientsOtherSpecification: string | null;
  payRecipientsNote: string | null;
  payType: PayType[];
  payTypeNote: string | null;
  payClaims: ClaimsBasedPayType[];
}

export interface GetFunding_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  modifiedDts: Time | null;
}

export interface GetFunding_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetFunding_modelPlan_payments;
  operationalNeeds: GetFunding_modelPlan_operationalNeeds[];
}

export interface GetFunding {
  modelPlan: GetFunding_modelPlan;
}

export interface GetFundingVariables {
  id: UUID;
}
