import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanBeneficiaries($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      beneficiaries {
        id
        modelPlanID
        beneficiaries
        beneficiariesOther
        beneficiariesNote
        treatDualElligibleDifferent
        treatDualElligibleDifferentHow
        treatDualElligibleDifferentNote
        excludeCertainCharacteristics
        excludeCertainCharacteristicsCriteria
        excludeCertainCharacteristicsNote
        numberPeopleImpacted
        estimateConfidence
        confidenceNote
        beneficiarySelectionNote
        beneficiarySelectionOther
        beneficiarySelectionMethod
        beneficiarySelectionFrequency
        beneficiarySelectionFrequencyNote
        beneficiarySelectionFrequencyOther
        beneficiaryOverlap
        beneficiaryOverlapNote
        precedenceRules
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
    }
  }
`;
