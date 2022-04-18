/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * ModelPlanInput represent the data point for plans about a model. It is the central data type in the appliation
 */
export interface ModelPlanInput {
  id?: UUID | null;
  requester?: string | null;
  requesterComponent?: string | null;
  mainPointOfContact?: string | null;
  pointOfContactComponent?: string | null;
  createdBy?: string | null;
  createdDts?: Time | null;
  modifiedBy?: string | null;
  modifiedDts?: Time | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
