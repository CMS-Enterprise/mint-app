/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FundingSource, PayRecipient, PayType, ClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetFundingOLD
// ====================================================

export interface GetFundingOLD_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  fundingSource: FundingSource[];
  fundingSourceOther: string | null;
  fundingSourceNote: string | null;
  fundingSourceR: FundingSource[];
  fundingSourceROther: string | null;
  fundingSourceRNote: string | null;
  payRecipients: PayRecipient[];
  payRecipientsOtherSpecification: string | null;
  payRecipientsNote: string | null;
  payType: PayType[];
  payTypeNote: string | null;
  payClaims: ClaimsBasedPayType[];
}

export interface GetFundingOLD_modelPlan_operationalNeeds {
  __typename: "OperationalNeed";
  modifiedDts: Time | null;
}

export interface GetFundingOLD_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetFundingOLD_modelPlan_payments;
  operationalNeeds: GetFundingOLD_modelPlan_operationalNeeds[];
}

export interface GetFundingOLD {
  modelPlan: GetFundingOLD_modelPlan;
}

export interface GetFundingOLDVariables {
  id: UUID;
}
