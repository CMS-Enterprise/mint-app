import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
        claimsProcessingPrecedence
        claimsProcessingPrecedenceOther
        claimsProcessingPrecedenceNote
        canParticipantsSelectBetweenPaymentMechanisms
        canParticipantsSelectBetweenPaymentMechanismsHow
        canParticipantsSelectBetweenPaymentMechanismsNote
        anticipatedPaymentFrequency
        anticipatedPaymentFrequencyContinually
        anticipatedPaymentFrequencyOther
        anticipatedPaymentFrequencyNote
      }
    }
  }
`);
