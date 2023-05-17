import { gql } from '@apollo/client';

export default gql`
  query GetRecover($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        payClaims
        willRecoverPayments
        willRecoverPaymentsNote
        anticipateReconcilingPaymentsRetrospectively
        anticipateReconcilingPaymentsRetrospectivelyNote
        paymentStartDate
        paymentStartDateNote
        readyForReviewByUserAccount {
          id
          commonName
        }
        readyForReviewDts
        status
      }
      operationalNeeds {
        id
        modifiedDts
      }
    }
  }
`;
