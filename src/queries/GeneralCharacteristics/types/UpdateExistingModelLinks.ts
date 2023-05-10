/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateExistingModelLinks
// ====================================================

export interface UpdateExistingModelLinks_updateExistingModelLinks_existingModel {
  __typename: "ExistingModel";
  id: number | null;
  modelName: string | null;
}

export interface UpdateExistingModelLinks_updateExistingModelLinks {
  __typename: "ExistingModelLink";
  id: UUID | null;
  existingModelID: number | null;
  existingModel: UpdateExistingModelLinks_updateExistingModelLinks_existingModel | null;
}

export interface UpdateExistingModelLinks {
  updateExistingModelLinks: UpdateExistingModelLinks_updateExistingModelLinks[];
}

export interface UpdateExistingModelLinksVariables {
  modelPlanID: UUID;
  existingModelIDs?: number[] | null;
  currentModelPlanIDs?: UUID[] | null;
}
