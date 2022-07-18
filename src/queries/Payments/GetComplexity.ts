import { gql } from '@apollo/client';

export default gql`
  query GetComplexity($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        payClaims
        expectedCalculationComplexityLevel
        expectedCalculationComplexityLevelNote
        canParticipantsSelectBetweenPaymentMechanisms
        canParticipantsSelectBetweenPaymentMechanismsHow
        canParticipantsSelectBetweenPaymentMechanismsNote
        anticipatedPaymentFrequency
        anticipatedPaymentFrequencyOther
        anticipatedPaymentFrequencyNote
      }
    }
  }
`;
