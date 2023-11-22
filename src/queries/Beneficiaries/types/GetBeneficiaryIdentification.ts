/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BeneficiariesType, TriStateAnswer } from "./../../../types/graphql-global-types";

// ====================================================
// GraphQL query operation: GetBeneficiaryIdentification
// ====================================================

export interface GetBeneficiaryIdentification_modelPlan_beneficiaries {
  __typename: "PlanBeneficiaries";
  id: UUID;
  beneficiaries: BeneficiariesType[];
  diseaseSpecificGroup: string | null;
  beneficiariesOther: string | null;
  beneficiariesNote: string | null;
  treatDualElligibleDifferent: TriStateAnswer | null;
  treatDualElligibleDifferentHow: string | null;
  treatDualElligibleDifferentNote: string | null;
  excludeCertainCharacteristics: TriStateAnswer | null;
  excludeCertainCharacteristicsCriteria: string | null;
  excludeCertainCharacteristicsNote: string | null;
}

export interface GetBeneficiaryIdentification_modelPlan {
  __typename: "ModelPlan";
  id: UUID;
  modelName: string;
  beneficiaries: GetBeneficiaryIdentification_modelPlan_beneficiaries;
}

export interface GetBeneficiaryIdentification {
  modelPlan: GetBeneficiaryIdentification_modelPlan;
}

export interface GetBeneficiaryIdentificationVariables {
  id: UUID;
}
