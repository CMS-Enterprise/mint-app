/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePlanFavorite
// ====================================================

export interface DeletePlanFavorite_deletePlanFavorite {
  __typename: "PlanFavorite";
  modelPlanID: UUID;
  userID: UUID;
}

export interface DeletePlanFavorite {
  deletePlanFavorite: DeletePlanFavorite_deletePlanFavorite;
}

export interface DeletePlanFavoriteVariables {
  modelPlanID: UUID;
}
