import { gql } from '@apollo/client';

export default gql`
  query GetRecover($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      payments {
        id
        payType
        willRecoverPayments
        willRecoverPaymentsNote
        anticipateReconcilingPaymentsRetrospectively
        anticipateReconcilingPaymentsRetrospectivelyNote
        paymentStartDate
        paymentStartDateNote
      }
    }
  }
`;
