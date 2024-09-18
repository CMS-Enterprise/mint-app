import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetBeneficiaryCostSharing($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        payClaims
        beneficiaryCostSharingLevelAndHandling
        waiveBeneficiaryCostSharingForAnyServices
        waiveBeneficiaryCostSharingServiceSpecification
        waiverOnlyAppliesPartOfPayment
        waiveBeneficiaryCostSharingNote
      }
    }
  }
`);
