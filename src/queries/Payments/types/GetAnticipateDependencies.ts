/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PayType, ClaimsBasedPayType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetAnticipateDependencies
// ====================================================

export interface GetAnticipateDependencies_modelPlan_payments {
  __typename: "PlanPayments";
  id: UUID;
  payType: PayType[];
  payClaims: ClaimsBasedPayType[];
  creatingDependenciesBetweenServices: boolean | null;
  creatingDependenciesBetweenServicesNote: string | null;
  needsClaimsDataCollection: boolean | null;
  needsClaimsDataCollectionNote: string | null;
  providingThirdPartyFile: boolean | null;
  isContractorAwareTestDataRequirements: boolean | null;
}

export interface GetAnticipateDependencies_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  payments: GetAnticipateDependencies_modelPlan_payments;
}

export interface GetAnticipateDependencies {
  modelPlan: GetAnticipateDependencies_modelPlan;
}

export interface GetAnticipateDependenciesVariables {
  id: UUID;
}
