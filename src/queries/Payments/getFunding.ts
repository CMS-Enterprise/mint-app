import { gql } from '@apollo/client';

export default gql`
  query GetFunding($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        fundingSource
        fundingSourceTrustFund
        fundingSourceOther
        fundingSourceNote
        fundingSourceR
        fundingSourceRTrustFund
        fundingSourceROther
        payRecipients
        payRecipientsOtherSpecification
        payRecipientsNote
        payType
        payTypeNote
      }
    }
  }
`;
