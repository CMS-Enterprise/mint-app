/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPlanFavorite
// ====================================================

export interface AddPlanFavorite_addPlanFavorite {
  __typename: "PlanFavorite";
  modelPlanID: UUID;
  userID: UUID;
}

export interface AddPlanFavorite {
  addPlanFavorite: AddPlanFavorite_addPlanFavorite;
}

export interface AddPlanFavoriteVariables {
  modelPlanID: UUID;
}
