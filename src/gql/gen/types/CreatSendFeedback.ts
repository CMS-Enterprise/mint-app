/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SendFeedbackEmailInput } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreatSendFeedback
// ====================================================

export interface CreatSendFeedback {
  /**
   * This mutation sends feedback about the MINT product to the MINT team
   */
  sendFeedbackEmail: boolean;
}

export interface CreatSendFeedbackVariables {
  input: SendFeedbackEmailInput;
}
