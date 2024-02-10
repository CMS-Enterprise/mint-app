/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetExistingModelPlans
// ====================================================

export interface GetExistingModelPlans_existingModelCollection {
  __typename: "ExistingModel";
  id: number | null;
  modelName: string;
}

export interface GetExistingModelPlans {
  existingModelCollection: GetExistingModelPlans_existingModelCollection[];
}
