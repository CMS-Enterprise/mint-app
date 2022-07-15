import { gql } from '@apollo/client';

export default gql`
  query GetBeneficiaryCostSharing($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        beneficiaryCostSharingLevelAndHandling
        waiveBeneficiaryCostSharingForAnyServices
        waiveBeneficiaryCostSharingServiceSpecification
        waiverOnlyAppliesPartOfPayment
        waiveBeneficiaryCostSharingNote
      }
    }
  }
`;
