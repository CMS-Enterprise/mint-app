import { gql } from '@apollo/client';

export default gql`
  query GetClaimsBasedPayment($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        payClaims
        payClaimsNote
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
      itTools {
        status
      }
    }
  }
`;
