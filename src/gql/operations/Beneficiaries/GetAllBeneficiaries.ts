import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllBeneficiaries($id: UUID!) {
    modelPlan(id: $id) {
      id
      beneficiaries {
        id
        modelPlanID
        beneficiaries
        diseaseSpecificGroup
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
        beneficiarySelectionMethod
        beneficiarySelectionOther
        beneficiarySelectionNote
        beneficiarySelectionFrequency
        beneficiarySelectionFrequencyContinually
        beneficiarySelectionFrequencyOther
        beneficiarySelectionFrequencyNote
        beneficiaryRemovalFrequency
        beneficiaryRemovalFrequencyContinually
        beneficiaryRemovalFrequencyNote
        beneficiaryRemovalFrequencyOther
        beneficiaryOverlap
        beneficiaryOverlapNote
        precedenceRules
        precedenceRulesYes
        precedenceRulesNo
        precedenceRulesNote
        createdDts
        modifiedDts
        status
      }
    }
  }
`);
