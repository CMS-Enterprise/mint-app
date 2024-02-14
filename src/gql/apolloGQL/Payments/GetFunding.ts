import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetFunding($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        fundingSource
        fundingSourceMedicareAInfo
        fundingSourceMedicareBInfo
        fundingSourceOther
        fundingSourceNote
        fundingSourceR
        fundingSourceRMedicareAInfo
        fundingSourceRMedicareBInfo
        fundingSourceROther
        fundingSourceRNote
        payRecipients
        payRecipientsOtherSpecification
        payRecipientsNote
        payType
        payTypeNote
        payClaims
      }
      operationalNeeds {
        id
        modifiedDts
      }
    }
  }
`);
