import { gql } from '@apollo/client';

export default gql`
  query GetClaimsBasedPayment($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payClaims
        payClaimsOther
        shouldAnyProvidersExcludedFFSSystems
        shouldAnyProviderExcludedFFSSystemsNote
        changesMedicarePhysicianFeeSchedule
        changesMedicarePhysicianFeeScheduleNote
        affectsMedicareSecondaryPayerClaims
        affectsMedicareSecondaryPayerClaimsHow
        affectsMedicareSecondaryPayerClaimsNote
        payModelDifferentiation
      }
    }
  }
`;
