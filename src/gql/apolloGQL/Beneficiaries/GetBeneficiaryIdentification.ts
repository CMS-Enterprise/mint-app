import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetBeneficiaryIdentification($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      beneficiaries {
        id
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
      }
    }
  }
`);
