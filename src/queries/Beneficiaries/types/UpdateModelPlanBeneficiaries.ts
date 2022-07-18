/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlanBeneficiariesChanges } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateModelPlanBeneficiaries
// ====================================================

export interface UpdateModelPlanBeneficiaries_updatePlanBeneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
}

export interface UpdateModelPlanBeneficiaries {
  updatePlanBeneficiaries: UpdateModelPlanBeneficiaries_updatePlanBeneficiaries;
}

export interface UpdateModelPlanBeneficiariesVariables {
  id: UUID;
  changes: PlanBeneficiariesChanges;
}
