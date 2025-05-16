import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
        paymentReconciliationFrequency
        paymentReconciliationFrequencyContinually
        paymentReconciliationFrequencyOther
        paymentReconciliationFrequencyNote
        paymentDemandRecoupmentFrequency
        paymentDemandRecoupmentFrequencyContinually
        paymentDemandRecoupmentFrequencyOther
        paymentDemandRecoupmentFrequencyNote
        paymentStartDate
        paymentStartDateNote
        readyForReviewByUserAccount {
          id
          commonName
        }
        readyForReviewDts
        status
      }
    }
  }
`);
