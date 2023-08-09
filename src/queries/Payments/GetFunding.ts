import { gql } from '@apollo/client';

export default gql`
  query GetFunding($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        fundingSource
        fundingSourceOther
        fundingSourceNote
        fundingSourceR
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
        modifiedDts
      }
    }
  }
`;
