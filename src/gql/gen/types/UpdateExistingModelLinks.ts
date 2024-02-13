/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ExisitingModelLinkFieldType } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateExistingModelLinks
// ====================================================

export interface UpdateExistingModelLinks_updateExistingModelLinks_links_model_ExistingModel {
  __typename: "ExistingModel";
  modelName: string;
  stage: string;
  numberOfParticipants: string | null;
  keywords: string | null;
}

export interface UpdateExistingModelLinks_updateExistingModelLinks_links_model_ModelPlan {
  __typename: "ModelPlan";
  modelName: string;
  abbreviation: string | null;
}

export type UpdateExistingModelLinks_updateExistingModelLinks_links_model = UpdateExistingModelLinks_updateExistingModelLinks_links_model_ExistingModel | UpdateExistingModelLinks_updateExistingModelLinks_links_model_ModelPlan;

export interface UpdateExistingModelLinks_updateExistingModelLinks_links {
  __typename: "ExistingModelLink";
  id: UUID | null;
  existingModelID: number | null;
  model: UpdateExistingModelLinks_updateExistingModelLinks_links_model;
}

export interface UpdateExistingModelLinks_updateExistingModelLinks {
  __typename: "ExistingModelLinks";
  links: UpdateExistingModelLinks_updateExistingModelLinks_links[];
}

export interface UpdateExistingModelLinks {
  /**
   * This will update linked existing models, and related model plans for given model plan and fieldName.
   * The fieldName allows it so you can create links for multiple sections of the model plan
   */
  updateExistingModelLinks: UpdateExistingModelLinks_updateExistingModelLinks;
}

export interface UpdateExistingModelLinksVariables {
  modelPlanID: UUID;
  fieldName: ExisitingModelLinkFieldType;
  existingModelIDs?: number[] | null;
  currentModelPlanIDs?: UUID[] | null;
}
