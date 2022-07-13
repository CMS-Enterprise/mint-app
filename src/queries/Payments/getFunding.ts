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
        fundingSourceNote
        fundingSourceR
        fundingSourceRTrustFund
        fundingSourceROther
        fundingSourceRNote
        payRecipients
        payRecipientsOtherSpecification
        payRecipientsNote
        payType
        payTypeNote
      }
    }
  }
`;
