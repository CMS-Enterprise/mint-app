import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAnticipateDependencies($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        payClaims
        willBePaymentAdjustments
        willBePaymentAdjustmentsNote
        creatingDependenciesBetweenServices
        creatingDependenciesBetweenServicesNote
        needsClaimsDataCollection
        needsClaimsDataCollectionNote
        providingThirdPartyFile
        isContractorAwareTestDataRequirements
      }
    }
  }
`);
