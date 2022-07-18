import { gql } from '@apollo/client';

export default gql`
  query GetBeneficiaryIdentification($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      beneficiaries {
        id
        beneficiaries
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
`;
